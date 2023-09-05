import { ScriptCommand } from "../../lib/builders/command";
import { enterPIN } from "../../lib/utils/auth";

export default new ScriptCommand()
    .setName('enterPin')
    .setExecute(async (args, compiler) => await enterPIN(compiler.oggy) == true ? undefined : new Error('cant enter pin'))