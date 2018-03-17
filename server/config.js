const config = {};

config.checkNetConnectionUponStart = false;
config.delay = 200; // start retrying after 200 ms of first try
config.port = 3000; // Listening port for Express
config.vehiclesEndPoint = '/vehicles';
config.expressTimeOut = 30000; // 30 seconds

config.jitterRange = 0.3;
config.jitterHalfRange = config.jitterRange / 2;
config.maxAttemptNumberForRandomBackoff = 4;

config.fourDoor = 4;
config.twoDoor = 2;

config.minRetryStatusCodeValue = 299;
config.timeoutSmartcarRequest = 30000; // 30 sec
config.maxRetryForBackoff = 6;
config.initialBackoffTime = 200; // 200 ms

module.exports = config;

