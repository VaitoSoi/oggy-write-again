// Import package
import Discord from 'discord.js'
import * as Mineflayer from 'mineflayer'
import mongoose from 'mongoose'
import _package from '../package.json' assert { type: "json" }

// Import Mineflayer plugins
import afk from './modules/afk.js'
import tpsPlugin from 'mineflayer-tps'

// Import handler modules
import eventsHandler from './handlers/events.js'
import commandHandler from './handlers/command.js'

export class Client {
    /**
     * @param {ENV | YAML} config 
     */
    constructor(config) {
        this.config = config
        this.commands = new Discord.Collection
        this.commandsJson = []
        const clientConfig = {
            intents: 513,
            partials: [Discord.Partials.Channel, Discord.Partials.Message, Discord.Partials.User]
        }
        this.client_1 = new Discord.Client(clientConfig)
        if (config.discord.token_2) this.client_2 = new Discord.Client(clientConfig);
        (async () => this.database = await mongoose.connect(this.config.database))()
    };
    /**
     * @param {Config} config
     */
    setConfig(config) {
        this.config = config;
        return this
    }
    async start() {
        await commandHandler(this)
        this.#discord_login(this.client_1, this.config.discord.token_1)
        if (this.config.discord.token_2) 
            this.#discord_login(this.client_2, this.config.discord.token_2)
        this.#minecraft_start()
    }
    /**
     * @param {Discord.Client} client 
     * @param {String} token
     */
    #discord_login(client, token) {
        client.login(token)
            .then(() => console.log(`[DISCORD.JS] [${client.user.tag}] Logined`))
            .catch(console.error)
        client.on(Discord.Events.Error, console.error);
        client.on(Discord.Events.Warn, console.error);
        client.on(Discord.Events.ClientReady, async (client) => {
            console.log(`[DISCORD.JS] [${client.user.tag}] User is ready`)
            const rest = new Discord.REST().setToken(token)
            const data = await rest.put(
                Discord.Routes.applicationCommands(client.user.id),
                { body: this.commandsJson }
            )
        })
        eventsHandler({ client, mode: EventHandlerMode.Discord, config: this.config })
    }
    #minecraft_start() {
        this.bot = Mineflayer.createBot({
            username: this.config.minecraft.username,
            password: this.config.minecraft.password,
            host: this.config.minecraft.ip,
            version: this.config.minecraft.version,
        })
        this.bot.loadPlugins([afk, tpsPlugin(Mineflayer)]);
        eventsHandler({ bot: this.bot, mode: EventHandlerMode.Mineflayer, config: this.config });
        this.bot.once('end', () => setTimeout(() => this.#minecraft_start(), 5 * 60 * 1000));
    }
}

export const DiscordEvents = Discord.Events
export const MineflayerEvents = {
    "Chat": "chat",
    "Whisper": "whisper",
    "ActionBar": "actionBar",
    "Message": "message",
    "MessageStr": "messagestr",
    "Inject_allowed": "inject_allowed",
    "Login": "login",
    "Spawn": "spawn",
    "Respawn": "respawn",
    "Game": "game",
    "ResourcePack": "resourcePack",
    "Title": "title",
    "Rain": "rain",
    "WeatherUpdate": "weatherUpdate",
    "Time": "time",
    "Kicked": "kicked",
    "End": "end",
    "Error": "error",
    "SpawnReset": "spawnReset",
    "Death": "death",
    "Health": "health",
    "Breath": "breath",
    "EntityAttributes": "entityAttributes",
    "EntitySwingArm": "entitySwingArm",
    "EntityHurt": "entityHurt",
    "EntityDead": "entityDead",
    "EntityTaming": "entityTaming",
    "EntityTamed": "entityTamed",
    "EntityShakingOffWater": "entityShakingOffWater",
    "EntityEatingGrass": "entityEatingGrass",
    "EntityWake": "entityWake",
    "EntityEat": "entityEat",
    "EntityCriticalEffect": "entityCriticalEffect",
    "EntityMagicCriticalEffect": "entityMagicCriticalEffect",
    "EntityCrouch": "entityCrouch",
    "EntityUncrouch": "entityUncrouch",
    "EntityEquip": "entityEquip",
    "EntitySleep": "entitySleep",
    "EntitySpawn": "entitySpawn",
    "ItemDrop": "itemDrop",
    "PlayerCollect": "playerCollect",
    "EntityGone": "entityGone",
    "EntityMoved": "entityMoved",
    "EntityDetach": "entityDetach",
    "EntityAttach": "entityAttach",
    "EntityUpdate": "entityUpdate",
    "EntityEffect": "entityEffect",
    "EntityEffectEnd": "entityEffectEnd",
    "PlayerJoined": "playerJoined",
    "PlayerUpdated": "playerUpdated",
    "PlayerLeft": "playerLeft",
    "BlockUpdate": "blockUpdate",
    "BlockPlaced": "blockPlaced",
    "ChunkColumnLoad": "chunkColumnLoad",
    "ChunkColumnUnload": "chunkColumnUnload",
    "SoundEffectHeard": "soundEffectHeard",
    "HardcodedSoundEffectHeard": "hardcodedSoundEffectHeard",
    "NoteHeard": "noteHeard",
    "PistonMove": "pistonMove",
    "ChestLidMove": "chestLidMove",
    "BlockBreakProgressObserved": "blockBreakProgressObserved",
    "BlockBreakProgressEnd": "blockBreakProgressEnd",
    "DiggingCompleted": "diggingCompleted",
    "DiggingAborted": "diggingAborted",
    "Move": "move",
    "ForcedMove": "forcedMove",
    "Mount": "mount",
    "Dismount": "dismount",
    "WindowOpen": "windowOpen",
    "WindowClose": "windowClose",
    "Sleep": "sleep",
    "Wake": "wake",
    "Experience": "experience",
    "ScoreboardCreated": "scoreboardCreated",
    "ScoreboardDeleted": "scoreboardDeleted",
    "ScoreboardTitleChanged": "scoreboardTitleChanged",
    "ScoreUpdated": "scoreUpdated",
    "ScoreRemoved": "scoreRemoved",
    "ScoreboardPosition": "scoreboardPosition",
    "TeamCreated": "teamCreated",
    "TeamRemoved": "teamRemoved",
    "TeamUpdated": "teamUpdated",
    "TeamMemberAdded": "teamMemberAdded",
    "TeamMemberRemoved": "teamMemberRemoved",
    "BossBarCreated": "bossBarCreated",
    "BossBarDeleted": "bossBarDeleted",
    "BossBarUpdated": "bossBarUpdated",
    "HeldItemChanged": "heldItemChanged",
    "PhysicsTick": "physicsTick",
    "Particle": "particle",
}
export const EventHandlerMode = {
    Both: 0,
    Discord: 1,
    Mineflayer: 2,
    Mongoose: 3,
}
export const EventType = {
    Discord: 1,
    Mineflayer: 2,
    Mongoose: 3,
}
export class EventBuilder {
    /**
     * @param {{name: String, once: Boolean, type: Number, run: Function | Promise<void>}} config 
     */
    constructor(config) {
        this.name = config?.name || '';
        this.once = config?.once || false;
        this.type = config?.type || EventType.Discord;
        this.run = Promise.resolve(config?.run || undefined);
    };
    /**
     * @param {String} name
     * @return {EventBuilder}
     */
    setName(name) {
        this.name = name; return this;
    };
    /**
     * @param {Boolean} once
     * @return {EventBuilder}
     */
    setOnce(once) {
        this.once = once; return this;
    };
    /**
     * @param {EventType} type
     * @return {EventBuilder}
     */
    setType(type) {
        this.type = type; return this;
    };
    /**
     * @param {Function | Promise} run
     * @return {EventBuilder}
     */
    setRun(run) {
        this.run = run; return this;
    };
}

export class SlashCommanderBuilder extends Discord.SlashCommandBuilder {
    /**
     * @param {Function | Promise<void>} run
     */
    set setRun(run) {
        this.run = Promise.resolve(run); return this;
    }
}

export class ENV {
    /**
     * @param {Object} env
     */
    constructor(env) {
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
            port: env.MINECRAFT_PORT ?? 25565
        }
        const status = {
            type: env.STATUS_TYPE ?? 'discord',
            discord: {
                interval: env.STATUS_DISCORD_INTERVAL ?? '5m',
                text: (env.STATUS_DISCORD_TEXT?.startsWith('[') && env?.STATUS_DISCORD_TEXT.endsWith(']')
                    ? env.STATUS_DISCORD_TEXT?.slice(1, -1).split(',')
                    : env.STATUS_DISCORD_TEXT?.split(',')) ?? [`OggyTheCode ${_package.version}`],
                status: env.STATUS_DISCORD_TYPE ?? Discord.PresenceUpdateStatus.Online
            },
            minecraft: {
                interval: env.STATUS_MINECRAFT_INTERVAL ?? '5m',
                disconnect: env.STATUS_MINECRAFT_DISCONNECT ?? Discord.PresenceUpdateStatus.DoNotDisturb,
                connect: env.STATUS_MINECRAFT_CONNECT ?? Discord.PresenceUpdateStatus.DoNotDisturb
            }
        }
        const database = env.DATABASE
        this.discord = discord;
        this.minecraft = minecraft;
        this.status = status
        this.database = database
        //if (!Mineflayer.supportedVersions.includes(this.minecraft.version))
        //    throw new Error(`didn't support version ${this.minecraft.version}`)
    }
}

export class YAML {
    /**
     * @param {Object} yaml
     */
    constructor(yaml) {
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
            port: yaml.minecraft.port ?? '25565'
        }
        const status = {
            type: yaml.status.type ?? 'discord',
            discord: {
                interval: yaml.status.discord.interval ?? '5m',
                text: (yaml.status.discord.text?.startsWith('[') && yaml?.status.discord.text.endsWith(']')
                    ? yaml.status.discord.text?.slice(1, -1).split(',')
                    : yaml.status.discord.text?.split(',')) ?? [`OggyTheCode ${_package.version}`],
                status: yaml.status.discord.status ?? Discord.PresenceUpdateStatus.Online
            },
            minecraft: {
                interval: yaml.status.minecraft.interval ?? '5m',
                disconnect: yaml.status.minecraft.disconnect ?? Discord.PresenceUpdateStatus.DoNotDisturb,
                connect: yaml.status.minecraft.connect ?? Discord.PresenceUpdateStatus.DoNotDisturb
            }
        }
        const database = yaml.database
        this.discord = discord;
        this.minecraft = minecraft;
        this.status = status
        this.database = database
        //if (!Mineflayer.supportedVersions.includes(this.minecraft.version))
        //    throw new Error(`didn't support version ${this.minecraft.version}`)
    }
}