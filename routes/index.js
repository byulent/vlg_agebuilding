var express = require('express');
var router = express.Router();
var datasetController = require('../controllers/datasetController');

/* GET home page. */
router.get('/', datasetController.index);

module.exports = router;
