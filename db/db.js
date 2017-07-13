const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectID;

const init = (connectionString) => {
    return MongoClient.connect(connectionString);
};

module.exports = { init, ObjectId };
