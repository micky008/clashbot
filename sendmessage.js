const { REST, Routes } = require('discord.js');
const { test_channel, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
	try {
		

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.post(
			Routes.channelMessages(test_channel),
			{ body: "Mon text" },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
