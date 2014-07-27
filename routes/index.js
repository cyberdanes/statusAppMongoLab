var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* GET homepage. */
router.get('/homepage', function(req, res) {
  res.render('homepage', { title: 'Home Page' });
});

/* GET New Video page. */
router.get('/newstatus', function(req, res) {
    res.render('newstatus', { title: 'Add New Status' });
});

/* GET New Video page. */
router.get('/searchstatus', function(req, res) {
    res.render('searchstatus', { title: 'Search Status' });
});

/* GET novideospage. */
router.get('/novideospage', function(req, res) {
  res.render('novideospage', { title: 'No Videos Page' });
});

/* GET Videolist page. */
router.get('/videolist', function(req, res) {
 var uri = 'mongodb://motu:motu1234@ds045679.mongolab.com:45679/cyberdanes';

 var mongodb = require('mongodb');

 mongodb.MongoClient.connect(uri, function(err, db) {
   
   if(err) throw err;
   
   var videos = db.collection('videos');
/*
 * Finally we run a query which returns all the hits that spend 10 or
 * more weeks at number 1.
 */

         videos.find({}, function (err, docs){

           if(err || !docs) res.redirect("novideospage");

           else res.render('videolist',{"videolist" : docs});
   });
 });
});

/* POST to add video service*/
router.post('/addstatus', function(req, res) {

    // Set our internal DB variable
    var db = req.db;
    var mongodb = require('mongodb');

    // Get our form values. These rely on the "name" attributes
    var username = req.body.username;
    var yesterday = req.body.yesterday;
    var today = req.body.today;
    var impediments = req.body.impediments;
    var rawstatusdate = new Date();
    console.log('status date' , rawstatusdate);
    var statusmonth = rawstatusdate.getMonth() + 1;
    var statusdate = rawstatusdate.getDate() + "/" + statusmonth + "/" + rawstatusdate.getFullYear();
    console.log('formatted date', statusdate)
var statusData = [
  {
    "userName": username,
    "statusDate": statusdate,
    "yesterday": yesterday,
    "today": today,
    "impediments": impediments
  }
];

var mongo = require('mongodb');
var Server = mongo.Server;
var Db = mongo.Db;
var result;


var server = new Server('ds053459.mongolab.com', 53459, {auto_reconnect : true});
console.log('got server');
var db = new Db('statusapp', server);
db.open(function(err, client) {
    client.authenticate('statusapp', 'statusapp', function(err, success) {
        console.log('connected to db');
        var statusCollection = db.collection("dailyUpdateCollection");
        console.log('got db collection');
        statusCollection.insert(statusData);
        if(success){
          console.log('inserted data');
          result = 'success';
        }else{
          console.log('error occurred inserting data');
          result = 'error';
        }
        
        db.close();
    });
});
res.redirect("homepage");
});

    /* POST to search status. */
    router.post('/searchstatus', function(req, res) {
        var username = req.body.username;
        var date = req.body.date;
        console.log(username);
        console.log(date);
        var mongo = require('mongodb');
var Server = mongo.Server;
var Db = mongo.Db;
var result;

var server = new Server('ds053459.mongolab.com', 53459, {auto_reconnect : true});
console.log('got server');
var db = new Db('statusapp', server);
console.log('got db');
db.open(function(err, client) {
    client.authenticate('statusapp', 'statusapp', function(err, success) {
        console.log('connected to db');
        var statusCollection = db.collection("dailyUpdateCollection");
        console.log('got db collection');
       statusCollection.find({"userName":username, "statusDate":date},{}, function(err, statuses) {
      if( err || !statuses) 
      res.redirect("novideospage");
      else {
        res.writeHead(200, {"Content-Type":"text/json",
                "Access-Control-Allow-Origin": "*"});
        statuses.each(function(t, status) { 
        console.log('status', status);
        console.log('stringified', JSON.stringify(status));
          console.log('writing to response');
          res.write(JSON.stringify(status));
          res.end();
      });
      };
  });
    });
});
});

module.exports = router;