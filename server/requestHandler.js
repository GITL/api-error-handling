const request = require('requestretry');
const config = require('./config');
const delay = config.delay; // start retrying after 200 ms of first try
const TWO = 2; // raised to n'th power for exponential backoffTime timing

var attempts = 0;
exponentialBackOff = exponentialBackOff.bind(this);
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
  attempts++;

  // var attemptsNumber = 1; // used in case err.attempts is undefined
  var message = '';
  var backoffTime = config.initialBackoffTime; // in ms, just initial value, will be overwritten

  try {
    // if (err.attempts) {
    //   attemptsNumber = err.attempts;
    // }
    // EXPONENTIAL BACKOFF
    backoffTime = delay * Math.pow(TWO, attempts - 1);

    // adding "JITTER" of += 15% of backoffTime
    backoffTime += Math.floor(Math.random() * backoffTime * config.jitterRange - backoffTime * config.jitterHalfRange );

    // TODO *******************************************************
    // can refactor the computation out of this function
    // ************************************************************

    message = 'exponential backing off ' + backoffTime + ' ms';

  } catch(e) {

    // backoffTime was not computed, use random backoff time

    attempts = Math.floor(Math.random() * config.maxAttemptNumberForRandomBackoff + 1);
    backoffTime = delay * Math.pow(TWO, attempts - 1);
    // TODO *******************************************************
    // can refactor the computation out of this function
    // ************************************************************
    message = 'random backoffTime ' +  backoffTime +  ' ms';
  }
  console.log(message);
  return backoffTime;
}


function retryInfo(err, response, body){
  // retry the request if we had an error or if the response was a 'Bad Gateway'
  if (err) {
    // console.log('error occurred, error 22 ', "error ");
  }

  // retry if origin server response is not valid JSON
  if (typeof body !== "object") {
    // console.log('body is undefined!');
    return true;
  }

  try {
    if (typeof body === "object") {

      // test for parsing vehicle info from orign server response
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
      // error will be handled in infoService()
      // console.log('TypeError error', 'error', err.name, 'message', err.message, ' error 12');
    } else {
      console.error(err.name, 'JSON parse error', ' error 14');
    }
    return true;
  }

  return err || response.statusCode > config.minRetryStatusCodeValue;
}

let infoService = (req, res) => {
  // TODO *******************************************************
  // refactor option selection out of this function
  // ************************************************************
  request({
    url: 'http://orignServer/id',
    // url: '127.0.0.1:3001/vehicles/test',
    json: true,
    method: 'POST',
    body: {"id": req.params.id, "responseType": "JSON"},
    headers: { "Content-Type": "application/json" },
    timeout: config.timeoutSmartcarRequest,
    // The below parameters are specific to request-retry
    maxAttempts: config.maxRetryForBackoff,
    delayStrategy: exponentialBackOff,
    retryStrategy: retryInfo,
    fullResponse: true
  })
  .then(function (response) {
    attempts = 0;
    var data = {};
    try {
      // test for parsing vehicle info from orign server's response
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
      data = {"status": "404", "error": err.name, "message": err.message, "code": "json parse error 11"};

      // TODO *******************************************************
      // create [error] response class & constructor
      // "code" can be used for internal use
      // ************************************************************
    }
    res.send(JSON.stringify( data ));
  })
  .catch(function(error) {
    attempts = 0;
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


// function retryDoor(err, response, body){
//   if (typeof body !== "object") {
//     return true;
//   }
//   if (err) {
//     // console.error('error occurred ', err.message);
//   }
//   try {
//     if (typeof body === "object") {
//       var data = [{
//         "location": body.data.doors.values[0].location.value,
//         "locked": body.data.doors.values[0].locked.value},
//         {"location": body.data.doors.values[1].location.value,
//         "locked": body.data.doors.values[1].locked.value
//       }]
//     }
//       // TODO *******************************************************
//       // refactor this resonse obj construction out of here
//       // ************************************************************

//   } catch(e) {
//     if ( e instanceof TypeError ) {
//       // error will be handled in getVehicleInfoService()
//       // console.log('TypeError error', 'error', err.name, 'message', err.message, ' error 09');
//     } else {
//       console.error(err.name, 'JSON parse error', ' error 14');
//     }
//     return true;
//   }

//   return err || response.statusCode > config.minRetryStatusCodeValue;
// }

// let doorService = (req, res) => {
//   // TODO *******************************************************
//   // refactor option selection out of this function
//   // ************************************************************
//   request({
//     url: 'http://http://orignServer/id/endpoint1',
//     json: true,
//     method: 'POST',
//     body: {"id": req.params.id, "responseType": "JSON"},
//     headers: { "Content-Type": "application/json" },

//     // The below parameters are specific to request-retry
//     maxAttempts: config.maxRetryForBackoff,
//     delayStrategy: exponentialBackOff,
//     retryStrategy: retryDoor,
//     fullResponse: true // (default) To resolve the promise with the full response or just the body
//   })
//   .then(function (response) {
//     attempts = 0;
//     var data = {};
//     try {
//       // test for parsing vehicle info from orign server's response
//       data = [{
//         "location": response.body.data.doors.values[0].location.value,
//         "locked": response.body.data.doors.values[0].locked.value},
//         {"location": response.body.data.doors.values[1].location.value,
//         "locked": response.body.data.doors.values[1].locked.value
//       }]
//       // TODO *******************************************************
//       // even if valid JSON, need to check presence of all required properties
//       // ************************************************************

//     } catch(err) {
//       // can save err.stack to log file
//       // Smartcar response to clients
//       data = {"status": "404", "error": err.name, "message": err.message, "code": "json parse error 11"};
//       // TODO *******************************************************
//       // create [error] response class & constructor
//       // "code" can be used for internal use
//       // ************************************************************
//     }
//     res.send(JSON.stringify( data ));
//   })
//   .catch(function(error) {
//     attempts = 0;
//     try {
//       res.send({"status": "404", "errno": error.errno, "message": error.message, "code": "2"});
//       // TODO *******************************************************
//       // create [error] response class & constructor
//       // ************************************************************
//     } catch(e) {
//       console.error('no errno value')
//     }
//   })
// }


// function retry_ener_fuel(err, response, body){
//   // retry the request if we had an error or if the response was a 'Bad Gateway'
//   if (typeof body !== "object") {
//     // console.log('body is undefined!');
//     return true;
//   }
//   if (err) {
//     console.log('error occurred ', err);
//   }
//   try {
//     if (typeof body === "object") {
//       var data = {
//         "percent": body.data.tankLevel.value
//       }
//     }
//       // TODO *******************************************************
//       // refactor this resonse obj construction out of here
//       // ************************************************************

//   } catch(e) {
//   // } catch(err) {
//     if ( err instanceof TypeError ) {
//       // error will be handled in getVehicleInfoService()
//       // console.log('TypeError error', 'error', err.name, 'message', err.message, ' error 12');
//     } else {
//       console.error(err.name, 'JSON parse error', ' error 05');
//     }
//     return true;
//   }
//   return err || response.statusCode > config.minRetryStatusCodeValue;
// }


// let enerService = (req, res) => {
//   // TODO *******************************************************
//   // refactor option selection out of this function
//   // ************************************************************
//   request({
//     url: 'http://originServer/id/endpoint2',
//     json: true,
//     method: 'POST',
//     body: {"id": req.params.id, "responseType": "JSON"},
//     headers: { "Content-Type": "application/json" },
//     // The below parameters are specific to request-retry
//     maxAttempts: config.maxRetryForBackoff,
//     delayStrategy: exponentialBackOff,
//     retryStrategy: retry_ener_fuel,
//     fullResponse: true
//   })
//   .then(function (response) {
//     attempts = 0;
//     var data = {};
//     try {
//       // TODO *******************************************************
//       // even if valid JSON, need to check presence of all required properties
//       // ************************************************************
//       data = {
//         "percent": Math.round(response.body.data.tankLevel.value)
//       }
//       // TODO *******************************************************
//       // could also save battery data
//       // ************************************************************
//     } catch(e) {
//       // can save err.stack to log file

//       // Smartcar response to clients
//       data = {"status": "404", "error": err.name, "message": err.message, "code": "json parse error 20"};

//       // TODO *******************************************************
//       // create [error] response class & constructor
//       // "code" can be used for internal use
//       // ************************************************************
//     }
//     res.send(JSON.stringify( data ));

//   })
//   .catch(function(err) {
//     attempts = 0;
//     try {
//       res.send({"status": "404", "errno": err.errno, "message": err.message, "code": "21"});
//       // TODO *******************************************************
//       // create [error] response class & constructor
//       // ************************************************************
//     } catch(err) {
//       console.error('no errno value')
//     }
//   })
// }


// function retryFuel(err, response, body){
//   if (typeof body !== "object") {
//     // console.log('body is undefined!');
//     return true;
//   }
//   if (err) {
//     console.log('error occurred ', err);
//   }
//   try {
//     if (typeof body === "object") {
//       var data = {
//         "percent": body.data.batteryLevel.value
//       }
//       // TODO *******************************************************
//       // refactor this resonse obj construction out of here
//       // ************************************************************
//     }
//   } catch(err) {
//     if ( err instanceof TypeError ) {
//       // error will be handled in getVehicleInfoService()
//       // console.log('TypeError error', 'error', err.name, 'message', err.message, ' error 73');
//     } else {
//       console.error(err.name, 'JSON parse error', ' error 38');
//     }
//     return true;
//   }

//   return err || response.statusCode > config.minRetryStatusCodeValue;
// }

// let fuelService = (req, res) => {
//   // TODO *******************************************************
//   // refactor option selection out of this function
//   // ************************************************************
//   request({
//     url: 'http://originServer/id/endpoint3',
//     json: true,
//     method: 'POST',
//     body: {"id": req.params.id, "responseType": "JSON"},
//     headers: { "Content-Type": "application/json" },

//     // The below parameters are specific to request-retry
//     maxAttempts: config.maxRetryForBackoff,
//     delayStrategy: exponentialBackOff,
//     retryStrategy: retryFuel,
//     fullResponse: true
//   })
//   .then(function (response) {
//     attempts = 0;
//     var data = {};
//     try {
//       // test for parsing vehicle info from orign server's response
//       data = {
//         "percent": Math.round(response.body.data.batteryLevel.value)
//       }
//       // TODO *******************************************************
//       // even if valid JSON, need to check presence of all required properties
//       // ************************************************************
//     } catch(err) {
//       // can save err.stack to log file

//       // Smartcar response to clients
//       data = {"status": "404", "error": err.name, "message": err.message, "code": "json parse error 17"};

//       // TODO *******************************************************
//       // create [error] response class & constructor
//       // "code" can be used for internal use
//       // ************************************************************
//     }
//     res.send(JSON.stringify( data ));
//   })
//   .catch(function(err) {
//     attempts = 0;
//     try {
//       res.send({"status": "404", "errno": err.errno, "message": err.message, "code": "2"});
//       // TODO *******************************************************
//       // create [error] response class & constructor
//       // ************************************************************
//     } catch(err) {
//       console.error('no errno value')
//     }
//   })
// }


// function retryStartStop(err, response, body){
//   if (typeof body !== "object") {
//     // console.log('body is undefined!');
//     return true;
//   }
//   if (err) {
//     // console.log('error occurred ', err);
//   }
//   try {
//     if (typeof body === "object") {
//       console.log('body.actionResult.status', body.actionResult.status);
//       var data = {
//         "status": (body.actionResult.status === 'EXECUTED') ? 'success' : 'error1'
//       }
//       // TODO *******************************************************
//       // refactor this resonse obj construction out of here
//       // ************************************************************
//     }
//   } catch(err) {
//     if ( err instanceof TypeError ) {
//       // error will be handled in getVehicleInfoService()
//       // console.log('TypeError error', 'error', err.name, 'message', err.message, ' error 12');
//     } else {
//       // console.error(err.name, 'JSON parse error', ' error 65');
//     }
//     return true;
//   }

//   return err || response.statusCode > config.minRetryStatusCodeValue;
// }


// let startStopService = (req, res) => {
//   // TODO *******************************************************
//   // refactor option selection out of this function
//   // ************************************************************
//   var command = req.body.action === 'START' ? 'START_VEHICLE' : 'STOP_VEHICLE';
//   request({
//     url: 'http://originServer/id/endpoint3',
//     json: true,
//     method: 'POST',
//     body: {"id": req.params.id, "command": command, "responseType": "JSON"},
//     headers: { "Content-Type": "application/json" },

//     // The below parameters are specific to request-retry
//     maxAttempts: config.maxRetryForBackoff,
//     delayStrategy: exponentialBackOff,
//     retryStrategy: retryStartStop,
//     fullResponse: true
//   })
//   .then(function (response) {
//     attempts = 0;
//     // console.log('response1', response.body);
//     var data = {};
//     try {
//       data = {
//         "status": (response.body.actionResult.status === 'EXECUTED') ? 'success' : 'error'
//       }
//       // TODO *******************************************************
//       // even if valid JSON, need to check presence of all required properties
//       // ************************************************************
//     } catch(err) {
//       // can save err.stack to log file

//       // Smartcar response to clients
//       data = {"status": "404", "error": err.name, "message": err.message, "code": "json parse error 34"};

//       // TODO *******************************************************
//       // create [error] response class & constructor
//       // "code" can be used for internal use
//       // ************************************************************
//     }
//     res.send(JSON.stringify( data ));
//   })
//   .catch(function(err) {
//     attempts = 0;
//     try {
//       res.send({"status": "404", "errno": err.errno, "message": err.message, "code": "62"});
//       // TODO *******************************************************
//       // create [error] response class & constructor
//       // ************************************************************
//     } catch(err) {
//       console.error('no errno value')
//     }
//   })
// }


module.exports.infoService = infoService;
// module.exports.doorService = doorService;
// module.exports.enerService = enerService;
// module.exports.fuelService = fuelService
// module.exports.startStopService = startStopService
