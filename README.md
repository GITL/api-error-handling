The Generic Motors (GM) car company has a terrible API. It returns badly structured JSON which isn't always consistent. Smartcar needs to adapt the API into a cleaner format.

There are two API specifications provided below, the GM API and the Smartcar API Spec. Your task is to implement the Smartcar spec by making HTTP requests to the GM API.

client --request--> Smartcar API --request--> GM API


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






