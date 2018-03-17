const router = require('express').Router();
const handler = require('./requestHandler.js');

router.get('/:id', handler.vehicleInfoService);

router.get('/:id/doors', handler.securityStatusService);

router.get('/:id/fuel', handler.energyService);

router.get('/:id/battery', handler.batteryEnergyService);

router.post('/:id/engine', handler.actionEngineService);

module.exports = router;
