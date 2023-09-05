import Discord, { AutocompleteInteraction } from 'discord.js'
import { CommandInteraction, Execute } from '../utils/lib'
import { Oggy } from '..'
import { Compiler } from '../../script/compiler'

type SlashcommandExecute = Execute<[oggy: Oggy, interaction: CommandInteraction], void>
type AutocompleteExecute = Execute<[oggy: Oggy, interaction: AutocompleteInteraction], void>
export class SlashCommandBuilder extends Discord.SlashCommandBuilder {
    public execute: SlashcommandExecute = () => { }
    public autocompleteExecute: AutocompleteExecute = () => { }

    constructor() { super() }

    public setExecute(execute: SlashcommandExecute): SlashCommandBuilder { this.execute = execute; return this }
    public setAutocompleteExecute(autocompleteExecute: AutocompleteExecute): SlashCommandBuilder { this.autocompleteExecute = autocompleteExecute; return this }
}
export class SlashCommandBuilderWithData {
    public data: Discord.SlashCommandBuilder | Discord.SlashCommandSubcommandBuilder | Discord.SlashCommandSubcommandGroupBuilder | Discord.SlashCommandSubcommandsOnlyBuilder = new Discord.SlashCommandBuilder()
    public execute: SlashcommandExecute = () => { }
    public autocompleteExecute: AutocompleteExecute = () => { }

    constructor() { }

    public setData(data: Discord.SlashCommandBuilder | Discord.SlashCommandSubcommandBuilder | Discord.SlashCommandSubcommandGroupBuilder | Discord.SlashCommandSubcommandsOnlyBuilder): SlashCommandBuilderWithData { this.data = data; return this }
    public setExecute(execute: SlashcommandExecute): SlashCommandBuilderWithData { this.execute = execute; return this }
    public setAutocompleteExecute(autocompleteExecute: AutocompleteExecute): SlashCommandBuilderWithData { this.autocompleteExecute = autocompleteExecute; return this }
}

type MineflayerExecute = Execute<[oggy: Oggy], void>
export class MineflayerCommandBuilder {
    public name: string = '';
    public description: string = '';
    public execute: MineflayerExecute = () => { };

    constructor () { }

    public setName(name: string): MineflayerCommandBuilder { this.name = name; return this }
    public setDescription(description: string): MineflayerCommandBuilder { this.description = description; return this }
    public setExecute(execute: MineflayerExecute): MineflayerCommandBuilder { this.execute = execute; return this }
}

type ScriptCommandExecute = Execute<[args: string[], this: Compiler], Error | void>
export class ScriptCommand {
    public name: string = ''
    public execute: ScriptCommandExecute = () => { }

    constructor() { }

    public setName(name: string): ScriptCommand { this.name = name; return this }
    public setExecute(execute: ScriptCommandExecute): ScriptCommand { this.execute = execute; return this }
}