// set up express server
const express = require('express');
const app = express();

const GM = require('./request-handler.js');

// use router for endpoints
const router = require('./routes.js');

// use middleware to parse incoming data from post
const bodyparser = require('body-parser');
app.use(bodyparser.json());

// app.use('/vehicles', router);
app.use(express.static(__dirname + '../client/dist'));

// {"vin":{"type":"String","value":"123123412412"},
//  "color":{"type":"String","value":"Metallic Silver"},
//  "fourDoorSedan":{"type":"Boolean","value":"True"},
//  "twoDoorCoupe":{"type":"Boolean","value":"False"},
//  "driveTrain":{"type":"String","value":"v8"}}}

// {
//   "vin": "1213231",
//   "color": "Metallic Silver",
//   "doorCount": 4,
//   "driveTrain": "v8"
// }

app.get('/vehicles/:id', (req, res) => {
  console.log('got GET request from ', req.url);
  GM.getVehicleInfoService(req.params.id, (data) => {
    data = JSON.parse(data);
    let result = {
      "vin": data.data.vin.value,
      "color": data.data.color.value,
      "doorCount": data.data.fourDoorSedan.value ? 4 : 2,
      "driveTrain": data.data.driveTrain.value
    }
    console.log('result ', result);
    res.statusCode = 200;
    res.send(result);
  });
});

app.post('/vehicles/:id/engine', (req, res) => {
  console.log('got POST request from ', req.url, req.body.action);
  GM.actionEngineService(req.params.id, req.body.action, (data) => {
    data = JSON.parse(data);
    let result = {"status": data.actionResult.status === "EXECUTED" ? "success" : "error"}
    console.log('result ', result);
    res.statusCode = 200;
    res.send(result);
  });
});

// app.get('/vehicles/:id', function (req, res) {
//   console.log('got GET request from ', req.url);
//   GM.getVehicleInfo(req.params.id, (data) => {
//     res.statusCode = 200;
//     res.send(data);
//   });
// });


app.set('port', 3000);
app.listen(app.get('port'));
console.log('Listening on port ', app.get('port'));

