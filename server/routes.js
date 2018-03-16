const router = require('express').Router();
const requestHandler = require('./requestHandler.js');
const handler = require('./axios.js');

const retry = require('./retry.js');


router.get('/:id', retry.getVehicleInfoService);

router.get('/:id/doors', retry.getSecurityStatusService);

router.get('/:id/fuel', retry.getEnergyService);

router.get('/:id/battery', retry.getBatteryEnergyService);

router.post('/:id/engine', retry.actionEngineService);



// router.get('/:id', requestHandler.vehicleAxios);
// router.get('/:id', requestHandler.vehicleRequest);

// router.post('/:id/engine', requestHandler.engineAxios);
// // router.post('/:id/engine', requestHandler.engineRequest);

// router.get('/:id/doors', requestHandler.security);

// router.get('/:id/fuel', requestHandler.fuel);

// router.get('/:id/battery', requestHandler.battery);

// // router.get('/:id/test', requestHandler.testServer);
// router.get('/:id/test', handler.dofibo);

// catch invalid endpoint
// router.get('', requestHandler.catchall);
// router.get('/:id*', requestHandler.catchall);


module.exports = router;

  // "service": "actionEngine",
  // "status": "200",
  // "actionResult": {
  //   "status": "EXECUTED|FAILED"

