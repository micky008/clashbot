const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token, channel_all } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');


// Create a new client instance
//https://discord.com/developers/docs/events/gateway#list-of-intents
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'scripts');
const commandFolders = fs.readdirSync(foldersPath);

for (const file of commandFolders) {
	const filePath = path.join(foldersPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		}
	}
});

client.on(Events.GuildMemberAdd, member => { //member=GuildMember
	let username = member.user.globalName;
	//get client
	let client = member.client;
	//get channel
	client.channels.fetch(channel_all)
		.then(channel => {
			let message = "bienvenue " + username + ", tu es à la fois chez les fous, et... non c'est tout en fait\n"
			message += "Dans ce message de bienvenue, c'est juste pour te dire que:\n"
			message += "- Ici c'est chill (comme dans le jeux:D )\n";
			message += "- On a un bot dédier, et que pour 'communiquer' avec le bot, c'est le chan 'question-au-bot' et il faut regarder le post épinglé.\n"
			message += "(le code pour les curieux) https://github.com/micky008/clashbot\n"
			channel.send(message);
		})
		.catch(console.error);

});

client.login(token);