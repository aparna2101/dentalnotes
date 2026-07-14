const app = require('express').Router();

const UserController = require('./user');
const { usersRoles } = require('../../../../config/Options');
const { validate } = require('../../../../middleware/Validators');
const AuthHelper = require('../../../../models/helpers/AuthHelper');

const upload=require('../../../../../utils/upload')

app.post(
  '/register',
  // AuthHelper.authenticateJWT(usersRoles.getAdmin()),
  upload.single('image'),
  UserController.create
);
app.post('/login', UserController.login);
app.get(
  '/getUserProfile',
  // AuthHelper.authenticateJWT(usersRoles.getAdmin()),
  UserController.getUserProfile
);
app.get(
  '/getById/:id',
  // AuthHelper.authenticateJWT(usersRoles.getAdmin()),
  UserController.getById
);

app.put(
  '/update',
  AuthHelper.authenticateJWT(usersRoles.getEMPLOYEE()),
  UserController.update
);

app.put(
  '/updateById/:id',
  upload.single('image'),
  AuthHelper.authenticateJWT(usersRoles.getEMPLOYEE()),
  UserController.updateById
);

// app.delete('/deleteById/:id', validate('checkParamId'), UserController.delete);
app.put('/resetPassword', UserController.resetPassword);
app.put('/updatePassword', UserController.resetPassword);
app.put('/forgetPassword', UserController.forgetPassword);



app.get('/getAll',AuthHelper.authenticateJWT(usersRoles.getEMPLOYEE()), UserController.getAll);


//admin wil handl this
app.delete('/delete/:id',UserController.deleteUser);
app.put('/changeStatus/:id',UserController.changeStatus)


module.exports = app;
