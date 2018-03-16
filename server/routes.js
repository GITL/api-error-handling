const router = require('express').Router();
const retry = require('./requestHandler.js');

router.get('/:id', retry.getVehicleInfoService);

router.get('/:id/doors', retry.getSecurityStatusService);

router.get('/:id/fuel', retry.getEnergyService);

router.get('/:id/battery', retry.getBatteryEnergyService);

router.post('/:id/engine', retry.actionEngineService);

module.exports = router;
