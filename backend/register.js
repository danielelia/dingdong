/* 
 * TSB - Register.js
 */

var mongoose = require('mongoose');
var crypto = require('crypto');
var user = require('./models');


exports.register = function(device_uuid, passphrase, signup_token, callback) {
    var u = device_uuid;
    var p = passphrase;
    var st = signup_token;

    console.log("u:", u, "p:", p, "st:", st);

    // check that the signup_token is correct
    if (st != "TSBSignupToken2014") {
	console.log("TSBToken incorrect, token was:", signup_token);
    } 
	
    // do crypto to hash passphrase and generate auth_token
    
    var hash = 'sha1' //apparently required by PBKDF2
    var iter = 1000 //num iterations of Hash function

    try {
	var s = crypto.randomBytes(10).toString('hex');
    } catch (ex) {
	// problem generating the salt, should handle this
	console.log("problem generating salt in register()");
    }
    
    try {
	var hp = crypto.pbkdf2Sync(p, s, iter, 64).toString('hex'); 
    } catch (ex) {
	console.log("problem generating hash in register()");
	// problem generating hash, probably should handle this
    }
    
    // generate an initial session token 
    var t = crypto.randomBytes(128).toString('hex');
    
    var d = new Date();
    var new_user = new user({
	uuid : u, 
	hashed_passphrase : hp,
	session_token : t, 
	salt : s,
	register_date : d,
    });

    
    //check if user exists
    user.find({uuid:u}, function (err, users) {
	var len = users.length;
	if(len == 0) {
	    //user doesn't exist yet
	    new_user.save(function (err) {
		callback({'response':"Successfully Registered"});
	    });
	} else {
	    callback({'response':'Device already registered'});
	}
    });

}
