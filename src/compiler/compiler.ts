import { Oggy, CompilerCommandBuilder } from "..";
import { Collection } from "discord.js";
import fs from 'node:fs'

export class Compiler {
    oggy: Oggy
    commands: Collection<string, CompilerCommandBuilder>
    constructor(oggy: Oggy) {
        this.oggy = oggy
        this.commands = new Collection()
    }
    run(script: string) {

    }
    commandHandler() {
        const files = fs.readdirSync('./src/compiler/commands')
            .filter(file => (file.endsWith('.ts') || file.endsWith('.js')) && fs.lstatSync(`./src/compiler/commands/${file}`).isFile())
        for (let i in files) {
            
        }
    }
}