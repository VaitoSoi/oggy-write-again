const mineflayer = require('mineflayer')

module.exports = {
    name: 'chat',
    /**
     * 
     * @param {mineflayer.Bot} bot 
     * @param {String} username 
     * @param {String} chat 
     */
    async run(bot, username, chat) {
        let prefix = 'og.'
        let msg = chat.toString()
        if (!msg.startsWith(prefix)) return
        let args = msg.slice(prefix.length).trim().split(/ +/g)
        let cmd = bot.cmds.find(e => e.name == args[0])
        if (!cmd) return
        cmd.run(bot, args)
    }
}