
exports.exponentialBackOff = function(err, response, body){
  // err.attempts = number of tries attempting/attempted

  var attemptsNumber = 1; // used in case err.attempts is undefined
  var message = '';
  var backoffTime = 200; // in ms, just initial value, will be overwritten

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

exports.hasNetConnection = function () {
  return new Promise((resolve, reject) => {
    console.log('checking net connection');
    var result = true;
    try {
      var exec = require('child_process').exec, child;
    } catch(e) {
      console.log(e);
    }

    child = exec('ping -c 1 8.8.8.8', function(error, stdout, stderr) {
      if(error !== null) {
        console.log("no net connection: ", error.name, " message: ",  error.message);//, ' error stack: ', error.stack);
        console.log('continuing');
        result = false
        reject(result);
      } else {
        console.log("has net connection");
        // result = true
        resolve(result);
      }
    });
  });
}

// warning only if no net connection found
exports.checkNetConnection = function() {
  this.hasNetConnection().then(() => {

  } ).catch(() => {

  } )
}

