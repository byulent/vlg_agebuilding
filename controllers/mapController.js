exports.index = function (req, res, next) {
	res.render('map', {
		title: "Карта возраста зданий Волгограда"
	});
}