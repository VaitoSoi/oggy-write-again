const mineflayer = require('mineflayer')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'message',
    async run(bot, msg, pos) {
        const sendRestart = require('../modules/sendRestart')
        const sendChat = require('../modules/sendChat')
        const color = require('../modules/color.json')
        const restartTime = /^UltimateAutoRestart » Restarting in (.+)!$/
        if (restartTime.test(msg.toString())) sendRestart(bot.client, restartTime.exec(msg.toString())[1]) 
        const restartNow = /^UltimateAutoRestart » Restarting... join back soon!$/
        if (restartNow.test(msg.toString())) sendRestart(bot.client, '', true)
        if (msg.toString().trim() == '') return
        sendChat(bot.client, new MessageEmbed()
            .setDescription(msg.toString())
            .setColor(color.blue), false
        )
    }
}