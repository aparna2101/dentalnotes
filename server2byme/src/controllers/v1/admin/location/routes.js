const app = require('express')();

const LocationController = require('./location');
const { usersRoles } = require('../../../../config/Options');
const { validate } = require('../../../../middleware/Validators');
const AuthHelper = require('../../../../models/helpers/AuthHelper');
const upload = require('../../../../../utils/upload');

// app.post(
//   '/create',
//    AuthHelper.authenticateJWT(usersRoles.getEMPLOYEE()),
//   upload.single('image'),
//   LocationController.create
// );

// app.get(
//   '/getById/:id',
//   // AuthHelper.authenticateJWT(usersRoles.getAdmin()),
//   AuthHelper.authenticateJWT(usersRoles.getEMPLOYEE()),
//   LocationController.getById
// );

app.get('/getOnlineUser', LocationController.getAll);

// app.get('/getAllForMap', LocationController.getAllForMap);


// app.put(
//   '/update/:id'
//   ,AuthHelper.authenticateJWT(usersRoles.getEMPLOYEE()),
//   LocationController.update
// );

// app.delete('/delete/:id',AuthHelper.authenticateJWT(usersRoles.getEMPLOYEE()),LocationController.remove);




module.exports = app;