const request = require('requestretry');
// var GO = false;

function myRetryStrategy(err, response, body){
  // console.log('in promises body=', body);
  // console.log('in promises reponse.body=', response.body);
  // console.log('in promises reponse.body.status=', response.body.status);
  // console.log('in promises reponse.status=', response.status);

  // retry the request if we had an error or if the response was a 'Bad Gateway'
  if (typeof body !== "object") {
    console.log('body is undefined!');
    return true;
  }
  if (body) {
    console.log('body ', body.status);
  }
  if (err) {
    console.log('error occurred ', err);
  }
  try {
    // throw new Error('Whoops!');
    if (typeof body === "object") {
      // console.log('here', typeof body);
      var data = {
        "vin": body.data.vin.value,
        "color": body.data.color.value,
        "doorCount": body.data.fourDoorSedan.value ? 4 : 2,
        "driveTrain": body.data.driveTrain.value
      }
    }

    // do data check
  } catch(e) {
  // } catch(err) {
    if ( e instanceof TypeError ) {
      console.log('TypeError error', e);
    } else {
      console.log('parse error', e);
    }
    return true;
  }
  // console.log('body=', body);
  return err || response.statusCode === 502 || response.statusCode > 299;
}

let getVehicleInfoService = (req, res) => {
  // console.log('here');
  request({
    url: 'http://gmapi.azurewebsites.net/getVehicleInfoService',
    json: true,                                 // must be present
    method: 'POST',                             // must be present
    body: {"id": req.params.id, "responseType": "JSON"},     // must be JSON with quotes
    headers: { "Content-Type": "application/json" }, // Must be JSON with quotes

    // url: 'http://127.0.0.1:3001/vehicles/test',
    // // url: 'http://8.8.8.8:8080/',
    // json: true,
    // method: "POST",
    // body: {"id": "1235", "responseType": "JSON"},
    // headers: { "Content-Type": "application/json" },

    // The below parameters are specific to request-retry
    maxAttempts: 3,   // (default) try 5 times
    retryDelay: 300,  // (default) wait for 5s before trying again
    retryStrategy: myRetryStrategy, // (default) retry on 5xx or network errors
    // retryStrategy: request.RetryStrategies.HTTPOrNetworkError, // (default) retry on 5xx or network errors
    fullResponse: true // (default) To resolve the promise with the full response or just the body
  })
  .then(function (response) {
    // response = The full response object or just the body
    // console.log('in promises reponse.body', response.body);
    console.log('in promises reponse.body.status', response.body.status); // correct
    // console.log('in promises reponse', response.statusCode); // may not be correct
    res.statusCode = 200;
    res.send(response.body);

  })
  .catch(function(error) {
    // error = Any occurred error
    console.log('in promises error', error.code);
  })
}


// no server or server refused connection(wrong port)
// { Error: connect ECONNREFUSED 127.0.0.1:3001
//     at Object._errnoException (util.js:1031:13)
//     at _exceptionWithHostPort (util.js:1052:20)
//     at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1195:14)
//   errno: 'ECONNREFUSED',
//   code: 'ECONNREFUSED',
//   syscall: 'connect',
//   address: '127.0.0.1',
//   port: 3001,
//   attempts: 3 }

// check timeout
// err  { Error: connect ETIMEDOUT 8.8.8.8:8080
//     at Object._errnoException (util.js:1031:13)
//     at _exceptionWithHostPort (util.js:1052:20)
//     at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1195:14)
//   errno: 'ETIMEDOUT',
//   code: 'ETIMEDOUT',
//   syscall: 'connect',
//   address: '8.8.8.8',
//   port: 8080,
//   attempts: 1 }

// server not found
// { Error: getaddrinfo ENOTFOUND gmapi.azurewebsites.ne gmapi.azurewebsites.ne:80
//     at errnoException (dns.js:55:10)
//     at GetAddrInfoReqWrap.onlookup [as oncomplete] (dns.js:97:26)
//   code: 'ENOTFOUND',
//   errno: 'ENOTFOUND',
//   syscall: 'getaddrinfo',
//   hostname: 'gmapi.azurewebsites.ne',
//   host: 'gmapi.azurewebsites.ne',
//   port: 80,
//   attempts: 3 }


 // function yourExportedFunction() {
 //     const p = promiseThatMightRejectFn();
 //     p.catch(() => {}); // add an empty catch handler
 //     return p;
 // }

// request({
//   // GM API *****************************************
//   url: 'http://gmapi.azurewebsites.net/getVehicleInfoService',
//   json: true,
//   method: 'POST',
//   body: {"id": "1236", "responseType": "JSON"},
//   headers: { "Content-Type": "application/json" },

//   // // INTERNET CONNECTION TEST **********************
//   // url: 'http://8.8.8.8',
//   // // json: true,
//   // method: 'GET',

//   // // TEST SERVER*************************************
//   // url: 'http://127.0.0.1:3002/vehicles/test',
//   // json: true,
//   // method: 'POST',
//   // body: {"id": "1235", "responseType": "JSON"},
//   // headers: { "Content-Type": "application/json" },

//   // The below parameters are specific to request-retry
//   maxAttempts: 3,   // (default) try 5 times
//   retryDelay: 5000,  // (default) wait for 5s before trying again
//   // retryStrategy: request.RetryStrategies.HTTPOrNetworkError,
//   retryStrategy: myRetryStrategy, // (default) retry on 5xx or network errors
//   // delayStrategy: constructExponentialBackoffStrategy()
// }, function(err, response, body){
//   // this callback will only be called when the request succeeded or after maxAttempts or on error
//   if (response) {
//     console.log('The number of request attempts: ' + response.attempts);
//   }
//   if (body) {
//     console.log('body is', body);
//   }
//   if (err) {
//     console.log('error is ', err);
//   }
// });

/**
 * @param   {Number} attempts The number of times that the request has been attempted.
 * @return  {Number} number of milliseconds to wait before retrying again the request.
 */
function getExponentialBackoff(attempts) {
  return (Math.pow(2, attempts) * 100) + Math.floor(Math.random() * 50);
}

function constructExponentialBackoffStrategy() {
  let attempts = 0;
  return () => {
    attempts += 1;
    return getExponentialBackoff(attempts);
  };
}


// async function myRetryStrategy(err, response, body){
//   console.log('start');
//   // await hasNoNetConnection();
//   // JSON.parse(body);
//   console.log('err', err);
//   console.log('end');
//   // retry the request if we had an error or if the response was a 'Bad Gateway'
//   // return err || response.statusCode === 502;
//   return true;
// }

async function myRetryStrategy2(err, response, body){
  retry = await hasNoNetConnection();
}

function hasNoNetConnection() {
  return new Promise((resolve, reject) => {
    var result;
    var exec = require('child_process').exec, child;

    child = exec('ping -c 1 8.8.8.8', function(error, stdout, stderr) {
      if(error !== null) {
        console.log("no net connection");
        result = true
        reject(error);
      } else {
        console.log("has net connection");
        result = false;
        resolve(result);
      }
    });
  });
}







function isValidResponse(body) {
  // retry the request if we had an error or if the response was a 'Bad Gateway'
  try {
    // var result = JSON.parse(JSON.stringify(body));
    var data = {
      "vin": body.data.vin.value,
      "color": body.data.color.value,
      "doorCount": body.data.fourDoorSedan.value ? 4 : 2,
      "driveTrain": body.data.driveTrain.value
    }
    console.log('data=', data);
    console.log('status = ', response.statusCode);
    return true;
  } catch (error) {
    console.log('return true');
    return false;
  }
}


// function checkInternet(cb) {
//     require('dns').lookup('google.com',function(err) {
//         if (err && err.code == "ENOTFOUND") {
//             cb(false);
//         } else {
//             cb(true);
//         }
//     })
// }


// var url = 'curl http://gmapi.azurewebsites.net/getVehicleInfoService -X POST -H \'Content-Type: application/json\'  -d \'{"id": "1234", "responseType": "JSON"}\'';

// var request = require('requestretry').defaults({ json: true, retryStrategy: myRetryStrategy });

module.exports.getVehicleInfoService = getVehicleInfoService;
