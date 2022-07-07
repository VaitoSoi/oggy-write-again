const mineflayer = require('mineflayer')
const { env } = require('process')
const config = {
    username: env.MINECARFT_BOT_NAME,
    version: env.MINECRAFT_VERSION,
    host: env.MINECARFT_HOST,
    port: env.MINECARFT_PORT,
    pass: env.MINECRAFT_PASS,
}
const { Client } = require('discord.js')

/**
 * Create mineflayer bot
 * @param {Client} client 
 */
async function bot(client) {
    /**
     * 
     * Create Bot
     * 
     */
    const bot = mineflayer.createBot({
        username: config.username,
        port: config.port,
        host: config.host,
        version: config.version,
    });
    /**
     * 
     * Event Handler
     * 
     */
    bot.client = client
    bot.login = 0
    require('./handler/event')(bot)
}