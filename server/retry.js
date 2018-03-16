const request = require('requestretry');
// const url = require('url');


function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(window.location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

function myRetryStrategy(err, response, body){

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

    // The below parameters are specific to request-retry
    maxAttempts: 3,   // (default) try 5 times
    retryDelay: 300,  // (default) wait for 5s before trying again
    retryStrategy: myRetryStrategy, // (default) retry on 5xx or network errors
    // retryStrategy: request.RetryStrategies.HTTPOrNetworkError, // (default) retry on 5xx or network errors
    fullResponse: true // (default) To resolve the promise with the full response or just the body
  })
  .then(function (response) {
    var data = {};
    try {
      data = {
        "vin": response.body.data.vin.value,
        "color": response.body.data.color.value,
        "doorCount": response.body.data.fourDoorSedan.value ? 4 : 2,
        "driveTrain": response.body.data.driveTrain.value
      }
    } catch(e) {
      console.log(' error happened', e);
    }
    res.status = 200;
    res.send(data);

  })
  .catch(function(error) {
    // error = Any occurred error
    console.log('in promises error=', error.code);
  })
}


function securityStatusRetryStrategy(err, response, body){
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
      var data = [{
        "location": body.data.doors.values[0].location.value,
        "locked": body.data.doors.values[0].locked.value},
        {"location": body.data.doors.values[1].location.value,
        "locked": body.data.doors.values[1].locked.value
      }]
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

let getSecurityStatusService = (req, res) => {
  // console.log('here');
  request({
    url: 'http://gmapi.azurewebsites.net/getSecurityStatusService',
    json: true,                                 // must be present
    method: 'POST',                             // must be present
    body: {"id": req.params.id, "responseType": "JSON"},     // must be JSON with quotes
    headers: { "Content-Type": "application/json" }, // Must be JSON with quotes

    // The below parameters are specific to request-retry
    maxAttempts: 3,   // (default) try 5 times
    retryDelay: 300,  // (default) wait for 5s before trying again
    retryStrategy: securityStatusRetryStrategy, // (default) retry on 5xx or network errors
    // retryStrategy: request.RetryStrategies.HTTPOrNetworkError, // (default) retry on 5xx or network errors
    fullResponse: true // (default) To resolve the promise with the full response or just the body
  })
  .then(function (response) {
    var data = {};
    try {
      data = [{
        "location": response.body.data.doors.values[0].location.value,
        "locked": response.body.data.doors.values[0].locked.value},
        {"location": response.body.data.doors.values[1].location.value,
        "locked": response.body.data.doors.values[1].locked.value
      }]
    } catch(e) {
      console.log(' error happened', e);
    }
    res.status = 200;
    res.send(data);

  })
  .catch(function(error) {
    // error = Any occurred error
    console.log('in promises error=', error.code);
  })
}


function getEnergyRetryStrategy(err, response, body){
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
      console.log('body.data', body.data);
      var data = {
        "percent": body.data.tankLevel.value
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

let getEnergyService = (req, res) => {
  // console.log('here');
  request({
    url: 'http://gmapi.azurewebsites.net/getEnergyService',
    json: true,                                 // must be present
    method: 'POST',                             // must be present
    body: {"id": req.params.id, "responseType": "JSON"},     // must be JSON with quotes
    headers: { "Content-Type": "application/json" }, // Must be JSON with quotes

    // The below parameters are specific to request-retry
    maxAttempts: 3,   // (default) try 5 times
    retryDelay: 300,  // (default) wait for 5s before trying again
    retryStrategy: getEnergyRetryStrategy, // (default) retry on 5xx or network errors
    // retryStrategy: request.RetryStrategies.HTTPOrNetworkError, // (default) retry on 5xx or network errors
    fullResponse: true // (default) To resolve the promise with the full response or just the body
  })
  .then(function (response) {
    var data = {};
    try {
      data = {
        "percent": response.body.data.tankLevel.value
      }
    } catch(e) {
      console.log(' error happened', e);
    }
    res.status = 200;
    res.send(data);

  })
  .catch(function(error) {
    // error = Any occurred error
    console.log('in promises error=', error.code);
  })
}

function getBatteryRetryStrategy(err, response, body){
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
      console.log('body.data', body.data);
      var data = {
        "percent": body.data.batteryLevel.value
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

let getBatteryEnergyService = (req, res) => {
  // console.log('here');
  request({
    url: 'http://gmapi.azurewebsites.net/getEnergyService',
    json: true,                                 // must be present
    method: 'POST',                             // must be present
    body: {"id": req.params.id, "responseType": "JSON"},     // must be JSON with quotes
    headers: { "Content-Type": "application/json" }, // Must be JSON with quotes

    // The below parameters are specific to request-retry
    maxAttempts: 3,   // (default) try 5 times
    retryDelay: 300,  // (default) wait for 5s before trying again
    retryStrategy: getBatteryRetryStrategy, // (default) retry on 5xx or network errors
    // retryStrategy: request.RetryStrategies.HTTPOrNetworkError, // (default) retry on 5xx or network errors
    fullResponse: true // (default) To resolve the promise with the full response or just the body
  })
  .then(function (response) {
    var data = {};
    try {
      data = {
        "percent": response.body.data.batteryLevel.value
      }
    } catch(e) {
      console.log(' error happened', e);
    }
    res.status = 200;
    res.send(data);

  })
  .catch(function(error) {
    // error = Any occurred error
    console.log('in promises error=', error.code);
  })
}


function engineServiceRetryStrategy(err, response, body){
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
      console.log('body', body);
      var data = {
        "status": (body.actionResult.status === 'EXECUTED') ? 'success' : 'error'
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

let actionEngineService = (req, res) => {
  // var url_parts = url.parse(req.url, true);
  // var query = url_parts.query;

  let command = req.query["action"];
  console.log('command', command);

  request({
    url: 'http://gmapi.azurewebsites.net/actionEngineService',
    json: true,                                 // must be present
    method: 'POST',                             // must be present
    body: {"id": req.params.id, "command": "START_VEHICLE", "responseType": "JSON"},     // must be JSON with quotes
    headers: { "Content-Type": "application/json" }, // Must be JSON with quotes

    // The below parameters are specific to request-retry
    maxAttempts: 3,   // (default) try 5 times
    retryDelay: 300,  // (default) wait for 5s before trying again
    retryStrategy: engineServiceRetryStrategy, // (default) retry on 5xx or network errors
    // retryStrategy: request.RetryStrategies.HTTPOrNetworkError, // (default) retry on 5xx or network errors
    fullResponse: true // (default) To resolve the promise with the full response or just the body
  })
  .then(function (response) {
    var data = {};
    try {
      data = {
        "status": (response.body.actionResult.status === 'EXECUTED') ? 'success' : 'error'
      }
    } catch(e) {
      console.log(' error happened', e);
    }
    res.status = 200;
    res.send(data);

  })
  .catch(function(error) {
    // error = Any occurred error
    console.log('in promises error=', error.code);
  })
}


 // function yourExportedFunction() {
 //     const p = promiseThatMightRejectFn();
 //     p.catch(() => {}); // add an empty catch handler
 //     return p;
 // }


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
module.exports.getSecurityStatusService = getSecurityStatusService;
module.exports.getEnergyService = getEnergyService;
module.exports.getBatteryEnergyService = getBatteryEnergyService
module.exports.actionEngineService = actionEngineService
