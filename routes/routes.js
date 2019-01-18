const s3bucket = 'zluxstore'; //Replace 'zluxstore' with your own
const path = require('path');
const AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');
const fs = require('fs');
const s3 = new AWS.S3();
const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var appRouter = function (app) {
	app.get("/", function(req, res) {
		res.sendFile(path.join(__dirname + '/../pages/index.html'));
	});
	app.post("/api/extract", function (req, res) {
		//get input
		body('vrurl').not().isEmpty().trim().escape()
		const redditPermalink = req.body.vrurl;
		
		if (redditPermalink !== ""){
			console.log(redditPermalink);

			const { exec } = require('child_process');
			exec('./extract-utils/youtube-dl "'+redditPermalink+'" -f bestvideo+bestaudio -o "extracts/%(title)s.%(ext)s" --print-json', (err, stdout, stderr) => {
				if (err) {
					var errMsg = "Extraction Error";
					var outputObj = {"err":true, "errMsg":errMsg ,"videoName":null ,"fileName":null, "downloadURL":null};
					res.status(200).json(JSON.stringify(outputObj));
					return;
				}

				const jsonOutput = JSON.parse(stdout);
				const fileLocation = jsonOutput._filename;
				console.log("Created: " + jsonOutput._filename);

				const body = fs.createReadStream(fileLocation)
				const params = {
					Bucket: s3bucket,
					Key: jsonOutput.title + "_" + uuidv4() + "." + jsonOutput.ext,
					Body: body,
					ACL: 'public-read'
				};
				s3.upload(params, function(err, data) {
					console.log(err, data);
					if (err == null){
						var outputObj = {"err":false, "errMsg":null ,"videoName":jsonOutput.title, "fileName":data.Key, "downloadURL":data.Location};
						res.status(200).json(outputObj);
					} else {
						var errMsg = "Upload Error";
						var outputObj = {"err":true, "errMsg":errMsg ,"videoName":null ,"fileName":null, "downloadURL":null};
						res.status(200).json(outputObj);
					}

					fs.unlink(fileLocation, function(err) { 
					    if(err) {
					       console.log("Unlink failed", err);
					    } else {
					       console.log("File "+fileLocation+ "deleted");
					    }
					});
				});
			});
		} else {
			var errMsg = "Empty URL";
			var outputObj = {"err":true, "errMsg":errMsg ,"videoName":null ,"fileName":null, "downloadURL":null};
			console.log(errMsg);
			res.status(200).json(outputObj);
		}
	});
}

module.exports = appRouter;