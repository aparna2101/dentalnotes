const app = require('express')();

const visitController = require('./visit');
const { usersRoles } = require('../../../../config/Options');
const { validate } = require('../../../../middleware/Validators');
const AuthHelper = require('../../../../models/helpers/AuthHelper');
const upload = require('../../../../../utils/upload');

app.post(
  '/create',
   AuthHelper.authenticateJWT(usersRoles.getEMPLOYEE()),
  upload.single('image'),
  visitController.create
);

app.get(
  '/getById/:id',
  // AuthHelper.authenticateJWT(usersRoles.getAdmin()),
  AuthHelper.authenticateJWT(usersRoles.getEMPLOYEE()),
  visitController.getById
);

app.get('/getAll',AuthHelper.authenticateJWT(usersRoles.getEMPLOYEE()), visitController.getAll);

app.get('/getAllForMap', visitController.getAllForMap);


app.put(
  '/update/:id'
  ,AuthHelper.authenticateJWT(usersRoles.getEMPLOYEE()),
  visitController.update
);

app.delete('/delete/:id',AuthHelper.authenticateJWT(usersRoles.getEMPLOYEE()),visitController.remove);




module.exports = app;
