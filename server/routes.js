const router = require('express').Router();
// const requestHandler = require('./requestHandler.js');
// const handler = require('./axios.js');
const retry = require('./retry.js');

router.get('/:id', retry.getVehicleInfoService);

router.get('/:id/doors', retry.getSecurityStatusService);

router.get('/:id/fuel', retry.getEnergyService);

router.get('/:id/battery', retry.getBatteryEnergyService);

router.post('/:id/engine', retry.actionEngineService);

module.exports = router;
