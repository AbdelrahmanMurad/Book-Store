const { MongoClient } = require('mongodb');
// console.log(process.env.MONGODB_URI);
// console.log(process.env.MONGODB_DB);
// console.log(process.env.PORT);
// const _uri = process.env.MONGODB_URI; //=> not working
const _uri = 'mongodb://localhost:27017';

const dbConnection = (collection, cb) => {
    MongoClient.connect(_uri)
        .then(async (client) => {
            console.log("===> Connect to Database");
            // await cb(client.db(process.env.MONGODB_DB).collection(collection)) //=> not working
            await cb(client.db('book_store').collection(collection))
            client.close();
        })
        .catch(() => { })
}

//test
// dbConnection('users', async (db) => {
//     const users = await db.findOne();
//     console.log(users);
// })

module.exports = dbConnection;