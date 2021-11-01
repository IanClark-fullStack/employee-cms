const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        port: 3306,
        host: 'localhost',
        user: 'root',  
        password: 'rootadmin',
        database: 'company_db'  
    }
);
db.connect((err) => {
    if (err) throw err;
})
module.exports = db;