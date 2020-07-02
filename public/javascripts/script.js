window.onload = function () {
	let width, height, map;

	function init() {
		setMap();
	}

	function setMap() {
		let today = new Date();
		let colors = [
			{year: 1917, color: 'd73027'},
			{year: 1954, color: 'fc8d59'},
			{year: 1970, color: 'fee08b'},
			{year: 1991, color: 'd9ef8b'},
			{year: 2007, color: '91cf60'},
			{year: today.getFullYear(), color: '1a9850'}
		]
		map = document.getElementById('map');
		resizeMap();
		window.onresize = resizeMap;

		let olMap = new ol.Map({
			target: 'map',
			layers: [
				new ol.layer.Tile({
					source: new ol.source.OSM({
						url: 'https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
					})
				}),
				new ol.layer.VectorTile({
					source: new ol.source.VectorTile({
						format: new ol.format.GeoJSON(),
						url: '//localhost:3000/tiles/{z}/{x}/{y}.json',
						tileSize: 256
					}),
					style: (feature) => {
						let builtYear = feature.getProperties().built_year, color;
						if (builtYear == null) color = 'cccccc';
						else {
							let colorObj = colors.find(value => value.year >= builtYear);
							color = colorObj.color;
						}
						return new ol.style.Style({
							fill: new ol.style.Fill({color: '#' + color})
						});
					}
				})
			],
			view: new ol.View({
				center: ol.proj.fromLonLat([44.5288, 48.6780]),
				zoom: 16,
				minZoom: 14,
				maxZoom: 18,
				rotation: Math.PI / 4
			})
		});
	}

	function resizeMap() {
		width = window.innerWidth, height = window.innerHeight;

		map.style.width = width + 'px';
		map.style.height = height + 'px';
	}

	init();
};