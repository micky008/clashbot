const { clash_token } = require('./config.json');
const https = require('node:https'); 

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

var reqGet = https.request(optionsget, function(res) {
    console.log("statusCode: ", res.statusCode);
    playersWithNoDon = [];
    res.on('data', function(d) {
		let players = JSON.parse(d).items;
		for (let player of players) {
			if (player.donations == 0) {
				let res = player.name;				
				if (player.donationsReceived > 0){
					res += ":point_left:"
				}
				res += "\n"
				playersWithNoDon.push(res)
				//process.stdout.write(player.name+'\n')
			}
		}
		process.stdout.write("en 1 fois");
		for (let player of playersWithNoDon){
			process.stdout.write(player+"\n");
		}
		
    });
	
});

reqGet.end();
reqGet.on('error', function(e) {
    console.error(e);
});