var minutes = 0.1, the_interval = minutes * 60 * 1000;
var SerialPort = require('serialport');
var receivedpong = 0;
var failcount = 0; 
var net = require('net'); // require net for open server.
var btrecived="";

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
		if ( data == "1")
			btrecived = "1";
		if ( data == "0") 
			btrecived = "0";
	});

setInterval(function() {
	if ( receivedpong == 0 ) failcount++;
	if ( failcount == 3 ) {
		console.log("3 times error doing recovery");
		var proc = require('child_process').spawn("/home/root/bt/startbt.sh");
	}
	port.write("2");
	receivedpong = 0;
}, the_interval);

var server = net.createServer(function(socket) {
	socket.setKeepAlive(true,60000);
	socket.on('data', function(data) {
		if ( data == "On" || data == "Cff") {
			btrecived = "";
			if ( data == "On")
				port.write("1");
			else
				port.write("0");
			while ( btrecived == "")
				;
			socket.write("Alarm is now " + (btrecived == "0" ) ? "Off" : "On");
		}
		else {
			socket.write("Error, bad command");
		}

	});
});

server.listen(6007, '127.0.0.1');