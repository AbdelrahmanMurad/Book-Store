require('dotenv').config(); // to make it accessible
const express = require('express');
const app = express();
const routes = require('./routes');
const middlewares = require('./middlewares')
const { returnJson } = require('./modules/JsonResponse');

/**
 * Globalize returnJson
 */
global.returnJson = returnJson;

/**
 * Error handling for promises
 */
process.on('unhandledRejection', (reason) => {
    console.log(reason);
    process.exit(1);
});

/** 
 * Error handler for next
 */
app.use((error, req, res, next) => {
    return returnJson(res, error.statusCode, false, error.message, null)
});

/**
 * Middleware
 */
middlewares.global(app)

/**
 * Route
 */
routes(app)

module.exports = app;