const bookRouter = require('./books')
const authRouter = require('./auth')

const Test = [
    { Test: 'Test' }
];

module.exports = (app) => {
    app.get('/test', (req, res, next) => res.status(200).json(Test))
    app.get('/tests', (req, res, next) => res.redirect('/test'))
    app.get('/', (req, res, next) => res.redirect('/test'))

    //Routes of models
    app.use('/books', bookRouter);
    app.use('/auth', authRouter);
}