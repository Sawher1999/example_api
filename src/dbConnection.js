const mysql = require('mysql');

function createDBConnection() {
    const dbCon = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'example_api'
    });

    dbCon.connect((err) => {
        if (err) {
            console.error('Error connecting to the database:', err);
            return;
        }
        console.log('Connected to the database');
    });

    return dbCon;
}

module.exports = createDBConnection;
