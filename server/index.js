// set up express server
const express = require('express');
const app = express();

const GM = require('./request-handler.js');

// use router for endpoints
const router = require('./routes.js');

// use middleware to parse incoming data from post
const bodyparser = require('body-parser');
app.use(bodyparser.json());

// app.use('/vehicles', router);
app.use(express.static(__dirname + '../client/dist'));


app.get('/vehicles', function (req, res) {

  console.log('got GET request from ', req.url);

  GM.gmAPI(1234, (data) => {
    res.statusCode = 200;
    res.send(data);
  });
});


app.set('port', 3000);
app.listen(app.get('port'));
console.log('Listening on port ', app.get('port'));

