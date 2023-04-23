import fs from 'node:fs';
import { EventHandlerMode, EventHandlerConfig, EventBuilder } from '../index.js'

export default function (config: EventHandlerConfig) {
    if (config.mode == EventHandlerMode.Both || config.mode == EventHandlerMode.Discord)
        fs.readdirSync('./src/events/discord/')
            .filter(file => (file.endsWith('.ts') || file.endsWith('.js')) && fs.lstatSync(`./src/events/discord/${file}`).isFile())
            .forEach(async function (file) {
                const event: EventBuilder = (await import(`../events/discord/${file}`)).default
                if (!event.name || !event.run) return console.error(`file ${file} missing name or run function`);
                switch (event.once) {
                    case true:
                        config.client?.once(event.name, (...args: any[]) => event.run(config.config, ...args)); break;
                    default:
                        config.client?.on(event.name, (...args: any[]) => event.run(config.config, ...args))
                }
            })
    if (config.mode == EventHandlerMode.Both || config.mode == EventHandlerMode.Mineflayer)
        fs.readdirSync('./src/events/mineflayer/')
            .filter(file => (file.endsWith('.ts') || file.endsWith('.js')) && fs.lstatSync(`./src/events/mineflayer/${file}`).isFile())
            .forEach(async function (file) {
                const event: EventBuilder = (await import(`../events/mineflayer/${file}`)).default
                if (!event.name || !event.run) return console.error(`file ${file} missing name or run function`);
                    switch (event.once) {
                        case true:
                            config.bot?.once(<any>event.name, (...args: any[]) => event.run(config.config, ...args)); break;
                        default:
                            config.bot?.on(<any>event.name, (...args: any[]) => event.run(config.config, ...args))
                    }
            })
    console.log(`[${config.client ? 'DISCORD.JS' : 'MINEFLAYER'}] [${config.client ? config.client?.user?.tag: config.bot?.username}] Listened to all events`)
}