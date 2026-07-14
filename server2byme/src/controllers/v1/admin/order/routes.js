const app = require('express')();

const OrderController = require('./order');
const { usersRoles } = require('../../../../config/Options');
const { validate } = require('../../../../middleware/Validators');
const AuthHelper = require('../../../../models/helpers/AuthHelper');

app.post(
  '/create',
   AuthHelper.authenticateJWT(usersRoles.getEMPLOYEE()),
  OrderController.create
);

app.get(
  '/getById/:id',
  // AuthHelper.authenticateJWT(usersRoles.getAdmin()),
  OrderController.getById
);

app.get('/getAll',AuthHelper.authenticateJWT(usersRoles.getEMPLOYEE()), OrderController.getAll);

app.put(
  '/changeStatus/:id',
  AuthHelper.authenticateJWT(usersRoles.getEMPLOYEE()),
  OrderController.changeStatus
);


app.put(
  '/update/:id',
  AuthHelper.authenticateJWT(usersRoles.getEMPLOYEE()),
  OrderController.update
);

app.delete('/delete/:id',OrderController.remove);




module.exports = app;
