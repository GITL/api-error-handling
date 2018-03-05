const request = require('request');

let getVehicleInfoService = (id, callback) => {
  // console.log('making GM api call');
  let options = {
    url: 'http://gmapi.azurewebsites.net/getVehicleInfoService',
    body: JSON.stringify({"id": id, "responseType": "JSON"}),
    headers: {
      'Content-Type': 'application/json'
    }
  };
  request.post(options, function(err, res, body) {
      console.log('returned from GM api request', body);
      callback(body);
  });
};


let actionEngineService = (id, command, callback) => {
  // console.log('making GM actionEngineService call');
  let options = {
    url: 'http://gmapi.azurewebsites.net/actionEngineService',
    body: JSON.stringify({
      "id": id,
      "command": command + '_VEHICLE',
      "responseType": "JSON"
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  };
  request.post(options, function(err, res, body) {
      console.log('returned from GM actionEngineService request', body);
      callback(body);
  });
};

module.exports.getVehicleInfoService = getVehicleInfoService;
module.exports.actionEngineService = actionEngineService;
