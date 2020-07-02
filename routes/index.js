var express = require('express');
var router = express.Router();
var parserController = require('../controllers/parserController');
var mapController = require('../controllers/mapController');

/* GET home page. */
router.get('/parse/', parserController.index);
router.get('/', mapController.index);

module.exports = router;
