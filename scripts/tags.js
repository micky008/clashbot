const { SlashCommandBuilder } = require('discord.js');
const { clash_token } = require('../config.json');
const https = require('node:https');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tags')
		.setDescription('connaitres les tags du clan'),
	async execute(interaction) {
		
		let montext ={ "content": "mon text", "embeds":[] };
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
						
			res.on('data', async chunk => {
				fullJson += chunk;
			});
			res.on('end', async () => {				
				let players = JSON.parse(fullJson).items;				
				let resString = "Voici TOUS les tags des joueurs du clans\n\n";		
				let resEmbeded="";
				for (let player of players) {
					resEmbeded += `${player.name}: ${player.tag}\n`;
				}
				let emb = new Embeded("all tags", resEmbeded);
				resString+="\n";
				montext.content = resString;
				montext.embeds.push(emb)
				//const data = await rest.post(Routes.channelMessages(test_channel),{ body: montext });
				//console.log('Message send');
				await interaction.reply(montext);
			});			
		});
		reqGet.end();
		reqGet.on('error', function(e) {
			console.error(e);
		});
				
	},
};


class Message {
	content;
	embeds;
}
 
class Embeded {
	title //string
	type //article
	description//string
	color //int
	constructor(title, descr){
		this.title = title;
		this.type = "article";
		this.description = descr;
		this.color = 0xEFFF00;
	}
}