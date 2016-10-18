var mraa = require('mraa'); //require mraa
var sleep = require('sleep'); //require sleep libary to delay between commands
var net = require('net'); // require net for open server.
var doorconfig = require('./config'); // door configuration
var minutes = 0.000001, the_interval = minutes * 60 * 1000;
var childProcess = require('child_process'), child;
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
var PotentiometerStatus = new mraa.Aio(0); // Potentiometer Status

//MotorStatus read Potentiometer Status and consider if door is "Open", "Close" or in the "Middle"
function MotorStatus() {
	var PotentiometerRead = PotentiometerStatus.read();
	if ( PotentiometerRead < doorconfig.ThrasholdConsiderdOpen ) return "Open";
	else if ( PotentiometerRead > doorconfig.ThrasholdConsiderdClose ) return "Close";
	return "Middle";
}

setInterval(function() {
	var doorneedtobe = doorref.child('doorneedtobe');
	doorneedtobe.on('value' , snap => {
			if ( MotorStatus() != snap.val() ) {
				console.log("Possible to be thief");
				if ( snap.val() == "Close" ) {
					console.log("ok lets send notifications");
					var notification = {
							title: "Thief Alert",
						       	msg: "someone is opening your lock manually!",
							popup: "true"	
						}	
					child = childProcess.exec('node /home/root/smartdoor/scripts/sendnotification.js "Thief Alert" "someone is opening your lock manually!"', function (error, stdout, stderr) {
						   if (error) {
						     console.log(error.stack);
						     console.log('Error code: '+error.code);
						     console.log('Signal received: '+error.signal);
						   }
						   console.log('Child Process STDOUT: '+stdout);
						   console.log('Child Process STDERR: '+stderr);
						 });

							doorref.child('notification').set(notification);
				    var stop = new Date().getTime();
					while(new Date().getTime() < stop + 10000) {
						;
					}
					notification['popup'] = "false";
					doorref.child('notification').set(notification);
				    var stop = new Date().getTime();
					while(new Date().getTime() < stop + 60000) {
						;
					}
				}
			}
		}
	    );
}, the_interval);