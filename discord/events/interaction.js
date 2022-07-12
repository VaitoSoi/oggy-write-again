const { CommandInteraction } = require('discord.js')
const fs = require('node:fs')

module.exports = {
    name: 'interactionCreate',
    /**
     * Interaction event
     * @param {CommandInteraction} interaction 
     */
    async run (interaction) {
        const client = interaction.client;
        if (!interaction.isCommand()) return
        await interaction.deferReply()
        client.slash.get(interaction.commandName).run(interaction)
    }
}