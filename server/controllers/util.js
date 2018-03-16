
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



