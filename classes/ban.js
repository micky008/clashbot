const { readFileSync } = require('node:fs');

module.exports = {
		ban(fullJson){
			let donnepas = [];
			let inactifs = [];
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
				resString += "Qui seront les prochains élus ?";
				return resString;
		}
};
