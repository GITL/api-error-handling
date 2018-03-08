const axios = require('axios');
const backoff = require('backoff');
const requestModule = require('./requestModule.js');

// const that = this;
const fibonacciBackoff = backoff.fibonacci({
    randomisationFactor: 0,
    initialDelay: 1000,
    maxDelay: 20000
});
var counter = 0;

var dorequest = (req, res) => {
  console.log('in dorequest');
  let id = req.params.id;
  let options = {
    url: 'vehicles/test',
    baseURL: 'http://127.0.0.1:3001/',
    data: {"id": id, "responseType": "JSON"},
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    timeout: 3000,
  };

  requestModule.testRequest(options, (data) => {
    // if( counter >= 3){
    //   data = {"service": "getVehicleInfo", "status": "200", "data": { "vin": { "type": "String", "value": "123123412412" }, "color": { "type": "String", "value": "Metallic Silver" }, "fourDoorSedan": { "type": "Boolean", "value": "True" }, "twoDoorCoupe": { "type": "Boolean", "value": "False" }, "driveTrain": { "type": "String", "value": "v8" } } }
    // }
    try {
      result = {
        "vin": data.data.vin.value,
        "color": data.data.color.value,
        "doorCount": data.data.fourDoorSedan.value ? 4 : 2,
        "driveTrain": data.data.driveTrain.value
      },
      // console.log(result);
      res.statusCode = 200;
      res.send(result);

    } catch (error) {
      console.log('error in parsing response json', res.statusCode );
      res.statusCode = 400;
      res.send();
      // console.log('h');
      // return fibonacciBackoff.backoff();
    }
    // res.statusCode = 200;
    // res.send(result);

  });
}

let dofibo = (req, res) => {
// let dofibo = () => {
  console.log('starting fibonacci backoff');
  fibonacciBackoff.failAfter(1);

  fibonacciBackoff.on('backoff', function(number, delay) {
      console.log(number + ' ' + delay + 'ms');
  });

  fibonacciBackoff.on('ready', function(number, delay) {
    counter++;
    dorequest(req, res);

    // fibonacciBackoff.backoff();
  });

  fibonacciBackoff.on('fail', function() {
      console.log('fail');
      // return res.end();
  });

  fibonacciBackoff.backoff();
}

// dofibo = dofibo.bind(that);
// dorequest = dorequest.bind(that);

// dofibo();

module.exports.dofibo = dofibo;