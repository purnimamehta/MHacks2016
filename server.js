var express  = require('express');
var app      = express();                               // create our app w/ express
var morgan = require('morgan');                         // log requests to the console (express4)
var bodyParser = require('body-parser');                // pull information from HTML POST (express4)
var methodOverride = require('method-override');        // simulate DELETE and PUT (express4)
var twilio = require('twilio');
var client = new twilio.RestClient('AC8d97c5d87de31f92b2487444f0322533', '51c9234232cd01347f6ca2321242475b');
var router = express.Router();




// configuration =================

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

router.get('/api/sendSms/:phone_number/:name/:items', function(req, res, next) {
    console.log(req.params.phone_number.substring(1));
    console.log(req.params.name.substring(1));
    console.log(req.params.items.substring(1));
    client.sendSms({
        to: req.params.phone_number.substring(1),
        from: '+15005550006',
        body: req.params.name.substring(1)+', your order ' + req.params.items.substring(1) + ' is ready for pick up!'
    }, function (error, message) {
        if (error) {
            console.log(error);
            res.json(error).end();
        } else {
            console.log('Success! The SID for this SMS message is:');
            console.log(message.sid);
            console.log('Message sent on:');
            console.log(message.dateCreated);
            res.json(message).end();
        }
    });
});

app.use('', router);


// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");