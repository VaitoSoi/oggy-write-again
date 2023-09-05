import { Window } from "prismarine-windows";
import { ScriptCommand } from "../../lib/builders/command";
import { Slots } from "../../lib/utils/enum";
import { ChatMessage } from 'prismarine-chat'

export default new ScriptCommand()
    .setName('on')
    .setExecute((args, compiler) => {
        const eventReg = /^on (.+) (.+)$/,
            eventRegCon = /^on (.+):"(.+)" (.+)$/,
            eventExec = eventRegCon.exec(args.join(' ')) || eventReg.exec(args.join(' ')) || [],
            eventName = eventExec[1]
        if (!eventName) return new Error(`invalid input event`)

        if (eventRegCon.test(eventName)) {
            const condition = eventExec[2],
                commands = args.slice(condition.split(' ').length + 1).join(' ').split(';').map((cmd) => {
                    const args = cmd.split(' '),
                        command = compiler.commands.find(command => command.name == args[2])
                    if (!command) return {}
                    else return { args, command }
                })
            switch (eventName) {
                case 'windowOpen':
                    if (condition && !Object.keys(Slots).includes(condition)) return new Error(`can't find that window`)
                    const slot = isNaN(Number(condition)) ? Slots[<any>condition] : Number(condition)
                    compiler.oggy.eventEmitter.on(eventName, async (window: Window) => {
                        if (window.slots.length == slot) for (let i in commands) {
                            const cmd = commands[i]
                            await cmd.command?.execute(cmd.args, compiler)
                        }
                        else return undefined
                    })
                    break;
                case 'message':
                    compiler.oggy.eventEmitter.on(eventName, async (msg: ChatMessage) => {
                        if (msg.toString() == condition) for (let i in commands) {
                            const cmd = commands[i]
                            await cmd.command?.execute(cmd.args, compiler)
                        }
                        else return undefined
                    });
                    break;
                case 'spawn':
                    compiler.oggy.eventEmitter.on(eventName, async () => {
                        if (compiler.oggy.data.spawnTime == Number(condition)) for (let i in commands) {
                            const cmd = commands[i]
                            await cmd.command?.execute(cmd.args, compiler)
                        } else return undefined
                    });
                    break;
            }
        }
        else {
            const commands = args.slice(2).join(' ').split(';').map((cmd) => {
                const args = cmd.split(' '),
                    command = compiler.commands.find(command => command.name == args[2])
                if (!command) return {}
                else return { args, command }
            })
            compiler.oggy.eventEmitter.on(eventName, () => commands.forEach((cmd) => cmd.command?.execute(cmd.args, compiler)))
        }
    })