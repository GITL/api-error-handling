check internet
check params
check json data is correct
handle time outs
handle econnrefused
log into text file
config file


failed to connect to server
failed to resolve hostname
invalid user input
request timeout
server returned a 500 response
socket hang-up
system is out of memory

ERRORS:
ECONNRESET, ENOTFOUND, ESOCKETTIMEDOUT, ETIMEDOUT, ECONNREFUSED, EHOSTUNREACH, EPIPE, EAI_AGAIN,
HTTP 5xx error


if unknown issue happens, may need to restart the server



res.status(500).send({ error: "boo:(" });




    //throwing an Error from typical function, whether sync or async
 if(!productToAdd)
 throw new Error("How can I add new product when no value provided?");

//'throwing' an Error from EventEmitter
const myEmitter = new MyEmitter();
myEmitter.emit('error', new Error('whoops!'));

//'throwing' an Error from a Promise
 return new promise(function (resolve, reject) {
 DAL.getProduct(productToAdd.id).then((existingProduct) =>{
 if(existingProduct != null)
 return reject(new Error("Why fooling us and trying to add an existing product?"));




const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const app = express();

app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse();

  twiml.message('The Robots are coming! Head for the hills!');

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});







Accept and Content-Type headers


{
  "code": 21211,
  "message": "The 'To' number 5551234567 is not a valid phone number.",
  "more_info": "https://www.twilio.com/docs/errors/21211",
  "status": 400
}




When a collision first occurs, send a “Jamming signal” to prevent further data being sent.
Resend a frame after either 0 seconds or 51.2μs, chosen at random.
If that fails, resend the frame after either 0s, 51.2μs, 102.4μs, or 153.6μs.
If that still doesn't work, resend the frame after k · 51.2μs, where k is a random integer between 0 and 23 − 1.
In general, after the cth failed attempt, resend the frame after k · 51.2μs, where k is a random integer between 0 and 2c − 1.

the retransmission timeout reaches a ceiling, and thereafter does not increase any further.




The Generic Motors (GM) car company has a terrible API. It returns badly structured JSON which isn't always consistent. Smartcar needs to adapt the API into a cleaner format.

There are two API specifications provided below, the GM API and the Smartcar API Spec. Your task is to implement the Smartcar spec by making HTTP requests to the GM API.

client --request--> Smartcar API --request--> GM API

curl http://gmapi.azurewebsites.net/getVehicleInfoService -X POST -H 'Content-Type: application/json'  -d '{"id": "1234", "responseType": "JSON"}'

curl http://127.0.0.1:3000/vehicles/1235/engine -X POST -d '{"action": "START"}' -H 'Content-Type: application/json'

curl http://127.0.0.1:3000/vehicles/1235/engine -X POST -d '{"action": "STOP", "responseType": "JSON"}' -H 'Content-Type: application/json'


curl http://gmapi.azurewebsites.net/actionEngineService -X POST -H 'Content-Type: application/json'  -d '{"id": "1234", "responseType": "JSON", "command": "STOP_VEHICLE"}'


541 characters for Security response


POST /getVehicleInfoService
Content-Type: application/json
{
  "id": "1234",
  "responseType": "JSON"
}
Response:
{
  "service": "getVehicleInfo",
  "status": "200",
  "data": {
    "vin": {
      "type": "String",
      "value": "123123412412"
    },
    "color": {
      "type": "String",
      "value": "Metallic Silver"
    },
    "fourDoorSedan": {
      "type": "Boolean",
      "value": "True"
    },
    "twoDoorCoupe": {
      "type": "Boolean",
      "value": "False"
    },
    "driveTrain": {
      "type": "String",
      "value": "v8"
    }
  }
}

GET /vehicles/:id
{
  "vin": "1213231",
  "color": "Metallic Silver",
  "doorCount": 4,
  "driveTrain": "v8"
}
- - - - -
GET /vehicles/:id/doors
[
  {
    "location": "frontLeft",
    "locked": true
  },
  {
    "location": "frontRight",
    "locked": true
  }
]
- - - - -

POST /getEnergyService
Content-Type: application/json

{
  "id": "1234",
  "responseType": "JSON"
}
Response:

{
  "service": "getEnergyService",
  "status": "200",
  "data": {
    "tankLevel": {
      "type": "Number",
      "value": "30"
    },
    "batteryLevel": {
      "type": "Null",
      "value": "null"
    }
  }
}

GET /vehicles/:id/fuel
Response:
{
  "percent": 30
}
GET /vehicles/:id/battery
Response:
{
  "percent": 50
}
- - - - -

POST /actionEngineService
Content-Type: application/json
{
  "id": "1234",
  "command": "START_VEHICLE|STOP_VEHICLE",
  "responseType": "JSON"
}
Response:
{
  "service": "actionEngine",
  "status": "200",
  "actionResult": {
    "status": "EXECUTED|FAILED"
  }
}

POST /vehicles/:id/engine
Content-Type: application/json
{
  "action": "START|STOP"
}
Response:
{
  "status": "success|error"
}


{"service":"actionEngine",
 "status":"200",
 "actionResult":{"status":"FAILED"}}

{"status": res[actionResult][status] === "EXECUTED" ? "success" : "error"}


POST /actionEngineService
Content-Type: application/json

{
  "id": "1234",
  "command": "START_VEHICLE|STOP_VEHICLE",
  "responseType": "JSON"
}
Response:

{
  "service": "actionEngine",
  "status": "200",
  "actionResult": {
    "status": "EXECUTED|FAILED"
  }
}

POST /vehicles/:id/engine
Content-Type: application/json

{
  "action": "START|STOP"
}




