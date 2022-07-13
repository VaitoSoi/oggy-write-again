const Discord = require('discord.js')

/**
 * Send to all server
 * @param {Discord.Client} client 
 * @param {Discord.MessageEmbed} embed 
 * @param {Boolean} now
 */
module.exports = (client, time, now) => {
    const db = require('../../models/config')
    client.guilds.cache.forEach(async (guild) => {
        const data = await db.findOne({
            'guild_id': guild_id
        })
        if (!data) return
        const channel = guild.channels.cache.get(data.config.channels.restart)
        if (!channel || !channel.isText()) return
        if (!guild.me.permissionsIn(channel).has('SEND_MESSAGES')) return
        const role = guild.roles.cache.get(data.config.roles.restart)
        if (!role) return
        if (!now) channel.send({
            content: `${role} | Server sẽ khởi động trong vòng ${time} nữa...`,
            allowedMentions: {
                roles: [role]
            }
        })
        else channel.send({
            content: `${role} | Server đang khởi động lại...`,
            allowedMentions: {
                roles: [role]
            }
        })
    })
}