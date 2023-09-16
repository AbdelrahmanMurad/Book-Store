const { dbConnection } = require('../configurations')
const { userVali, loginVali } = require('../validations')
const { hashSync, compareSync } = require('bcryptjs')
/**class User {
 *  constructor()
 * 1- validation(): make a regular expression. [input: user data]
 * 2- isExist(): check existance of user in the database. [return promise]
 * 3- save(): save and insert the user to the database. [input: callback function, output: user id & status]
 * 4- login(): login operation  [return promise - input & output: data]
 * }
 */
class User {

    constructor(userData) {
        this.userData = userData
    }

    //validation(): make a regular expression. [input: user data]
    static validation(userData) {
        try {
            return userVali.validate(userData)
        } catch (error) {
            return false;
        }
    }

    //isExist(): check existance of user in the database. [return promise]
    isExist() {
        return new Promise((resolve, reject) => {
            dbConnection('users', async (collection) => {
                try {
                    //search of user in db.
                    const user = await collection.findOne({
                        '$or': [
                            { username: this.userData.username },
                            { email: this.userData.email }
                        ]
                    })
                    if (!user) {
                        resolve(
                            {
                                check: false,
                                message: 'user is not exist in database'
                            }
                        )
                    } else {
                        if (user.username === this.userData.username) {
                            resolve(
                                {
                                    check: true,
                                    message: 'username is already used'
                                }
                            )
                        } else if (user.email === this.userData.email) {
                            resolve(
                                {
                                    check: true,
                                    message: 'email is already used'
                                }
                            )
                        }
                    }
                } catch (error) {
                    reject(error)
                }
            })
        })
    }

    //save(): save and insert the user to the database. [input: callback function, output: user id]
    save(cb) {
        dbConnection('users', async (collection) => {
            try {
                //encrypting password
                const hashedPassword = hashSync(this.userData.password);
                this.userData.password = hashedPassword;
                //save - insert the user to mongoDB
                await collection.insertOne(this.userData)
                //get the id from the user & store it in the callback fn.
                const newUser = await collection.findOne({ username: this.userData.username })
                cb({
                    status: true,
                    _user_id: newUser._id
                })
            } catch (error) {
                cb({
                    status: false,
                    message: error.message
                })
            }
        })
    }

    /**login() method
     * 1- make a validation operation.
     * 2- dbConnection to fetch username & password by findOne
     * 3- compare between passwords
     */
    static login(loginData) {
        return new Promise((resolve, reject) => {

            //make a validation operation.
            const valiResult = loginVali.validate(loginData);
            if (valiResult.error) {
                resolve({
                    status: false,
                    message: validation.error.message,
                    code: 400
                })
            }

            //dbConnection to fetch username & password by findOne
            dbConnection('users', async (collection) => {
                try {
                    const user = await collection.findOne(
                        { username: loginData.username },
                        { projection: { username: 1, password: 1 } }
                    )

                    //compare between passwords
                    if (user) {
                        if (compareSync(loginData.password, user.password) == true) {
                            resolve({
                                status: true,
                                data: user
                            })
                        }
                    } else {
                        resolve({
                            status: false,
                            message: 'login failed',
                            code: 401
                        })
                    }
                } catch (error) {
                    reject({
                        status: false,
                        message: error.message
                    })
                }
            })

        })

    }

}

module.exports = User;