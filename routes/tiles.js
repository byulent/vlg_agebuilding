var express = require('express');
var router = express.Router();
var fs = require('fs');
var Tiles = require('../lib/tiles');

router.get('/:z/:x/:y.json', (req, res, next) => {
	var dstPath = 'tiles/';
	let z = req.params.z,
		x = req.params.x,
		y = req.params.y;

	fs.readFile(dstPath + x + ',' + y + ',' + z + '.json', 'utf8', (err, data) => {
		if (!data) {
			data = {
				type: "FeatureCollection",
				features: []
			}
		} else data = JSON.parse(data);
		res.set('Access-Control-Allow-Origin', '*');
		res.jsonp(data);
	});
});

router.post('/generate/', (req, res, next) => {
	let minZoom = req.body.minZoom,
		maxZoom = req.body.maxZoom;
	tiles = new Tiles();

	for (let z = minZoom; z <= maxZoom; z++) {
		tiles.generateTiles(z);
	}

	res.end('tiles generated');
})

module.exports = router;
