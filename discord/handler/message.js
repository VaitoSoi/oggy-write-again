const fs = require('node:fs');
const { Client } = require('discord.js')

/**
 * Message handler
 * @param {Client} client 
 */

module.exports = (client) => {
    fs.readdirSync('./discord/message_commands/').forEach((dir) => {
        fs.readdirSync(`./discord/message_commands/${dir}/`).forEach((file) => {
            const command = require(`../message_commands/${dir}/${file}`);
            if (!command.name) return
            client.message.set(command.name, command)
            if (command.aliases
                && Array.isArray(command.aliases))
                command.aliases.forEach(
                    a => client.aliases.set(a, command.name)
                )
        })
    })

    console.log('[CLIENT]\x1b[32m LOADED MESSAGE_COMMANDS\x1b[0m');
}