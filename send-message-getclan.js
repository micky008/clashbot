const { clash_token } = require('./config.json');
const https = require('node:https');
const { openSync, writeSync, readFileSync, closeSync } = require('node:fs');

(async () => {
	try {
		var header = {
			"Authorization": "Bearer " + clash_token
		};

		var optionsget = {
			host: 'api.clashroyale.com',
			port: 443,
			path: '/v1/clans/%23#ID/members', // the rest of the url with parameters if needed
			method: 'GET',
			headers: header
		};
		optionsget.path = optionsget.path.replace("#ID", "28JCGQ0");

		let fullJson = "";
		var reqGet = https.request(optionsget, res => {
			res.on('data', async chunk => {
				fullJson += chunk;
			});
			res.on('end', async () => {
				let handle = openSync("./clan.json", "w+");
				let players = JSON.parse(fullJson)["items"];
				writeSync(handle, JSON.stringify(players));
				closeSync(handle);				
			});

		});

		reqGet.end();
		reqGet.on('error', function (e) {
			console.error(e);
		});

	} catch (error) {
		console.error(error);
	}
})();
