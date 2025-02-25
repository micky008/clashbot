const { REST, Routes } = require('discord.js');
const { test_channel, token } = require('./config.json');

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
	try {
		let montext ={ "content": "mon text"   };
		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.post(
			Routes.channelMessages(test_channel),
			{ body: montext },
		);

		console.log('Message send');
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
