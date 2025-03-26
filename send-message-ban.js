const { REST, Routes } = require('discord.js');
const { channel_all, token, clash_token } = require('./config.json');
const https = require('node:https');
const { readFileSync } = require('node:fs');

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
			let donnepas = [];
			let inactifs = [];
			res.on('data', async chunk => {
				fullJson += chunk;
			});
			res.on('end', async () => {
				let players = JSON.parse(fullJson).items;
				for (let player of players) {
					if (player.donations == 0 && player.donationsReceived > 0) { //radin
						donnepas.push(player)
					} else if (player.donations == 0 && player.donationsReceived == 0) { //parasites
						inactifs.push(player)
					}
				}

				let tableau = readFileSync("./clan.json", "utf-8");
				let vendrediPlayers = JSON.parse(tableau);

				let resString = "Dans la catégorie 'Donne pas et ramasse pas' :face_in_clouds: les nominés sont:\n";
				for (let player of inactifs) {
					if (vendrediPlayers.findIndex(ply => ply.tag == player.tag) > 0) {
						resString += player.name + "\n";
					}
				}
				resString += "\n";
				resString += "Dans la catégorie 'Ne donne pas mais ramasse':black_joker: :head_shaking_horizontally: les nominés sont:\n";
				for (let player of donnepas) {
					if (vendrediPlayers.findIndex(ply => ply.tag == player.tag) > 0) {
						resString += player.name + "\n";
					}
				}
				resString += "\n";
				resString += "Qui seront les prochains élus ?"
				montext.content = resString;
				const data = await rest.post(Routes.channelMessages(channel_all), { body: montext });
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
