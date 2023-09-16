const { User, Reviewer } = require('../models');
const createHttpError = require('http-errors');
const { returnJson } = require('../modules/JsonResponse');
/**auth.js for contoller
 * 1- signup()
 *      a) userData: variable request data from body.
 *      b) validation operation.
 *      c) check existance from user instace. (you can save user here, in then() after result. [because its promise])
 *      d) save data.
 * 
 * 2- login()
 *      a) req.body in input.
 *      b) fetch data if status is true by then() [promise]
 *      c) catch the error.
 */

const signup = async (req, res, next) => {
    //request data
    const userData = req.body;

    //validation (static)
    const vali = User.validation(userData)
    if (vali.error) {
        return next(createHttpError(400, vali.error.message))
    }

    //instace
    const user = new User(userData);

    try {
        //check existance
        const result = await user.isExist();
        if (result.check) {//check = true => user exist => 409 => conflict
            return next(createHttpError(409, result.message))
        }
    } catch (error) {
        return next(createHttpError(500, error.message))
    }

    //save user. [input: callback function]
    user.save((status) => {
        //fetch reviewer to make a user reviewer. (reviewer has name & id[same of user id])
        if (status.status) {
            const reviewer = new Reviewer({
                name: userData.name,
                _user_id: status._user_id
            })
            //save reviewer. [input: callback function]
            reviewer.save((result) => {
                if (result.status) {
                    // return returnJson(res, 201, true, 'user has been created', user)
                    // return returnJson(res, 201, true, 'user has been created', reviewer)
                    return returnJson(res, 201, true, 'user has been created', null)
                } else {
                    return next(createHttpError(500, 'user has been created but reviewer has not'))
                }
            })
        } else {
            return next(createHttpError(500, status.message))
        }
    })
}

const login = (req, res, next) => {
    //req.body in input.
    User.login(req.body)
        //fetch data if status is true by then() [promise]
        .then((result) => {
            if (result.status) {
                return returnJson(res, 200, true, '', result.data)
            } else
                return next(createHttpError(result.code, result.message))
        })
        // catch the error.
        .catch(err => next(createHttpError(500, err.message)))
}

module.exports = {
    signup, login
}