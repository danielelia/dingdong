/* 
 * TSB - Register.js
 */

var mongoose = require('mongoose');
var crypto = require('crypto');
var user = require('./models');


exports.register = function(uuid, login_token, callback) {
    var u = uuid;
    
    //TODO: Some checking of the UUID here
    
    
    //var token = crypto.createHash('sha512').update(uuid, 'ascii').digest('hex');
    //var hashed_auth_token = crypto.createHash('sha512').update(login_token, 'ascii').digest('hex');
    
    var token = uuid;
    var hashed_auth_token = login_token;

    var date = new Date();

    var new_user = new user({
	token : token, 
	uuid : uuid, 
	hashed_auth_token : hashed_auth_token,
	register_date : date
    });


    //check if user exists
    user.find({uuid:uuid}, function (err, users) {
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
