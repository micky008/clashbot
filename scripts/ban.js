const { SlashCommandBuilder } = require('discord.js');
const { clash_token } = require('../config.json');
const https = require('node:https');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kohlanta')
		.setDescription('Qui serra banni ?'),
	async execute(interaction) {
		
		var playersWithNoDon = [];

		var header = {
			"Authorization": "Bearer " + clash_token	
		};

		var optionsget = {
			host : 'api.clashroyale.com',
			port : 443,
			path : '/v1/clans/%23#ID/members', // the rest of the url with parameters if needed
			method : 'GET',
			headers: header
		};
		optionsget.path = optionsget.path.replace("#ID", "28JCGQ0");
		
		let fullJson = ""
		
		var reqGet = https.request(optionsget, res => {
			playersWithNoDon = [];
			res.on('data', async chunk => {
				fullJson += chunk;
			});
			res.on('end', async () => {
				let players = JSON.parse(fullJson).items;
				for (let player of players) {
					let res = "";	
					if (player.donations == 0) {
						res = player.name;
						if (player.donationsReceived > 0) {
							res += " :point_left:";
						}
					}
					if (res == "") {
						continue;
					}
					playersWithNoDon.push(res)
				}
				let resString = "Et les nominés sont:\n";
				for (let playerName of playersWithNoDon) {
					resString += playerName + "\n";
				}
				resString+="\n";
				resString += "Qui serront les prochains élu ?"
				await interaction.reply(resString);
			});
			
		});

		reqGet.end();
		reqGet.on('error', function(e) {
			console.error(e);
		});
				
	},
};

