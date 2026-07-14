const app = require('express')();

const basicDetailController = require('./basicDetail');


app.post(
  '/create',
  basicDetailController.create
);


app.get(
  '/getById/:id',
  // AuthHelper.authenticateJWT(usersRoles.getAdmin()),
  basicDetailController.getById
);

// app.get('/getAll',AuthHelper.authenticateJWT(usersRoles.getAllRolesOfUserAsArray()), basicDetailController.getAll);

app.put(
  '/update/:id',
  basicDetailController.update
);

// app.delete('/delete/:id', AuthHelper.authenticateJWT(usersRoles.getAllRolesOfUserAsArray()),basicDetailController.remove);
// app.put('/accepteBdyAdmin/:id', AuthHelper.authenticateJWT([usersRoles.ADMIN,usersRoles.SUB_ADMIN]),basicDetailController.acceptedByAdmin);




module.exports = app;
