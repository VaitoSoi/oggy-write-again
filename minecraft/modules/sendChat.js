const Discord = require('discord.js')

/**
 * Send to all server
 * @param {Discord.Client} client 
 * @param {Discord.MessageEmbed} embed 
 */
module.exports = (client, embed) => {
    const db = require('../../models/config')
    client.guilds.cache.forEach(async (guild) => {
        const data = await db.findOne({
            'guild_id': guild_id
        })
        if (!data) return
        const channel = guild.channels.cache.get(data.config.channels.livechat)
        if (!channel || !channel.isText()) return
        if (!guild.me.permissionsIn(channel).has('SEND_MESSAGES')) return
        if (guild.me.permissionsIn(channel).has('EMBED_LINKS')
            && data.config.chatType.toLowerCase() === 'embed') channel.send({
                embeds: [
                    embed
                ]
            })
        else channel.send(
            embed.description ?
                embed.description
                : embed.title
        )
    })
}