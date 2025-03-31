const { SlashCommandBuilder } = require('discord.js');
const { clash_token } = require('../config.json');
const https = require('node:https');
const { readFileSync } = require('node:fs');
const { ban }  = require("../classes/ban.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kohlanta')
		.setDescription('Qui sera banni ?'),
	async execute(interaction) {

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

		let fullJson = ""

		var reqGet = https.request(optionsget, res => {
			let donnepas = [];
			let inactifs = [];
			res.on('data', async chunk => {
				fullJson += chunk;
			});
			res.on('end', async () => {
				let resString = ban(fullJson);
				await interaction.reply(resString);
			});
		});
		reqGet.end();
		reqGet.on('error', function (e) {
			console.error(e);
		});

	},
};

