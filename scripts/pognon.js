const { SlashCommandBuilder } = require('discord.js');
const { clash_token } = require('../config.json');
const https = require('node:https');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pognon')
        .setDescription('Savoir combien de gold ta dépensé dans ce jeu')
        .addStringOption(option =>
            option
                .setName('tag')
                .setDescription('le tag du joueur')
                .setRequired(true))
    ,
    async execute(interaction) {
        let tag = interaction.options.getString('tag');
        if (tag.startsWith("#")) {
            tag = tag.replace('#', '');
        }
        tag = tag.toUpperCase();

        let myhttp = new MyClashHttp();
        myhttp.getPlayer(tag).then(async (fullJson) => {
            let player = JSON.parse(fullJson);
            let pognon = new Pognon(player);
            let res = await pognon.getPognon();
            await interaction.reply(res);
        }).catch(async (err) => {
            await interaction.reply("le tag " + tag + " n'existe pas");
        });
    }
};

class Pognon {

    player;
    cards; //PlayedCarte

    constructor(p) {
        this.player = p;
        this.cards = p.cards;
        this.cards.push(...p.supportCards);
    }


    calculCost(card, tab) { //card = PlayedCard
        let res = 0;
        let max = card.level > card.maxLevel ? card.maxLevel : card.level;
        for (let i = 0; i < max; i++) {
            res += tab[i];
        }
        return res;
    }

    calculCartePo(card, tabPo, tabCarte) {
        let res = 0;
        if (card.level >= card.maxLevel) {
            return 0;
        }
        //nombre de carte < prochain palier
        if (card.count < tabCarte[card.level + 1]) {
            return 0;
        }
        return tabPo[card.level];
    }

    howManyCostCards(cards) {
        let pos = [];
        let nbs = [];
        let costpayed = 0;
        let todayPo = 0;
        for (let card of cards) {
            switch (card.rarity) {
                case "common":
                    pos = RefCards.carte_commune_po;
                    nbs = RefCards.carte_commune_nb;
                    break;
                case "rare":
                    pos = RefCards.carte_rare_po;
                    nbs = RefCards.carte_rare_nb;
                    break;
                case "epic":
                    pos = RefCards.carte_epic_po;
                    nbs = RefCards.carte_epic_nb;
                    break;
                case "legendary":
                    pos = RefCards.carte_legendaire_po;
                    nbs = RefCards.carte_lengendaire_nb;
                    break;
                case "champion":
                    pos = RefCards.carte_champion_po;
                    nbs = RefCards.carte_champion_nb;
                    break;
            }
            costpayed += this.calculCost(card, pos);
            todayPo += this.calculCartePo(card, pos, nbs);
        }
        let res = [];
        res[0] = costpayed;
        res[1] = todayPo;
        return res;
    }


    async getPognon() { //promise<string>
        let res = this.howManyCostCards(this.cards);
        let myhttp = new MyClashHttp();
        let costAllMax = await myhttp.getCostAllCards();
        let formatteur = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
        let resStr = this.player.name + "\n";
        resStr += "Cout Max de tts les Cartes: " + formatteur.format(costAllMax) + "\n";
        resStr += "Thunes deja investie: " + formatteur.format(res[0]) + "\n";
        resStr += "Reste a mettre: " + formatteur.format(costAllMax - res[0]) + "\n";
        resStr += "\n";
        resStr += "Total de po à mettre pour les cartes prêtes à monter de niveau: " + formatteur.format(res[1]) + "\n";
        return Promise.resolve(resStr);
    }

}

class Player {
    tag;//string
    name;//string
    cards; //PlayedCard[]
    supportCards;//PlayedCard[]
}

class Card {
    name; //string
    maxLevel;//int
    rarity;//string
}

class PlayedCard extends Card {
    level;//int
    count;//int
}

class RefCards {
    //merci https://royaleapi.com/blog/level-16-and-economy-changes-2025-q4
    static carte_commune_po = [0, 5, 20, 50, 150, 400, 1000, 2000, 4000, 8000, 15000, 25000, 40000, 60000, 90000,120000];
    static carte_commune_nb = [0, 1, 2, 4, 10, 20, 50, 100, 200, 400, 800, 1000, 1500, 2500,3500,5500,7500];
    static max_commune_po = 365625;
    static max_commune_carte = 23087;

    static carte_rare_po = [0, 50, 150, 400, 1000, 2000, 4000, 8000, 15000, 35000, 75000, 100000];
    static carte_rare_nb = [0, 1, 2, 4, 10, 20, 50, 100, 200, 400, 500, 750, 1250];
    static max_rare_po = 240600;
    static max_rare_carte = 3287;

    static carte_epic_po = [0, 50, 150, 400, 1000, 2000, 4000, 8000, 15000, 25000,40000,60000,90000,120000];
    static carte_epic_nb = [0, 1, 2, 4, 10, 20, 50, 100, 200, 300,400,550,750,1000,1400];
    static max_epic_po = 365600;
    static max_epic_carte = 4787;

    static carte_legendaire_po = [0, 5000, 15000, 25000,40000,60000,90000,120000];
    static carte_lengendaire_nb = [0, 1, 2, 4, 6, 9,12,14,20];
    static max_legendaire_po = 355000;
    static max_legendaire_carte = 68;

    static carte_champion_po = [0, 25000,40000,60000,90000,120000];
    static carte_champion_nb = [0, 1, 2, 5,8,11,15];
    static max_champion_po = 335000;
    static max_champion_carte = 42;

}

class MyClashHttp {
    getPlayer(tag) {//promise<string>,error
        return new Promise((resolve, reject) => {
            let header = {
                "Authorization": "Bearer " + clash_token
            };
            let optionsget = {
                host: 'api.clashroyale.com',
                port: 443,
                path: '/v1/players/%23#ID', // the rest of the url with parameters if needed
                method: 'GET',
                headers: header
            };
            optionsget.path = optionsget.path.replace("#ID", tag);
            //LVLURYQ
            let fullJson = "";
            var reqGet = https.request(optionsget, res => {
                if (res.statusCode == 404) {
                    reject("tag inconnue");
                    return;
                }

                res.on('data', chunk => {
                    fullJson += chunk;
                });
                res.on('end', () => {
                    resolve(fullJson);
                });
            });
            reqGet.end();
            reqGet.on('error', function (e) {
                console.error(e);
            });
        });
    }


    getCostAllCards() {//promise<number>,error
        return new Promise((resolve, reject) => {
            let header = {
                "Authorization": "Bearer " + clash_token
            };
            let optionsget = {
                host: 'api.clashroyale.com',
                port: 443,
                path: '/v1/cards', // the rest of the url with parameters if needed
                method: 'GET',
                headers: header
            };
            //LVLURYQ
            let fullJson = "";
            var reqGet = https.request(optionsget, res => {
                if (res.statusCode == 404) {
                    reject("tag inconnue");
                    return;
                }

                res.on('data', chunk => {
                    fullJson += chunk;
                });
                res.on('end', () => {
                    let items = JSON.parse(fullJson); //card[]
                    let max = 0;
		    let pos = 0;
		    let cards = items.items;
			cards.push(...items.supportItems)
                    for (let card of cards) {
                        switch (card.rarity) {
                            case "common":
                                pos = RefCards.max_commune_po;
                                break;
                            case "rare":
                                pos = RefCards.max_rare_po;
                                break;
                            case "epic":
                                pos = RefCards.max_epic_po;
                                break;
                            case "legendary":
                                pos = RefCards.max_legendaire_po;
                                break;
                            case "champion":
                                pos = RefCards.max_champion_po;
                                break;
                        }
                        max += pos;
                    }
                    resolve(max);
                });
            });
            reqGet.end();
            reqGet.on('error', function (e) {
                console.error(e);
            });
        });
    }

}


