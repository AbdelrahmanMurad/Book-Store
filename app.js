const express = require('express');
const routes = require('./routes');
const app = express();
require('dotenv').config();

const returnJson = require('./modules/JsonResponse')
global.returnJson = returnJson;

routes(app)

module.exports = app;