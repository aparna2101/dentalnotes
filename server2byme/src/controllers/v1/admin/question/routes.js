const app = require('express')();
const Question=require('./question');
const { validate } = require('../../../../middleware/Validators');
const AuthHelper = require('../../../../models/helpers/AuthHelper');

app.get('/:id', Question.getById);
app.get('/questionSetQuestions/:id', Question.getAllQuestionOfQuestionSet);
app.post('/:id', Question.createForQuestionSet);
app.put('/:id', Question.update);
app.delete('/:id', Question.delete);

module.exports = app;
