const router = require('express').Router();
const requestHandler = require('./requestHandler.js');

router.get('/test', requestHandler.testServer);

router.get('/:id', requestHandler.vehicleAxios);
// router.get('/:id', requestHandler.vehicleRequest);

router.post('/:id/engine', requestHandler.engineAxios);
// router.post('/:id/engine', requestHandler.engineRequest);

router.get('/:id/doors', requestHandler.security);

router.get('/:id/fuel', requestHandler.fuel);

router.get('/:id/battery', requestHandler.battery);

// catch invalid endpoint
// router.get('', requestHandler.catchall);
// router.get('/:id*', requestHandler.catchall);


module.exports = router;
