const mineflayer = require('mineflayer')

module.exports = {
    name: 'message',
    /**
     * 
     * @param {mineflayer.Bot} bot 
     * @param {mineflayer.jsonMsg} msg 
     * @param {*} pos 
     */
    async run(bot, msg, pos) {
        const sendRestart = require('../modules/sendRestart')
        const restartTime = /^UltimateAutoRestart » (.+)$/
        if (restartTime.test(msg.toString())) sendRestart(bot.client, restartTime.exec(msg.toString())[1]) 
        const restartNow = /^UltimateAutoRestart » Restarting... join back soon!$/
        if (restartNow.test(msg.toString())) sendRestart(bot.client, '', true)
    }
}