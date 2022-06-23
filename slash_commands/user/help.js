const { CommandInteraction, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const fs = require('node:fs')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Hiện tất cả lệnh bot có'),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */
    run: async (interaction) => {
        const client = interaction.client

        let dirs = fs.readdirSync('./slash_commands/')
        let categoies = []
        let option = []
        dirs.forEach((dir) => {
            let files = fs.readdirSync(`./slash_commands/${dir}/`).filter(file => file.endsWith('.js'))
            categoies.push({
                name: dir.toString(),
                cmds: files
            })
            option.push({
                label: (dir.toLowerCase() === 'user' ?
                    '🤵'
                    : dir.toLowerCase() === 'server' ?
                        '⛏'
                        : '') + ' ' +
                    dir[0].toUpperCase() + dir.slice(1).toLowerCase() ,
                description: `Có ${files.length} lệnh`+ ' | ' +
                    (dir.toLowerCase() === 'user' ?
                    'Là các lệnh cơ bản của bot'
                    : dir.toLowerCase() === 'server' ?
                        'Là các lệnh liên quan đến 2y2c.asia'
                        : ''),
                value: dir.toLowerCase()
            })
        })

        const embed = new MessageEmbed()
            .setAuthor({
                name: `${client.user.tag} Help Menu`,
                iconURL: client.user.displayAvatarURL()
            })
            .setDescription(
                'Các lệnh cơ bản: \n' +
                '> `/config`: Điều chỉnh các cài đặt của bot.\n' +
                '> `/botinfo`: Toàn bộ thông tin về bot.\n' +
                '> `/help`: Hiện menu này.\n' +
                'Dùng `/help <tên_lệnh>` để biết thông các thông về lệnh\n' +
                'Các link liên quan của Oggy:\n' +
                '[Invite Oggy](https://discord.com/oauth2/authorize?client_id=898782551110471701&permissions=93264&scope=bot+applications.commands) | ' +
                '[Invite Oggy 2](https://discord.com/oauth2/authorize?client_id=974862207106027540&permissions=93264&scope=bot+applications.commands)\n'
            )
            .setColor('RANDOM')
            .setFooter({
                text: `${interaction.user.tag} • ${interaction.guild.name}`,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp()
            .setThumbnail(client.user.displayAvatarURL())
        interaction.editReply({
            embeds: [
                embed
            ],
            components: [
                new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                        .setCustomId('choose')
                        .setOptions(option)
                        .setPlaceholder('📃 Category')
                        .setDisabled(false)
                    )
            ]
        })
    }
}
