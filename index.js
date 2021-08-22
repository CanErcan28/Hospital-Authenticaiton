//Written in NodeJS. The file where the requests are made.

//Required tools have already been downloaded and imported.
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');


//mongodb connection
var dbConn = mongodb.MongoClient.connect('mongodb://localhost:27017');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, 'public')));


//where we add the data to the system
app.post('/post-feedback', function(req, res) {
    dbConn.then(function(db) {
        delete req.body._id; // for safety reasons
        db.collection('feedbacks').insertOne(req.body);
    });
    res.send('Data received:\n' + JSON.stringify(req.body));
});


//where we read the data
app.get('/view-feedbacks', function(req, res) {
    dbConn.then(function(db) {
        db.collection('feedbacks').find({}).toArray().then(function(feedbacks) {
            res.status(200).json(feedbacks);
        });
    });
});

app.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0');