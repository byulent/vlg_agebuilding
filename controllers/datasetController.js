var gdal = require('gdal');

var dataset = gdal.open('datasets/volgograd_buildings.geojson');
var layer = dataset.layers.get(0);

exports.index = function (req, res, next) {
	res.render('index', {
		title: 'Node GDAL test',
		features: layer.features,
		featuresNumber: layer.features.count(),
		fields: layer.fields.getNames(),
		extent: JSON.stringify(layer.extent),
		srs: layer.srs ? layer.srs.toWKT() : 'null'
	});
}