const app = require('express')();
const Result=require('./result');
const { validate } = require('../../../../middleware/Validators');
const AuthHelper = require('../../../../models/helpers/AuthHelper');

app.get('/rankedStudent',Result.rankedStudent);


module.exports = app;
