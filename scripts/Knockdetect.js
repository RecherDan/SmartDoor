var mraa = require('mraa'); //require mraa
var minutes = 0.000001, the_interval = minutes * 60 * 1000;
var analogPin1 = new mraa.Aio(3); //to indecat if the door isclose or not useing a potensiometer

var KnockCount = 0;
var lastKnock = 0;
var minThreshold = 100;
var MaxtimeBetweenKnocks = 3000;
var MintimeBetweenKnocks = 100;
setInterval(function() {
	var d = new Date();
	if ( (d.getTime() - lastKnock) >  MaxtimeBetweenKnocks ) {
		KnockCount = 0;
	}
	if ( ( analogPin1.read() > minThreshold ) && ((d.getTime() - lastKnock) >  MintimeBetweenKnocks )) {
		console.log("Took " + KnockCount);
		KnockCount=KnockCount+1;
	}
	if ( KnockCount > 3 ) {
		console.log("Took Took");
	}	
	lastKnock = d.getTime();
}, the_interval);