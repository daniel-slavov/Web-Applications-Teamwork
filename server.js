const db = require('./db');
const data = require('./data').init(db);
const app = require('./app').init(data);

const port = 3001;

app.listen(port, () => {
    console.log(`Server listening at: ${port}`);
});
