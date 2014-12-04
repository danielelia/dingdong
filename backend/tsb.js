/*
 *  TSB - Node.JS Backend for the Android and iOS app
 *  Version 0.0.1 - November 9, 2014
 */


// ARGS : node tsb.js <https>
// If https is supplied, the server will also listen on port 8443 
// for HTTPS connections
var runWithHttps = process.argv[2] == 'https';


var express   = require('express');
var connect   = require('connect');
var app       = express();
var schedule  = require('node-schedule');

var port      = process.env.PORT || 8080;
var httpsPort = 8443;
var db 		  = require('./modules/db/db.js');
var fs 		  = require('fs');
var http 	  = require('http');
var https 	  = require('https');

// SSL configuration

if (runWithHttps) {
	var privateKey = fs.readFileSync('etc/ssl/private/server.key', 'utf8');
	var certificate = fs.readFileSync('etc/ssl/private/server.crt', 'utf8');
	var credentials = {key: privateKey, cert: certificate};
}

// Configuration
app.use(express.static(__dirname + '/public'));
app.use(connect.logger('dev'));
app.use(connect.json());
app.use(connect.urlencoded());

// Routes
require('./routes.js')(app);
//app.listen(port);


// initialize TSB broadcast
var broadcast = require('./modules/broadcast/announce');
broadcast.initialize_annoucement();

// initialize Post-Order Campaign
var post_order_campaign = require('./modules/support/sendout');
post_order_campaign.initialize_post_order_campaign();


schedule.scheduleJob({minute: 13}, function(){
    post_order_campaign.do_post_order_sendout();
});



// Set up the servers
var httpServer = http.createServer(app);
httpServer.listen(port);

if (runWithHttps) {
	var httpsServer = https.createServer(credentials, app);
	httpsServer.listen(httpsPort);
}


console.log('TSB is running on port ' + port);
if (runWithHttps) {
	console.log('TSB is also running on port ' + httpsPort);
}
