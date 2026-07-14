const app = require('express')();

const Student = require('./student');
const { usersRoles } = require('../../../../config/Options');
const { validate } = require('../../../../middleware/Validators');
const AuthHelper = require('../../../../models/helpers/AuthHelper');
const { helpers } = require('handlebars');


app.get('/getAllQuestionSetOfSeminar',Student.getAllQuestionSetOfSeminar)
app.get('/testByQuestionSet/:id',Student.testByQuestionSet)
app.post('/submitTest',Student.submitTest)
app.get('/getResultByQuestionSetId/:id',Student.getResultByQuestionSetId)
app.get('/rankedResult',Student.rankedResult);
app.post('/:id', Student.registerStudent);
app.get('/allResultOfStudent', Student.allResultOfStudent);

module.exports = app;
