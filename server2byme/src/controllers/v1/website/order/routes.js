const app = require('express')();

const OrderController = require('./order');
const { usersRoles } = require('../../../../config/Options');
const { validate } = require('../../../../middleware/Validators');
const AuthHelper = require('../../../../models/helpers/AuthHelper');

app.put(
  '/cancelOrder',
  // AuthHelper.authenticateJWT(usersRoles.getAdmin()),
  OrderController.cancelOrder
);
app.post(
  '/placeOrder',
  // AuthHelper.authenticateJWT(usersRoles.getAdmin()),
  OrderController.placeOrder
);
app.get(
  '/getAllOrder',
  // AuthHelper.authenticateJWT(usersRoles.getAdmin()),
  OrderController.getAllOrder
);
app.get(
  '/getById/:id',
  // AuthHelper.authenticateJWT(usersRoles.getAdmin()),
  OrderController.getById
);

module.exports=app;