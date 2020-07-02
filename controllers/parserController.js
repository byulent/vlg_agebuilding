var csv = require('csv-parse/lib/sync');
var fs = require('fs');
var jaro = require('jaro-winkler');
var buildingsWithYears = [];
var streetAbbrevs = [['улица', 'ул'], ['ул', 'ул'], ['переулок', 'пер'], ['поселок', 'п'], ['посёлок', 'п'], ['бульвар', 'б-р'], ["проспект", "пр-кт"],
	['пр', 'пр-кт'], ['шоссе', 'ш'], ['набережная', 'наб'], ['проезд', 'проезд']];
var filename = 'public/datasets/volgograd_buildings.json';

exports.index = function (req, res, next) {
	var str = fs.readFileSync(filename);
	var geojson = JSON.parse(str);
	var features = geojson.features;

	var csvFile = fs.readFileSync('public/datasets/export-reestrmkd-34-20200401.csv');
	buildingsWithYears = csv(csvFile, {delimiter: ';', columns: true});

	var addrRegexp = /(?<name>.*?)?(?<type>(^| )(б?ул|пос|пе?р|шос)[а-яё]*)\.?(?<name2>.*)/u;
	var city, street, streetType, streetAbbr, streetName = '', housenumber = '', street2, street2Type, street2Abbr,
		street2Name = '', housenumber2 = '',
		buildingCity, buildingStreetType, buildingStreet, buildingNumber;

	features.forEach((feature) => {
		if (!feature.properties.built_year) {
			city = feature.properties['addr:city'] || 'Волгоград';
			street = feature.properties['addr:street'];
			if (street) {
				if (street.match(addrRegexp)) {
					streetType = street.match(addrRegexp).groups.type;
					streetAbbr = streetAbbrevs.find((item) => item[0] == streetType.trim());
					if (streetAbbr) {
						streetName = street.match(addrRegexp).groups.name || street.match(addrRegexp).groups.name2;
						streetName = streetName.trim() || '';
					} else {
						streetType = 'улица';
						streetAbbr = 'ул';
						streetName = street;
					}
				} else {
					streetType = 'улица';
					streetAbbr = 'ул';
					streetName = street;
				}
				housenumber = feature.properties['addr:housenumber'];
				street2 = feature.properties['addr2:street'];
				if (street2) {
					if (street2.match(addrRegexp)) {
						street2Type = street2.match(addrRegexp).groups.type;
						street2Abbr = streetAbbrevs.find((item) => item[0] == street2Type.trim());
						if (street2Abbr) {
							street2Name = street2.match(addrRegexp).groups.name || street2.match(addrRegexp).groups.name2;
							street2Name = street2Name.trim() || '';
						} else {
							street2Type = 'улица';
							street2Abbr = 'ул';
							street2Name = street2;
						}
					} else {
						street2Type = 'улица';
						street2Abbr = 'ул';
						street2Name = street2;
					}
				}
				var buildings = buildingsWithYears.filter(value => {
					return city == value.formalname_city && (value.built_year || value.exploitation_start_year)
						&& ((value.formalname_street.includes(streetName) && (value.house_number.replace('.', '').toLowerCase() == housenumber.toLowerCase() ||
							(value.house_number + value.building + value.block + value.letter).toLowerCase() == housenumber.toLowerCase()) && value.shortname_street == streetAbbr[1])
							|| (value.formalname_street.includes(street2Name) && (value.house_number.replace('.', '').toLowerCase() == housenumber2.toLowerCase() ||
								(value.house_number + value.building + value.block + value.letter).toLowerCase() == housenumber2.toLowerCase()) && value.shortname_street == street2Abbr[1]));
				})
				// console.log(buildings);
				if (buildings.length > 0) feature.properties.built_year = buildings[0].built_year || buildings[0].exploitation_start_year;
				else feature.properties.built_year = null;
			}
			city = street = streetType = streetName = housenumber = buildingCity =
				buildingStreetType = buildingStreet = buildingNumber = undefined;
		}
	});
	geojson.features = features;
	fs.writeFileSync(filename, JSON.stringify(geojson));

	res.render('index', {
		title: 'Search in CSV test',
		features: features,
		featuresNumber: features.length
	});
}