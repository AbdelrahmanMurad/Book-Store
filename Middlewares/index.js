const createHttpError = require("http-errors");

module.exports = {
    global: (app) => {
        app.use('/books', (req, res, next) => {
            const language = req.query.lang;
            if (language && (language == 'en' || language == 'ar')) {
                next()
            } else {
                const error = createHttpError(400, 'language is required');
                next(error);
            }
        });
    },
}