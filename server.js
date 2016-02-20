var express  = require('express');
var app      = express();                               // create our app w/ express
var morgan = require('morgan');                         // log requests to the console (express4)
var bodyParser = require('body-parser');                // pull information from HTML POST (express4)
var methodOverride = require('method-override');        // simulate DELETE and PUT (express4)

var sendSms = function (phone_number, items, location) {
    var twilio = require('twilio');
    var client = new twilio.RestClient('AC8d97c5d87de31f92b2487444f0322533', '51c9234232cd01347f6ca2321242475b');

    client.sendSms({
        to: phone_number,
        from: '7342125122',
        body: 'Your order ' + items + ' is ready for pick up at ' + location + '!'
    }, function (error, message) {
        if (error) {
            console.log(error);
        } else {
            console.log('Success! The SID for this SMS message is:');
            console.log(message.sid);
            console.log('Message sent on:');
            console.log(message.dateCreated);
        }
    });
}

// configuration =================

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

require('./app/routes.js')(app);
// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");