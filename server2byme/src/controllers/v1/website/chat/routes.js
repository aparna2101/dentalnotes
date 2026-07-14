const app = require('express')();

const UserController = require('./userController');
const { usersRoles } = require('../../../../config/Options');
const { validate } = require('../../../../middleware/Validators');
const AuthHelper = require('../../../../models/helpers/AuthHelper');
const upload = require('../../../../../utils/upload');



app.post(
  '/message/:id',
  AuthHelper.authenticateJWT([]),
  UserController.message
);


app.get(
  '/getAllmessage/:id',
  AuthHelper.authenticateJWT([]),
  UserController.getAllmessage
);




module.exports = app;
