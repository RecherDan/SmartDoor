/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */

/*
A  node.js application intended to control the opening and closeing of the door.useing astepermotor

MRAA - Low Level Skeleton Library for Communication on GNU/Linux platforms
Library in C/C++ to interface with Galileo & other Intel platforms, in a structured and sane API with port nanmes/numbering that match boards & with bindings to javascript & python.

Steps for installing MRAA & UPM Library on Intel IoT Platform with IoTDevKit Linux* image
Using a ssh client: 
1. echo "src maa-upm http://iotdk.intel.com/repos/1.1/intelgalactic" > /etc/opkg/intel-iotdk.conf
2. opkg update
3. opkg upgrade

Article: https://software.intel.com/en-us/html5/articles/intel-xdk-iot-edition-nodejs-templates
*/


var mraa = require('mraa'); //require mraa
console.log('MRAA Version: ' + mraa.getVersion()); //write the mraa version to the console
var sleep = require('sleep'); //require mraa
var colors = require('colors');// to show difrent colore line in console
var Cylon = require('cylon');
var doorStatus = "ok";

var stpeDigitalPin12 = new mraa.Gpio(12); //setup digital pin to make the spes in the stepper motor
var directionDigitalPin11=new mraa.Gpio(11); //setup digital pin to make dirction of the routition of the stepper motor 1(clockwise?) 0 (anti clockwise) 
stpeDigitalPin12.dir(mraa.DIR_OUT); //set the gpio direction to output
directionDigitalPin11.dir(mraa.DIR_OUT); //set the gpio direction to output
var analogPin0 = new mraa.Aio(0); //to indecat if the door isclose or not useing a potensiometer
var commendstr="unnoknown";


console.log("Opening and Closing Door Program By Ori 23.9.2015".trap.underline.blue); // to try the colors 


// geting the  command line arguments exemple in " http://stackoverflow.com/questions/4351521/how-to-pass-command-line-arguments-to-node-js "
//process.argv.forEach(function (val, index, array) {  
//        	if (index ==2 )  { commendstr =val}
//        }
//	);
//var command;
//if (commendstr=="open"){ command=true;} //command is aboolen if true the commend is to open the door and false is to close it
//    else { command=false;}

//varibals to set the range of motion and speed ==============================================================================
var ThrasholdConsiderdOpen= 100 // a reading form the analog pin 0 (in rang of 0 to 1023) blow it the door is considerd opne
var ThrasholdConsiderdClose= 900 // a reading form the analog pin 0 (in rang of 0 to 1023) above it the door is considerd close
var maxStepsToOpen = 7000; // how many maximum!!!!! steps to open or close the door the motore sould do
var dirToOpen =1;// set the dirction of side the motor will spin
var dirToClose =0;// the same ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
var chek = 0;
var half_time_Of_Sleep_Between_Steps=1200;// the time in micorSecends between the digitalwirte 1 and!! 0 to the step pin
//==============================================================================================================================




// starting the algorithm ==========================================================================================
//==================================================================================================================
function doorCom(command) {
	//checks the current position of the lock 
	var analogValue = analogPin0.read(); //read the value of the analog pin
	console.log("analog data from A0: %d".yellow ,analogValue);
	var isopen = true;
	if (analogValue < ThrasholdConsiderdOpen) { isopen = true;}//sets the curent position of the lock i
	else if(analogValue > ThrasholdConsiderdClose) { isopen = false;}
	else {isopen =!command;} // becos the current positon cloud be in btween the open and close values
	
	//cheking if we are trying to open unalrady open door or closeing aclose door
	var SopClo;
	if (command==isopen){ 
	    if (isopen) {  SopClo ="open"}//sets the string
	        else{  SopClo ="close"} 
	    console.log("the door is alredy %s".underline.yellow, SopClo);
	    doorStatus = "already";
	    return;
	}
	
	//set the directio we will rotet the motor 
	    if (command) {directionDigitalPin11.write(dirToOpen);}
	    else {directionDigitalPin11.write(dirToClose);}
	
	//doing the steps =============================================================================================
	//============================================================================================================= 
	
	///display:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	///:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
	
	require("child_process").exec('cyldispOri').unref();
	  for(var i = 0; i < maxStepsToOpen ;i++){
	     console.log("avctivating motor"); 
	     stpeDigitalPin12.write(1);
	     sleep.usleep(half_time_Of_Sleep_Between_Steps);
	     stpeDigitalPin12.write(0);
	     sleep.usleep(half_time_Of_Sleep_Between_Steps) ;
	     // dispaly current position
	     chek=analogPin0.read();
	     console.log("analog data from A0: %d",chek);
	     if  (command) {
	    	 if (chek<ThrasholdConsiderdOpen) break;
	     }
	     else {
	    	 if (chek>ThrasholdConsiderdClose) break;
	     }    
	  }
	
	//check to see if the motor succeed in opening or closeing the door
	
	if (chek<ThrasholdConsiderdOpen+5) {
		isopen = true;
		SopClo="open";
		doorStatus = "Open";
	}
	else if (chek>ThrasholdConsiderdClose){ 
		isopen = false;
		SopClo="close";
		doorStatus = "Close";
	}
	else {
			console.log("FAIL!!! door is still door  %s".underline.red, SopClo);
			///display:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
			doorStatus = "Fail";

			///:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
	}
	
	if (command==isopen){  
	    console.log("SUSCCESS!!! done door is  %s ".underline.green, SopClo);
			///display:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

			///:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		
	     // exiting the node js process
	}
	
			///display:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

}
		///:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

var net = require('net');

var server = net.createServer(function(socket) {
	socket.setKeepAlive(true,60000);
	socket.on('data', function(data) {
		var tempcom = false;
		if ( data == "open" || data == "close") {
			tempcom = (data == "open")? true : false;	
			doorCom(tempcom);
			socket.write("Door " + doorStatus);
		}
		else {
			socket.write("Error, bad command");
		}

	});
});

server.listen(1337, '127.0.0.1');