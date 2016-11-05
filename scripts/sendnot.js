var FCM = require('fcm-node');
var Firebase = require("firebase");
var doorconfig = require('./config'); // door configuration

var sendnot = {};

var config = {
	    apiKey: "AIzaSyCRpzldmrnwtOf7M_TBBNGFofyswZ2IifQ",
	    authDomain: "smartdoor-2f29b.firebaseapp.com",
	    databaseURL: "https://smartdoor-2f29b.firebaseio.com",
	    storageBucket: "",
	    messagingSenderId: "693048105512"
	  };
Firebase.initializeApp(config, "Sendnot");

var database = Firebase.database();
var rootref = database.ref().child('users');
//var doorref = rootref.child(doorconfig.doorname);

var serverKey = 'AIzaSyCRpzldmrnwtOf7M_TBBNGFofyswZ2IifQ';
var fcm = new FCM(serverKey);



var query = Firebase2.database().ref("users").orderByKey();

sendnot.send = function(Title, Msg) {
	query.once("value", function(snapshot) {
	snapshot.forEach(function(childSnapshot) {
	  // key will be "ada" the first time and "alan" the second time
	  var key = childSnapshot.key;
	  // childData will be the actual contents of the child
	  var childData = childSnapshot.val();
	  if ( doorconfig.doorname == childSnapshot.child("door").val()) {
		  console.log(key);
		  console.log(childSnapshot.child("toekn").val());
		  console.log(childSnapshot.child("door").val());  
		  
		  var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
				    to: childSnapshot.child("toekn").val(), 
				    
				    notification: {
				        title: Title, 
				        body: Msg 
				    }
				};
	
				fcm.send(message, function(err, response){
				    if (err) {
				        console.log("Something has gone wrong!");
				        return;
				    } else {
				        console.log("Successfully sent with response: ", response);
				        return;
				    }
				});
	  }
	return;
	});
	return;
	});
}
module.exports = sendnot;