const mineflayer = require('mineflayer')
const Discord = require('discord.js')

module.exports = {
    name: 'messageCreate',
    discord: true,
    /**
     * 
     * @param {mineflayer.Bot} bot 
     * @param {Discord.Message} message 
     */
    run (bot, message) {
        const db = require('../../models/option')
        const data = await db.findOne({
            'guild.id': message.guildId
        })
        if (!data) return
        if (message.channelId !== data.config.channels.livechat) return
        try {
            bot.chat(`<${message.author.tag}> ${message.content.trim}`)
            message.react('✅')
        } catch (e) {
            message.react('🛑')
        }
    }
}