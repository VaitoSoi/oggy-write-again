const { CommandInteraction, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const wait = require('node:timers/promises').setTimeout

module.exports = {
    data: new SlashCommandBuilder()
        .setName('start')
        .setDescription('Bắt đầu e vơ ry thinh'),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */ 
    run: async(interaction) => {
        const client = interaction.client
        interaction.editReply('👋 OggyTheBot xin chào, đây là các bước khởi đầu của bot.')
        interaction.channel.send('1️⃣ Trước hết, hãy kiểm tra và thiết lập các thứ cơ bản cho bot (tự động).')
        let perm = true
        interaction.channel.send('⏳ Bot đang kiểm tra các quyền cần thiết...').then((msg) => {
            let send = true,
                embed = true,
                react = true
            if (!interaction.guild.me.permissions.has('SEND_MESSAGES')) send = false
            if (!interaction.guild.me.permissions.has('EMBED_LINKS')) embed = false
            if (!interaction.guild.me.permissions.has('ADD_REACTIONS')) react = false
            if (send && embed && react) msg.edit('✅ Bot đã được cấp đủ quyền')
            else {
                msg.edit(
                    `Các quyền hiện tại của bot:\n` +
                    `> Quyền gửi tin nhắn (SEND_MESSAGES): ${send ? '✅' : '❌'}\n` +
                    `> Quyền nhúng liên kết (EMBED_LINKS): ${embed ? '✅' : '❌'}\n` +
                    `> Quyền thêm biểu cảm (ADD_REACTIONS): ${react ? '✅' : '❌'}\n` +
                    'Vui lòng cấp các quyền còn thiếu để bot có thể hoạt động bình thường'
                ); perm = false
            }
        })
        if (!perm) return
        await wait(1 * 1000)
        const db = require('../../../models/option')
        let data = await db.findOne({
            'guildid': interaction.guildId
        })
        const embedImageLink = 'https://cdn.discordapp.com/attachments/936994104884224020/997858841351962707/unknown.png'
        const messageImageLink = 'https://cdn.discordapp.com/attachments/936994104884224020/997859375790174289/unknown.png'
        const embedsWithImageLink = [
            new MessageEmbed()
                .setTitle('Minh họa cho lựa chọn `Embed`')
                .setImage(embedImageLink)
                .setURL(embedImageLink),
            new MessageEmbed()
                .setTitle('Minh họa cho lựa chọn `Message`')
                .setImage(messageImageLink)
                .setURL(
                    Math.floor(Math.random() * 10) == 1
                        ? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
                        : messageImageLink
                )
        ]
        const embedSupportServer = new MessageEmbed()
            .setTitle('OggyTheBot Support Server')
            .setURL('https://discord.com/invite/NBsnNGDeQd')
            .setFooter({
                text: 'Không phải scam đơu :))'
            })
        const send = (role, restartChannel) => {
            if (restartChannel)
                restartChannel.send(
                    `Click 📢 để nhận role ${role}.\n` +
                    `Role sẽ được mention khi có thông báo và khi server restart.\n`
                ).then(async (msg) => {
                    msg.react('📢')
                    data.config.messages.restart = msg.id
                    await data.save()
                    done = true
                })
            else channel.send(
                `Click 📢 để nhận role ${role}.\n` +
                `Role sẽ được mention khi có thông báo và khi server restart.\n`
            ).then(async (msg) => {
                msg.react('📢')
                data.config.messages.restart = msg.id
                await data.save()
                done = true
            })
        }
        interaction.channel.send('⏳ Đang tạo cài đặt cho bot...').then(async (msg) => {
            if (data)
                return msg.edit('✅ Đã có cài đặt sẵn!')
            else {
                data = new db({
                    guildid: interaction.guildId,
                    guildname: interaction.guild.name,
                    config: {
                        channels: {
                            livechat: '',
                            restart: '',
                            status: ''
                        },
                        messages: {
                            restart: '',
                            status: '',
                        },
                        roles: {
                            restart: ''
                        },
                        chatType: 'embed',
                        prefix: 'og.'
                    }
                })
                await data.save()
                msg.edit('✅ | Đã tạo cài đặt')
            }
        })
        await wait(1 * 1000)
        interaction.channel.send('2️⃣ Chỉnh sửa một vài thứ liên quan đến cài đặt của Ót gy.')
        interaction.channel.send('> Đầu tiên là các kênh văn bản')
        let type = '', now = '', restartChannel
        type = 'livechat'; now = 'channel'
        let m = await interaction.channel.send('👇 Vui lòng nhập ID hoặc tags kênh `livechat`.\nGhi `NO` hoặc `SKIP` để bỏ qua')
        interaction.channel.createMessageCollector({
            time: 5 * 60 * 1000,
            filter: msg => msg.author.id === interaction.user.id
        }).on('collect', async (msg) => {
            msg.delete()
            if (msg.content.toLowerCase() == 'no' || msg.content.toLowerCase() == 'skip') {
                m.delete()
                if (now == 'channel') {
                    if (type === 'livechat') type = 'restart'
                    else if (type === 'restart') type = 'status'
                    else if (type === 'status') { type = ''; now = 'message' }
                    if (type != '') m = await msg.channel.send(`👇 Vui lòng nhập ID hoặc tags kênh \`${type}\`.\nGhi \`NO\` để bỏ qua`)
                    else if (type == '' && now == 'message') {
                        msg.channel.send('> Tiếp theo là dạng hiển thị tin nhắn')
                        m = await msg.channel.send({
                            content: '👇 Hãy chọn một trong hai lựa chọn dưới đây:\n' +
                                '> 1️⃣ Embed (mặc định)\n' +
                                '> 2️⃣ Message\n' +
                                'Ghi `NO` hoặc `SKIP` để sử dụng mặc định',
                            embeds: embedsWithImageLink
                        })
                    }
                } else if (now === 'message') {
                    now = ''
                    msg.channel.send({
                        content: '✅ Done, toàn bộ các cài đặt cơ bản.\n' +
                            '🟢 Bạn có thể dùng lệnh:\n' +
                            '> `/config` để tùy chỉnh các cài đặt của bot\n' +
                            '> `/help` để hiện help menu\n' +
                            '👇 Vào Support Server để có thể nhận trợ giúp sớm nhất.',
                        embeds: [embedSupportServer]
                    })
                }
            }
            else if (now == 'channel') {
                let channel, collected = false
                if (isNaN(msg.content)) channel = msg.mentions.channels.first()
                else channel = msg.guild.channels.cache.get(msg.content)

                if (!channel) return
                if (!channel.isText())
                    return msg.channel.send(`🔴 | <#${channel.id}> phải là một kênh văn bản !`)
                        .then((m1) => setTimeout(() => {
                            m1.delete()
                        }, 10 * 1000))
                if (type === 'livechat') data.config.channels.livechat = channel.id
                else if (type === 'restart') data.config.channels.restart = channel.id
                else if (type === 'status') data.config.channels.status = channel.id
                await data.save()
                m.delete()
                const util = require('minecraft-server-util')
                if (type == 'status' || type == 'restart') {
                    try {
                        channel.permissionOverwrites.edit(msg.guild.roles.everyone, {
                            'SEND_MESSAGES': false,
                        }, {
                            reason: 'Oggy set-channel',
                            type: 0
                        })
                        msg.channel.send('✅ | Đã chỉnh role cho `@everyone`').then((msg) => setTimeout(() => {
                            msg.delete()
                        }, 10 * 1000))
                        channel.permissionOverwrites.edit(msg.guild.me, {
                            'SEND_MESSAGES': true,
                            'EMBED_LINKS': true
                        }, {
                            reason: 'Oggy set-channel',
                            type: 1
                        })
                        msg.channel.send('✅ | Đã chỉnh role cho bot').then((msg) => setTimeout(() => {
                            msg.delete()
                        }, 10 * 1000))
                    } catch {
                        msg.channel.send(`🟡 | Vui lòng khóa kênh ${channel} tránh tình trạng trôi tin nhắn!`)
                    }
                }
                if (type == 'status') {
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
                                    'Phát hiện lỗi khi lấy dữ liệu từ server:' +
                                    '```' + `${e}` + '```'
                                )
                        })
                    let m = await channel.send({
                        embeds: [embed]
                    })
                    m.react('🔁')
                    data.config.messages.restart = m.id
                    await data.save()
                }
                else if (type == 'restart') {
                    let m = await msg.channel.send(
                        'Vui lòng chọn 1 trong 2 lựa chọn sau:\n' +
                        '🟢 | Lấy một role restart có sẵn.\n' +
                        '🆕 | Tạo một role restart mới'
                    )
                    m.react('🟢'); m.react('🆕')
                    m.createReactionCollector({
                        time: 5 * 60 * 1000,
                        filter: (reaction, user) => user.id === interaction.user.id
                    }).on('collect', async (react, user) => {
                        m.delete()
                        if (react.emoji.name == '🆕') {
                            let role = await msg.guild.roles.create({
                                name: 'restart-notification',
                                reason: 'Oggy restart reaction-role',
                            })
                            msg.channel.send(
                                `✅ | Đã tạo restart-role thành công.\n` +
                                `ℹ | Thông tin về role:\n` +
                                `> Tên: ${role}\n` +
                                `> ID: ${role.id}`
                            )
                            data.config.roles.restart = role.id
                            await data.save()
                            send(role)
                            collected = true
                            now = 'message'
                        } else if (react.emoji.name == '🟢') {
                            msg.channel.send('👇 | Vui lòng ghi ID hoặc mention role.')
                            now = 'role'
                        }
                    })
                }
                if (type == 'livechat') { type = 'restart'; collected = true }
                else if (type == 'restart') { type = 'status'; restartChannel = channel }
                else if (type == 'status') { type = ''; now = 'message' }
                if (type != '' && collected == true) m = await msg.channel.send(`👇 Vui lòng nhập ID hoặc tags kênh \`${type}\`.\nGhi \`NO\` để bỏ qua`)
                else if (type == '' && now == 'message') {
                    msg.channel.send('> Tiếp theo là dạng hiển thị tin nhắn')
                    m = await msg.channel.send({
                        content: '👇 Hãy chọn một trong hai lựa chọn dưới đây:\n' +
                            '> 1️⃣ [Embed] (mặc định)\n' +
                            '> 2️⃣ [Message]\n' +
                            'Ghi `NO` hoặc `SKIP` để sử dụng mặc định',
                        embeds: embedsWithImageLink
                    })
                }
            }
            else if (now == 'message') {
                if (msg.content.toLowerCase() != 'embed' && msg.content.toLowerCase() != 'message') return msg.channel.send('🔴 Lựa chọn không hợp lệ!')
                data.config.chatType = msg.content.toLowerCase()
                await data.save()
                now = ''
                msg.channel.send({
                    content: '✅ Done, đã hoàn thành cài đặt toàn bộ các cài đặt cơ bản.\n' +
                        '🟢 Bạn có thể dùng lệnh:\n' +
                        '> `/config` để tùy chỉnh các cài đặt của bot\n' +
                        '> `/help` để hiện help menu\n' +
                        '👇 Vào Support Server để có thể nhận trợ giúp sớm nhất.',
                    embeds: [embedSupportServer]
                })
            }
            else if (now == 'role') {
                let role = null
                if (isNaN(msg.content)) role = msg.mentions.roles.first()
                else role = msg.guild.roles.cache.get(msg.content)
                if (!role)
                    return msg.channel.send('🔴 Không tìm thấy role hoặc role không hợp lệ')
                        .then((m) => setTimeout(() => m.delete(), 10 * 1000))
                data.config.roles.restart = role.id
                await data.save()
                send(role, restartChannel)
                now = 'channel'; type = 'status'
                m = await msg.channel.send(`👇 Vui lòng nhập ID hoặc tags kênh \`${type}\`.\nGhi \`NO\` để bỏ qua`)
            }
        })
    }
}