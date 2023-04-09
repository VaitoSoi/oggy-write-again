import Discord from 'discord.js'
import * as Mineflayer from 'mineflayer'
import Mongoose from 'mongoose'

type Callback<T> = T | PromiseLike<T>
export class Client {
    constructor(config: ENV | YAML);
    config: ENV | YAML;
    client_1: Discord.Client;
    client_2: Discord.Client;
    bot: Mineflayer.Bot;
    database: Mongoose;
    commands: Discord.Collection<String, SlashCommanderBuilder>;
    commandsJson: Array<Discord.RESTPostAPIChatInputApplicationCommandsJSONBody>
    setConfig(config: ENV | YAML): this;
    start(): void;
}

export type DiscordEvents = Discord.Events
export declare enum MineflayerEvents {
    Chat = "chat",
    Whisper = "whisper",
    ActionBar = "actionBar",
    Message = "message",
    MessageStr = "messagestr",
    Inject_allowed = "inject_allowed",
    Login = "login",
    Spawn = "spawn",
    Respawn = "respawn",
    Game = "game",
    ResourcePack = "resourcePack",
    Title = "title",
    Rain = "rain",
    WeatherUpdate = "weatherUpdate",
    Time = "time",
    Kicked = "kicked",
    End = "end",
    Error = "error",
    SpawnReset = "spawnReset",
    Death = "death",
    Health = "health",
    Breath = "breath",
    EntityAttributes = "entityAttributes",
    EntitySwingArm = "entitySwingArm",
    EntityHurt = "entityHurt",
    EntityDead = "entityDead",
    EntityTaming = "entityTaming",
    EntityTamed = "entityTamed",
    EntityShakingOffWater = "entityShakingOffWater",
    EntityEatingGrass = "entityEatingGrass",
    EntityWake = "entityWake",
    EntityEat = "entityEat",
    EntityCriticalEffect = "entityCriticalEffect",
    EntityMagicCriticalEffect = "entityMagicCriticalEffect",
    EntityCrouch = "entityCrouch",
    EntityUncrouch = "entityUncrouch",
    EntityEquip = "entityEquip",
    EntitySleep = "entitySleep",
    EntitySpawn = "entitySpawn",
    ItemDrop = "itemDrop",
    PlayerCollect = "playerCollect",
    EntityGone = "entityGone",
    EntityMoved = "entityMoved",
    EntityDetach = "entityDetach",
    EntityAttach = "entityAttach",
    EntityUpdate = "entityUpdate",
    EntityEffect = "entityEffect",
    EntityEffectEnd = "entityEffectEnd",
    PlayerJoined = "playerJoined",
    PlayerUpdated = "playerUpdated",
    PlayerLeft = "playerLeft",
    BlockUpdate = "blockUpdate",
    BlockPlaced = "blockPlaced",
    ChunkColumnLoad = "chunkColumnLoad",
    ChunkColumnUnload = "chunkColumnUnload",
    SoundEffectHeard = "soundEffectHeard",
    HardcodedSoundEffectHeard = "hardcodedSoundEffectHeard",
    NoteHeard = "noteHeard",
    PistonMove = "pistonMove",
    ChestLidMove = "chestLidMove",
    BlockBreakProgressObserved = "blockBreakProgressObserved",
    BlockBreakProgressEnd = "blockBreakProgressEnd",
    DiggingCompleted = "diggingCompleted",
    DiggingAborted = "diggingAborted",
    Move = "move",
    ForcedMove = "forcedMove",
    Mount = "mount",
    Dismount = "dismount",
    WindowOpen = "windowOpen",
    WindowClose = "windowClose",
    Sleep = "sleep",
    Wake = "wake",
    Experience = "experience",
    ScoreboardCreated = "scoreboardCreated",
    ScoreboardDeleted = "scoreboardDeleted",
    ScoreboardTitleChanged = "scoreboardTitleChanged",
    ScoreUpdated = "scoreUpdated",
    ScoreRemoved = "scoreRemoved",
    ScoreboardPosition = "scoreboardPosition",
    TeamCreated = "teamCreated",
    TeamRemoved = "teamRemoved",
    TeamUpdated = "teamUpdated",
    TeamMemberAdded = "teamMemberAdded",
    TeamMemberRemoved = "teamMemberRemoved",
    BossBarCreated = "bossBarCreated",
    BossBarDeleted = "bossBarDeleted",
    BossBarUpdated = "bossBarUpdated",
    HeldItemChanged = "heldItemChanged",
    PhysicsTick = "physicsTick",
    Particle = "particle",
}
export declare enum EventHandlerMode {
    Both = 0,
    Discord = 1,
    Mineflayer = 2,
}
export declare enum EventType {
    Discord = 1,
    Mineflayer = 2,
}
interface EventConfig {
    name: DiscordEvents | MineflayerEvent | String;
    once: boolean;
    type: EventType;
    run: (...args: any[]) => Callback<void>
}
export class EventBuilder {
    constructor(config?: EventConfig);
    /**
     * The name of event
     */
    readonly name: DiscordEvents | MineflayerEvent | String;
    /**
     * If this event is one time listened
     */
    readonly once: boolean;
    /**
     * Type of this event
     */
    readonly type: EventType;
    /**
     * The function to called when the event is emitted
     */
    readonly run: Function | Promise<void>;
    setName(name: DiscordEvents | MineflayerEvent | String): this;
    setOnce(once: boolean): this;
    setType(type: EventType): this;
    setRun(run: (...args: any[]) => Callback<void>): this;
}

export class SlashCommanderBuilder extends Discord.SlashCommandBuilder {
    readonly run: Promise<void>;
    setRun(run: (interaction: Discord.CommandInteraction) => Callback<void>): this;
}

export class Config {
    constructor(config?: Object);
    readonly discord: {
        token_1: String;
        token_2: String
    };
    readonly minecraft: {
        username: String;
        password: String;
        pin: String;
        version: String;
        port: String;
    };
    readonly status: {
        type: String;
        discord: {
            interval: String;
            text: Array<String>;
            status: Discord.PresenceUpdateStatus | String
        },
        minecraft: {
            interval: String;
            connect: Discord.PresenceUpdateStatus | String;
            disconnect: Discord.PresenceUpdateStatus | String
        }
    };
    readonly database: String;
}
export class ENV extends Config {
    constructor(env?: Object);
}
export class YAML extends Config {
    constructor(yaml?: Object);
}