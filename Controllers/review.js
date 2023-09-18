const { Review } = require('../models')
const createError = require('http-errors')
const { ObjectId } = require("bson");
const { returnJson } = require('../modules/JsonResponse')
/**Steps: add()
 * 1- get reviewData from body.
 * 2- get _reviewer_id from token.
 * 3- validation & if validation.error
 * 4- create instance.
 * 5- convert id type to ObjectId.
 * 6- save() with refreshAvgRating.
 * ============================================
 * Steps: remove()
 * 1- get id from path parameter
 * 2- getOne() => promise
 *          - store _book_id
 * 3- remove() => cb
 *          - remove id
 *          - refrish avg rating
 */
const add = (req, res, next) => {
    //1- get reviewData from body.
    const reviewData = req.body

    //2- get _reviewer_id from token.
    reviewData._reviewer_id = req._reviewer_id

    //3- validation & if validation.error
    const validation = Review.validate(reviewData)
    if (validation.error) {
        return next(createError(400, validation.error.message))
    }

    //4- create instance.
    const review = new Review(reviewData)

    //5- convert id type to ObjectId.
    review.reviewData._reviewer_id = new ObjectId(review.reviewData._reviewer_id)
    review.reviewData._book_id = new ObjectId(review.reviewData._book_id)
    //remember this: any type id in mongoDB needs to be ObjectId.

    //6- save()
    review.save((result) => {
        if (!result.status) {
            return next(createError(500))
        }
        //update after save
        //refreshAvgRating => static
        Book.refreshAvgRating(review.reviewData._book_id)
        return returnJson(res, 200, true, '', review)
    })
}

const remove = (req, res, next) => {
    //Note:
    // Operations like delete & updata, id is sent to path parameters automatic.
    // if payload, payload sent to body.
    // why id not sent to body ??
    // because we will not modify on id.
    const _id = new ObjectId(req.params.id);

    //store first then delete.
    Review.getOne(_id)
        .then(result => {
            if (!result.status) {
                return next(createError(404))
            }

            // const review = result.data;
            const _book_id = result.data._book_id

            Review.remove(_id, (result) => {
                if (!result.status) {
                    return next(createError(500, result.message))
                }

                //We must store the review first before deleting, because if we delete it first, we will not know the book id.
                // Book.refreshAvgRating(review._book_id)
                Book.refreshAvgRating(_book_id)

                return returnJson(res, 200, true, "", null)
                // res.status(200).json(result);
            })
        })
        .catch(err => {
            return next(createError(500, err.message))
        })
}

module.exports = {
    add, remove
}