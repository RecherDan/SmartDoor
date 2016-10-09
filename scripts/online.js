var Firebase = require("firebase");
var getIP = require('external-ip')();
var net = require('net');

var doorconfig = require('./config'); // door configuration

var minutes = 0.01, the_interval = minutes * 60 * 1000;
var config = {
	    apiKey: "AIzaSyCRpzldmrnwtOf7M_TBBNGFofyswZ2IifQ",
	    authDomain: "smartdoor-2f29b.firebaseapp.com",
	    databaseURL: "https://smartdoor-2f29b.firebaseio.com",
	    storageBucket: "",
	    messagingSenderId: "693048105512"
	  };
Firebase.initializeApp(config);
var database = Firebase.database();
var doorstatus = "closed";
var smokedet = "clean";
var lastevent = "13:20";
var alarm = "off";
var eip = "";

console.log("start updating online status");
getIP(function (err, ip) {
    if (err) {
        // every service in the list has failed 
        throw err;
    }
    eip = ip;
});

database.ref().child('doors').child(doorconfig.doorname).child('todo').on("value", function(snapshot) {
	  console.log("todo " + snapshot.val());
	  if (snapshot.val() != "null" ) {
		  var valid = false;
		  var port = 6001;
		  var mode = "";
		  if ( snapshot.val()  == "Lock" ) {
			  valid = true;
			  port = 6001;
			  mode = "Close";
		  } 
		  if ( snapshot.val()  == "Unlock" ) {
			  valid = true;
			  port = 6001;
			  mode = "Open";
		  } 
		  if ( valid ) {
			  var client = new net.Socket();
			  client.connect(port, '127.0.0.1', function() {
			  	console.log('Connected');
			  	client.write(mode);
			  });

			  client.on('data', function(data) {
			  	console.log('Received: ' + data);
			  	client.destroy(); // kill client after server's response
			  });

			  client.on('close', function() {
			  	console.log('Connection closed');
			  });
		  }
	  }
		  
	  database.ref().child('doors').child(doorconfig.doorname).child('todo').set("null");
	  
	});

setInterval(function() {
  //console.log(doorconfig.doorname + ": I am doing my 0.1 minutes check");
  var d = new Date();
  var rootref = database.ref().child('doors');
  var doorref = rootref.child(doorconfig.doorname);
  //exec tester.js to receive door information
  doorref.child('ip').set(eip);
  doorref.child('time').set(d.getTime());
  //doorref.set({ip: eip,
	//  time: d.getTime(),
	  //doorstatus: doorstatus,
	//  smokedetect: smokedet,
	//  alarm: alarm,
	//  lastevent: lastevent
	//  });
  // do your stuff here
}, the_interval);