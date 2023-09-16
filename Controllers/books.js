const { returnJson } = require('../modules/JsonResponse');
const { dbConnection } = require('../configurations');
const createHttpError = require('http-errors');

//get all books stored in the db with pagination.
const getBooks = (req, res, next) => {
    try {
        //pagination
        const pageNumber = parseInt(req.query.page);
        const limit = 2;
        const skip = (pageNumber - 1) * limit;

        if (isNaN(pageNumber)) {
            const error = createHttpError(400, 'You should send a page number');
            next(error);
        }

        dbConnection('books', async (collection) => {
            const books = await collection.find({}).limit(limit).skip(skip).toArray();
            return returnJson(res, 200, true, '', books)
        })
    } catch (error) {
        next(createHttpError(500, error.message))
    }
}

module.exports = { getBooks }