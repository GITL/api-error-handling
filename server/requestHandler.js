const request = require('requestretry');
const delay = 200; // start retrying after 200 ms of first try
const TWO = 2;

const logger = console;

process.on('uncaughtException', (err) => {
    logger.log('whoops! There was an uncaught error', err);
    // do a graceful shutdown,
    // close the database connection etc.
    process.exit(1);
});
/**
 * @param  {Null | Object} err
 * @param  {Object} response
 * @param  {Object} body
 * @return {Number} number of milliseconds to wait before trying again the request
 */
function expDelayStrategy(err, response, body){
  // set delay of retry to a random number between 300 and 2000 ms
  var multiple = 1;// = Math.floor(Math.random() * (2000 - 300 + 1) + 300);
  var message = '';
  var backoff = 1;

  try {
    if (err.attempts) {
      multiple = err.attempts;
    }
    backoff = delay * Math.pow(TWO, multiple - 1);
    backoff += Math.floor(Math.random() * backoff * 0.2 - backoff * 0.1)
    message = 'exponential backing off ' + backoff + ' ms';

  } catch(e) {
    // console.error('undefined error')
    multiple = Math.floor(Math.random() * 4 + 1);
    backoff = delay * Math.pow(TWO, multiple - 1);
    // console.log('backoff', backoff);
    message = 'random backoff ' +  backoff +  ' ms';
  }

  // const backoff = delay * Math.pow(TWO, multiple - 1);
  // console.log(multiple, 'backing off ', backoff, ' ms');
  console.log(message);
  return backoff;
}

function vehicleInfoRetryStrategy(err, response, body){
  // retry the request if we had an error or if the response was a 'Bad Gateway'
  if (err) {
    // console.log('error occurred, error 22 ', "error ");
  }
  if (typeof body !== "object") {
    // console.log('body is undefined!');
    return true;
  }
  if (body) {
    // console.log('body ', body.status);
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
      // console.log('stack', e.stack);
      // console.log('TypeError error', 'error', e.name, 'message', e.message, ' error 12');
      // handled by error 11 in getVehicleInfoService
    } else {
      console.log('parse error', e, ' error 14');
    }
    return true;
  }
  // console.log('body=', body);
  return err || response.statusCode > 299;
}

let getVehicleInfoService = (req, res) => {
  // console.log('here');
  request({
    url: 'http://gmapi.azurewebsites.net/getVehicleInfoService',
    // url: '127.0.0.1:3001/vehicles/test',
    json: true,                                 // must be present
    method: 'POST',                             // must be present
    body: {"id": req.params.id, "responseType": "JSON"},     // must be JSON with quotes
    headers: { "Content-Type": "application/json" }, // Must be JSON with quotes
    timeout: 10000,
    // The below parameters are specific to request-retry
    maxAttempts: 5,   // (default) try 5 times
    // retryDelay: 300,  // (default) wait for 5s before trying again
    delayStrategy: expDelayStrategy,
    retryStrategy: vehicleInfoRetryStrategy, // (default) retry on 5xx or network errors
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
    } catch(err) {
      // console.log(err.stack);
      // data = {"status": "404", "error name": e.name, "message": e.message, "error stack": e.stack};
      data = {"status": "404", "error": err.name, "message": err.message, "code": "11"};
      // if (e) {
      //   data = {"status": "404", "error name": e.name, "message": e.message, "error stack": e.stack};
      // } else {
      //   data = {"status": "404", "message": e.message, "code": "1",};
      // }
    }
    // res.status = 200;
    res.send(data);

  })
  .catch(function(error) {
    // console.log( 'error = Any occurred error', error);
    // res.status = 404;
    // console.log("errno", error.errno, "message", error.message, 'error name', error.name);
    try {
      res.send({"status": "404", "errno": error.errno, "message": error.message, "code": "2"});
    } catch(e) {
      console.error('no errno value')
    }
  })
}


function securityStatusRetryStrategy(err, response, body){
  // retry the request if we had an error or if the response was a 'Bad Gateway'
  if (typeof body !== "object") {
    // console.log('body is undefined!');
    return true;
  }
  if (body) {
    // console.log('body ', body.status);
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
    maxAttempts: 5,   // (default) try 5 times
    // retryDelay: 300,  // (default) wait for 5s before trying again
    delayStrategy: expDelayStrategy,
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
    // console.log('in promises error=', error.code, error.message); // error.code = ENOTFOUND
    // res.send({"status": "404", "error name": e.name, "message": error.message, "code": "3"});
    try {
      res.send({"status": "404", "errno": error.errno, "message": error.message, "code": "2"});
    } catch(e) {
      console.error('no errno value')
    }
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
    maxAttempts: 5,   // (default) try 5 times
    // retryDelay: 300,  // (default) wait for 5s before trying again
    delayStrategy: expDelayStrategy,
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
    maxAttempts: 5,   // (default) try 5 times
    // retryDelay: 300,  // (default) wait for 5s before trying again
    delayStrategy: expDelayStrategy,
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
