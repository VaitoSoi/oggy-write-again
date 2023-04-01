import Discord from 'discord.js'
import _package from '../package.json'
import { Config } from './index'
import mineflayer, { supportedVersions } from 'mineflayer'
import afk from './modules/afk'

export class Client {
    /**
     * @param {Config} config 
     */
    constructor(config) {
        this.commands = new Discord.Collection
        this.client_1 = new Discord.Client()
        if (config.discord.token_2) this.client_2 = new Discord.Client()
        this.config = config
    };
    start() {

    }
    /**
     * @param {Discord.Client} client 
     * @param {String} token
     */
    #discord_login(client) {
        client.login(token)
            .then(() => console.log(`[DISCORD] Login as ${client.user.tag}`))
            .catch(console.error)
        client.on(Discord.Events.Error, console.error);
        client.on(Discord.Events.Warn, console.error);
    }
    #minecraft_start() {
        this.bot = mineflayer.createBot({
            username: this.config.minecraft.username,
            password: this.config.minecraft.password,
            host: this.config.minecraft.ip,
            version: this.config.minecraft.version,
        })
        this.bot.loadPlugin(afk);
    }
}

export class EventBuilder {
    /**
     * @param {{name: String; once: boolean; run: Function | Promise}} config 
     */
    constructor(config) {
        if (!config.name || !config.run) throw new Error(`missing name or runfunction`);
        this.name = config.name;
        this.once = config.once || false;
        this.run = Promise.resolve(config.run || undefined);
    }
    /**
     * @param {String} name
     * @return {EventBuilder}
     */
    set setName(name) {
        this.name = name; return this;
    }
    /**
     * @param {Boolean} once
     * @return {EventBuilder}
     */
    set setOnce(once) {
        this.once = once; return this;
    }
    /**
     * @param {Function | Promise} run
     * @return {EventBuilder}
     */
    set setRun(run) {
        this.run = run; return this;
    }
}

export class SlashCommanderBuilder extends Discord.SlashCommandBuilder {
    /**
     * @param {Function | Promise} run
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
                status: env.STATUS_DISCORD_STATUS ?? Discord.PresenceUpdateStatus.Online
            },
            minecraft: {
                interval: env.STATUS_MINECRAFT_INTERVAL ?? '5m',
                disconnect: env.STATUS_MINECRAFT_DISCONNECT ?? Discord.PresenceUpdateStatus.DoNotDisturb,
                connect: env.STATUS_MINECRAFT_CONNECT ?? Discord.PresenceUpdateStatus.DoNotDisturb
            }
        }
        this.discord = discord;
        this.minecraft = minecraft;
        this.status = status
        if (!supportedVersions.includes(this.minecraft.version)) 
            throw new Error(`didn't support version ${this.minecraft.version}`)
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
        this.discord = discord;
        this.minecraft = minecraft;
        this.status = status
        if (!supportedVersions.includes(this.minecraft.version)) 
            throw new Error(`didn't support version ${this.minecraft.version}`)
    }
}