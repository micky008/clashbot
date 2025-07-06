const { REST, Routes } = require('discord.js');
const { channel_all, channel_test,token, clash_token } = require('./config.json');
const https = require('node:https');

const { ban }  = require("./classes/ban.js");
const { genereux }  = require("./classes/genereux.js");

const rest = new REST().setToken(token);

(async () => {
	try {
		let montext = { "content": "mon text" };
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
				let resString = ban(fullJson);
				let donnators = genereux(fullJson);
//				resString += "\n\n\n\nA l'inverse:\n";
//				resString += donnators;
				montext.content = resString;
				await rest.post(Routes.channelMessages(channel_all), { body: montext });
				montext.content = donnators;
				await rest.post(Routes.channelMessages(channel_all), { body: montext });
				//const data = await rest.post(Routes.channelMessages(channel_test), { body: montext });
				console.log('Message send');
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
