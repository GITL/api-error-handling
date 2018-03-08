const axios = require('axios');
const backoff = require('backoff');
const requestModule = require('./requestModule.js');

const fibonacciBackoff = backoff.fibonacci({
    randomisationFactor: 0,
    initialDelay: 1000,
    maxDelay: 20000
});

var counter = 0;

let dofibo = (req, res) => {
  counter = 0;
  fibonacciBackoff.failAfter(3);

  fibonacciBackoff.on('backoff', function(number, delay) {
      console.log(number + ' ' + delay + 'ms');
  });

  fibonacciBackoff.on('ready', function(number, delay) {

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
      try {
        result = {
          "vin": data.data.vin.value,
          "color": data.data.color.value,
          "doorCount": data.data.fourDoorSedan.value ? 4 : 2,
          "driveTrain": data.data.driveTrain.value
        }
      } catch (error) {
        // console.log('error in parsing response json', res.statusCode );
        // res.statusCode = 400;
        // res.end();
        // console.log('h');
        // return fibonacciBackoff.backoff();
      }
      res.statusCode = 200;
      res.send(result);
    });

  });

  fibonacciBackoff.on('fail', function() {
      console.log('fail');
      return res.end();
  });

  fibonacciBackoff.backoff();
}

// dofibo(req, res);

module.exports.dofibo = dofibo;