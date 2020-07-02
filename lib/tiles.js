var fs = require('fs');

var tileSize = 256;
var srcFile = '../public/datasets/volgograd_buildings.json';
var dstPath = '../tiles/';
var minX = Number.MAX_VALUE;
var maxX = 0;
var minY = Number.MAX_VALUE;
var maxY = 0;

function Tiles() {

}

Tiles.prototype.generateTiles = function (zoom) {
	var worldSize = tileSize << zoom;
	var tiles = {};
	var properties = {};

//*****************************************************************************
	var colors = [];
	var str = fs.readFileSync(srcFile, 'utf8');

	var geojson = JSON.parse(str);

	console.log('processing ' + geojson.features.length + ' features...');

	var feature, tileBBox;
	for (var i = 0, il = geojson.features.length; i < il; i++) {
		feature = geojson.features[i];
		tileBBox = getTileBBox(feature.geometry.coordinates[0], tileSize, worldSize);
		addToTiles(feature, tileBBox, zoom, tiles);
	}

	for (var key in tiles) {
		console.log('writing tile ' + key + '.json, ' + tiles[key].features.length + ' features');
		fs.writeFileSync(dstPath + key + '.json', JSON.stringify(tiles[key]));
	}
	console.log('Done.');
}

function getTileBBox(polygon, tileSize, worldSize) {

	var minLon = Infinity,
		maxLon = -Infinity,
		minLat = Infinity,
		maxLat = -Infinity;

	for (var i = 0, il = polygon.length; i < il; i++) {
		if (polygon[i].length > 2) {
			for (var j = 0, jl = polygon[i].length; j < jl; j++) {
				minLon = Math.min(minLon, polygon[i][j][0]);
				maxLon = Math.max(maxLon, polygon[i][j][0]);
				minLat = Math.min(minLat, polygon[i][j][1]);
				maxLat = Math.max(maxLat, polygon[i][j][1]);
			}
		} else {
			minLon = Math.min(minLon, polygon[i][0]);
			maxLon = Math.max(maxLon, polygon[i][0]);
			minLat = Math.min(minLat, polygon[i][1]);
			maxLat = Math.max(maxLat, polygon[i][1]);
		}
	}

	var minXY = project(minLat, minLon, worldSize);
	var maxXY = project(maxLat, maxLon, worldSize);

	var
		newMinX = Math.min(minXY.x, maxXY.x),
		newMinY = Math.min(minXY.y, maxXY.y),
		newMaxX = Math.max(minXY.x, maxXY.x),
		newMaxY = Math.max(minXY.y, maxXY.y);

	return {
		minX: newMinX / tileSize << 0,
		minY: newMinY / tileSize << 0,
		maxX: newMaxX / tileSize << 0,
		maxY: newMaxY / tileSize << 0
	};

}

function addToTiles(feature, tileBBox, zoom, tiles) {
	var x, y, key;

	for (y = tileBBox.minY; y <= tileBBox.maxY; y++) {
		for (x = tileBBox.minX; x <= tileBBox.maxX; x++) {
			key = [x, y, zoom].join(',');
			if (!tiles[key]) {
				maxX = x > maxX ? x : maxX;
				maxY = y > maxY ? y : maxY;

				minX = x < minX ? x : minX;
				minY = y < minY ? y : minY;

				tiles[key] = {
					type: 'FeatureCollection',
					features: []
				};
			}

			tiles[key].features.push(feature);
		}
	}
}

function project(latitude, longitude, worldSize) {
	var x = longitude / 360 + 0.5,
		y = Math.min(1, Math.max(0, 0.5 - (Math.log(Math.tan((Math.PI / 4) + (Math.PI / 2) * latitude / 180)) / Math.PI) / 2));

	return {x: x * worldSize, y: y * worldSize};
}

module.exports = Tiles;