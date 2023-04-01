import Discord from 'discord.js'

interface DiscordJs {
    token_1: String,
    token_2: String,
}
interface Minecraft {
    username: String,
    password: String,
    pin: String,
    ip: String,
    version: String,
    port: Number,
}
interface DiscordStatus {
    interval: String,
    text: Array,
    status: Discord.PresenceUpdateStatus,
}
interface MinecraftStatus {
    interval: String,
    disconnect: Discord.PresenceUpdateStatus,
    connect: Discord.PresenceUpdateStatus,
}
interface Status {
    type: String,
    discord: DiscordStatus,
    minecraft: MinecraftStatus,
}
export interface Config {
    discord: DiscordJs,
    minecraft: Minecraft,
    status: Status
}