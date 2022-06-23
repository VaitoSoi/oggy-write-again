const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const token = process.env.TOKEN
const fs = require('node:fs');

module.exports = (client) => {
    const commands = [];
    const commandFiles = []

    fs.readdirSync('./slash_commands/').forEach((dir) => {
        fs.readdirSync(`./slash_commands/${dir}/`).forEach((file) => {
            const command = require(`../slash_commands/${dir}/${file}`);
            commands.push(command.data.toJSON());
            client.slash.set(command.data.name, command)
        })
    })

    const rest = new REST({ version: '9' }).setToken(token);

    (async () => {
        try {
            console.log('[CLIENT]\x1b[33m LOADING SLASH_COMMANDS\x1b[0m');

            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: commands },
            );

            console.log('[CLIENT]\x1b[32m LOADED SLASH_COMMANDS\x1b[0m');
        } catch (error) {
            console.error(`[CLIENT]\x1b[31m LOAD ERROR: ${error}\x1b[0m`);
        }
    })();
}