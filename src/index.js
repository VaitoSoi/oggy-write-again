import Discord from 'discord.js'

export class Client extends Discord.Client {
    constructor () {
        this.commands = new Discord.Collection
    };
    start () {
        this.login(process.env.DISCORD_TOKEN)
            .then(() => console.log(`[DISCORD] Login as ${this.user.tag}`))
            .catch(console.error)
        this.on(Discord.Events.Error, console.error);
        this.on(Discord.Events.Warn, console.error);
    }
}

export class EventBuilder {
    /**
     * @param {{name: String; once: boolean; run: Function | Promise}} config 
     */
    constructor (config) {
        if (!config.name || !config.run) throw new Error(`missing name or runfunction`);
        this.name = config.name;
        this.once = config.once || false;
        this.run = Promise.resolve(config.run || undefined);
    }
    /**
     * @param {String} name
     * @return {EventBuilder}
     */
    set setName (name) {
        this.name = name; return this;
    }
    /**
     * @param {Boolean} once
     * @return {EventBuilder}
     */
    set setOnce (once) {
        this.once = once; return this;
    }
    /**
     * @param {Function | Promise} run
     * @return {EventBuilder}
     */
    set setRun (run) {
        this.run = run; return this;
    }
}