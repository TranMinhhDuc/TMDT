const mysql = require('mysql2/promise');
const { HOST, PORT_DB, USER, PASSWORD, DB_NAME } = require('./env');

console.log({ HOST, PORT_DB, USER, PASSWORD, DB_NAME });

const dbPool = mysql.createPool({
    host: HOST,
    user: USER,
    port: PORT_DB,
    database: DB_NAME,
    password: PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = dbPool;