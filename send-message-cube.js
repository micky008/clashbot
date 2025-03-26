const { REST, Routes } = require('discord.js');
const { channel_spam, token } = require('./config.json');

const rest = new REST().setToken(token);
let montext = { "content": "mon text" };
montext.content = "Chaque semaine 1 cube 1* à récupérer ici :\nhttps://store.supercell.com/fr/clashroyale\nDites merci a tortugua ! pour le rappel";
rest.post(Routes.channelMessages(channel_spam), { body: montext }).then(res=>{
     console.log('Message Cube send');
});

