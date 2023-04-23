import { EventBuilder, MineflayerEvents } from '../../index.js'
import { sendMessage, consoleEmbed } from '../../modules/message.js'

export default new EventBuilder()
    .setName(MineflayerEvents.Spawn)
    .setOnce(true)
    .setRun(function (client) {
            client.data.currentCluster = 0
            console.log(`[MINEFLAYER] ${client.bot?.username} spawned`)
            client.data.loginAt = Date.now()
            sendMessage(client, new consoleEmbed()
                .setTitle('Đã đăng nhập vào máy chủ')
                .setDescription(
                    `**Thông tin chi tiết:**\n` +
                    `> Máy chủ: ${client.config.minecraft}\n` +
                    `> Tên người chơi: ${client.bot?.username}\n` 
                )
                .setColor('Green'))
        }
    )