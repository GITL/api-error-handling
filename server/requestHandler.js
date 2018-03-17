const request = require('requestretry');
const config = require('./config');

const delay = config.delay; // start retrying after 200 ms of first try
const TWO = 2; // raised to n'th power for exponential backoffTime timing


// TODO *******************************************************
// ************************************************************
// common elements of the 5 sets of retry strategy and request
// handlers below can be refactored
// ************************************************************
// ************************************************************

/**
 * @param  {Null | Object} err
 * @param  {Object} response
 * @param  {Object} body
 * @return {Number} number of milliseconds to wait before trying again the request
 */
function exponentialBackOff(err, response, body){
  // err.attempts = number of tries attempting/attempted

  var attemptsNumber = 1; // used in case err.attempts is undefined
  var message = '';
  var backoffTime = config.initialBackoffTime; // in ms, just initial value, will be overwritten

  try {
    if (err.attempts) {
      attemptsNumber = err.attempts;
    }
    // EXPONENTIAL BACKOFF
    backoffTime = delay * Math.pow(TWO, attemptsNumber - 1);

    // adding "JITTER" of += 15% of backoffTime
    backoffTime += Math.floor(Math.random() * backoffTime * config.jitterRange - backoffTime * config.jitterHalfRange );

    // TODO *******************************************************
    // can refactor the computation out of this function
    // ************************************************************

    message = 'exponential backing off ' + backoffTime + ' ms';

  } catch(e) {

    // backoffTime was not computed, use random backoff time

    attemptsNumber = Math.floor(Math.random() * config.maxAttemptNumberForRandomBackoff + 1);
    backoffTime = delay * Math.pow(TWO, attemptsNumber - 1);
    // TODO *******************************************************
    // can refactor the computation out of this function
    // ************************************************************
    message = 'random backoffTime ' +  backoffTime +  ' ms';
  }
  console.log(message);
  return backoffTime;
}


function retryStrategy_vehicleInfo(err, response, body){
  // retry the request if we had an error or if the response was a 'Bad Gateway'
  if (err) {
    // console.log('error occurred, error 22 ', "error ");
  }

  // retry if GM's response is not valid JSON
  if (typeof body !== "object") {
    // console.log('body is undefined!');
    return true;
  }

  try {
    if (typeof body === "object") {

      // test for parsing vehicle info from GM's response
      var data = {
        "vin": body.data.vin.value,
        "color": body.data.color.value,
        "doorCount": body.data.fourDoorSedan.value ? config.fourDoor : config.twoDoor,
        "driveTrain": body.data.driveTrain.value
      }
      // TODO *******************************************************
      // refactor this resonse obj construction out of here
      // ************************************************************
    }

  } catch(err) {
    if ( err instanceof TypeError ) {
      // error will be handled in getVehicleInfoService()
      // console.log('TypeError error', 'error', err.name, 'message', err.message, ' error 12');
    } else {
      console.log('parse error', err.name, err.message, ' error 14');
    }
    return true;
  }

  return err || response.statusCode > config.minRetryStatusCodeValue;
}

let vehicleInfoService = (req, res) => {
  // TODO *******************************************************
  // refactor option selection out of this function
  // ************************************************************
  request({
    url: 'http://gmapi.azurewebsites.net/getVehicleInfoService',
    // url: '127.0.0.1:3001/vehicles/test',
    json: true,
    method: 'POST',
    body: {"id": req.params.id, "responseType": "JSON"},
    headers: { "Content-Type": "application/json" },
    timeout: config.timeoutSmartcarRequest,
    // The below parameters are specific to request-retry
    maxAttempts: config.maxRetryForBackoff,
    delayStrategy: exponentialBackOff,
    retryStrategy: retryStrategy_vehicleInfo,
    fullResponse: true
  })
  .then(function (response) {
    var data = {};
    try {
      // test for parsing vehicle info from GM's response
      data = {
        "vin": response.body.data.vin.value,
        "color": response.body.data.color.value,
        "doorCount": response.body.data.fourDoorSedan.value ? config.fourDoor : config.twoDoor,
        "driveTrain": response.body.data.driveTrain.value
      }
      // TODO *******************************************************
      // even if valid JSON, need to check presence of all required properties
      // ************************************************************

    } catch(err) {
      // can save err.stack to log file

      // Smartcar response to clients
      data = {"status": "404", "error": err.name, "message": err.message, "code": "11"};

      // TODO *******************************************************
      // create [error] response class & constructor
      // "code" can be used for internal use
      // ************************************************************
    }
    res.send(data);
  })
  .catch(function(error) {
    try {
      res.send({"status": "404", "errno": error.errno, "message": error.message, "code": "2"});
      // TODO *******************************************************
      // create [error] response class & constructor
      // ************************************************************
    } catch(e) {
      console.error('no errno value')
    }
  })
}


function retryStrategy_security(err, response, body){
  if (typeof body !== "object") {
    return true;
  }
  if (err) {
    console.log('error occurred ', err);
  }
  try {
    if (typeof body === "object") {
      var data = [{
        "location": body.data.doors.values[0].location.value,
        "locked": body.data.doors.values[0].locked.value},
        {"location": body.data.doors.values[1].location.value,
        "locked": body.data.doors.values[1].locked.value
      }]
    }

  } catch(e) {
    if ( e instanceof TypeError ) {
      // console.log('TypeError error', e);
    } else {
      console.log('parse error', err.name, err.message, ' error 15');
    }
    return true;
  }
  // console.log('body=', body);
  return err || response.statusCode === 502 || response.statusCode > 299;
}

let securityStatusService = (req, res) => {
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
    delayStrategy: exponentialBackOff,
    retryStrategy: retryStrategy_security, // (default) retry on 5xx or network errors
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


function retryStrategy_energy(err, response, body){
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
  return err || response.statusCode > config.minRetryStatusCodeValue;
}


let energyService = (req, res) => {
  request({
    url: 'http://gmapi.azurewebsites.net/getEnergyService',
    json: true,
    method: 'POST',
    body: {"id": req.params.id, "responseType": "JSON"},
    headers: { "Content-Type": "application/json" },
    // The below parameters are specific to request-retry
    maxAttempts: config.maxRetryForBackoff,
    delayStrategy: exponentialBackOff,
    retryStrategy: retryStrategy_energy,
    fullResponse: true
  })
  .then(function (response) {
    var data = {};
    try {
      data = {
        "percent": response.body.data.tankLevel.value
      }
      // TODO *******************************************************
      // could also save battery data
      // ************************************************************
    } catch(e) {
      console.log(' error happened', e);
    }
    res.status = 200;
    res.send(data);

  })
  .catch(function(error) {
    console.log('in promises error=', error.code);
  })
}


function retryStrategy_battery(err, response, body){
  if (typeof body !== "object") {
    console.log('body is undefined!');
    return true;
  }
  if (err) {
    console.log('error occurred ', err);
  }
  try {
    if (typeof body === "object") {
      console.log('body.data', body.data);
      var data = {
        "percent": body.data.batteryLevel.value
      }
    }
  } catch(e) {
    if ( e instanceof TypeError ) {
      // console.log('TypeError error', e);
    } else {
      console.log('parse error', e);
    }
    return true;
  }
  // console.log('body=', body);
  return err || response.statusCode > config.minRetryStatusCodeValue;
}

let batteryEnergyService = (req, res) => {
  request({
    url: 'http://gmapi.azurewebsites.net/getEnergyService',
    json: true,
    method: 'POST',
    body: {"id": req.params.id, "responseType": "JSON"},
    headers: { "Content-Type": "application/json" },

    // The below parameters are specific to request-retry
    maxAttempts: config.maxRetryForBackoff,
    delayStrategy: exponentialBackOff,
    retryStrategy: retryStrategy_battery,
    fullResponse: true
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
    console.log('in promises error=', error.code);
  })
}


function retryStrategy_engine(err, response, body){
  if (typeof body !== "object") {
    console.log('body is undefined!');
    return true;
  }
  if (err) {
    console.log('error occurred ', err);
  }
  try {
    if (typeof body === "object") {
      console.log('body.actionResult.status', body.actionResult.status);
      var data = {
        "status": (body.actionResult.status === 'EXECUTED') ? 'success' : 'error1'
      }
      // console.log('status', data);
    }
  } catch(e) {
    if ( e instanceof TypeError ) {
      // console.log('TypeError error', e);
    } else {
      console.log('parse error', e);
    }
    return true;
  }
  // console.log('body=', body);
  return err || response.statusCode > config.minRetryStatusCodeValue;
}


let actionEngineService = (req, res) => {

  var command = req.body.action === 'START' ? 'START_VEHICLE' : 'STOP_VEHICLE';
  request({
    url: 'http://gmapi.azurewebsites.net/actionEngineService',
    json: true,
    method: 'POST',
    body: {"id": req.params.id, "command": command, "responseType": "JSON"},
    headers: { "Content-Type": "application/json" },

    // The below parameters are specific to request-retry
    maxAttempts: config.maxRetryForBackoff,
    retryStrategy: retryStrategy_engine,
    fullResponse: true
  })
  .then(function (response) {
    // console.log('response1', response.body);
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
// function getExponentialbackoffTime(attempts) {
//   return (Math.pow(2, attempts) * 100) + Math.floor(Math.random() * 50);
// }

// function constructExponentialbackoffTimeStrategy() {
//   let attempts = 0;
//   return () => {
//     attempts += 1;
//     return getExponentialbackoffTime(attempts);
//   };
// }

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

// async function myRetryStrategy2(err, response, body){
//   retry = await hasNoNetConnection();
// }

// function isValidResponse(body) {
//   // retry the request if we had an error or if the response was a 'Bad Gateway'
//   try {
//     // var result = JSON.parse(JSON.stringify(body));
//     var data = {
//       "vin": body.data.vin.value,
//       "color": body.data.color.value,
//       "doorCount": body.data.fourDoorSedan.value ? 4 : 2,
//       "driveTrain": body.data.driveTrain.value
//     }
//     console.log('data=', data);
//     console.log('status = ', response.statusCode);
//     return true;
//   } catch (error) {
//     console.log('return true');
//     return false;
//   }
// }


module.exports.vehicleInfoService = vehicleInfoService;
module.exports.securityStatusService = securityStatusService;
module.exports.energyService = energyService;
module.exports.batteryEnergyService = batteryEnergyService
module.exports.actionEngineService = actionEngineService
