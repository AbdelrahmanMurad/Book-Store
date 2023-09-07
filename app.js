const express = require('express');
const routes = require('./routes');
const middlewares = require('./middlewares')
const app = express();
require('dotenv').config();

const returnJson = require('./modules/JsonResponse')
global.returnJson = returnJson;

middlewares.global(app)
routes(app)

module.exports = app;