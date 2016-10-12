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

function storeLog(name, todo) {
	  var d = new Date();
	  var log = {
			  name: name,
			  todo: todo,
			  time: d.getTime()
	  }
	  database.ref().child('doors').child(doorconfig.doorname).child('log').push(log);
}
function applyService (port, mode) {
	  
	  if ( doorconfig.debug == false ) {
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


database.ref().child('doors').child(doorconfig.doorname).on("value", function(snapshot) {
		
	  if (snapshot.child('todo').val() != "null" ) {
		  database.ref().child('doors').child(doorconfig.doorname).child('todo').set("null");
		  console.log("todo " + snapshot.child('todo').val());
		  if ( snapshot.child('todo').val()  == "Lock" ) {
			  storeLog(snapshot.child('todo-name').val(), snapshot.child('todo').val());
			  applyService(6001, "Close");
		  } 
		  if ( snapshot.child('todo').val()  == "Unlock" ) {
			  storeLog(snapshot.child('todo-name').val(), snapshot.child('todo').val());
			  applyService(6001, "Open");
		  } 
		  if ( snapshot.child('todo').val()  == "Emergency" ) {
			  storeLog(snapshot.child('todo-name').val(), snapshot.child('todo').val());
			  applyService(6001, "Open");
			  applyService(6003, "");
		  } 
	  }
		  
	  
	  
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