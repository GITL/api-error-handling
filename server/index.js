// set up express server
const express = require('express');
const bodyParser = require('body-parser')

// const timeout = require('connect-timeout');
const app = express();

const utils = require('./util.js');

const config = require('./config');

// use middleware to parse incoming data from post
app.use(bodyParser.json());

// check for net connection, give a warning if no net connection
if ( config.checkNetConnectionUponStart ) { utils.checkNetConnection() };

// use router for endpoints
const router = require('./routes.js');

// set timeout for express
app.use(function(req, res, next){
  res.setTimeout(config.expressTimeOut, function(){
    console.log('Request has timed out.');
      res.sendStatus(408);
    });
  next();
});

app.use(config.vehiclesEndPoint, router);

app.use(express.static(__dirname + '../client/dist'));

app.set('port', config.port);
app.listen(app.get('port'));

console.log('Listening on port ', app.get('port'));
