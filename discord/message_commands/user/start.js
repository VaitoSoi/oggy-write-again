const { Client, Message, MessageEmbed } = require('discord.js')
const wait = require('node:timers/promises').setTimeout

module.exports = {
    name: 'start',
    description: 'Bắt đầu mọi thứ',
    usage: '',
    /**
    * 
    * @param {Client} client 
    * @param {Message} message 
    * @param {String[]} args 
    */
    run: async (client, message, args) => {
        message.channel.send('👋 OggyTheBot xin chào, đây là các bước khởi đầu của bot.')
        message.channel.send('1️⃣ Trước hết, hãy kiểm tra và thiết lập các thứ cơ bản cho bot (tự động).')
        let perm = true
        message.channel.send('⏳ Bot đang kiểm tra các quyền cần thiết...').then((msg) => {
            let send = true,
                embed = true,
                react = true
            if (!message.guild.me.permissions.has('SEND_MESSAGES')) send = false
            if (!message.guild.me.permissions.has('EMBED_LINKS')) embed = false
            if (!message.guild.me.permissions.has('ADD_REACTIONS')) react = false
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
        await wait(1000)
        const db = require('../../../models/option')
        let data = await db.findOne({
            'guild_id': message.guildId
        })
        message.channel.send('⏳ Đang tạo cài đặt cho bot...').then(async (msg) => {
            if (data)
                return msg.edit('✅ Cài đặt đã có sẳn!')
            else {
                data = new db({
                    guild_id: message.guildId,
                    guild_name: message.guild.name,
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
        await wait(1000)
        message.channel.send('2️⃣ Chỉnh sửa một vào thứ.')
        message.channel.send('> Đầu tiên là các kênh văn bản')
        let type = '', now = ''
        type = 'livechat'; now = 'channel'
        let m = await message.channel.send('👇 Vui lòng nhập ID hoặc tags kênh `livechat`.\nGhi `NO` hoặc `SKIP` để bỏ qua')
        message.channel.createMessageCollector({
            time: 5 * 60 * 1000,
            filter: msg => msg.author.id === message.author.id
        }).on('collect', async (msg) => {
            msg.delete()
            if (msg.content.toLowerCase() == 'no' || msg.content.toLowerCase() == 'skip') {
                m.delete()
                if (now == 'channel') {
                    if (type === 'livechat') type = 'restart'
                    else if (type === 'restart') type = 'status'
                    else if (type === 'status') { type = ''; now = 'message' }
                    if (type != '') m = await message.channel.send(`👇 Vui lòng nhập ID hoặc tags kênh \`${type}\`.\nGhi \`NO\` để bỏ qua`)
                    else if (type == '' && now == 'message') {
                        message.channel.send('> Tiếp theo là dạng hiển thị tin nhắn')
                        m = await message.channel.send(
                            '👇 Hãy chọn một trong hai lựa chọn dưới đây:\n' +
                            '> 1️⃣ Embed (mặc định)\n' +
                            '> 2️⃣ Message\n' +
                            'Ghi `NO` hoặc `SKIP` để sử dụng mặc định'
                        )
                    }
                }
            } else if (now == 'channel') {
                let channel, set = {}
                if (isNaN(args[4])) channel = msg.mentions.channels.first()
                else channel = msg.guild.channels.cache.get(msg.content)
                if (!channel.isText()) return msg.channel.send(`🔴 | <#${channel.id}> phải là một kênh văn bản !`).then((m1) => setTimeout(() => {
                    m1.delete()
                }, 10 * 1000))
                if (type == 'livechat') {
                    set = {
                        'config.channel.livechat': channel.id
                    }; type = 'restart'
                } else if (type == 'restart') {
                    set = {
                        'config.channel.restart': channel.id
                    }; type = 'status'
                } else if (type == 'status') {
                    set = {
                        'config.channel.status': channel.id
                    }; type = ''; now = 'message'
                }
                await db.findOneAndUpdate({ 'guild_id': message.guildId }, { $set: set })
                m.delete()
                const util = require('minecraft-server-util')
                if (type == 'status' || type == 'restart') {
                    try {
                        channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                            'SEND_MESSAGES': false,
                        }, {
                            reason: 'Oggy set-channel',
                            type: 0
                        })
                        message.reply('✅ | Đã chỉnh role cho `@everyone`').then((msg) => setTimeout(() => {
                            msg.delete()
                        }, 20 * 1000))
                        channel.permissionOverwrites.edit(message.guild.me, {
                            'SEND_MESSAGES': true,
                            'EMBED_LINKS': true
                        }, {
                            reason: 'Oggy set-channel',
                            type: 1
                        })
                        message.channel.send('✅ | Đã chỉnh role cho bot').then((msg) => setTimeout(() => {
                            msg.delete()
                        }, 20 * 1000))
                    } catch {
                        message.channel.send(`🟡 | Vui lòng khóa kênh ${channel} tránh tình trạng trôi tin nhắn!`)
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
                            text: `${message.author.tag}`,
                            iconURL: message.author.displayAvatarURL()
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
                } else if (type == 'restart') {
                    let send = (role) =>
                        channel.send(
                            `Click 📢 để nhận role ${role}.\n` +
                            `Role sẽ được mention khi có thông báo và khi server restart.\n`
                        ).then(async (msg) => {
                            msg.react('📢')
                            data.config.messages.restart = msg.id
                            await data.save()
                        })
                    let m = await message.channel.send(
                        'Vui lòng chọn 1 trong 2 lựa chọn sau:\n' +
                        '🟢 | Lấy một role restart có sẵn.\n' +
                        '🆕 | Tạo một role restart mới'
                    )
                    m.react('🟢'); m.react('🆕')
                    m.createReactionCollector({
                        time: 5 * 60 * 1000
                    }).on('collect', async (react, user) => {
                        if (user.id !== message.author.id) return
                        m.delete()
                        if (react.emoji.name == '🆕') {
                            let role = await message.guild.roles.create({
                                name: 'restart-notification',
                                reason: 'Oggy restart reaction-role',
                            })
                            message.channel.send(
                                `✅ | Đã tạo restart-role thành công.\n` +
                                `ℹ | Thông tin về role:\n` +
                                `> Tên: ${role}\n` +
                                `> ID: ${role.id}`
                            )
                            data.config.roles.restart = role.id
                            await data.save()
                            send(role)
                        } else if (react.emoji.name == '🟢') {
                            let done = false
                            let msg = await message.channel.send('👇 | Vui lòng ghi ID hoặc mention role.')
                            message.channel.createMessageCollector({
                                time: 5 * 60 * 1000
                            }).on('collect', async (m) => {
                                if (m.author.id != message.author.id || done) return
                                let role = null
                                if (isNaN(m.content)) role = m.mentions.roles.first()
                                else role = message.guild.roles.cache.get(m.content)
                                m.delete()
                                if (!role)
                                    return m.channel.send('🔴 | Không tìm thấy role!')
                                        .then(msg => setTimeout(() => msg.delete(), 20 * 1000))
                                msg.delete()
                                data.config.roles.restart = role.id
                                await data.save()
                                message.channel.send('✅ | Đã lưu role!')
                                send(role)
                                done = true
                            })
                        }
                    })
                }
                if (type != '') m = await message.channel.send(`👇 Vui lòng nhập ID hoặc tags kênh \`${type}\`.\nGhi \`NO\` để bỏ qua`)
                else if (type == '' && now == 'message') {
                    message.channel.send('> Tiếp theo là dạng hiển thị tin nhắn')
                    m = await message.channel.send(
                        '👇 Hãy chọn một trong hai lựa chọn dưới đây:\n' +
                        '> 1️⃣ Embed (mặc định)\n' +
                        '> 2️⃣ Message\n' +
                        'Ghi `NO` hoặc `SKIP` để sử dụng mặc định'
                    )
                }
            } else if (now == 'message') {
                if (msg.content.toLowerCase() != 'embed' && msg.content.toLowerCase() != 'message') return msg.reply('🔴 Lựa chọn không hợp lệ!')
                data.config.chatType = msg.content.toLowerCase()
                await data.save()
            }
        })
    }
}