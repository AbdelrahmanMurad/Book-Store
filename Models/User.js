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
     * 2- dbConnection
     * 3- Join - aggregate: merging the data we need between two collections (users & reviewers)
     * 4- compare between passwords
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

            dbConnection('users', async (collection) => {
                try {
                    /** aggregate([]) => output: array of objects => merging the data we need between two collections (users & reviewers)
                     *   - it will take 3 objects:
                     *       - lookup object: takes multiple fields.
                     *               - form field: Name of related collection: we need to merge the Related Collection (second collection) with the Main Collection (first collection).
                     *               - localField: name of key in the Main Collection. => in SQL: Primary Key
                     *               - foreignField: name of key in the Related Collection. => in SQL: Foreign Key
                     *               - as field: name of related document => انت حر في اختيار الاسم
                     *       - match object: condition
                     *       - limit object: to limit the number of users in result.
                     * =======================================================================
                     *  The problems in aggregate method: 
                     *      1- findOne()وليس ال find()انها تتعامل مع الداتا مثل ال 
                     *          - المطلوب فقط userمش ال usersهيك هي بتجيب كل ال 
                     *          - Solution: (match & limit objects) => match obj for make a condition  + limit obj for specifying number of users.
                     *      2- arrayواحنا بدنا نشيل ال arrayانها بتجيب الداتا في ال (data in list)
                     *          - Solution: select the first object in the array to each collection, so the output will be (object) not (array of objects).
                     *                      - first user: const user = dbResult[0];
                     *                      - first reviewer: user.reviewer = (user.reviewer) ? user.reviewer[0] : null
                     */
                    const dbResutl = await collection.aggregate([
                        {
                            $lookup: {
                                from: 'reviewers',
                                localField: '_id',
                                foreignField: '_user_id',
                                as: 'reviewer'
                            }
                        },
                        { $match: { username: loginData.username } },
                        { $limit: 1 }
                    ]).toArray()

                    //Start of parent if
                    if (dbResutl) {
                        //first user (first object)
                        const user = dbResutl[0];

                        //loginData.password => decrypted
                        //user.password => encrypted
                        if (user || compareSync(loginData.password, user.password)) {
                            //first reviewer (first object)
                            // if user.reviewer exist
                            user.reviewer = (user.reviewer) ? user.reviewer[0] : null
                            // or => if (user.reviewer) { user.reviewer = user.reviewer[0] } else { user.reviewer = null }
                        } else {
                            resolve({
                                status: false
                            })
                        }

                        //End of parent if
                        resolve({
                            status: true,
                            data: user
                        })
                    } else {
                        resolve({
                            status: false
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