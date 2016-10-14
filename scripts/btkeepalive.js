var minutes = 0.1, the_interval = minutes * 60 * 1000;
var SerialPort = require('serialport');
var receivedpong = 0;
var failcount = 0; 
var net = require('net'); // require net for open server.
fs = require('fs');
var btdata="";
var btwait=false;
var btwaitfailcount=0;
var socketwrite = "";

function waitnsec(nsec) {
	var stop = new Date().getTime();
	while(new Date().getTime() < stop + nsec*1000) {
		;
	}
}


var port = new SerialPort('/dev/rfcomm0');
	port.on('open', function() {
			console.log("connected");
	});
	 
	// open errors will be emitted as an error event 
	port.on('error', function(err) {
	  var proc = require('child_process').exec("bash -x /home/root/bt/startbt.sh");
	  console.log('Error: ', err.message);
	})	
	port.on('data', function(data) {
		//console.log('bt recived:' + data);
		if ( data == "3" ) {
			receivedpong = 1;
			failcount = 0;
		}
		if ( data == "1" || data =="0") {
			if (btwait && (data == btdata)) {
				btwaitfailcount = 0;
				btwait=false;
				console.log("received Alarm status btwait=false and data is: " + data);
				socketwrite.write((data == "0" ) ? "Off" : "On");
			}
		}

	});

setInterval(function() {
	if ( receivedpong == 0 ) failcount++;
	if ( btwait ) {
		btwaitfailcount++;
		port.write(btdata);
		console.log("fail to receive alram status send again");
	}
	if ( failcount >= 3 || btwaitfailcount >= 3 ) {
		console.log("3 times error doing recovery");
		var proc = require('child_process').exec("bash -x /home/root/bt/startbt.sh");
		proc.stdout.on('data', (data) => {
			  console.log(`stdout: ${data}`);
		});
		proc.stdout.on('error', (data) => {
			  console.log(`stdout err: ${data}`);
		});
		failcount = -1000;
		btwaitfailcount = -1000;
	}
	if ( receivedpong == 1 ) {
		port.write("2");
		receivedpong = 0;
	}
}, the_interval);

var server = net.createServer(function(socket) {
	socket.setKeepAlive(true,60000);
	socket.on('data', function(data) {
		if ( data == "On" || data == "Off") {
			btdata = (data == "On" ) ? "1" : "0";
			btwait = true;
			if ( data == "On")
				port.write("1");
			else
				port.write("0");
			socketwrite = socket;
			//socketwrite.write("Alarm is now " + (btrecived == "0" ) ? "Off" : "On");
		}
		else {
			socket.write("Error, bad command");
		}

	});
});

server.listen(6007, '127.0.0.1');