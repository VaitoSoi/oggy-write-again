import { ScriptCommand } from "../../lib/builders/command";
import { enterPass } from "../../lib/utils/auth";

export default new ScriptCommand()
    .setName('enterPass')
    .setExecute(async (args, compiler) => await enterPass(compiler.oggy) == true ? undefined : new Error('cant enter pass'))