
module.exports = function (app) {
    app.get('/api/order', function(req, res) {
        // get orders from firebase
        console.log("get order");
        res.json(
{"menu": {
  "id": "file",
  "value": "File",
  "popup": {
    "menuitem": [
      {"value": "New", "onclick": "CreateNewDoc()"},
      {"value": "Open", "onclick": "OpenDoc()"},
      {"value": "Close", "onclick": "CloseDoc()"}
    ]
  }
}});
    });
    
    app.delete('/api/order/:order_id', function (req, res) {
        console.log(req.params.order_id);
    });
    
    app.get('*', function (req, res) {
        res.sendfile('./public/index.html');
    });
}

