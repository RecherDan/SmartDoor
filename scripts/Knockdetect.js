var mraa = require('mraa'); //require mraa
var minutes = 0.000001, the_interval = minutes * 60 * 1000;
var analogPin1 = new mraa.Aio(3); //to indecat if the door isclose or not useing a potensiometer
var childProcess = require('child_process'), child;
var KnockCount = 0;
var lastKnock = 0;
var minThreshold = 100;
var MaxtimeBetweenKnocks = 3000;
var MintimeBetweenKnocks = 500;
setInterval(function() {
	var d = new Date();
	if ( (d.getTime() - lastKnock) >  MaxtimeBetweenKnocks ) {
		KnockCount = 0;
	}
	if ( ( analogPin1.read() > minThreshold ) && ((d.getTime() - lastKnock) >  MintimeBetweenKnocks )) {
		console.log("Took " + KnockCount);
		KnockCount=KnockCount+1;
		lastKnock = d.getTime();
	}
	if ( KnockCount >= 3 ) {
		KnockCount = 0;
		console.log("Took Took Took");
		child = childProcess.exec('node scripts/sendnotification.js "Took took" "someonw knoked your door"', function (error, stdout, stderr) {
			   if (error) {
			     console.log(error.stack);
			     console.log('Error code: '+error.code);
			     console.log('Signal received: '+error.signal);
			   }
			   console.log('Child Process STDOUT: '+stdout);
			   console.log('Child Process STDERR: '+stderr);
			 });
	}	
}, the_interval);