const { CommandInteraction, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { Bot } = require('mineflayer')
const util = require('minecraft-server-util')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('2y2c')
        .setDescription('Hiện tất cả các thông tin về 2y2c'),
    /**
    * 
    * @param {CommandInteraction} interaction 
    * @param {Bot} minecraftbot
    */
    run: async (interaction, minecraftbot) => {
        const client = interaction.client
        const embed = new MessageEmbed()
            .setAuthor({
                name: `${client.user.tag} Server Utils`,
                iconURL: client.user.displayAvatarURL()
            })
            .setTitle(`\`2Y2C\` Status`)
            .setFooter({
                text: `${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp()
            .setThumbnail(`https://mc-api.net/v3/server/favicon/2y2c.org`)
        const now = Date.now()
        await util.status('2y2c.org', 25565)
            .then((response) => {
                const ping = Date.now() - now
                embed
                    .setColor('GREEN')
                    .setDescription(
                        `**Status:** 🟢 Online\n` +
                        `**Player:** ${response.players.online}/${response.players.max}\n` +
                        `**Version:** ${response.version.name}\n` +
                        `**Ping:** ${ping}\n` +
                        `**MOTD:** \n>>> ${response.motd.clean}\n`
                    )
            })
            .catch(e => {
                embed
                    .setColor('RED')
                    .setDescription(
                        '**Status:** 🔴 Offline\n' +
                        'Phát hiện lỗi khi kết nối đến server:' +
                        '```' + `${e}` + '```'
                    )
            })
        interaction.editReply({
            embeds: [embed]
        })
    }
}