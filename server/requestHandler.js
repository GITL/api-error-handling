const requestModule = require('./requestModule.js');


let vehicleAxios = (req, res) => {
  // validate req.params & req.params.id
  // replace options with options subroutine
  // console.log('vehicleAxios');
  let id = req.params.id;
  let options = {
    url: 'getVehicleInfoService',
    baseURL: 'http://gmapi.azurewebsites.net/',
    // data: JSON.stringify({"id": id, "responseType": "JSON"}),
    data: {"id": id, "responseType": "JSON"},
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    timeout: 3000,
    // transformResponse: [function (data) {
    //   // Do whatever you want to transform the data
    //   data = JSON.parse(data);
    //   let result = {
    //     "vin": data.data.vin.value,
    //     "color": data.data.color.value,
    //     "doorCount": data.data.fourDoorSedan.value ? 4 : 2,
    //     "driveTrain": data.data.driveTrain.value
    //   }
    //   return result;
    // }],
    // withCredentials: false, // default
    // responseType: 'application/text', // default
    // xsrfCookieName: 'XSRF-TOKEN', // default
    // xsrfHeaderName: 'X-XSRF-TOKEN', // default
    // maxContentLength: 1000,
    // validateStatus: function (status) {
    //   return status >= 200 && status < 300; // default
    // },
  };

  requestModule.makeRequestAxios(options, (data) => {

    // console.log('data1 response.data', response.data);
    // res.statusCode = 200;
    // res.send(data);

    // console.log('error', err);
    // validate response
      // if error, call error handler with error code

    // replace with response handler subroutines
    let result = '';
    try {
      result = {
        "vin": data.data.vin.value,
        "color": data.data.color.value,
        "doorCount": data.data.fourDoorSedan.value ? 4 : 2,
        "driveTrain": data.data.driveTrain.value
     }
    } catch (error) {
      // 404: Service not found
      console.log('data0', data);
      console.log('Error6 ', error);
    }
    // console.log('data2', result);
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

let engineAxios = (req, res) => {
  let id = req.params.id;
  let command = req.body.action;

  let options = {
    url: 'http://gmapi.azurewebsites.net/actionEngineService',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      "id": id,
      "command": command + '_VEHICLE',
      "responseType": "JSON"
    },
  };

  requestModule.makeRequestAxios(options, (data) => {
      // data = JSON.parse(data);
    // console.log('data=', data);
    let result = {"status": data.actionResult.status === "EXECUTED" ? "success" : "error"}
    // console.log(result);
    res.statusCode = 200;
    res.send(result);
  });
};

let engineRequest = (req, res) => {
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


let testServer = (req, res) => {
  // // validate req.params & req.params.id
  // console.log('starting testServer');
  // replace options with options subroutine
  let id = "1235";//req.params.id;
  let options = {
    // url: 'vehicles/test',
    // baseURL: 'http://127.0.0.1:3001/',
    data: {"id": id, "responseType": "JSON"},
    // method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    timeout: 30000,
  };

  // requestModule.doAxiosRetry(options, (data) => {
  //   console.log('doAxiosRetry returned');
  //   res.statusCode = 200;
  //   res.send(result);
  // });

  requestModule.testRequest(options, (data) => {
    // console.log('here 2');
    try {
      result = {
        "vin": data.data.vin.value,
        "color": data.data.color.value,
        "doorCount": data.data.fourDoorSedan.value ? 4 : 2,
        "driveTrain": data.data.driveTrain.value
     }
    } catch (error) {
      // 404: Service not found
      // console.log('data0', data);
      // res.statusCode = 400;
      console.log('error in parsing response json', res.statusCode );
    }
    res.statusCode = 200;
    res.send(result);
  });
}

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
module.exports.engineAxios = engineAxios;
module.exports.engineRequest = engineRequest;
module.exports.catchall = catchall;
module.exports.testServer = testServer;

