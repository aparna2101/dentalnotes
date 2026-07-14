const app = require('express')();

const ProductController = require('./cart');
const { usersRoles } = require('../../../../config/Options');
const { validate } = require('../../../../middleware/Validators');
const AuthHelper = require('../../../../models/helpers/AuthHelper');

app.get(
  '/',
  // AuthHelper.authenticateJWT(usersRoles.getAdmin()),
  ProductController.get
);
app.post(
  '/addToCart',
  // AuthHelper.authenticateJWT(usersRoles.getAdmin()),
  ProductController.addToCart
);



// app.get(
//   '/getById/:id',
//   // AuthHelper.authenticateJWT(usersRoles.getAdmin()),
//   ProductController.getById
// );

// app.get('/getAll', ProductController.getAll);

// app.put(
//   '/update/:id',
//   // AuthHelper.authenticateJWT(usersRoles.getAdmin()),
//   ProductController.update
// );
// app.delete('/delete/:id',ProductController.remove);
module.exports=app;