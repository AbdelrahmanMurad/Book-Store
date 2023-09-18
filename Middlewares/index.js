const createHttpError = require("http-errors");
const express = require('express');

module.exports = {
    global: (app) => {
        //language must be english or arabic.
        app.use('/books', (req, res, next) => {
            const language = req.query.lang;
            if (language && (language == 'en' || language == 'ar')) {
                return next()
            } else {
                const error = createHttpError(400, 'language is required');
                return next(error);
            }
        });
        //Body Parser to clear the type of data.
        app.use(express.json());
    },

    auth: require('./auth')
}