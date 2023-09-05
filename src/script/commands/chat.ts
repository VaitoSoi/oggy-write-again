import { ScriptCommand } from "../../lib/builders/command";

export default new ScriptCommand()
    .setName('chat')
    .setExecute(async (args, compiler) => void compiler.oggy.mineflayer?.chat(args.slice(1).join(' ')))