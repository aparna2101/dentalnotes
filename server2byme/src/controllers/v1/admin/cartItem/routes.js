const app = require('express')();

const cartItemController = require('./cartItem');
const { usersRoles } = require('../../../../config/Options');
const { validate } = require('../../../../middleware/Validators');
const AuthHelper = require('../../../../models/helpers/AuthHelper');


app.delete(
  '/remove/:id',
  // AuthHelper.authenticateJWT(usersRoles.getAdmin()),
  cartItemController.remove
);

// app.get('/getAll', ProductController.getAll);

app.put(
  '/updateQuantity/:id',
  // AuthHelper.authenticateJWT(usersRoles.getAdmin()),
 
  cartItemController.update
);
// app.delete('/delete/:id',ProductController.remove);
module.exports=app;