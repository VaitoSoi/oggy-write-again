import { EmbedBuilder } from 'discord.js'
import { EventBuilder, MineflayerEvents } from '../../index'
import { consoleEmbed, sendMessage } from '../../modules/message'
import { setTimeout as wait } from 'node:timers/promises'

export default new EventBuilder()
    .setName(MineflayerEvents.MessageStr)
    .setOnce(false)
    .setRun(async function (client, message: string) {
        console.log(message)
        const normalChat = /^<(.+)> (.+)$/
        const whisperSend = /^nhắn cho (.+): (.+)$/
        const whisperReceive = /^(.+) nhắn: $(.+)$/
        const embed = new EmbedBuilder()
            .setFooter({
                text: `OggyTheCode ${client.package.version}`,
                iconURL: `https://github.com/${client.package.github}.png`
            })
            .setTimestamp()
        if (normalChat.test(message ?? '')) {
            const name = (normalChat.exec(message ?? '') || [])[1]
            console.dir({ name, player: client.bot?.players[name] }, { depth: null })
            embed
                .setAuthor({
                    name,
                    iconURL: `https://crafatar.com/avatars/${client.bot?.players[name]?.uuid ?? ''}`
                })
                .setDescription((normalChat.exec(message) ?? [])[2])
                .setColor('Blue')
        } else if (whisperSend.test(message))
            embed
                .setAuthor({
                    name: client.bot?.username ?? 'Oggy',
                    iconURL: `https://crafatar.com/avatars/${client.bot?.player.uuid ?? ''}`
                })
                .setDescription(message)
                .setColor('LuminousVividPink')
        else if (whisperReceive.test(message)) {
            const name = (whisperReceive.exec(message) ?? ['', 'Oggy'])[1]
            embed
                .setAuthor({
                    name,
                    iconURL: `https://crafatar.com/avatars/${client.bot?.players[name].uuid ?? ''}`
                })
                .setDescription(message)
                .setColor('LuminousVividPink')
        } else {
            embed
                .setAuthor({
                    name: 'Server Console',
                    iconURL: `https://api.mcstatus.io/v2/icon/${client.config.minecraft.server.ip}`
                })
                .setDescription(message ?? 'Nothing....')
                .setColor('Blue')
            switch (message) {
                case 'đang vào AnarchyVN...':
                case 'Connecting to the server...':
                    embed.setColor('Yellow'); break
                case 'Please log-in in order to use the chat or any commands!':
                case 'Oops something went wrong... Putting you back in queue.':
                case 'Already connecting to this server!':
                    embed.setColor('Red'); break
            }
        }
        sendMessage(client, embed)

        if (message.trim().toLowerCase() == 'dùng lệnh/anarchyvn  để vào server.') {
            await wait(1000).catch(e => { })
            client.bot?.chat('/anarchyvn');
            sendMessage(client, new consoleEmbed()
                .setTitle(`Đã nhập chat \`/anarchyvn\``)
                .setColor('Green')
            )
        }
    })