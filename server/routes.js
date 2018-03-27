const router = require('express').Router();
const handler = require('./requestHandler.js');

router.get('/:id', handler.infoService);

// router.get('/:id/doors', handler.doorService);

// router.get('/:id/fuel', handler.enerService);

// router.get('/:id/battery', handler.fuelService);

// router.post('/:id/engine', handler.startStopService);

module.exports = router;
