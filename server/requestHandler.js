const requestModule = require('./requestModule.js');

let vehicleAxios = (req, res) => {
  // validate req.params & req.params.id


  // replace options with options subroutine
  let id = req.params.id;
  let options = {
    url: 'http://gmapi.azurewebsites.net/getVehicleInfoService',
    data: JSON.stringify({"id": id, "responseType": "JSON"}),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  requestModule.makeRequestAxios(options, (data) => {
      // data = JSON.parse(data);

    // validate response
      // if error, call error handler with error code

    // replace with response handler subroutines
    let result = {
      "vin": data.data.vin.value,
      "color": data.data.color.value,
      "doorCount": data.data.fourDoorSedan.value ? 4 : 2,
      "driveTrain": data.data.driveTrain.value
    }
    // console.log(result);
    res.statusCode = 200;
    res.send(result);
  });
}

let vehicleRequest = (req, res) => {
  // validate req.params & req.params.id


  // replace options with options subroutine
  let id = req.params.id;
  let options = {
    url: 'http://gmapi.azurewebsites.net/getVehicleInfoService',
    body: JSON.stringify({"id": id, "responseType": "JSON"}),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  requestModule.makeRequest(options, (data) => {
      data = JSON.parse(data);

    // validate response
      // if error, call error handler with error code

    // replace with response handler subroutines
    let result = {
      "vin": data.data.vin.value,
      "color": data.data.color.value,
      "doorCount": data.data.fourDoorSedan.value ? 4 : 2,
      "driveTrain": data.data.driveTrain.value
    }
    // console.log(result);
    res.statusCode = 200;
    res.send(result);
  });
}

let engine = (req, res) => {
  // let id = req.url.replace('/', '');
  // console.log('engine, id=', req.params.id, req.body.action);
  let id = req.params.id;
  let command = req.body.action;

  let options = {
    url: 'http://gmapi.azurewebsites.net/actionEngineService',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "id": id,
      "command": command + '_VEHICLE',
      "responseType": "JSON"
    }),
  };

  requestModule.makeRequest(options, (data) => {
      data = JSON.parse(data);
    let result = {"status": data.actionResult.status === "EXECUTED" ? "success" : "error"}
    // console.log(result);
    res.statusCode = 200;
    res.send(result);
  });
};

let catchall = (req, res) => {
  res.statusCode = 400;
  res.send('invalid request');
};

let security = (req, res) => {
  res.statusCode = 501;
  res.send('doors end point not yet implemented');
};

let fuel = (req, res) => {
  res.statusCode = 404;
  res.send('fuel end point not yet implemented');
};

let battery = (req, res) => {
  res.statusCode = 404;
  res.send('battery end point not yet implemented');
};

module.exports.vehicleAxios = vehicleAxios;
module.exports.vehicleRequest = vehicleRequest;
module.exports.security = security;
module.exports.fuel = fuel;
module.exports.battery = battery;
module.exports.engine = engine;
module.exports.catchall = catchall;

