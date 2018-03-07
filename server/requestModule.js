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

let makeRequestAxios = (config, callback) => {
  console.log("there");
  axios( config )
    .then(function (response) {
      // console.log('Error0 ', response.data);
      // callback(response.data);
    })
    .catch(function (error) {
      // console.log('Error1 ', error.toString());
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log('Error2', error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log('Error3', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error4', error.message);
      }
      console.log('Error5', error.toString());
    });
}

let testRequest = (config, callback) => {
  // console.log('there 2');
  axios( config )
    .then(function (response) {
      // var data = JSON.parse(response.data);
      // console.log('there 3', response.data);
      callback(response.data);
    })
    .catch(function (error) {
      console.log('there 4', error.toString());
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log('Error 2', error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log('Error 3', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error 4, invalid json', error.message);
      }
      console.log('Error 5, invalid json', error.toString());
    });
}

// axios.get('/user/12345')
//   .then(function(response) {
//     console.log(response.data);
//     console.log(response.status);
//     console.log(response.statusText);
//     console.log(response.headers);
//     console.log(response.config);
//   });

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
module.exports.testRequest = testRequest;
// module.exports.getVehicleInfoService = getVehicleInfoService;
// module.exports.actionEngineService = actionEngineService;
