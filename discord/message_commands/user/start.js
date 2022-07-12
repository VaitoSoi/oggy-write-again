const { Client, Message, MessageEmbed } = require('discord.js')

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
        message.channel.send('1️⃣ Đầu tiên hãy kiểm tra và thiết lập các thứ cơ bản cho bot (tự động).')
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
        message.channel.send('⏳ Đang tạo cài đặt cho bot...').then((msg) => {
            const db = require('../../../models/option')
            let data = await db.findOne({
                'guild_id': message.guildId
            })
            if (data)
                return msg.edit('🟡 | Đã có cài đặt!')
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
        message.channel.send('2️⃣ Chỉnh sửa một vào thứ.')
        let type = '', now = ''
        let m = await message.channel.send('👇 Vui lòng nhập ID hoặc tags kênh livechat.\nGhi `NO` để bỏ qua')
        type = 'livechat'; now = 'channel'
        message.channel.createMessageCollector({
            time: 5 * 60 * 1000,
            filter: msg => msg.author.id === message.author.id
        }).on('collect', async (msg) => {
            msg.delete()
            if (msg.content.toLowerCase() == 'no') return
            if (now == 'channel') {
                let channel
                if (isNaN(args[4])) channel = msg.mentions.channels.first()
                else channel = msg.guild.channels.cache.get(msg.content)
                if (!channel.isText()) return msg.channel.send(`🔴 | <#${channel.id}> phải là một kênh văn bản !`).then((m1) => setTimeout(() => {
                    m1.delete()
                }, 10 * 1000))
                if (type === 'livechat') {
                    set = {
                        'config.channel.livechat': channel.id
                    }; type = ' restart'
                } else if (type === 'restart') {
                    set = {
                        'config.channel.restart': channel.id
                    }; type === 'status'
                } else if (type === 'status') {
                    set = {
                        'config.channel.status': channel.id
                    }; type = ''
                }
                await db.findOneAndUpdate({
                    'guild_id': message.guildId
                },
                    {
                        $set: set
                    })
                m.delete()
                if (type != '') m = await message.channel.send(`👇 Vui lòng nhập ID hoặc tags kênh ${type}.\nGhi \`NO\` để bỏ qua`)
                else m = await message.channel.send(`👇 Vui lòng nhập ID hoặc tags kênh ${type}.\nGhi \`NO\` để bỏ qua`)
            }
        })
    }
}