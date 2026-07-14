// Polyfill for SlowBuffer which is missing in newer Node.js versions
const buffer = require('buffer');
if (!buffer.SlowBuffer) {
  buffer.SlowBuffer = buffer.Buffer;
}

const _ = require('lodash');

const path = require('path');
const cors = require('cors');
const chalk = require('chalk');
const logger = require('morgan');
const helmet = require('helmet');
const express = require('express');
const errorHandler = require('errorhandler');
const cookieParser = require('cookie-parser');
const User=require("./src/models/User")
require('dotenv').config();

const { Server } = require('socket.io'); //
const { createServer } = require('http'); //

// const lodash = require('lodash');
const apiRouter = require('./src/routes');
const CustomResponses = require('./src/models/helpers/CustomResponses');
 let DB= require('./src/config/DbConnection');
const app = express();

const { PORT, NODE_ENV } = process.env;

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:573',
  'https://dentalnotesrep.com',
  'https://admin.dentalnotesrep.com'
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(null, true); // For development, let's just allow all but keep the credentials logic
      }
      return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);


const server = createServer(app);
server.timeout = 900000; // 15 minutes timeout for large file uploads


  const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
  pingTimeout: 60000, // Adjust pingTimeout to give more time
  pingInterval: 25000,
});

// global._ = lodash

app.set('env', NODE_ENV);
app.use(logger('dev'));
app.use(CustomResponses);
app.use(express.json());

app.use(express.json({ limit: '1024mb' }));
app.use(express.urlencoded({ limit: '1024mb', extended: false }));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use(
  '/',
  express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 })
);
app.use('/images', express.static(path.join(__dirname, 'assets')));
app.use('/videos', express.static(path.join(__dirname, 'videos')));


app.use('/', apiRouter);
if (NODE_ENV !== 'production') {
  app.use(logger('dev'));
}

app.set('port', PORT || 3000);

// const server = app.listen(app.get('port'), () => {
//   console.log(

//     '%s App is running at http://localhost:%d in %s mode',
//     chalk.green('✓'),
//     app.get('port'),
//     app.get('env')
//   );
//   console.log('Press CTRL-C to stop\n');
// });


const emailToSocketIdMap = new Map();
const socketIdtoEmailMap = new Map();


const {makeMeOnline,sendMessage,makeMeOffline,adminPushNotification,userLocation,handleOnlineUserLocation,handleMYLocation,handleAdminExitLocationRoom}=require("./src/controllers/v1/admin/user/user.socket");
const Cart = require('./src/models/cart');

io.on('connection', (socket) => {
  console.log('USER IS CONNECT TO SOCKET', socket.id);
 

  // socket.on('room:join', ({ email, room }) => {
  //   console.log('The request to be online', email);
  //   const data = { email };
  //   socketIdtoEmailMap.set(socket.id, email);
  //   emailToSocketIdMap.set(email, socket.id);

  //   //handl database here to make user Online

  //   io.to(room).emit('User:online', { email, id: socket.id });
  //   io.to(socket.id).emit('room:join', data);
  // });





  socket.on('make:me:online',makeMeOnline(socket,io));
  socket.on('send:message',sendMessage(socket,io));
  socket.on('admin:notification',adminPushNotification(socket,io));
  socket.on('user:location',userLocation(socket,io));
  socket.on('online:user:location',handleOnlineUserLocation(socket,io));
  socket.on('my:location',handleMYLocation(socket,io));
  socket.on('admin:exit:location:room',handleAdminExitLocationRoom(socket,io));
  socket.on('make:me:offline',makeMeOffline(socket,io));



  socket.on('user:call', ({ to, offer }) => {
    console.log('Request to make a call to', to, offer);
    io.to(to).emit('incoming:call', { from: socket.id, offer });
  });

  socket.on('call:accepted', ({ to, ans }) => {
    console.log('Call accepted', to, 'Answer', ans);
    io.to(to).emit('call:accepted', { from: socket.id, ans });
  });

  socket.on('peer:nego:needed', ({ offer, to }) => {
    io.to(to).emit('peer:nego:needed', { from: socket.id, offer });
  });

  socket.on('peer:nego:done', ({ to, ans }) => {
    io.to(to).emit('peer:nego:final', { from: socket.id, ans });
  });

  socket.on('make:me:offline',makeMeOffline(socket,io));

  socket.on('disconnect',makeMeOffline(socket,io));
});

server.listen(PORT, () => {
  console.log(`server is started on port ${PORT}`);
  
  console.log(
    '%s App is running at http://localhost:%d in %s mode',
    chalk.green('✓'),
    app.get('port'),
    app.get('env')
  );
  console.log('Press CTRL-C to stop\n');
 setTimeout(()=>{
  CheckAndCreateAdmin()
 },500)
});

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

if (process.env.NODE_ENV === 'development') {
  app.use(errorHandler());
}


 async function CheckAndCreateAdmin(){
  const bcrypt = require('bcrypt');
  console.log("Checking Admin and creating")
  const exist= await User.findOne({email:process.env.ADMIN_EMAIL}).select('+password')
  console.log("password setting",process.env.ADMIN_password)
  if(!exist){
   let admin =await User.create({
      email:process.env.ADMIN_EMAIL,
      firstName:process.env.ADMIN_firstName,
      lastName:process.env.ADMIN_lastName,
      gender:process.env.ADMIN_gender,
      phoneNumber:process.env.ADMIN_phoneNumber,
      password:process.env.ADMIN_password,
      role:"ADMIN"
    })
    await Cart.create({customerId:admin._id})
    console.log("new Admin created",admin)
  } else {
    // Sync password from env on every server start
    const hash = await bcrypt.hash(process.env.ADMIN_password, 8);
    await User.updateOne({email:process.env.ADMIN_EMAIL}, {$set:{password:hash}});
    console.log("Admin password synced from env")
  }
  



}
