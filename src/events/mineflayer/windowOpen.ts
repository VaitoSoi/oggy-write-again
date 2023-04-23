import { EventBuilder, MineflayerEvents } from '../../index.js'
import * as Window from 'prismarine-windows'
import { consoleEmbed, sendMessage } from '../../modules/message.js'

export default new EventBuilder()
    .setName(MineflayerEvents.WindowOpen)
    .setOnce(false)
    .setRun(async function (client, window: Window.Window) {
            switch (window.slots.length) {
                case 46:
                    const pins = client.config.minecraft.pin.split(' ').map(Number)
                    await client.bot?.simpleClick.leftMouse(pins[0])
                    await client.bot?.simpleClick.leftMouse(pins[1])
                    await client.bot?.simpleClick.leftMouse(pins[2])
                    await client.bot?.simpleClick.leftMouse(pins[3])
                    sendMessage(client, new consoleEmbed()
                        .setTitle('Đã nhập PIN')
                        .setDescription(
                            `**Thông tin chi tiết:**\n` +
                            `> Máy chủ: ${client.config.minecraft.ip}\n` +
                            `> Đăng nhập với tên: ${client.bot?.username}`
                        )
                        .setColor('Green')
                    )
                    break;
                case 63:
                    await client.bot?.simpleClick.leftMouse(13)
                    sendMessage(client, new consoleEmbed()
                        .setTitle('Đã nhập vào ô chuyển cụm máy chủ')
                        .setDescription(
                            `**Thông tin chi tiết:**\n` +
                            `> Máy chủ: ${client.config.minecraft.ip}\n` +
                            `> Đăng nhập với tên: ${client.bot?.username}`
                        )
                        .setColor('Green')
                    )
            }
        }
    )