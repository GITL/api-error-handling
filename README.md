A. How to run this server app:

1. from the root/smartcar folder, install npm modules
   `npm -S install`

2. start the app with `node server/index.js`

- - - - -

B. Program flow:

Main Express entry page -> router page -> request handler page (requestretry)

- - - - -

C. Exponential backoff with jitter:

Attempted to handle as many "errors" as possible  See error-types.pdf. Have also included a random backoff as a backup, should exponential backoff algorithm fail

- - - - -

D. Checking for net connection has been disabled but it would check for net connection upon start

- - - - -

E. Missing error handling:

No retries on timeouts, ECONNREFUSED, socket and other network issues

No validity check on the data for POST requests to GM, could be implemented separately prior to their use as options for the request

No logging, most of console.log/errors could be logged with timestamp.  Stack info from errors can also be logged

No testing (too many refactoring and testing)

- - - - -

F. Potential improvements:

Simply checking for validity of JSON response from GM isn't sufficient.  It's possible to have one that's missing some properties but can pass as a valid JSON.  So presence of all required properties must be tested as well.

Server maybe restarted upon crashing except that its state can not be guaranteed

Modular/centralized way of issuing error response JSON to Smartcar's clients would be more helpful (a la Twilio or Stripe)

Creating a list of codes that can be used for internal development

Refactor the request handlers

More use of Promises and Async/Await

- - - - -

G. curl commands, Postman and a separate server standing for GM were used to develop and test functionalities

curl http://gmapi.azurewebsites.net/getVehicleInfoService -X POST -H 'Content-Type: application/json'  -d '{"id": "1234", "responseType": "JSON"}'

curl http://127.0.0.1:3000/vehicles/1235/engine -X POST -d '{"action": "START"}' -H 'Content-Type: application/json'

curl http://127.0.0.1:3000/vehicles/1235/engine -X POST -d '{"action": "STOP", "responseType": "JSON"}' -H 'Content-Type: application/json'

curl http://gmapi.azurewebsites.net/actionEngineService -X POST -H 'Content-Type: application/json'  -d '{"id": "1234", "responseType": "JSON", "command": "STOP_VEHICLE"}'
