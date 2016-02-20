var database = require('../config/database'); 
var Firebase = require("firebase");
var firebaseRef = new Firebase(database.url);

module.exports = function (app) {
    app.get('/api/order', function(req, res) {
        // get orders from firebase  
    });
    
    app.delete('/api/order/:order_id', function (req, res) {
        console.log(req.params.order_id);
    });
    
    app.get('*', function (req, res) {
        res.sendfile('./public/index.html');
    });
}

