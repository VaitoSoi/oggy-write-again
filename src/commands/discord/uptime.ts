import ms from "ms";
import { SlashCommandBuilder } from "../..";

export default new SlashCommandBuilder()
    .setName('uptime')
    .setDescription('Hiển thị thời gian chạy của bot')
    .setRun((interaction, client) => {
        interaction.editReply(
            `--- ${interaction.client.user.tag} Uptime ---\n` +
            `> Dicord Client: ${ms(interaction.client.uptime)} (<t:${Math.round(interaction.client.readyTimestamp/1000)}:R>)\n` +
            (client?.bot
                ? `> Mineflayer Bot: ${ms(Date.now() - client.data.loginAt)} (<t:${Math.round(client.data.loginAt / 1000)}:R>)`
                : ''
            )
        )
    })