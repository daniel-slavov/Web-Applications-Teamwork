const { MongoClient } = require('mongodb');
const async = require('../../utils/async');

const cleanUp = (connectionString) => {
    return async()
        .then(() => MongoClient.connect(connectionString))
        .then((db) => db.dropDatabase());
};

module.exports = { cleanUp };