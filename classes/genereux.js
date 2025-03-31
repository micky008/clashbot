
module.exports = {
	genereux(fullJson) {
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
		resStr += "Merci a vous les gars ! :saluting_face:";
		return resStr;
	}	
};