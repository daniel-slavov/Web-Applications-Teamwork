const db = require('./db');
const data = require('./data').init(db);
const app = require('./app').init(data);

const config = require('./config');

app.listen(config.port, () => {
    console.log(`Server listening at: ${config.port}`);
});
