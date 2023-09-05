import { ScriptCommand } from "../../lib/builders/command";

export default new ScriptCommand()
    .setName('click')
    .setExecute((args, compiler) => {
        const mouse =
            isNaN(Number(args[1]))
                ? args[1] == 'left'
                    ? 0
                    : args[1] == 'right'
                        ? 1
                        : undefined
                : Number(args[1]) == 0 || Number(args[1]) == 0
                    ? Number(args[1])
                    : undefined

        if (!mouse) return new Error('invalid mouse')

        const slots = args.slice(2).map(Number)
        if (!slots || !slots.length) return new Error('invalid slot')

        for (let i = 0; i < slots.length; i++)
            try {
                compiler.oggy.mineflayer?.clickWindow(slots[i], mouse, 0)
            } catch (error: any) {
                return error
            }
    })