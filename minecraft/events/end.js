const mineflayer = require('mineflayer')
const chat = require('../modules/sendChat')
const { MessageEmbed } = require('discord.js')
const color = require('../modules/color.json')
const ms = require('ms')

module.exports = {
    name: 'end',
    /**
     * 
     * @param {mineflayer.Bot} bot 
     * @param {String} reason
     */
    async run(bot, reason) {
        let reconnect = '3m'
        chat(bot.client, new MessageEmbed()
            .setDescription(
                `**Bot đã mất kết nối với server**\n` +
                `**Lý do: \`${reason.toString()}\`**\n` +
                `**Kết nối lại sau ${reconnect}**`
            )
            .setColor(color.red), true
        )
        setTimeout(() => {
            chat(bot.client, new MessageEmbed()
                .setDescription(
                    `**Đang kết nối lại với server....**`
                )
                .setColor(color.yellow), true
            )
            require('../main')(bot.client)
        }, ms(reconnect));
    }
}