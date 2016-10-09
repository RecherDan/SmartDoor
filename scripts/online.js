var Firebase = require("firebase");
var getIP = require('external-ip')();
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

setInterval(function() {
  console.log(doorconfig.doorname + ": I am doing my 0.1 minutes check");
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