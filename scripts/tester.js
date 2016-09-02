var net = require('net');
var device = process.argv[2];
var mode = process.argv[3];
var port = 6001;
if ( device == "Motor") port = 6001;
if ( device == "DoorStatus" ) port = 6002;
if ( device == "Alarm" ) port = 6003;
if ( device == "Smoke" ) port = 6004;


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