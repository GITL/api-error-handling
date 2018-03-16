const request = require('request');
const axios = require('axios');
// wrap makeRequest with try catch



// let doAxiosRetry = (options, callback) => {
//   console.log('in doAxiosRetry');

//   axios.get('https://timercheck.io/wework' , function(err, res, body) {
//     console.log('axios retry', body);
//     // handle error
//       // call error handler with error code

//     callback(body);
//   });
// }



let makeRequest = (options, callback) => {
  request(options, function(err, res, body) {
      // console.log('returned from GM api request', body);
      // handle error
        // call error handler with error code

      callback(body);
  });
}

let makeRequestAxios = (config, callback) => {
  console.log("makeRequestAxios");
  // axios.post('http://127.0.0.1:3001/vehicles/test', data: {"id": id, "responseType": "JSON"}, headers: { 'Content-Type': 'application/json' });

  axios( config )
    .then(function (response) {
      callback(response.data);
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
        // console.log('Error 3', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error 4, invalid json', error.message);
      }
      console.log('Error 5, invalid json', error.toString());
    });
}

module.exports.makeRequestAxios = makeRequestAxios;
module.exports.makeRequest = makeRequest;
module.exports.testRequest = testRequest;
// module.exports.doAxiosRetry = doAxiosRetry


