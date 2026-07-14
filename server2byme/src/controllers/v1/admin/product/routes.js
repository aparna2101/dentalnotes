const app = require('express')();

const ProductController = require('./product');
const { usersRoles } = require('../../../../config/Options');
const { validate } = require('../../../../middleware/Validators');
const AuthHelper = require('../../../../models/helpers/AuthHelper');

const upload=require('../../../../../utils/upload')

app.post(
  '/create',
  // AuthHelper.authenticateJWT(usersRoles.getAdmin()),
  upload.single('image'),
  ProductController.create
);

app.get(
  '/getById/:id',
  // AuthHelper.authenticateJWT(usersRoles.getAdmin()),
  ProductController.getById
);

app.get('/getAll', ProductController.getAll);

app.put(
  '/update/:id',
  // AuthHelper.authenticateJWT(usersRoles.getAdmin()),
  upload.single("image"),
  ProductController.update
);

app.delete('/delete/:id',ProductController.remove);




module.exports = app;
