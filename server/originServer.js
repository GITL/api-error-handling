// set up express server
const express = require('express');
// const timeout = require('connect-timeout');
const app = express();

// const GM = require('./requestModule.js');

// use middleware to parse incoming data from post
const bodyparser = require('body-parser');
app.use(bodyparser.json());

// use router for endpoints
// const router = require('./routes.js');

app.use(function(req, res, next){
  res.setTimeout(60000, function(){
    console.log('Request has timed out.');
      res.sendStatus(408)
      // res.send(408);
    });

  next();
});

// app.use('/vehicles', router);

// app.use('/', router);

app.use(express.static(__dirname + '../client/dist'));

app.post('/vehicles/test', (req, res) => {
  console.log('in test server');
  // let result = JSON.stringify({"service": "getVehicleInfo", "status": "200", "data": { "vin": { "type": "String", "value": "123123412412" }, "color": { "type": "String", "value": "Metallic Silver" }, "fourDoorSedan": { "type": "Boolean", "value": "True" }, "twoDoorCoupe": { "type": "Boolean", "value": "False" }, "driveTrain": { "type": "String", "value": "v8" } } });

// let result = JSON.stringify({"service": "getVehicleInfo", "status": "200", "data": { "vin": { "type": "String", "value": "123123412412" }, "color": { "type": "String", "value": "Metallic Silver" }, "fourDoorSedan": { "type": "Boolean", "value": "True" }, "twoDoorCoupe": { "type": "Boolean", "value": "False" }, "driveTrain": { "type": "String", "value": "v8" } } });

let result = '{"service": "getVehicleInfo", "status": "500", "data": { "vin": { "type": "String", "value": "7777" }, "color": { "type": "String", "value": "Metallic Silver" }, "fourDoorSedan" : { "type": "Boolean", "value": "True" }, "twoDoorCoupe": { "type": "Boolean", "value": "False" }, "driveTrain": { "type": "String", "value": "v8" }}}';

  // let result = JSON.stringify({
  //     "service": "getVehicleInfo",
  //     "status": "200",
  //     "data": {
  //       "vin": {
  //         "type": "String",
  //         "value": "123123412412"
  //       },
  //       "color": {
  //         "type": "String",
  //         "value": "Metallic Silver"
  //       },
  //       "fourDoorSedan": {
  //         "type": "Boolean",
  //         "value": "True"
  //       },
  //       "twoDoorCoupe": {
  //         "type": "Boolean",
  //         "value": "False"
  //       },
  //       "driveTrain": {
  //         "type": "String",
  //         "value": "v8"
  //       }
  //     }
  //   })
  // var message = {"status": 200, "errorCode": "error code",  "message": "hi"};
  // res.statusCode = 404;
  res.status("200");
  // res.writeHead(201, {'Content-Type': 'application/json'});
  res.end(result);

  // res.status(500);
  // res.send(result);
  // res.status(500).send(result);
});
// add error handlers
// app.use(logErrors)
// app.use(clientErrorHandler)
// app.use(errorHandler)

// app.use(function (err, req, res, next) {
//   console.error(err.stack)
//   res.status(500).send('Something broke!')
// })
// app.use(timeout(5000));
// app.use(haltOnTimedout);

app.set('port', 3001);
app.listen(app.get('port'));
console.log('Listening on port ', app.get('port'));


// function haltOnTimedout(req, res, next){
//   if (!req.timedout) next();
// }

// app.get('/User', async function(req, res) {
//   let users;
//   try {
//     users = await db.collection('User').find().toArray();
//   } catch (error) {
//     res.status(500).json({ error: error.toString() });
//   }
//   res.json({ users });
// });
