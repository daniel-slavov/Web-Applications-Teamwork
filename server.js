const config = require('./config');

require('./db').init(config.connectionString)
    .then((db) => {
        return require('./data').init(db);
    })
    .then((data) => {
        return require('./app').init(data);
    })
    .then((app) => {
        app.listen(config.port, () => {
            console.log(`Server listening at: ${config.port}`);
        });
    });

