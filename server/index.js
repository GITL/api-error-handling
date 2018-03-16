// set up express server
const express = require('express');
// const timeout = require('connect-timeout');
const app = express();

const util = require('./controllers/util.js');

// const GM = require('./requestModule.js');

// const fibo = require('./axios.js');

// use middleware to parse incoming data from post
const bodyparser = require('body-parser');
app.use(bodyparser.json());

// check for net connection, give a warning if no net connection
util.hasNetConnection().then(() => {

} ).catch(() => {

} )

// use router for endpoints
const router = require('./routes.js');

app.use(function(req, res, next){
  res.setTimeout(30000, function(){
    console.log('Request has timed out.');
      res.sendStatus(408);
    });

  next();
});

app.use('/vehicles', router);

app.use(express.static(__dirname + '../client/dist'));


app.set('port', 3000);
app.listen(app.get('port'));

console.log('Listening on port ', app.get('port'));
