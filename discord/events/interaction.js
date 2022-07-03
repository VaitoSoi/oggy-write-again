const { CommandInteraction } = require('discord.js')
const fs = require('node:fs')

module.exports = {
    name: 'interactionCreate',
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async run (interaction) {
        const client = interaction.client;
        if (!interaction.isCommand()) return
        const files = [] 
        fs.readdirSync('./discord/slash_commands/server/').filter(f => f.endsWith('js')).map((f) => f.replace('.js', '')).forEach((file) => {
            const cmd = require(`../slash_commands/server/${file}`)
            if (!cmd) return
            files.push(cmd.data.name)
        })
        // if (files.includes(interaction.commandName)) return
        await interaction.deferReply()
        client.slash.get(interaction.commandName).run(interaction)
    }
}