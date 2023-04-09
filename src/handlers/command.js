import Discord, { REST, Routes } from 'discord.js'
import { Client } from '../index.js'
import fs from 'node:fs'

/**
 * @param {Client} client
 */
export default async function (client) {
    const files = fs.readdirSync('./src/commands/')
    for (const i in files) {
        const commands = (await import(`../commands/${i}`)).default
        if (!commands) continue
        client.commands.set(commands.name, commands)
        client.commandsJson.push(commands.toJSON())
    }
}