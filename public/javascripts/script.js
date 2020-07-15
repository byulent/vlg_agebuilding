window.onload = function () {
	let width, height, map;

	function init() {
		// window.onresize = resizeMap;
		setMap();
	}

	function initLegend(colors, startYear) {
		let legendBox = document.getElementsByClassName('info__legend')[0];
		colors.forEach((color, i) => {
			let legendPiece = document.createElement('div');
			legendPiece.classList.add('info__legend-piece');
			if (i == 0) legendPiece.innerHTML += '<span class="info__legend-label info__legend-label_position_first">' + startYear + '</span>';
			legendPiece.innerHTML += '<span class="info__legend-label' + (i == colors.length - 1 ? ' info__legend-label_position_last' : '') + '">' + color.year + '</span>';
			legendPiece.style.backgroundColor = '#' + color.color;
			legendPiece.style.width = (100.0 / colors.length) + '%';
			legendBox.append(legendPiece);
		});
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
		initLegend(colors, '~1771');
		map = document.getElementById('map');
		// resizeMap();

		var buildings = new ol.layer.VectorTile({
			source: new ol.source.VectorTile({
				attributions: [
					'© <a href="https://vk.com/byulent">Бюлент Татаринов</a>, 2019-' + today.getFullYear(),
					'© <a href="https://www.reformagkh.ru/">Реформа ЖКХ</a>'
				],
				format: new ol.format.GeoJSON(),
				url: 'http:://vlg.agebuilding.ru/tiles/{z}/{x}/{y}.json',
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
		});
		let olMap = new ol.Map({
			target: 'map',
			layers: [
				new ol.layer.Tile({
					source: new ol.source.OSM({
						url: 'http://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
					})
				}),
				buildings
			],
			view: new ol.View({
				center: ol.proj.fromLonLat([44.517018, 48.706936]),
				zoom: 16,
				minZoom: 14,
				maxZoom: 18,
				rotation: Math.PI / 4
			})
		});
		olMap.on('pointermove', (event) => {
			buildings.getFeatures(event.pixel).then((features) => {
				let popups = document.getElementsByClassName('popup');
				if (popups.length) popups[0].remove();
				if (!features.length) return;
				let feature = features[0];
				let popup = document.createElement('div');
				popup.classList.add('popup');
				popup.innerHTML = '<strong>' + (feature.values_['addr:city'] || 'Волгоград') + ', '
					+ feature.values_['addr:street'] + ', '
					+ feature.values_['addr:housenumber'] + '</strong><br>Год постройки: '
					+ (feature.values_['built_year'] || 'Нет информации для этого здания. Сообщите нам!');
				map.append(popup);
			});
			let canvasSlice = document.getElementsByClassName('ol-touch').length ? 2 : 1;
			let canvases = Array.prototype.slice.call(document.getElementsByTagName('canvas'), canvasSlice);
			for (let canvas of canvases) {
				canvas.remove();
			}
		})
	}

	function resizeMap() {
		width = window.innerWidth, height = window.innerHeight;

		map.style.width = width + 'px';
		map.style.height = height + 'px';
	}

	init();
};