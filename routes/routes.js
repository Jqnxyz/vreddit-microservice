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
			console.log("Request: "+redditPermalink);
			const { exec } = require('child_process');
			exec('./extract-utils/youtube-dl "'+redditPermalink+'" -f bestvideo+bestaudio -o "extracts/%(title)s.%(ext)s" --print-json', (err, stdout, stderr) => {
				if (err) {
					console.log("Exec Error");
					var errMsg = "Unable to parse content";
					var outputObj = {"err":true, "errMsg":errMsg ,"videoName":null ,"fileName":null, "downloadURL":null};
					res.status(200).json(outputObj);
					return;
				}
				const jsonOutput = JSON.parse(stdout);
				var fileLocation = jsonOutput._filename;
				console.log("Created: " + jsonOutput._filename);
				//console.log(jsonOutput);

				//mux ext
				var muxExt = jsonOutput.ext;

				//Youtube mp4a 
				if (jsonOutput.acodec == "mp4a.40.2" && jsonOutput.extractor == "youtube"){
					console.log("Special: extractor = YouTube + acodec = mp4a.40.2 => muxExt = mkv");
					muxExt = "mkv";

					fileLocation = fileLocation.substring(0, fileLocation.length-jsonOutput.ext.length) + muxExt;
				}

				//Youtube opus 
				if (jsonOutput.acodec == "opus" && jsonOutput.extractor == "youtube"){
					console.log("Special: extractor = YouTube + acodec = opus => muxExt = mkv");
					muxExt = "mkv";

					fileLocation = fileLocation.substring(0, fileLocation.length-jsonOutput.ext.length) + muxExt;
				}

				const body = fs.createReadStream(fileLocation)
				const params = {
					Bucket: s3bucket,
					Key: jsonOutput.title + "_" + uuidv4() + "." + muxExt,
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