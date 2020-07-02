var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
	res.end('admin router');
});

module.exports = router;
