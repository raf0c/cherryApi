var express    = require('express');
var mongo      = require('mongodb');
var morgan     = require('morgan');
var bodyParser = require('body-parser');
var port       = process.env.PORT || 8080; // set our port

users = require('./routes/users');

var app = express();

var Server = mongo.Server;
var Db     = mongo.Db;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('cherrydb', server);

app.set('json spaces', '\t');
app.use(morgan('dev')); /* 'default','short','tiny','dev' */
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

app.get('/',users.getWelcomeMsg);
app.get('/users', users.findAll);
app.get('/users/:id', users.findById);
app.post('/users', users.addUser);
app.put('/users/:id', users.updateUser);
app.delete('/users/:id', users.deleteUser);


/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function () {
    'use strict';
    var users = [{
        name: "Matthew",
        lastName: "Ng",
        country: "USA",
        timeZone: "PDT/Pacific Daylight Time",
        picture: "http://i.imgur.com/gtWsPu9.jpg"
    }, {
        name: "Rafael",
        lastName: "Ocampo",
        country: "Mexico",
        timeZone: "CDT/Central Daylight Time",
        picture: "http://i.imgur.com/26jo0Tw.jpg"
    }];

    db.collection('users', function (err, collection) {
        collection.insert(users, {safe: true}, function (err, result) {});
    });

};


db.open(function (err, db) {
    'use strict';
    if (!err) {
        console.log("Connected to 'cherrydb' database");
        db.collection('users', {strict: true}, function (err, collection) {
            if (err) {
                console.log("The users collection doesn't exist. Creating it with simple data");
                populateDB();
            }
        });
    }
});

app.listen(port);

console.log('Listening on port ' + port + '...');
