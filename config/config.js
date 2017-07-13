const protocol = 'mongodb:/';
const server = 'localhost';
const port = '3001';
const databaseName = 'Events';

const connectionString = `${protocol}/${server}/${databaseName}`;

module.exports = { port, connectionString };
