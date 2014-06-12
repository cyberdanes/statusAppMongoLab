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
router.get('/newvideo', function(req, res) {
    res.render('newvideo', { title: 'Add New Video' });
});

/* GET New Video page. */
router.get('/searchvideopage', function(req, res) {
    res.render('searchvideopage', { title: 'Search Videos' });
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

/* POST to search videos. */
router.post('/searchvideo', function(req, res) {
    var db = req.db;
    var matchingVideos = [];
    var tags = req.body.keywords;
    var arr = tags.split(" ");
    
    // app.js
    db.videos.find({}, function(err, videos) {
      if( err || !videos) 
      res.redirect("novideospage");
      else videos.forEach( function(video) {
      var videoTags = video.tags;
      var videoTagArr = videoTags.split(" ");
      videoTagArr.forEach(function(value1) {
      	arr.forEach(function(value2) {
      		if(value1 === value2)
      		match = true;
      	});
      	if(match === true)
      	matchingVideos.push(video);
      	match = false;
      });
  } );
    });

 //   var collection = db.get('videocollection');
//    collection.find({},{},function(e,docs){
//        res.render('videolist', {
//            "videolist" : docs
//        });
//    });
});

/* POST to add video service*/
router.post('/addvideo', function(req, res) {

    // Set our internal DB variable
    var db = req.db;
    var mongodb = require('mongodb');

    // Get our form values. These rely on the "name" attributes
    var videoname = req.body.videoname;
    var videoid = req.body.videoid;
    var videotags = req.body.videotags;
    var videopath = req.body.videopath;

var videoData = [
  {
    videoName: videoname,
    videoId: videoid,
    videoTags: videotags,
    videoPath: videopath
  }
];

var uri = 'mongodb://motu:motu1234@ds045679.mongolab.com:45679/cyberdanes';

mongodb.MongoClient.connect(uri, function(err, db) {
  
  if(err)  res.send("There was a problem adding the information to the database.");;
  
       var videos = db.collection('videos');

   // Note that the insert method can take either an array or a dict.

 videos.insert(videoData, function(err, result) {
    if(err) throw err;
    else {
          res.location("videolist");
          //And forward to success page
            res.redirect("videolist");
    }
});


  
});

    // Submit to the DB
//    collection.insert({
//        "videoname" : videoName,
//        "videoid" : videoId,
//        "videotags" : videoTags,
//	"videopath" : videoPath
//    }, function (err, doc) {
//        if (err) {
//            // If it failed, return error
//            res.send("There was a problem adding the information to the database.");
//        }
//        else {
//            // If it worked, set the header so the address bar doesn't still say /adduser
//            res.location("homepage");
//            // And forward to success page
//            res.redirect("homepage");
//        }
//    });
});

    /* POST to search videos. */
    router.get('/searchvideo', function(req, res) {
        var url = require('url');
        var url_parts = url.parse(req.url, true);
        var tags = url_parts.query;
        var db = req.db;
        var videos = db.get('videocollection');
        var matchingVideos = [];
        var arr = tags.split(" ");
        var match = false;
        console.log("in method");
        var flag1 = 1;
        var flag2 = 1;
        var flag3 = 1;
        var videoPushCount = 0;
        // app.js
        videos.find({}, function(err, videos) {
          if( err || !videos) 
          res.redirect("novideospage");
          else videos.forEach( function(video) {
            console.log('Flag One for Video', flag1);
          var videoTags = video.videotags;
          var videoPushed = false;
          arr.forEach(function(value1) {
            console.log('Flag Two for keyword' ,flag2);
            videoTags.forEach(function(value2) {
            console.log('Flag Three for Video tag' ,flag3);
            console.log('Value from video', value1);
            console.log('Value from keyword', value2);
              if(value1.toString().toUpperCase() === value2.toString().toUpperCase()){
              match = true;
              console.log('match');
            }
            flag3 = flag3 +1;
            });
            flag3 = 1;
            flag2 = flag2 + 1;
          });
          flag2 = 1;
          if(match === true && videoPushed === false){
            matchingVideos.push(video);
            videoPushed = true;
            videoPushCount = videoPushCount +1;
            console.log('video pushed', videoPushCount);
            console.log(video);
            console.log(video.videopath);
            console.log(matchingVideos);
          }
          match = false;
      });
    console.log('final matching video paths' , matchingVideos);
        //res.json(matchingVideos);
           res.writeHead(200, {"Content-Type":"text/json",
                "Access-Control-Allow-Origin": "*"});
   res.write(JSON.stringify(matchingVideos));
   res.end();
        });
    });

    /* POST to add video service*/
    router.post('/addvideo', function(req, res) {

        // Set our internal DB variable
        var db = req.db;
       
        // Get our form values. These rely on the "name" attributes
        var videotitle = req.body.videotitle;
        var videodescription = req.body.videodescription;
        var videopath = req.body.videopath;
        var videoposter = req.body.videoposter;
        var videocategory = req.body.videocategory;
        var videotags = req.body.videotags;
        var tagarr = videotags.split(" ");
    
    var collection = db.get('videocollection');
      
      // Submit to the DB
    collection.insert({
        "videotitle" : videotitle,
        "videodescription" : videodescription,
        "videopath" : videopath,
        "videoposter" : videoposter,
        "videocategory" : videocategory,
        "videotags" : tagarr
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // If it worked, set the header so the address bar doesn't still say /addvideo
            res.location("homepage");
            // And forward to success page
            res.redirect("homepage");
        }
    });
    });

module.exports = router;