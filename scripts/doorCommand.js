var mraa = require('mraa'); //require mraa
var sleep = require('sleep'); //require sleep libary to delay between commands
var net = require('net'); // require net for open server.
var doorconfig = require('./config'); // door configuration
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


// pins definitions
var myDigitalPin7 = new mraa.Gpio(7);
myDigitalPin7.dir(mraa.DIR_OUT);
var StepPin = new mraa.Gpio(12); //setup digital pin to make the steps in the stepper motor
var DirectionPin=new mraa.Gpio(11); //setup digital pin to make direction of the rotation of the stepper motor 1(clockwise) 0 (anti clockwise) 
StepPin.dir(mraa.DIR_OUT); //set the gpio direction to output
DirectionPin.dir(mraa.DIR_OUT); //set the gpio direction to output
var PotentiometerStatus = new mraa.Aio(0); // Potentiometer Status


// global definitions
var ThrasholdConsiderdOpen= doorconfig.ThrasholdConsiderdOpen; // a reading form the analog pin 0 (in rang of 0 to 1023) blow it the door is considerd opne
var ThrasholdConsiderdClose= doorconfig.ThrasholdConsiderdClose; // a reading form the analog pin 0 (in rang of 0 to 1023) above it the door is considerd close
var maxStepsToOpen = 7000; // how many maximum!!!!! steps to open or close the door the motore sould do
var dirToOpen =1;// set the dirction of side the motor will spin
var dirToClose =0;// the same ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
var inOperation = 0;
var half_time_Of_Sleep_Between_Steps=1200;// the time in micorSecends between the digitalwirte 1 and!! 0 to the step pin
var commendstr="unnoknown";

// this function used for printing door status to the screen
function PrintDoorStatus(MSG) {
	// TODO: command to screen!
	doorref.child('doormsg').set(MSG);
	console.log(MSG);
}

// StepMotor doing the "stepping" to direction "Direction"
function StepMotor(Direction) {
	// rely on
	myDigitalPin7.write(1);
	
	// set direction
    if (Direction == "Open") 
    	DirectionPin.write(dirToOpen);
    else 
    	DirectionPin.write(dirToClose);
    
    
    for(var i = 0; i < maxStepsToOpen ;i++){
	    StepPin.write(1);
	    sleep.usleep(half_time_Of_Sleep_Between_Steps);
	    StepPin.write(0);
	    sleep.usleep(half_time_Of_Sleep_Between_Steps) ;
	    var PotentiometerRead = PotentiometerStatus.read();
	    if (Direction == "Open" && PotentiometerRead < ThrasholdConsiderdOpen)
	    	break;
	    if (Direction == "Close" && PotentiometerRead > ThrasholdConsiderdClose)
	    	break;
    }
    
	// rely off
	myDigitalPin7.write(0);
}

// MotorStatus read Potentiometer Status and consider if door is "Open", "Close" or in the "Middle"
function MotorStatus() {
	var PotentiometerRead = PotentiometerStatus.read();
	if ( PotentiometerRead < ThrasholdConsiderdOpen ) return "Open";
	else if ( PotentiometerRead > ThrasholdConsiderdClose ) return "Close";
	return "Middle";
}

// DoorCom receives "Open" or "Close" and then controlling the stepper to open or close.
function doorCom(command) {
	var motorStatus = MotorStatus();
	
	// checks if any operation is needed.
	if ( command == "Open" && motorStatus == "Open" ) {
		PrintDoorStatus("Door Already Open");
		return ;
	}
	
	if ( command == "Close" && motorStatus == "Close" ) {
		PrintDoorStatus("Door Already Closed");
		return ;
	}	
	
	//checks if command is eligible
	if ( command != "Open" && command != "Close") {
		PrintDoorStatus("Received bad command.");
		return ;	
	}
	
	//update status
	if ( command == "Open")
		doorref.child('doorstatus').set("Unlocking");
	if ( command == "Close")
		doorref.child('doorstatus').set("Locking");
	
	// step the motor
	StepMotor(command);
		
	// check status after operation
	motorStatus = MotorStatus();
	
	if ( command == "Open" && motorStatus == "Open" ) {
		PrintDoorStatus("Door Open sucessfully!");
		return ;
	}
	
	if ( command == "Close" && motorStatus == "Close" ) {
		PrintDoorStatus("Door Closed sucessfully!");
		return ;
	}	
	
	
	PrintDoorStatus("Some Errors occurs while trying to " + command + " the Door. current status is: " + motorStatus);
}


// open socket server and wait to commands.
var server = net.createServer(function(socket) {
	socket.setKeepAlive(true,60000);
	socket.on('data', function(data) {
		var tempcom = false;
		if ( inOperation == 1 ) {
			socket.write("Error, already working");
		}
		else if ( data == "Open" || data == "Close") {
			// motor is in use don't allow others to do operation!
			inOperation = 1;
			doorCom(data);
			var motorStatus = MotorStatus();
			doorref.child('doorstatus').set(motorStatus);
			sleep.usleep(half_time_Of_Sleep_Between_Steps) ;
			doorref.child('doorneedtobe').set(motorStatus);
			inOperation = 0;
			socket.write("Door " + motorStatus);
		}
		else {
			socket.write("Error, bad command");
		}

	});
});

server.listen(6001, '127.0.0.1');