const { REST, Routes } = require('discord.js');
const { channel_all,channel_test, token,clash_token } = require('./config.json');
const https = require('node:https');

const rest = new REST().setToken(token);

(async () => {
	try {
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
			let donnepas = [];
			let inactifs = [];
			res.on('data', async chunk => {
				fullJson += chunk;
			});
			
			res.on('end', async () => {
				let players = JSON.parse(fullJson)["items"];
				players.sort( (a, b) => {
					if (a.donations > b.donations){
						return -1;
					}else if (a.donations < b.donations){
						return 1;
					}
					return 0;
				});
               
			    let resStr = "Les 5 (Jean-marc) Généreux sont:\n";
				for (let i=0;i<5;i++){
					resStr += `${players[i].name} : ${players[i].donations}\n`;
				}
				resStr += "Merci a vous les gars ! :saluting_face:"
				//return resStr;
				montext.content = resStr;
				//montext.embeds.push(emb)
				const data = await rest.post(Routes.channelMessages(channel_test),{ body: montext });
				console.log('Message send');
			});
			
		});

		reqGet.end();
		reqGet.on('error', function(e) {
			console.error(e);
		});
				
	} catch (error) {
		console.error(error);
	}
})();

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