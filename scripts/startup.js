var sys = require('sys')
var exec = require('child_process').exec;
var child;
// executes `remainder`


function delay() {
	setTimeout(function(){
		child = exec("/home/root/scripts/startup.sh");
	} , 60000);
}


      delay();  


 
