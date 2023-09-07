const bookRouter = require('./books')

const Test = [
    { Test: 'Test' }
];

module.exports = (app) => {
    app.get('/test', (req, res, next) => res.status(200).json(Test))
    app.get('/tests', (req, res, next) => res.redirect('/test'))
    app.get('/', (req, res, next) => res.redirect('/test'))

    app.use('/books', bookRouter);
}