const express = require('express');
const app = express();
require('dotenv').config();

const returnJson = require('./modules/JsonResponse')
global.returnJson = returnJson;

const Test = [
    { Test: 'Test' }
];

app.get('/test', (req, res, next) => res.status(200).json(Test))
app.get('/', (req, res, next) => res.redirect('/test'))

module.exports = app;