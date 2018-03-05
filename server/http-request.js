const request = require('request');
const url = 'http://gmapi.azurewebsites.net/getVehicleInfoService';
const postData = JSON.stringify( { 'id': '1235', 'responseType': 'JSON' } );

request( {
  headers: {'Content-Type': 'application/json'},
  url: url,
  body: postData,
  json: true
}, function(error, response, body) {
  console.log(body);
});

