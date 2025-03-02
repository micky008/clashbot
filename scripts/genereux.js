const { SlashCommandBuilder } = require('discord.js');
const { clash_token } = require('../config.json');
const https = require('node:https');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('genereux')
        .setDescription('Qui est le plus généreux de la bande !')        
    ,
    async execute(interaction) {
       
        let header = {
            "Authorization": "Bearer " + clash_token
        };

        let optionsget = {
            host : 'api.clashroyale.com',
			port : 443,
			path : '/v1/clans/%23#ID/members', // the rest of the url with parameters if needed
			method : 'GET',
			headers: header
        };
        optionsget.path = optionsget.path.replace("#ID", "28JCGQ0");
        //LVLURYQ
        let fullJson = "";
        var reqGet = https.request(optionsget, res => {

            res.on('data', chunk => {
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
				await interaction.reply(resStr);
            });
        });

        reqGet.end();
        reqGet.on('error', function (e) {
            console.error(e);
        });

    },
};


class Player {
    tag;//string
    name;//string
	donations;//number
}