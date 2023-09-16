const { dbConnection } = require("../configurations");
/**class Reviewer{
 * constructor()
 * 1- save(): update the user that does not has an id. [input: callback function, output: status]
 * }
 */
class Reviewer {

    constructor(reviewerData) {
        this.reviewerData = reviewerData;
    }

    //save(): update the user that does not has an id.
    save(cb) {
        dbConnection('reviewers', async (collection) => {
            try {
                //update reviewer
                await collection.updateOne(
                    { name: this.reviewerData.name, _user_id: null },//condition
                    { $set: { _user_id: this.reviewerData._user_id, name: this.reviewerData.name } },//then
                    { upsert: true }
                )
                cb({
                    status: true
                })
            } catch (error) {
                cb({
                    status: false,
                    message: error.message
                })
            }
        })
    }
}

module.exports = Reviewer;