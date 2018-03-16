const request = require('request');
// const axios = require('axios');
const backoff = require('backoff');
// const requestModule = require('./requestModule.js');

// var url = 'curl http://gmapi.azurewebsites.net/getVehicleInfoService -X POST -H \'Content-Type: application/json\'  -d \'{"id": "1234", "responseType": "JSON"}\'';


// var call = backoff.call(request.get,
//   'http://gmapi.azurewebsites.net/getVehicleInfoService',
//   '-X POST -H Content-Type: application/json  -d {id: 1234, responseType: JSON}',
//   function(error, response, body) {
//     console.log(body);
// });

// call.retryIf(function(err) { return err.status >= 200; });
// call.setStrategy(new backoff.ExponentialStrategy());
// call.failAfter(4);
// call.start();


var call = backoff.call(request, '127.0.0.1:3001/vehicles/test', '-X POST', function(error, response, body) {
  // console.log(response.statusCode, body);
  console.log('body', body);
});

call.retryIf(function(err) { return err.status });
call.setStrategy(new backoff.ExponentialStrategy());
call.failAfter(4);
call.start();



// const request = require('request');
// const url = 'http://gmapi.azurewebsites.net/getVehicleInfoService';
// const postData = JSON.stringify( { 'id': '1235', 'responseType': 'JSON' } );

// request( {
//   headers: {'Content-Type': 'application/json'},
//   url: url,
//   body: postData,
//   method: 'POST',
//   // json: true
// }, function(error, response, body) {
//   console.log(body);
// });

// var call = backoff.call(get, 'https://timercheck.io/wework', function(err, res) {

//     console.log('Num retries: ' + call.getNumRetries());
//     if (err) {
//         console.log('Error: ' + err.message);
//     } else {
//         console.log('Status: ' + res.statusCode);
//     }
// }

// );
