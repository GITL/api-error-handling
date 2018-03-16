const request = require('request');
const url = 'http://gmapi.azurewebsites.net/getVehicleInfoService';
const postData = JSON.stringify( { 'id': '1235', 'responseType': 'JSON' } );

// request( {
//   headers: {'Content-Type': 'application/json'},
//   url: url,
//   body: postData,
//   method: 'POST',
//   // json: true
// }, function(error, response, body) {
//   console.log(body);
// });

// curl http://gmapi.azurewebsites.net/getVehicleInfoService -X POST -H 'Content-Type: application/json'  -d '{"id": "1234", "responseType": "JSON"}'

request( {
  url: 'https://timercheck.io/wework/60',
  // method: 'POST',
  // json: true
}, function(error, response, body) {
  console.log(body);
});

