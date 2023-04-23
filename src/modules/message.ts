import { Client } from "../index.js";
import Discord from 'discord.js';
import option from '../database/option.js'
import _package from '../../package.json' assert { type: "json" };
export class consoleEmbed extends Discord.EmbedBuilder {
    constructor() {
        super()
        this
            .setAuthor({
                name: `Oggy Console`,
                iconURL: `attachment://image/console.png`
            })
            .setFooter({
                text: `OggyTheCode ${_package.version}`,
                iconURL: `https://github.com/${_package.github}.png`
            })
    }
}
export async function sendMessage(client: Client, message: Discord.EmbedBuilder | string) {
    const sendOption = message instanceof Discord.EmbedBuilder ? { embeds: [message] } : message;
    const fetchGuild = (client: Discord.Client, id: string = '') => client.guilds.cache.get(id)
    const datas = await option.find()
    let sent: Array<string> = []
    datas.forEach(async function (data) {
        const guild = fetchGuild(client.client_1, data.guildid) || fetchGuild(client.client_2, data.guildid)
        if (!guild || sent.includes(guild.id)) return
        const channel = guild.channels.cache.get(data.config?.channels?.livechat || '')
        if (!channel || channel.type != Discord.ChannelType.GuildText || !channel.permissionsFor(await guild.members.fetchMe()).has(Discord.PermissionFlagsBits.SendMessages)) return
        sent.push((await channel.send(sendOption)).guildId)
    })
}