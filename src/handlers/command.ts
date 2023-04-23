import { Client, SlashCommandBuilder, SlashCommandBuilderWithData } from '../index.js'
import fs from 'node:fs'

export default async function (client: Client): Promise<void> {
    const files = fs.readdirSync('./src/commands/discord/')
    for (const i in files) {
        const commands: SlashCommandBuilder | SlashCommandBuilderWithData = (await import(`../commands/discord/${files[i]}`)).default
        if (!commands) continue
        if (commands instanceof SlashCommandBuilder) {
            client.commands.set(commands.name, commands)
            client.commandsJson.push(commands.toJSON())
        } else if (commands instanceof SlashCommandBuilderWithData) {
            client.commands.set(commands.data.name, commands)
            client.commandsJson.push(commands.data.toJSON())
        }
    }
}