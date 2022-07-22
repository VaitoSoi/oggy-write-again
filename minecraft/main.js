const mineflayer = require('mineflayer')
const env = process.env
const config = {
    username: env.MINECRAFT_NAME,
    version: env.MINECRAFT_VERSION,
    host: env.MINECRAFT_HOST,
    port: env.MINECRAFT_PORT,
    pass: env.MINECRAFT_PASS,
}
const { Client } = require('discord.js')
const tpsPlugin = require('mineflayer-tps')(mineflayer)

/**
 * Create mineflayer bot
 * @param {Client} client 
 */
async function run(client) {
    /**
     * 
     * Create Bot
     * 
     */
    let bot
    try {
        bot = mineflayer.createBot({
            username: config.username,
            port: config.port,
            host: config.host,
            version: config.version,
        })
    } catch (error) {
        console.log(e)
        setTimeout(() => {
            run(client)
        }, 5 * 60 * 1000);
    }
    /**
     * 
     * Load Plugin
     * 
     */
    bot.loadPlugin(tpsPlugin)
    /**
     * 
     * Event Handler
     * 
     */
    bot.client = client
    bot.login = 0
    bot.cmds = []
    bot.readyAt = Math.floor(Date.now() / 1000)
    require('./handler/event')(bot)
    require('./handler/command')(bot.cmds)
}

module.exports = run