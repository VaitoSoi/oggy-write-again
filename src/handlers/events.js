import fs from 'node:fs';
import { Client } from '../index';

/**
 * @param {client} Client
 * @returns {void}
 */
export default function (client) {
    fs.readdirSync('./src/events/')
        .filter(file => file.endsWith('.js') && fs.lstatSync(`./src/events/${file}`).isFile())
        .forEach(async function (file) {
            const event = (await import(`../events/${file}`)).default
            if (!event.name || !event.run) return console.error(`file ${file} missing name or run function`);
            switch (event.once) {
                case true:
                    client.once(event.name, (...args) => event.run(...args)); break;
                default:
                    client.on(event.name, (...args) => event.run(...args))
            }
        })
}