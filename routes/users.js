var ObjectID = require('mongodb').ObjectID;

exports.getWelcomeMsg = function (req, res) {
    'use strict';
    res.json({ message: 'hooray! welcome to our api!' });
}

exports.findById = function (req, res) {
    'use strict';
    var id = ObjectID.createFromHexString(req.params.id);
    console.log('Retrieving user: ' + id);
    db.collection('users', function (err, collection) {
        collection.find({'_id': id}).limit(1).next(function (err, result) {
            if (result) {
                res.send(result);
            } else {
                console.log('no data');
            }
        });
    });
};

exports.findAll = function (req, res) {
    'use strict';
    db.collection('users', function (err, collection) {
        collection.find().toArray(function (err, items) {
            res.send(items);
        });
    });
};

exports.addUser = function (req, res) {
    'use strict';
    var user = req.body;
    console.log('Adding user: ' + JSON.stringify(user));
    db.collection('users', function (err, collection) {
        collection.insert(user, {safe: true}, function (err, result) {
            if (err) {
                res.send({'error': 'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
};

exports.updateUser = function (req, res) {
    'use strict';
    var id = ObjectID.createFromHexString(req.params.id)
    var user = req.body;
    console.log('Updating user: ' + id);
    console.log(JSON.stringify(user));
    db.collection('users', function (err, collection) {
        collection.updateOne({'_id': id}, user, {safe: true}, function (err, result) {
            if (err) {
                res.send({'error': 'An error has occurred'});
            } else {
                console.log(result + ' document(s) updated');
                res.send(user);
            }
        });
    });
};

exports.deleteUser = function (req, res) {
    'use strict';
    var id = ObjectID.createFromHexString(req.params.id);
    console.log('Deleting user: ' + id);
    db.collection('users', function (err, collection) {
        if (err) {
            console.log('Error ocurred ' + err);
        } else {
            collection.deleteOne({'_id': id}, {safe: true}, function (err, result) {
            if (err) {
                res.send({'error': 'An error has occurred - ' + err});
            } else {
                console.log(result + ' document(s) deleted');
                res.send(req.body);
            }
        });
        }
    });
};