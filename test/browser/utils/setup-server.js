const async = require('../../../utils/async');
const { getApp } = require('../../../app/app');
const dbUtils = require('../../shared/db.utils');

class Server {
    constructor(url, connectionString, port) {
        this.url = url;
        this.port = port;
        this.connectionString = connectionString;
    }

    start() {
        return async()
            .then(() => getApp({
                connectionString: this.connectionString,
                logsDirectory: this.logsDirectory,
            }))
            .then((app) => {
                this.app = app;
                return new Promise((resolve) => {
                    this.server = app.listen(this.port, resolve);
                });
            });
    }

    stop() {
        return async()
            .then(() => dbUtils.cleanUp(this.connectionString))
            .then(() => new Promise((resolve) => this.server.close(resolve)));
    }
}


module.exports = { Server };