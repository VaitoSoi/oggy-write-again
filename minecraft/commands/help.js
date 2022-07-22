const mineflayer = require('mineflayer')
const fs = require('node:fs')

module.exports = {
    name: 'help',
    /**
     * 
     * @param {mineflayer.Bot} bot 
     * @param {String[]} args 
     */
    run: async (bot, args) => {
        let cmd = fs.readdirSync('./minecraft/commands/').filter(file => file.endsWith('.js'))
        bot.chat(`Các lệnh hiện có: ${bot.cmds.map(e => e.name).join(', ')}`)
    }
}