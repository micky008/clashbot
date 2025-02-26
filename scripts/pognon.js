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

            res.on('data', chunk => {
                fullJson += chunk;
            });

            res.on('end', async () => {
                let player = JSON.parse(fullJson);
                let pognon = new Pognon(player);
                let res = pognon.getPognon();
                await interaction.reply(res);
            });


        });

        reqGet.end();
        reqGet.on('error', function (e) {
            console.error(e);
        });

    },
};

class Pognon {

    player;
    cards;

    constructor(p) {
        this.player = p;
        this.cards = p.cards;
        this.cards.push(...p.supportCards);
    }


    calculCost(card, tab) {
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

    howManyCards(cards) {
        countCommon = 0;
        countRare = 0;
        countEpic = 0;
        countLegend = 0;
        countChamp = 0;
        pos = [];
        nbs = [];
        costpayed = 0;
        todayPo = 0;
        for (let card of cards) {
            switch (card.rarity) {
                case "common":
                    countCommon++;
                    pos = RefCards.carte_commune_po;
                    nbs = RefCards.carte_commune_nb;
                    break;
                case "rare":
                    countRare++;
                    pos = RefCards.carte_rare_po;
                    nbs = RefCards.carte_rare_nb;
                    break;
                case "epic":
                    countEpic++;
                    pos = RefCards.carte_epic_po;
                    nbs = RefCards.carte_epic_nb;
                    break;
                case "legendary":
                    countLegend++;
                    pos = RefCards.carte_legendaire_po;
                    nbs = RefCards.carte_lengendaire_nb;
                    break;
                case "champion":
                    countChamp++;
                    pos = RefCards.carte_champion_po;
                    nbs = RefCards.carte_champion_nb;
                    break;
            }
            costpayed += this.calculCost(card, pos);
            todayPo += this.calculCartePo(card, pos, nbs);
        }
        res = [];
        res[0] = countCommon * RefCards.max_commune_po;
        res[1] = countRare * RefCards.max_rare_po;
        res[2] = countEpic * RefCards.max_epic_po;
        res[3] = countLegend * RefCards.max_legendaire_po;
        res[4] = countChamp * RefCards.max_champion_po;
        res[5] = costpayed;
        res[6] = todayPo;
        return res;
    }


    getPognon() {

        let res[] = this.howManyCards(this.cards);
        let costAllMax = (res[0] + res[1] + res[2] + res[3] + res[4]);
        let formatteur = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
        let resStr = this.player.name + "\n";
        resStr += "Cout Max de tts les Cartes: " + formatteur.format(costAllMax) + "\n";
        resStr += "Thunes deja investie: " + formatteur.format(res[5]) + "\n";
        resStr += "Reste a mettre: " + formatteur.format(costAllMax - res[5]) + "\n";
        resStr += "\n";
        resStr += "Total de po à mettre pour les cartes prêtes à monter de niveau: " + formatteur.format(res[6]) + "\n";
        return resStr;
    }

}

class Player {
    tag;//string
    name;//string
    cards; //card[]
    supportCards;//card[]

}

class Card {
    name; //string
    level;//int
    maxLevel;//int
    rarity;//string
    count;//int
}

class RefCards {
    //merci https://clash.world/guides/card-upgrade-costs/
    static carte_commune_po = [0, 5, 20, 50, 150, 400, 1000, 2000, 4000, 8000, 15000, 35000, 75000, 100000];
    static carte_commune_nb = [0, 1, 2, 4, 10, 20, 50, 100, 200, 400, 800, 1000, 1500, 3000, 5000];
    static max_commune_po = 240625;
    static max_commune_carte = 12087;

    static carte_rare_po = [0, 50, 150, 400, 1000, 2000, 4000, 8000, 15000, 35000, 75000, 100000];
    static carte_rare_nb = [0, 1, 2, 4, 10, 20, 50, 100, 200, 400, 500, 750, 1250];
    static max_rare_po = 240600;
    static max_rare_carte = 3287;

    static carte_epic_po = [0, 400, 2000, 4000, 8000, 15000, 35000, 75000, 100000];
    static carte_epic_nb = [0, 1, 2, 4, 10, 20, 40, 50, 100, 200];
    static max_epic_po = 239400;
    static max_epic_carte = 427;

    static carte_legendaire_po = [0, 5000, 15000, 35000, 75000, 100000];
    static carte_lengendaire_nb = [0, 1, 2, 4, 6, 10, 20];
    static max_legendaire_po = 230000;
    static max_legendaire_carte = 43;

    static carte_champion_po = [0, 35000, 75000, 100000];
    static carte_champion_nb = [0, 1, 2, 8, 20];
    static max_champion_po = 210000;
    static max_champion_carte = 31;

}
