const app = require('express')();

const settings = require('./settings');
const { usersRoles } = require('../../../../config/Options');
const { validate } = require('../../../../middleware/Validators');
const AuthHelper = require('../../../../models/helpers/AuthHelper');
const upload = require('../../../../../utils/upload');



app.post(
  '/settings',
  settings.createSettings
);

app.post(
    '/updateSettings',
    settings.newPhonePayPayment
  );



// app.post(
//     '/createPayment',
//    AuthHelper.authenticateJWT({isPremium:false}),
//     PaymentGateWayController.newPhonePayPayment
//   );
// app.post(
//     '/verify/:id',
//     PaymentGateWayController.verifyPhonePayPayment
//   );


// app.post(
//     '/verifyPayment',
    
//     PaymentGateWayController.verifyPayment
//   );
  



module.exports = app;
