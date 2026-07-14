const app = require('express')();

const PaymentGateWayController = require('./PaymentGateWayController');
const { usersRoles } = require('../../../../config/Options');
const { validate } = require('../../../../middleware/Validators');
const AuthHelper = require('../../../../models/helpers/AuthHelper');
const upload = require('../../../../../utils/upload');



app.post(
  '/message/:id',

  PaymentGateWayController.message
);


app.get(
  '/getAllmessage/:id',
 
  PaymentGateWayController.getAllmessage
);




app.post(
    '/createPayment',
   AuthHelper.authenticateJWT({isPremium:false}),
    PaymentGateWayController.newPhonePayPayment
  );
app.post(
    '/createPayment',
   AuthHelper.authenticateJWT({isPremium:false}),
    PaymentGateWayController.newPhonePayPayment
  );
app.post(
    '/verify/:id',
    PaymentGateWayController.verifyPhonePayPayment
  );
app.get(
    '/verify/:id',
    PaymentGateWayController.verifyPhonePayPayment
  );


// app.post(
//     '/verifyPayment',
    
//     PaymentGateWayController.verifyPayment
//   );
  



module.exports = app;
