const { MongoClient } = require('mongodb');

const _uri = process.env.MONGODB_URI;

const dbConnection = (collection, cb) => {
    MongoClient.connect(_uri)
        .then(async (client) => {
            console.log("===> Connect to Database");
            await cb(client.db(process.env.MONGODB_DB).collection(collection))
            client.close();
        })
        .catch(() => { })
}

dbConnection('users', async (db) => {
    const users = await db.findOne();
    console.log(users);
})

module.exports = dbConnection;