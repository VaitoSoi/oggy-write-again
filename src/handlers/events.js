import fs from 'node:fs';
import Discord from 'discord.js'
import * as Mineflayer from 'mineflayer'
import { EventHandlerMode, EventType } from '../index.js'

/**
 * @param {{client: Discord.Client, bot: Mineflayer.Bot, mode: EventHandlerMode, config: Object}} config
 * @returns {void}
 */
export default function (config) {
    fs.readdirSync('./src/events/')
        .filter(file => file.endsWith('.js') && fs.lstatSync(`./src/events/${file}`).isFile())
        .forEach(async function (file) {
            const event = (await import(`../events/${file}`)).default
            if (!event.name || !event.run) return console.error(`file ${file} missing name or run function`);
            if (event.type = EventType.Discord && (config.mode == EventHandlerMode.Both || config.mode == EventHandlerMode.Discord))
                switch (event.once) {
                    case true:
                        config.client.once(event.name, (...args) => event.run(...args, config.config)); break;
                    default:
                        config.client.on(event.name, (...args) => event.run(...args, config.config))
                }
            else if (event.type = EventType.Mineflayer && (config.mode == EventHandlerMode.Both || config.mode == EventHandlerMode.Mineflayer))
                switch (event.once) {
                    case true:
                        config.bot.once(event.name, (...args) => event.run(...args, config.config)); break;
                    default:
                        config.bot.on(event.name, (...args) => event.run(...args, config.config))
                }
        })
}