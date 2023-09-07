const createHttpError = require("http-errors");

module.exports = {
    global: (app) => {
        app.use('/books', (req, res, next) => {
            const page = req.query.page;
            const language = req.query.lang;
            if (page && (language && (language == 'en' || language == 'ar'))) {
                next()
            } else {
                const error = createHttpError(400, 'page or language is required');
                next(error);
            }
        });
    },
}