import { Client } from "../index.js";
import Discord from 'discord.js';
import option from '../database/option.js'

export const colors = {
    
}
/**
 * 
 * @param {Client} client 
 * @param {Discord.Embed | String} message 
 */
export async function sendMessage(client, message) {
    const sendOption = message instanceof Embed ? { embeds: [message] } : { content: message };
    /**
     * @param {Discord.Client} client 
     * @param {String} id 
     */
    const fetchGuild = (client, id) => client.guilds.cache.get(id)
    const datas = await option.find()
    datas.forEach(data => {
        const guild = fetchGuild(client.client_1, data.guildid) ?? fetchGuild(client.client_2, data.guildid) ?? undefined
        if (!guild) return
        const channel = guild.channels.cache.get(data.config.channels.livechat)
        if (!channel || channel.type != Discord.ChannelType.GuildText) return
        channel.send(sendOption)
    })
}