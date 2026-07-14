const app = require('express')();

const InvoiceController = require('./invoice');
const { usersRoles } = require('../../../../config/Options');
const { validate } = require('../../../../middleware/Validators');
const AuthHelper = require('../../../../models/helpers/AuthHelper');

app.post(
  '/create',
  // AuthHelper.authenticateJWT(usersRoles.getAdmin()),
 InvoiceController.create
);
app.get(
  '/getById/:id',
  // AuthHelper.authenticateJWT(usersRoles.getAdmin()),
 InvoiceController.getById
);

app.get('/getAll', InvoiceController.getAll);

app.put(
  '/update',
  // AuthHelper.authenticateJWT(usersRoles.getAdmin()),
 InvoiceController.update
);

app.delete('/delete/:id', InvoiceController.remove);




module.exports = app;
