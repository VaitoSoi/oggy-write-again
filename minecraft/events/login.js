const mineflayer = require('mineflayer')
const chat = require('../modules/sendChat')
const { MessageEmbed } = require('discord.js')
const color = require('../modules/color.json')

module.exports = {
    name: 'login',
    /**
     * 
     * @param {mineflayer.Bot} bot 
     */
    async run(bot) {
        bot.login++
        let sv = ''
        if (bot.login == 1) sv = 'PIN'
        else if (bot.login == 2) sv = 'QUEUE'
        else if (bot.login == 3) {
            sv = 'MAIN'; botlogin = 0
        }
        chat(bot.client, new MessageEmbed()
            .setDescription(`**Bot đã vào cụm \`${sv}\`**`)
            .setColor(color.green), true
        )
    }
}