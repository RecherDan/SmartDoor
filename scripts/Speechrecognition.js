var net = require('net'); // require net for open server.
const fs = require('fs');
const speech = require('@google-cloud/speech')({
	  projectId: 'smartdoor-2f29b',
	  keyFilename: '/home/root/smartdoor/scripts/smartdoor-fbe1a59a4915.json'
	});
var doorconfig = require('/home/root/smartdoor/scripts/config'); // door configuration
var Firebase = require("firebase");
var config = {
	    apiKey: "AIzaSyCRpzldmrnwtOf7M_TBBNGFofyswZ2IifQ",
	    authDomain: "smartdoor-2f29b.firebaseapp.com",
	    databaseURL: "https://smartdoor-2f29b.firebaseio.com",
	    storageBucket: "",
	    messagingSenderId: "693048105512"
	  };
Firebase.initializeApp(config);

var database = Firebase.database();
var rootref = database.ref().child('doors');
var doorref = rootref.child(doorconfig.doorname);

if ( doorconfig.SpeechService == false ) return;

function startRecord() {
	var proc = require('child_process').spawn("arecord", ['-t','raw','-r','16000','-f','S16_LE','./test2.raw'] );
	console.log("start recording2");
	proc.stdout.on('data', (data) => {
		  console.log(`stdout: ${data}`);
	});
	var stop = new Date().getTime();
	while(new Date().getTime() < stop + 5000) {
		;
	}

	proc.kill();
	stop = new Date().getTime();
	while(new Date().getTime() < stop + 2000) {
		;
	}
	speech.recognize("./test2.raw", {
	    encoding: 'LINEAR16',
	    sampleRate: 16000
	  }, (err, results) => {
	    if (err) {
	      console.log(err);
		    
	      return;
	    }
	    console.log('Results:', results);
	    console.log('Upper case:', results.toUpperCase());
	    if ( results.toUpperCase() == "OPEN SESAME") {
	    	console.log("Open the door");
			var client = new net.Socket();
			client.connect(6001, '127.0.0.1', function() {
				console.log('Connected');
				client.write("Open");
			});

			client.on('data', function(data) {
				console.log('Received: ' + data);
				client.destroy(); // kill client after server's response
			});

			client.on('close', function() {
				console.log('Connection closed');
			});
	    	return;
	    }
			var notification = {
				title: "Someone recorded a message",
			       	msg: results,
				popup: "true"	
			}	
				doorref.child('notification').set(notification);
			    var stop = new Date().getTime();
				while(new Date().getTime() < stop + 10000) {
					;
				}
				notification['popup'] = "false";
				doorref.child('notification').set(notification);
				 return;
	  });
	  
	
}

//open socket server and wait to commands.
var server = net.createServer(function(socket) {
	console.log("Speech Recognition server is on ");
	socket.setKeepAlive(true,60000);
	socket.on('data', function(data) {

	 if ( data == "Record" ) {
			startRecord();
		}
		else {
			socket.write("Error, bad command");
		}

	});
});

server.listen(6006, '127.0.0.1');