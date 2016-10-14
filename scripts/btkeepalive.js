var minutes = 0.01, the_interval = minutes * 60 * 1000;
var SerialPort = require('serialport');
var receivedpong = 0;
var failcount = 0; 

var port = new SerialPort('/dev/rfcomm0');
	port.on('open', function() {
			console.log("connected");
	});
	 
	// open errors will be emitted as an error event 
	port.on('error', function(err) {
	  console.log('Error: ', err.message);
	})	
	port.on('data', function(data) {
		console.log('bt recived:' + data);
		if ( data == "3" ) {
			receivedpong = 1;
			failcount = 0;
		}
	});

setInterval(function() {
	if ( receivedpong == 0 ) failcount++;
	if ( failcount == 3 ) {
		console.log("3 times error");
	}
	port.write("2");
	receivedpong = 0;
}, the_interval);