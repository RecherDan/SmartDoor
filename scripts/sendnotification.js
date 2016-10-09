var FCM = require('fcm-push');
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
var rootref = database.ref().child('users');
//var doorref = rootref.child(doorconfig.doorname);

var serverKey = 'https://smartdoor-2f29b.firebaseio.com';
//var fcm = new FCM(serverKey);


var query = Firebase.database().ref("users").orderByKey();
query.once("value")
.then(function(snapshot) {
snapshot.forEach(function(childSnapshot) {
  // key will be "ada" the first time and "alan" the second time
  var key = childSnapshot.key;
  // childData will be the actual contents of the child
  var childData = childSnapshot.val();
  console.log(key);
  console.log(childSnapshot.child("token").val());
});
});