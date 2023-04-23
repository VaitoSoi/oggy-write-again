import { EventBuilder, MineflayerEvents } from "../../index.js";
import { sendMessage, consoleEmbed } from "../../modules/message.js";
import ms from "ms";

export default new EventBuilder()
    .setName(MineflayerEvents.End)
    .setOnce(true)
    .setRun(function (client, reason: String) {
        client.data.currentCluster = 0
        sendMessage(client, new consoleEmbed()
            .setTitle('Mất kết nối với máy chủ')
            .setDescription(
                `**Thông tin chi tiết:**\n` +
                `> Máy chủ: ${client.config}\n` +
                `> Tên người chơi: ${client.bot?.username}\n` +
                `> Lý do mất kết nối: ${reason}\n` +
                `> Tổng thời gian online: ${ms(Date.now() - client.data.loginAt)}` +
                `> Kết nối lại sau: ${ms(client.config.minecraft.reconnectTimeout)}`
            )
            .setColor('Red')
        )
    })