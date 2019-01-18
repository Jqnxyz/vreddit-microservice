var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require("body-parser");
var routes = require("./routes/routes.js");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//static files
app.use('/static', express.static(path.join(__dirname + '/public')));

routes(app);

app.get('/', function (req, res) {
  res.send('Hello World')
})

var server = app.listen(80, function () {
    console.log("Server running on port.", server.address().port);
});