const fs = require('node:fs')
const mineflayer = require('mineflayer')

/**
 * Minecraft event handler
 * @param {mineflayer.Bot} bot Mineflayer Bot
 */
module.exports = async function handler (bot) {
    fs.readdirSync('./minecraft/events/').filter(
        file => file.endsWith('.js')
    ).forEach((file) => {
        const event = require(`../events/${file}`)
        if (!event.discord) bot.on(event.name, (...args) => { event.run(bot, ...args) })
        else bot.client.on(event.name, (...args) => event.run(bot, ...args))
    })
}