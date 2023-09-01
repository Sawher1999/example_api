// require dependencies that must be used
const express = require('express');
const app = express();
const port = 3000;

let bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// connect to mysql
const createDBConnection = require('./src/dbConnection');
const dbCon = createDBConnection();

var routeMember= require('./src/routes/member');
app.use('/api/', routeMember);

// homepage route
app.get('/', (req, res) => {
    return res.send({
        error: false,
        message: 'Welcome to demo RESTful API with NodeJS, Express, MYSQL'
    })
})

app.listen(port, () => {
    console.log('Node App is running on port 3000')
})

module.exports = app;