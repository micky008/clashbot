const { readFileSync } = require('node:fs');

module.exports = {
	ban(fullJson) {
		let donnepas = [];
		let inactifs = [];
		let regexp = /([0-9]{4})([0-9]{2})([0-9]{2})T.*/
		let players = JSON.parse(fullJson).items;
		for (let player of players) {
			if (player.donations == 0 && player.donationsReceived > 0) { //radin
				donnepas.push(player);
				continue;
			} else if (player.donations == 0 && player.donationsReceived == 0) { //parasites
				inactifs.push(player);
				continue;
			}
			let res = regexp.exec(player.lastSeen);
			let date = new Date(res[1], res[2] - 1, res[3]);
			let timestemp = date.getTime();
			let now = Date.now();
			if ((now - timestemp) >= 604800000) { //604800000 = 7 jours
				inactifs.push(player);
			}
		}

		let tableau = readFileSync("./clan.json", "utf-8");
		let vendrediPlayers = JSON.parse(tableau);
		let resString = "";
		if (inactifs.length > 0) {
			resString += "Dans la catégorie 'Donne pas et ramasse pas' :face_in_clouds: les nominés sont:\n";
			for (let player of inactifs) {
				if (vendrediPlayers.findIndex(ply => ply.tag == player.tag) > 0) {
					resString += player.name + "\n";
				}
			}
			resString += "\n";
		}
		if (donnepas.length > 0) {
			resString += "Dans la catégorie 'Ne donne pas mais ramasse':black_joker: :head_shaking_horizontally: les nominés sont:\n";
			for (let player of donnepas) {
				if (vendrediPlayers.findIndex(ply => ply.tag == player.tag) > 0) {
					resString += player.name + "\n";
				}
			}
			resString += "\n";
			resString += "Qui seront les prochains élus ?";
		}
		if (inactifs.length == 0 && donnepas.length == 0){
			resString = "Bien joué, tout le monde joue le jeu :heart:\n";
		}
		return resString;
	}
};
