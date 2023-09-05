import { readdirSync } from "fs";
import { Oggy } from "../lib";
import { ScriptCommand } from "../lib/builders/command";
import { join } from "path";

export class Compiler {
    public commands: ScriptCommand[] = []

    constructor(public oggy: Oggy) {
        this.commandHandler()
    }

    private async commandHandler() {
        const path = join(__dirname, '..', this.oggy.config.system.path.command.script)
        const files = readdirSync(path)

        for (let i in files) {
            const command: ScriptCommand = (await import(join(path, files[i]))).default
            if (!command) this.oggy.logger.warn(`[COMPILER] script command file ${files[i]} is empty`)
            else if (!command.name) this.oggy.logger.warn(`[COMPILER] script command file ${files[i]} is missing name`)
            else if (!command.execute) this.oggy.logger.warn(`[COMPILER] script command file ${files[i]} is missing execute function`)
            else this.commands.push(command)
        }

        this.oggy.logger.info(`[COMPILER] Handled ${this.commands.length} command(s)`)
    }

    public async runScript(script: string) {
        const args = script.replace(/\t/gi, '').split('\n')

        for (let i in args) {
            const command = this.commands.find(val => val.name === args[i])

            if (!command) this.oggy.logger.warn(`[COMPILER] Cant find command ${args[i]}`)
            else {
                const cb = await command.execute(args, this)
                if (cb instanceof Error) this.oggy.logger.error(`[COMPILER] Catch an error while excute command at line ${i}:\n ${cb.stack}`)
            }
        }
    }
}