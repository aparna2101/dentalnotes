const bcrypt = require('bcrypt');
const User = require('../../../../models/User');
const Cart = require('../.../../../../../models/cart');
const MESSAGES = require('../../../../models/helpers/MessagesHelper');
const mongoose = require('mongoose');

const {
  uploadFromBuffer,
  deleteFile,
} = require('../../../../../utils/cloudinary');
const OPTIONS = require('../../../../config/Options');
const userObj = require('../cart/cart');
const ObjectId = mongoose.Types.ObjectId;

const adminSockets = {};

const UserSocketObject = {
  makeMeOnline: (socket, io) => {
    return async ({ email }) => {
      try {
        // Update the user to be online, create the field if it doesn't exist

       console.log("make:me:online")
       if(email){
        const user = await User.findOneAndUpdate(
          { email: email },
          { $set: { isOnline: true, socketId: socket.id } },
          { new: true,upsert: true  }
        );

        console.log("which user got online",user)
        io.to(socket.id).emit('User:online', {
          email: user.email,
          id: socket.id,
        });
       }

        // Emit events to the room and the socket
       
      } catch (error) {
        console.error('Error in making user online:', error);
        // Optionally, you can emit an error message to the client
        socket.emit('error', { message: 'Failed to make user online.' });
      }
    };
  },
  
  sendMessage: (socket, io) => {
    return async ({content,sender,receiver }) => {
      try {
        // Update the user to be online, create the field if it doesn't exist

       
      console.log("Recived the frontend message",content)
      console.log("Recived the frontend message",sender)
      console.log("Recived the frontend message",receiver)

      const user=await User.findById(new mongoose.Types.ObjectId(receiver));
      if(user.isOnline && user.socketId){
        io.to(user.socketId).emit("send:message",{
          content,
          sender,
          receiver,
          createdAt:new Date()
        })
      }

      

      } catch (error) {
        console.error('Error in making user online:', error);
        // Optionally, you can emit an error message to the client
        socket.emit('error', { message: 'Failed to make user online.' });
      }
    };
  },

  makeMeOffline: (socket, io) => {
    return async () => {
      try {
        // Update the user to be online, create the field if it doesn't exist
        console.log('make:me:offline', socket.id);
        const user = await User.findOneAndUpdate(
          { socketId: socket.id },
          { $set: { isOnline: false, socketId: null } },
          { new: true }
        );

        console.log('Offline user', user);

        // Emit events to the room and the socket
        // io.to(socket.id).emit('User:online', {
        //   email: user.email,
        //   id: socket.id,
        // });
      } catch (error) {
        console.error('Error in making user online:', error);
        // Optionally, you can emit an error message to the client
        socket.emit('error', { message: 'Failed to make user online.' });
      }
    };
  },

  adminPushNotification: (socket, io) => {
    return async ({ email, notification }) => {
      try {
        // Update the user to be online, create the field if it doesn't exist
        console.log('admin:push:notificatioin');
        const user = await User.findOne({ email: email });
        if (user.socketId) {
          io.to(user.socketId).emit('admin:notification', { notification });
        } else {
          socket.emit('error', {
            message: `Unable to send Notification to ${email} `,
          });
        }
      } catch (error) {
        console.error('Error in making user online:', error);
        // Optionally, you can emit an error message to the client
        socket.emit('error', { message: 'Failed to make user online.' });
      }
    };
  },

  userLocation: (socket, io) => {
    return async ({ longitude, latitude }) => {
      try {
        // Update the user to be online, create the field if it doesn't exist
        console.log('user:location', longitude, 'latitidue', latitude);
      } catch (error) {
        console.error('Error in making user online:', error);
        // Optionally, you can emit an error message to the client
        socket.emit('error', { message: 'Failed to make user online.' });
      }
    };
  },

  handleOnlineUserLocation: (socket, io) => {
    return async ({ selectedUsers, roomId }) => {
      try {
        console.log("SEND ONLINE USER LOCATION")
        const socketsInRoom = io.sockets.adapter.rooms.get(roomId);
        if (socketsInRoom) {
          for (let socketId of socketsInRoom) {
            const socketToLeave = io.sockets.sockets.get(socketId);
            if (socketToLeave) {
              socketToLeave.emit('stop:sharing:location', {
                message: 'Stop sharing the location',
                roomId: roomId,
              });
              socketToLeave.leave(roomId);
              console.log(`Socket ${socketId} left room ${roomId}`);
            }
          }
        }
        adminSockets[roomId] = socket.id;
        const userIds = selectedUsers.map((user) => user._id);
        const users = await User.find({
          _id: { $in: userIds }, // Matches any user IDs that are in the provided array
          isOnline: true,
        });

        const socketss = users.map((eachUser) => {
          const targetSocket = io.sockets.sockets.get(eachUser.socketId);

          console.log('each user socketId', eachUser.socketId);
          if (targetSocket && !targetSocket.rooms.has(roomId)) {
            targetSocket.join(roomId);
            targetSocket.emit('send:real:time:location', {
              message: `You have joine the roomm ${roomId}`,
              roomId: roomId,
              userId: eachUser._id,
            });
          }
        });
        console.log('sockets', socketss);
      } catch (error) {
        console.error('Error in making user online:', error);
        // Optionally, you can emit an error message to the client
        socket.emit('error', { message: 'Failed to make user online.' });
      }
    };
  },

  handleMYLocation: (socket, io) => {
    return async ({ name, _id, roomId, position, date,imageUrl }) => {
     
      try {
        console.log('HANDLE MY LOCATION ');
       

        const targetSocket = io.sockets.sockets.get(adminSockets[roomId]);
        targetSocket.emit('handle:user:location', {
          name,
          _id,
          roomId,
          position,
          imageUrl,
          date: date,
        });
      } catch (error) {
        console.error('Error in making user online:', error);
        const targetSocket = io.sockets.sockets.get(adminSockets[roomId]);
        targetSocket.emit('error', {
          message: `error in handling location of ${name} `,
        });
      }
    };
  },

  handleAdminExitLocationRoom: (socket, io) => {
    return async ({ roomId }) => {
      try {
        console.log("ADMIN EXIT THE LOCATION ROOM");
        const socketsInRoom = io.sockets.adapter.rooms.get(roomId);
        if (socketsInRoom) {
          for (let socketId of socketsInRoom) {
            const socketToLeave = io.sockets.sockets.get(socketId);
            if (socketToLeave) {
              socketToLeave.emit('stop:sharing:location', {
                message: 'Stop sharing the location',
                roomId: roomId,
              });
              socketToLeave.leave(roomId);
              console.log(`Socket ${socketId} left room ${roomId}`);
            }
          }
        }
      } catch (error) {
        console.error('Error in making user online:', error);
        const targetSocket = io.sockets.sockets.get(adminSockets[roomId]);
        targetSocket.emit('error', {
          message: `error in handling location of ${name} `,
        });
      }
    };
  },
};

module.exports = UserSocketObject;
