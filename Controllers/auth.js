const { User, Reviewer } = require('../models');
const createHttpError = require('http-errors');
const { returnJson } = require('../modules/JsonResponse');

/** signup() method
 * 1- userData: variable request data from body.
 * 2- validation operation.
 * 3- check existance from user instace. (you can save user here, in then() after result. [because its promise])
 * 4- save data.
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


module.exports = {
    signup
}