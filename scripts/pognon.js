const { SlashCommandBuilder } = require('discord.js');
const { clash_token } = require('../config.json');
const https = require('node:https');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pognon')
		.setDescription('Savoir combien de gold ta dépenser dans ce jeux')
		.addStringOption(option =>
			option
				.setName('tag')
				.setDescription('le tag du joueur')
				.setRequired(true)),		
	async execute(interaction) {
		let tag = interaction.options.getString('tag');
		if (tag.startsWith("#")) {
			tag = tag.replace('#','');
		}
		tag = tag.toUpperCase();
		let header = {
			"Authorization": "Bearer " + clash_token
		};

		let optionsget = {
			host : 'api.clashroyale.com',
			port : 443,
			path : '/v1/players/%23#ID', // the rest of the url with parameters if needed
			method : 'GET',
			headers: header
		};
		optionsget.path = optionsget.path.replace("#ID", tag);
		//LVLURYQ //micky008
		
		let fulljson ="";
		
		var reqGet = https.request(optionsget, res => {
			
			res.on('data', chunk => {
				fulljson += chunk;			
			});
			res.on('end', async () => {
				let player = JSON.parse(fulljson);
				let pognon = new Pognon(player);
				let res = pognon.getPognon();
				await interaction.reply(res);
				
			});

		});
		reqGet.end();		
		reqGet.on('error', function(e) {
			console.error(e);
		});

	}
};


 class Pognon {
	
	player;
	cards;
	
	constructor(p){
		this.player = p;
		this.cards = p.cards;
		this.cards.push(...p.supportCards);
	}
	
	getPognon() {
		let todayPo = 0;
		let costpayed = 0;
		let costAllMax = 0;
		for (let c of this.cards) {
			let card = FactoryCard.getCarRarityCard(c);
			costpayed += card.getManyCardCost();
			costAllMax += card.getMaxPOForOneCard();
			if (card.haveEnoughCardForNextStep()) {
				todayPo += card.getPOForNextStep();
			}
		}
		let formatteur = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
		res = player.name+"\n";
		res += "Cout Max de tts les Cartes: " + formatteur.format(costAllMax);
		res += "Thunes deja investie: " + formatteur.format(costpayed);
		res += "Reste a mettre: " + formatteur.format(costAllMax - costpayed);
		res += "\n";
		res +="Total de po a mettre pour carte passable: " +  formatteur.format(todayPo);
		return res;
	} 
	
}

 class AbstractCard {
	
	card; //Card
	type; //String
	tab;//Tableaux

   constructor(card, type, tab) {
        this.card = card;
        this.type = type;
        this.tab = tab;
    }

    /**
     * Fais double emplois ca depends du tableau. getManyCardCost et
     * getNbDeCarteMis
     *
     * @param tabCarte
     * @return
     */
    getHowMis( tabCarte) {
        let max = this.card.level > this.card.maxLevel ? this.card.maxLevel : this.card.level;
        let res = 0;
        for (let i = 0; i < max; i++) {
            res += tabCarte[i];
        }
        return res;
    }

     getPOForNextStep( tabPo) {
        return tabPo[this.card.level];
    }

     haveEnoughCardForNextStep(tabCarte) {
        if (this.card.level >= this.card.maxLevel) {
            return false;
        }
        //nombre de carte < prochain palier
        if (this.card.count < tabCarte[this.card.level + 1]) {
            return false;
        }
        return true;
    }

     getMaxPOForOneCard() {
        return this.tab.max_po;
    }

     haveEnoughCardForNextStep() {
        return this.haveEnoughCardForNextStep(this.tab.nb);
    }

     getPOForNextStep() {
        return this.getPOForNextStep(this.tab.po);
    }

     getManyCardCost() {
        return this.getHowMis(this.tab.po);
    }

     getNbMaxCard() {
        return this.tab.max_nb;
    }

     getNbDeCarteMis() {
        return this.getHowMis(this.tab.nb);
    }

   
     getRarityType() {
        return this.type;
    }

   
}

class Tableaux {

         po; //int[]
         nb;//int[]
         max_po;//int
         max_nb;//int

       constructor( po,  nb,  maxPo,  maxNb) {
            this.po = po;
            this.nb = nb;
            this.max_po = maxPo;
            this.max_nb = maxNb;
        }
    }

 class FactoryCard {

    static getCarRarityCard(card) {
        switch (card.rarity) {
            case CommonCard.TYPE:
                return new CommonCard(card);
            case RareCard.TYPE:
                return new RareCard(card);
            case EpicCard.TYPE:
                return new EpicCard(card);
            case LegendCard.TYPE:
                return new LegendCard(card);
            case ChampCard.TYPE:
                return new ChampCard(card);
        }
        return undefined;
    }

}


 class ChampCard extends AbstractCard {

     static   carte_champion_po = [0, 35000, 75000, 100000];
     static   carte_champion_nb = [0, 1, 2, 8, 20];
     static   max_champion_po = 210000;
     static   max_champion_carte = 31;
     static   TYPE = "champion";

     static  tab = new Tableaux(ChampCard.carte_champion_po, ChampCard.carte_champion_nb, ChampCard.max_champion_po, ChampCard.max_champion_carte);

   constructor(card) {
        super(card, ChampCard.TYPE, ChampCard.tab);
    }

}

 class CommonCard extends AbstractCard {

      static  carte_commune_po = [0, 5, 20, 50, 150, 400, 1000, 2000, 4000, 8000, 15000, 35000, 75000, 100000];
      static  carte_commune_nb = [0, 1, 2, 4, 10, 20, 50, 100, 200, 400, 800, 1000, 1500, 3000, 5000];
      static  max_commune_po = 240625;
      static  max_commune_carte = 12087;
     static   TYPE = "common";

     static  tab = new Tableaux(CommonCard.carte_commune_po, CommonCard.carte_commune_nb, CommonCard.max_commune_po, CommonCard.max_commune_carte);

    constructor(card) {
        super(card, CommonCard.TYPE, CommonCard.tab);
    }

}

 class EpicCard extends AbstractCard {

     static   carte_epic_po = [0, 400, 2000, 4000, 8000, 15000, 35000, 75000, 100000];
     static   carte_epic_nb = [0, 1, 2, 4, 10, 20, 40, 50, 100, 200];
     static   max_epic_po = 239400;
     static   max_epic_carte = 427;
     static   TYPE = "epic";

     static tab = new Tableaux(EpicCard.carte_epic_po, EpicCard.carte_epic_nb, EpicCard.max_epic_po, EpicCard.max_epic_carte);

    constructor(card) {
        super(card, EpicCard.TYPE, EpicCard.tab);
    }

}

 class LegendCard extends AbstractCard {

     static   carte_legendaire_po = [0, 5000, 15000, 35000, 75000, 100000];
     static   carte_lengendaire_nb = [0, 1, 2, 4, 6, 10, 20];
     static   max_legendaire_po = 230000;
     static   max_legendaire_carte = 43;
     static   TYPE = "legendary";

      static  tab = new Tableaux(LegendCard.carte_legendaire_po, LegendCard.carte_lengendaire_nb, LegendCard.max_legendaire_po, LegendCard.max_legendaire_carte);
   
    
    constructor(card) {
        super(card, LegendCard.TYPE, LegendCard.tab);
    } 
    
}

 class RareCard extends AbstractCard {

     static   carte_rare_po = [0, 50, 150, 400, 1000, 2000, 4000, 8000, 15000, 35000, 75000, 100000];
     static   carte_rare_nb = [0, 1, 2, 4, 10, 20, 50, 100, 200, 400, 500, 750, 1250];
     static   max_rare_po = 240600;
     static   max_rare_carte = 3287;
     static   TYPE = "rare";

     static tab = new Tableaux(RareCard.carte_rare_po, RareCard.carte_rare_nb, RareCard.max_rare_po, RareCard.max_rare_carte);

    constructor(card) {
        super(card, RareCard.TYPE, RareCard.tab);
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
