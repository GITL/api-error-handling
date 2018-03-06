const request = require('request');
const axios = require('axios');
// wrap makeRequest with try catch

let makeRequest = (options, callback) => {
  request(options, function(err, res, body) {
      // console.log('returned from GM api request', body);
      // handle error
        // call error handler with error code

      callback(body);
  });
}

let makeRequestAxios = (options, callback) => {
  axios( options )
    .then(function (response) {
      callback(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}


// let getVehicleInfoService = (id, callback) => {
//   // console.log('making GM api call');
//   let options = {
//     url: 'http://gmapi.azurewebsites.net/getVehicleInfoService',
//     body: JSON.stringify({"id": id, "responseType": "JSON"}),
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   };
//   request.post(options, function(err, res, body) {
//       console.log('returned from GM api request', body);
//       callback(body);
//   });
// };


// let actionEngineService = (id, command, callback) => {
//   console.log('making GM actionEngineService call');
//   let options = {
//     url: 'http://gmapi.azurewebsites.net/actionEngineService',
//     method: 'POST',
//     body: JSON.stringify({
//       "id": id,
//       "command": command + '_VEHICLE',
//       "responseType": "JSON"
//     }),
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   };
//   request(options, function(err, res, body) {
//       console.log('returned from GM actionEngineService request', body);
//       callback(body);
//   });
// };
module.exports.makeRequestAxios = makeRequestAxios;
module.exports.makeRequest = makeRequest;
// module.exports.getVehicleInfoService = getVehicleInfoService;
// module.exports.actionEngineService = actionEngineService;
