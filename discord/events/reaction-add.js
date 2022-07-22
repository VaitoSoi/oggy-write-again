const Discord = require('discord.js')

module.exports = {
    name: 'messageReactionAdd',
    /**
     * 
     * @param {Discord.MessageReaction} reaction 
     * @param {Discord.User} user 
     */
    async run(reaction, user) {
        const client = reaction.client
        if (user.bot) return
        const db = require('../../models/option')
        const data = await db.findOne({
            guildid: reaction.message.guildId
        })
        if (!data) return
        if (reaction.message.id != data.config.messages.restart
            || reaction.message.id != data.config.messages.status) return
        if (reaction.message.id == data.config.messages.status) {
            reaction.message.edit({
                embeds: [
                    new Discord.MessageEmbed()
                        .setTitle('⏳ Đang tải...')
                ]
            })
            const util = require('minecraft-server-util')
            const embed = new Discord.MessageEmbed()
                .setAuthor({
                    name: `${client.user.tag} Server Utils`,
                    iconURL: client.user.displayAvatarURL()
                })
                .setTitle(`\`2Y2C\` Status`)
                .setFooter({
                    text: `${message.author.tag}`,
                    iconURL: message.author.displayAvatarURL()
                })
                .setTimestamp()
                .setThumbnail(`https://eu.mc-api.net/v3/server/favicon/2y2c.org`)
            const now = Date.now()
            util.status('2y2c.org', 25565)
                .then((response) => {
                    embed
                        .setColor('GREEN')
                        .setDescription(
                            `**Status:** 🟢 Online\n` +
                            `**Player:** ${response.players.online}/${response.players.max}\n` +
                            `**Version:** ${response.version.name}\n` +
                            `**Ping:** ${Date.now() - now}\n` +
                            `**MOTD:** \n>>> ${response.motd.clean}\n`
                        )
                })
                .catch(e => {
                    embed
                        .setColor('RED')
                        .setDescription(
                            '**Status:** 🔴 Offline\n' +
                            'Phát hiện lỗi khi lấy dữ liệu từ server:' +
                            '```' + `${e}` + '```'
                        )
                })
            reaction.message.edit({
                embeds: [embed]
            })
        } else if (reaction.message.id == data.config.messages.status) {
            
        }
    }
}