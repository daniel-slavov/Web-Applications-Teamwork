const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const init = (connectionString) => {
    return MongoClient.connect(connectionString);
};

module.exports = { init };
