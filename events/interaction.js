const { CommandInteraction } = require('discord.js')

module.exports = {
    name: 'interactionCreate',
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async run (interaction) {
        const client = interaction.client;
        await interaction.deferReply()
        client.slash.get(interaction.commandName).run(interaction)
    }
}