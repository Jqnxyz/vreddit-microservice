var path = require('path');

var appRouter = function (app) {
	app.get("/", function(req, res) {
		res.sendFile(path.join(__dirname + '/../pages/index.html'));
	});

	app.get("/api/extract", function (req, res) {
		res.status(200).send("extract api");
	});
}

module.exports = appRouter;