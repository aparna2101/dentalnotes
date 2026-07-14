const app = require('express')();

const PaymentController = require('./payment');
const { usersRoles } = require('../../../../config/Options');
const { validate } = require('../../../../middleware/Validators');
const AuthHelper = require('../../../../models/helpers/AuthHelper');
const { single } = require('../../../../../utils/upload');
const upload = require('../../../../../utils/upload');

app.post(
  '/create',
  AuthHelper.authenticateJWT(usersRoles.getAllRolesOfUserAsArray()),
  upload.single("image"),
  PaymentController.create
);


app.get(
  '/getById/:id',
  // AuthHelper.authenticateJWT(usersRoles.getAdmin()),
  PaymentController.getById
);

app.get('/getAll',AuthHelper.authenticateJWT(usersRoles.getAllRolesOfUserAsArray()), PaymentController.getAll);

app.put(
  '/update/:id',
  AuthHelper.authenticateJWT(usersRoles.getAllRolesOfUserAsArray()),
  // AuthHelper.authenticateJWT(usersRoles.getAdmin()),
  upload.single("image"),
  PaymentController.update
);

app.delete('/delete/:id', AuthHelper.authenticateJWT(usersRoles.getAllRolesOfUserAsArray()),PaymentController.remove);
app.put('/accepteBdyAdmin/:id', AuthHelper.authenticateJWT([usersRoles.ADMIN,usersRoles.SUB_ADMIN]),PaymentController.acceptedByAdmin);




module.exports = app;
