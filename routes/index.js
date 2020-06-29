var express = require('express');
var router = express.Router();
var datasetController = require('../controllers/datasetController');
var csvParserController = require('../controllers/csvParserController');
var mapController = require('../controllers/mapController');

/* GET home page. */
router.get('/', datasetController.index);
router.get('/csv/', csvParserController.index);
router.get('/map/', mapController.index);

module.exports = router;
