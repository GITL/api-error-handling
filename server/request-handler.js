const request = require('request');

let gmAPI = (id, callback) => {
  console.log('making GM api call');

  let options = {
    url: 'http://gmapi.azurewebsites.net/getVehicleInfoService',
    body: JSON.stringify({"id": "1234", "responseType": "JSON"}),
    headers: {
      'Content-Type': 'application/json'
    }
  };

  request.post(options, function(err, res, body) {
      // console.log(body);
      // parseData(body);
      console.log('returned from GM api request', body);
      callback(body);
  });

};

module.exports.gmAPI = gmAPI;
