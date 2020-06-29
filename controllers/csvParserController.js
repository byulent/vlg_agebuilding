var csv = require('csv-parser');
var fs = require('fs');
var results = [];

fs.createReadStream('public/datasets/export-reestrmkd-34-20200401.csv')
	.pipe(csv({ separator: ';' }))
	.on("data", (data) => results.push(data));

exports.index = function (req, res, next) {
	res.render('csv', {
		title: 'Node CSV Parser test',
		features: results,
	})
}

