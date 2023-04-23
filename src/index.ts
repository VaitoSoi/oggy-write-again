// Import package
import Discord from 'discord.js'
import * as Mineflayer from 'mineflayer'
import mongoose from 'mongoose'
import _package from '../package.json' assert { type: "json" };
import ms from 'ms'

// Import Mineflayer plugins
import afk from './modules/afk.js'
import tps from './modules/tps.js'

// Import handler modules
import eventsHandler from './handlers/events.js'
import commandHandler from './handlers/command.js'

interface Package {
    name: string;
    version: string;
    main: string;
    repository: string;
    github: string;
    author: string;
    license: string;
    dependencies: Object;
    type: string;
}
interface Data {
    loginAt: number;
    currentCluster: number;
}
export class Client {
    config: ENV | YAML;
    client_1: Discord.Client;
    client_2: Discord.Client;
    bot?: Mineflayer.Bot;
    package: Package;
    data: Data
    commands: Discord.Collection<string, SlashCommandBuilder | SlashCommandBuilderWithData>;
    commandsJson: Array<Discord.RESTPostAPIChatInputApplicationCommandsJSONBody>
    constructor(config: ENV | YAML) {
        console.log(config)
        this.config = config
        this.commands = new Discord.Collection()
        this.commandsJson = []
        this.package = _package
        this.data = {
            loginAt: 0,
            currentCluster: 0
        }
        const clientConfig = {
            intents: 513,
            partials: [Discord.Partials.Channel, Discord.Partials.Message, Discord.Partials.User]
        }
        this.client_1 = new Discord.Client(clientConfig)
        this.client_2 = new Discord.Client(clientConfig);
        (async () => await mongoose.connect(this.config.database.link))()
    };
    setConfig(config: ENV | YAML): Client {
        this.config = config;
        return this
    }
    async start(): Promise<void> {
        await commandHandler(this)
        this.#discord_login(this.client_1, this.config.discord.token_1)
        if (this.config.discord.token_2)
            this.#discord_login(this.client_2, this.config.discord.token_2)
        this.#minecraft_start()
    }
    #discord_login(client: Discord.Client, token: string): void {
        client.login(token)
            .then(() => console.log(`[DISCORD.JS] [${client?.user?.tag}] Logined`))
            .catch(console.error)
        client.on(Discord.Events.Error, console.error);
        client.on(Discord.Events.Warn, console.error);
        client.on(Discord.Events.ClientReady, async (client) => {
            console.log(`[DISCORD.JS] [${client.user.tag}] User is ready`)
            const rest = new Discord.REST().setToken(token)
            const data = await rest.put(
                Discord.Routes.applicationCommands(client.user.id),
                { body: this.commandsJson },
            );
            console.log(`[DISCORD.JS] [${client.user.tag}] Registered ${(<Array<Discord.RESTPostAPIChatInputApplicationCommandsJSONBody>>data).length ?? 0}/${this.commandsJson.length} application (/) commands.`);
            eventsHandler({ client, mode: EventHandlerMode.Discord, config: this })
        })
    }
    #minecraft_start() {
        this.bot = Mineflayer.createBot({
            username: this.config.minecraft.username,
            password: this.config.minecraft.password,
            host: this.config.minecraft.ip,
            version: this.config.minecraft.version,
            hideErrors: true
        })
        this.bot.loadPlugins([afk, tps]);
        this.bot.once('spawn', () => {
            console.log(`[MINEFLAYER] [${this.bot?.username}] Spawned`)
            eventsHandler({ bot: this.bot, mode: EventHandlerMode.Mineflayer, config: this })
        });
        this.bot.once('end', () => void setTimeout(() => this.#minecraft_start(), 5 * 60 * 1000));
    }
}

type Callback<T> = T | PromiseLike<T>
export interface Bot extends Mineflayer.Bot {
    getTps(): number
    afk: {
        start(): void
        stop(): void
    }
}

export class SlashCommandBuilder extends Discord.SlashCommandBuilder {
    run: (interaction: Discord.CommandInteraction, client?: Client) => Callback<void>
    autocompleteRun: (interaction: Discord.AutocompleteInteraction, client?: Client) => Callback<void>
    constructor() {
        super()
        this.setName('name')
        this.setDescription('description')
        this.setDMPermission(false)
    }
    setRun(run: (interaction: Discord.CommandInteraction, client?: Client) => Callback<void>) { this.run = run; return this; }
    setAutocompleteRun(run: (interaction: Discord.AutocompleteInteraction, client?: Client) => Callback<void>) { this.autocompleteRun = run; return this; }
}
interface SlashCommandBuilderWithDataOption {
    data: Discord.SlashCommandBuilder | Discord.SlashCommandSubcommandsOnlyBuilder
    run: (interaction: Discord.CommandInteraction, client?: Client) => Callback<void>
    autocompleteRun: (interaction: Discord.AutocompleteInteraction, client?: Client) => Callback<void>
}
export class SlashCommandBuilderWithData {
    data: Discord.SlashCommandBuilder | Discord.SlashCommandSubcommandsOnlyBuilder
    run: (interaction: Discord.CommandInteraction, client?: Client) => Callback<void>
    autocompleteRun: (interaction: Discord.AutocompleteInteraction, client?: Client) => Callback<void>
    constructor(config?: SlashCommandBuilderWithDataOption) {
        this.data = config?.data ?? new SlashCommandBuilder()
        this.run = config?.run ?? function () { }
        this.autocompleteRun = config?.autocompleteRun ?? function () { }
    }
    setData(data: Discord.SlashCommandBuilder | Discord.SlashCommandSubcommandsOnlyBuilder) {
        this.data = data
        return this
    }
    setRun(run: (interaction: Discord.CommandInteraction, client?: Client) => Callback<void>) {
        this.run = run
        return this
    }
    setAutocompleteRun(run: (interaction: Discord.AutocompleteInteraction, client?: Client) => Callback<void>) {
        this.autocompleteRun = run
        return this
    }
}
interface MinecraftCommandBuilderOption {
    name: string;
    description: string;
    usage: string
    aliases: Array<string>
    run: (args: Array<string>, bot: Mineflayer.Bot) => Callback<void>
}
export class MinecraftCommandBuilder {
    name: string;
    description: string;
    usage: string
    aliases: Array<string>
    run: (args: Array<string>, bot: Mineflayer.Bot) => Callback<void>
    constructor(option?: MinecraftCommandBuilderOption) {
        this.name = option?.name || 'namw'
        this.description = option?.description ?? 'Lệnh không có miêu tả'
        this.usage = option?.usage ?? 'Lệnh không có cách dùng'
        this.aliases = option?.aliases ?? []
        this.run = option?.run ?? function () { }
    }
    setName(name: string) {
        this.name = name; return this;
    };
    setDescription(description: string) {
        this.description = description; return this;
    };
    setUsage(usage: string) {
        this.usage = usage; return this;
    };
    setAliases(aliases: Array<string>) {
        this.aliases = aliases; return this;
    };
    setRun(run: (args: Array<string>, bot: Mineflayer.Bot) => Callback<void>) {
        this.run = run; return this;
    };
}

type DiscordEvents = Discord.Events
export enum MineflayerEvents {
    "Chat" = "chat",
    "Whisper" = "whisper",
    "ActionBar" = "actionBar",
    "Message" = "message",
    "MessageStr" = "messagestr",
    "InjectAllowed" = "inject_allowed",
    "Login" = "login",
    "Spawn" = "spawn",
    "Respawn" = "respawn",
    "Game" = "game",
    "ResourcePack" = "resourcePack",
    "Title" = "title",
    "Rain" = "rain",
    "WeatherUpdate" = "weatherUpdate",
    "Time" = "time",
    "Kicked" = "kicked",
    "End" = "end",
    "Error" = "error",
    "SpawnReset" = "spawnReset",
    "Death" = "death",
    "Health" = "health",
    "Breath" = "breath",
    "EntityAttributes" = "entityAttributes",
    "EntitySwingArm" = "entitySwingArm",
    "EntityHurt" = "entityHurt",
    "EntityDead" = "entityDead",
    "EntityTaming" = "entityTaming",
    "EntityTamed" = "entityTamed",
    "EntityShakingOffWater" = "entityShakingOffWater",
    "EntityEatingGrass" = "entityEatingGrass",
    "EntityWake" = "entityWake",
    "EntityEat" = "entityEat",
    "EntityCriticalEffect" = "entityCriticalEffect",
    "EntityMagicCriticalEffect" = "entityMagicCriticalEffect",
    "EntityCrouch" = "entityCrouch",
    "EntityUncrouch" = "entityUncrouch",
    "EntityEquip" = "entityEquip",
    "EntitySleep" = "entitySleep",
    "EntitySpawn" = "entitySpawn",
    "ItemDrop" = "itemDrop",
    "PlayerCollect" = "playerCollect",
    "EntityGone" = "entityGone",
    "EntityMoved" = "entityMoved",
    "EntityDetach" = "entityDetach",
    "EntityAttach" = "entityAttach",
    "EntityUpdate" = "entityUpdate",
    "EntityEffect" = "entityEffect",
    "EntityEffectEnd" = "entityEffectEnd",
    "PlayerJoined" = "playerJoined",
    "PlayerUpdated" = "playerUpdated",
    "PlayerLeft" = "playerLeft",
    "BlockUpdate" = "blockUpdate",
    "BlockPlaced" = "blockPlaced",
    "ChunkColumnLoad" = "chunkColumnLoad",
    "ChunkColumnUnload" = "chunkColumnUnload",
    "SoundEffectHeard" = "soundEffectHeard",
    "HardcodedSoundEffectHeard" = "hardcodedSoundEffectHeard",
    "NoteHeard" = "noteHeard",
    "PistonMove" = "pistonMove",
    "ChestLidMove" = "chestLidMove",
    "BlockBreakProgressObserved" = "blockBreakProgressObserved",
    "BlockBreakProgressEnd" = "blockBreakProgressEnd",
    "DiggingCompleted" = "diggingCompleted",
    "DiggingAborted" = "diggingAborted",
    "Move" = "move",
    "ForcedMove" = "forcedMove",
    "Mount" = "mount",
    "Dismount" = "dismount",
    "WindowOpen" = "windowOpen",
    "WindowClose" = "windowClose",
    "Sleep" = "sleep",
    "Wake" = "wake",
    "Experience" = "experience",
    "ScoreboardCreated" = "scoreboardCreated",
    "ScoreboardDeleted" = "scoreboardDeleted",
    "ScoreboardTitleChanged" = "scoreboardTitleChanged",
    "ScoreUpdated" = "scoreUpdated",
    "ScoreRemoved" = "scoreRemoved",
    "ScoreboardPosition" = "scoreboardPosition",
    "TeamCreated" = "teamCreated",
    "TeamRemoved" = "teamRemoved",
    "TeamUpdated" = "teamUpdated",
    "TeamMemberAdded" = "teamMemberAdded",
    "TeamMemberRemoved" = "teamMemberRemoved",
    "BossBarCreated" = "bossBarCreated",
    "BossBarDeleted" = "bossBarDeleted",
    "BossBarUpdated" = "bossBarUpdated",
    "HeldItemChanged" = "heldItemChanged",
    "PhysicsTick" = "physicsTick",
    "Particle" = "particle",
}
export enum EventHandlerMode {
    Both = 0,
    Discord = 1,
    Mineflayer = 2
}
export interface EventHandlerConfig {
    client?: Discord.Client;
    bot?: Mineflayer.Bot;
    mode: EventHandlerMode;
    config: Client;
}
interface EventConfig {
    name: DiscordEvents | MineflayerEvents | string;
    once: boolean;
    run: (client: Client, ...args: any[]) => Callback<void>
}
export class EventBuilder {
    name: DiscordEvents | MineflayerEvents | string;
    once: Boolean;
    run: (...args: any[]) => Callback<void>;
    constructor(config?: EventConfig) {
        this.name = config?.name || '';
        this.once = config?.once || false;
        this.run = config?.run || function () { };
    };
    setName(name: string): EventBuilder {
        this.name = name; return this;
    };
    setOnce(once: Boolean): EventBuilder {
        this.once = once; return this;
    };
    setRun(run: (client: Client, ...args: any[]) => Callback<void>) {
        this.run = run; return this;
    };
}

interface DiscordConfig {
    token_1: string
    token_2: string
}
interface MinecraftConfig {
    username: string
    password: string
    pin: string
    ip: string
    version: string
    reconnectTimeout: number
}
interface StatusConfig {
    type: string
    updateInterval: number
    discord: {
        text: string,
        status: string | Discord.PresenceUpdateStatus
    }
    minecraft: {
        connect: string | Discord.PresenceUpdateStatus
        disconnect: string | Discord.PresenceUpdateStatus
    }
}
interface DatabaseConfig {
    link: string
}
export class ENV {
    readonly discord: DiscordConfig
    readonly minecraft: MinecraftConfig
    readonly status: StatusConfig
    readonly database: DatabaseConfig
    constructor(env: any) {
        const discord = {
            token_1: env.DISCORD_TOKEN_1 ?? '',
            token_2: env.DISCORD_TOKEN_2 ?? '',
        }
        const minecraft = {
            username: env.MINECRAFT_USERNAME ?? 'player',
            password: env.MINECRAFT_PASSWORD ?? '',
            pin: env.MINECRAFT_PIN ?? '1 1 1 1',
            ip: env.MINECRAFT_IP ?? '2y2c.asia',
            version: env.MINECRAFT_VERSION ?? '1.16.5',
            port: Number(env.MINECRAFT_PORT) ?? 25565,
            reconnectTimeout: (isNaN(env.MINECRAFT_RECONNECTTIMEOUT)
                ? ms(<string>env.MINECRAFT_RECONNECTTIMEOUT)
                : Number(env.MINECRAFT_RECONNECTTIMEOUT)) ?? 5 * 1000
        }
        const status = {
            type: env.STATUS_TYPE ?? 'discord',
            updateInterval: env.STATUS_UPDATEINTERVAL ?? '5m',
            discord: {
                text: (env.STATUS_DISCORD_TEXT?.startsWith('[') && env?.STATUS_DISCORD_TEXT.endsWith(']')
                    ? env.STATUS_DISCORD_TEXT?.slice(1, -1).split(',')
                    : env.STATUS_DISCORD_TEXT?.split(',')) ?? [`OggyTheCode ${_package.version}`, `Created by: ${_package.author}`],
                status: env.STATUS_DISCORD_TYPE ?? Discord.PresenceUpdateStatus.Online
            },
            minecraft: {
                disconnect: env.STATUS_MINECRAFT_DISCONNECT ?? Discord.PresenceUpdateStatus.DoNotDisturb,
                connect: env.STATUS_MINECRAFT_CONNECT ?? Discord.PresenceUpdateStatus.DoNotDisturb
            }
        }
        const database = {
            link: env.DATABASE_LINK
        }
        this.discord = discord;
        this.minecraft = minecraft;
        this.status = status
        this.database = database
    }
}

export class YAML {
    readonly discord: DiscordConfig
    readonly minecraft: MinecraftConfig
    readonly status: StatusConfig
    readonly database: DatabaseConfig
    constructor(yaml: any) {
        const discord = {
            token_1: yaml.discord.token_1 ?? '',
            token_2: yaml.discord.token_2 ?? '',
        }
        const minecraft = {
            username: yaml.minecraft.username ?? 'player',
            password: yaml.minecraft.password ?? '',
            pin: yaml.minecraft.pin ?? '1 1 1 1',
            ip: yaml.minecraft.ip ?? '2y2c.asia',
            version: yaml.minecraft.version ?? '1.16.5',
            port: yaml.minecraft.port ?? '25565',
            reconnectTimeout: (!!yaml.minecraft.reconnectTimeout && Number.isNaN(yaml.minecraft.reconnectTimeout)
                ? ms(<string>(yaml.minecraft.reconnectTimeout))
                : Number(yaml.minecraft.reconnectTimeout)) ?? 5 * 1000
        }
        const status = {
            type: yaml.status.type ?? 'discord',
            updateInterval: yaml.status.updateInterval ?? '5m',
            discord: {
                text: (yaml.status.discord.text?.startsWith('[') && yaml?.status.discord.text.endsWith(']')
                    ? yaml.status.discord.text?.slice(1, -1).split(',')
                    : yaml.status.discord.text?.split(',')) ?? [`OggyTheCode ${_package.version}`],
                status: yaml.status.discord.status ?? Discord.PresenceUpdateStatus.Online
            },
            minecraft: {
                disconnect: yaml.status.minecraft.disconnect ?? Discord.PresenceUpdateStatus.DoNotDisturb,
                connect: yaml.status.minecraft.connect ?? Discord.PresenceUpdateStatus.DoNotDisturb
            }
        }
        const database = yaml.database
        this.discord = discord;
        this.minecraft = minecraft;
        this.status = status
        this.database = database
    }
}
