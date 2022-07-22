const { Message } = require('discord.js')

module.exports = {
    name: 'messageCreate',
    /**
     * Message event
     * @param {Message} message 
     */
    async run(message) {
        const client = message.client
        if (message.author.bot) return
        let prefix = process.env.prefix
        const db = require('../../models/option')
        const data = await db.findOne({
            guildid: message.guildId
        })
        if (data
            && data.config.prefix
            && data.config.prefix != '') prefix = data.config.prefix
        if (!message.content.startsWith(prefix)) return
        const args = message.content.slice(prefix.length).split(/ +/g)
        const cmd = client.message.get(args[0])
        if (!cmd) return
        cmd.run(client, message, args)
    }
}