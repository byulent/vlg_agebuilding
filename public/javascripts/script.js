window.onload = function () {
	var width, height, svg, path;

	function init() {
		setMap();
	}

	function setMap() {
		width = window.innerWidth, height = window.innerHeight;

		svg = d3.select('#map').append('svg')
			.attr('width', width)
			.attr('height', height);

		var mercator = d3.geoMercator()
			.scale(500000)
			.angle(-45)
			.center([44.516948, 48.707067]);

		path = d3.geoPath().projection(mercator);

		loadData();
	}

	function loadData() {
		queue()
			.defer(d3.json, "http://localhost:3000/datasets/volgograd_topo.json")  // карта в topoJSON-формате
			.await(processData);  // обработка загруженных данных
	}

	function processData(error, buildingsMap) {
		if (error) return console.error(error);
		var buildings = topojson.feature(buildingsMap, buildingsMap.objects.buildings);

		drawMap(buildings);
	}

	function drawMap(buildings) {

		svg.append("g")
			.selectAll("path")
			.data(buildings.features)
			.enter().append("path")
			.attr("d", path)
			.style('fill', 'black');

		var zoom = d3.behavior.zoom()
			.on("zoom",function() {
				svg.select('g').attr("transform","translate("+d3.event.translate.join(",")+")scale("+d3.event.scale+")")
			});

		svg.call(zoom)
	}

	init();
};