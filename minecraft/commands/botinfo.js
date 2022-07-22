const mineflayer = require('mineflayer')
const ms = require('ms')

module.exports = {
    name: 'botinfo',
    /**
     * 
     * @param {mineflayer.Bot} bot 
     * @param {String[]} args 
     */
    run: async (bot, args) => {
        bot.chat(`Ping: ${bot.player.ping}ms | Uptime: ${ms(Math.floor(Date.now()/1000) - bot.readyAt)} | Position: ${Object.values(bot.player.entity.position).join(' ')}`)
    }
} 