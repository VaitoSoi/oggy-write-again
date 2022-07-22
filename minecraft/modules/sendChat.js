const Discord = require('discord.js')

/**
 * Send to all server
 * @param {Discord.Client} client 
 * @param {Discord.MessageEmbed} embed 
 * @param {Boolean} notify
 */
module.exports = (client, embed, notify) => {
    const db = require('../../models/option')
    client.guilds.cache.forEach(async (guild) => {
        const data = await db.findOne({
            'guildid': guild.id
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
            notify == true
                ? embed.description
                    ? `\`--------------------------\`\n` +
                    `${embed.description.split('\n').map(str => '**Notify »** ' + str).join('\n')}\n` +
                    `\`--------------------------\``
                    :`\`--------------------------\`\n` +
                    `${embed.title.split('\n').map(str => '**Notify »** ' + str).join('\n')}` + 
                    `\`--------------------------\``
                : embed.description
                    ? embed.description
                    : embed.title
        )
    })
}