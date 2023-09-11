import { Client, Collection, GatewayIntentBits, IntentsBitField, REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes, APIApplicationCommandSubcommandOption, APIApplicationCommandSubcommandGroupOption } from "discord.js";
import { readdirSync } from "fs";
import { Bot, BotOptions, createBot } from "mineflayer";
import { join } from "path";
import { EventBuilder } from "./builders/event";
import { Logger } from "./utils/utils";
import { Execute, filesFilter } from "./utils/lib";
import { MineflayerCommandBuilder, SlashCommandBuilder, SlashCommandBuilderWithData } from "./builders/command";
import { Config } from "./builders/config";
import ms from "ms";
import { OggyExpress } from "./web/web";
import { EventEmitter } from "events";
import { pathfinder, Movements } from 'mineflayer-pathfinder'
import Tps from './plugins/tps'
import { OggyDatabase } from "./database/database";

export class Oggy {
    public discord: Client;
    public mineflayer?: Bot;
    public commands: {
        discord: {
            jsonArray: Array<RESTPostAPIChatInputApplicationCommandsJSONBody | APIApplicationCommandSubcommandOption | APIApplicationCommandSubcommandGroupOption>,
            collections: Collection<string, SlashCommandBuilder>
        },
        mineflayer: {
            collections: Collection<string, MineflayerCommandBuilder>
        }
    } = {
            discord: {
                jsonArray: [],
                collections: new Collection()
            },
            mineflayer: {
                collections: new Collection()
            }
        }
    private readonly DefaultIntents: GatewayIntentBits[] = [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildPresences,
        IntentsBitField.Flags.MessageContent
    ]
    private readonly BotOption: BotOptions
    public logger: Logger = new Logger()
    public express: OggyExpress
    public eventEmitter: EventEmitter = new EventEmitter()
    public data: any = {}
    public database: OggyDatabase

    constructor(public config: Config, intents?: GatewayIntentBits[]) {
        this.database = new OggyDatabase(this)
        this.express = new OggyExpress(this)

        this.discord = new Client({ intents: intents || this.DefaultIntents })
        this.BotOption = {
            username: config.mineflayer.account.username,
            password: config.mineflayer.account.password,
            host: config.mineflayer.server.host,
            port: config.mineflayer.server.port,
            version: config.mineflayer.server.version,
            hideErrors: true,
        }

        this.commandHandler('discord')
        this.commandHandler('mineflayer')

        if (this.config.system.path.debug) this.logger.open(this.config.system.path.debug)

        this.eventEmitter.on('mineflayerReconnectTimeout', (timeout: number = this.config.mineflayer.server.reconnectTimeout) => {
            this.logger.warn(`[SYSTEM] Event mineflayerReconnectTimeout emitted. Reconnect after ${ms(timeout)}`)

            this.data.timeout = setTimeout(() => {
                this.mineflayer?.connect(this.BotOption)
            }, timeout);
        })
        this.eventEmitter.on('mineflayerReconnect', () => {
            this.logger.warn(`[SYSTEM] Event mineflayerReconnect emitted. Reconnecting...`)

            clearTimeout(this.data.timeout)

            this.mineflayer?.connect(this.BotOption)
        })
        this.eventEmitter.on('mineflayerEnd', (reason = 'Console Request') => this.mineflayer?.end(reason))

        this.eventEmitter.on('endProcess', async (reason: string = 'undfined') => {
            this.logger.error(`[SYSTEM] Event endProcess emitted.`)
            this.logger.error(`[SYSTEM] Reason: ${reason}`)

            this.mineflayer?.end('EndProcess')
            await this.discord.destroy()

            this.logger.error(`[SYSTEM] Killing process due to event endProcess.`)
            process.exit(0)
        })
    }

    public login(token: string = this.config.discord.token) {
        this.discord.on('ready', async (client) => {
            this.logger.info(`[DISCORD.JS] ${client.user.tag} is ready`)
            this.logger.info(this.commands.discord.jsonArray)

            const rest = new REST({ version: '10' })
            rest.setToken(token)

            const callback = await <Promise<any>>rest.put(Routes.applicationCommands(client.user.id), {
                body: this.commands.discord.jsonArray
            })

            this.logger.info(`[DISCORD.JS] Registered ${callback.length} slash command(s)`)
        })
        this.discord.on('shardReady', (shard) => void this.logger.debug(`[DISCORD.JS] Shard ID ${shard} is ready`))

        this.discord.on('warn', (warn) => void this.logger.warn(`[DISCORD.JS] ${warn}`))
        this.discord.on('error', (err) => void this.logger.error(`[DISCORD.JS] ${err}`))
        this.discord.on('shardError', (err) => void this.logger.error(`[DISCORD.JS] ${err}`))
        this.discord.on('shardDisconnect', (shard) => void this.logger.debug(`[DISCORD.JS] Shard ID ${shard} is disconnected`))

        this.discord.login(token)
            .catch(err => void this.logger.error(`[DISCORD] Login error: ${err.stack}`))

        this.createBot()
    }

    private createBot(options: BotOptions = this.BotOption) {
        this.mineflayer = createBot(options)
        this.data.spawnTime = 0
        this.data.movement = new Movements(this.mineflayer)

        this.eventHandler(this.mineflayer)
        this.mineflayer.loadPlugin(pathfinder)
        this.mineflayer.loadPlugin(Tps)
        this.mineflayer.pathfinder?.setMovements(this.data.movement)

        this.mineflayer._client.on('connect', () => void this.logger.info(`[MINEFLAYER] Bot connected`))
        this.mineflayer.on('spawn', () => void this.logger.info(`[MINEFLAYER] ${this.mineflayer?.username} spawned`))
        this.mineflayer._client.on('end', (reason) => {
            this.logger.error(`[MINEFLAYER] Bot disconnected`)
            this.logger.error(`[MINEFLAYER] Reason: ${reason}`)

            if (reason != 'EndProcess') this.eventEmitter.emit('mineflayerReconnectTimeout')
        })
        this.mineflayer._client.on('error', (err) => void this.logger.error(`[MINEFLAYER] ${err.stack}`))

        this.mineflayer.on('windowOpen', (window) => void this.eventEmitter.emit('windowOpen', window))
        this.mineflayer.on('message', (msg) => void this.eventEmitter.emit('message', msg))
        this.mineflayer.on('spawn', () => {
            this.data.spawnTime += 1
            void this.eventEmitter.emit('spawn')
        })
    }

    private eventHandler(bot: Bot | Client): void {
        type EventExecute = Execute<[any, Execute<any, void>], any>
        let on: EventExecute = bot.on,
            once: EventExecute = bot.once,
            dir: string = '',
            listened: string[] = []

        if (bot instanceof Client)
            dir = this.config.system.path.event.discord
        else
            dir = this.config.system.path.event.mineflayer
        dir = join(__dirname, '..', dir)

        const files = readdirSync(dir)
            .filter(val => filesFilter(dir, val))

        if (files.length == 0) return void this.logger.warn(`[SYSTEM] Dir ${dir} is empty`)

        for (let i = 0; i < files.length; i++) {
            const fileName = files[i]
            const event: EventBuilder = require(join(dir, fileName))

            if (!event) { this.logger.error(`event file ${fileName} is empty`); continue }
            else if (!event.name) { this.logger.error(`event file ${fileName} is missing name param`); continue }
            else if (!event.execute) { this.logger.error(`event file ${fileName} is missing execute function`); continue }
            else {
                if (event.once == true) once(event.name, (...args: any[]) => event.execute(this, ...args))
                else on(event.name, (...args: any[]) => event.execute(this, ...args))
                listened.push(event.name)
            }
        }

        return void this.logger.info(`[${bot instanceof Client ? 'DISCORD.JS' : 'MINEFLAYER'}] Listened to ${listened.length} event(s)`)
    }
    private commandHandler(mode: 'mineflayer' | 'discord') {
        const dir = join(__dirname, '..', this.config.system.path.command[mode]),
            files = readdirSync(dir)
                .filter(val => filesFilter(dir, val))

        if (files.length == 0) return void this.logger.warn(`[SYSTEM] Dir ${dir} is empty`)


        for (let i = 0; i < files.length; i++) {
            const command: SlashCommandBuilder | MineflayerCommandBuilder = require(join(dir, files[i]))

            this.commands[mode].collections.set(command.name, <any>command)
            if (command instanceof SlashCommandBuilder) this.commands.discord.jsonArray.push(command.toJSON())
            else if (command instanceof SlashCommandBuilderWithData) this.commands.discord.jsonArray.push(command.data.toJSON())
        }

        this.logger.info(`[${mode.toUpperCase()}] Handled ${this.commands[mode].collections.size} command(s) ${mode == 'discord' ? `(JSON Array: ${this.commands.discord.jsonArray.length})` : ''}`)
    }
}