const router = require('express').Router();
const requestHandler = require('./requestHandler.js');


router.get('/:id', requestHandler.vehicleAxios);

router.post('/:id/engine', requestHandler.engine);

router.get('/:id/doors', requestHandler.security);

router.get('/:id/fuel', requestHandler.fuel);

router.get('/:id/battery', requestHandler.battery);

// catch invalid endpoint
router.get('', requestHandler.catchall);
router.get('/:id*', requestHandler.catchall);

module.exports = router;
