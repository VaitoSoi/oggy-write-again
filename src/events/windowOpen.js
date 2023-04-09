import { EventBuilder, EventType, Client, MineflayerEvents } from '../index.js'
import * as Window from 'prismarine-windows'

export default new EventBuilder()
    .setName(MineflayerEvents.WindowOpen)
    .setType(EventType.Mineflayer)
    .setOnce(false)
    .setRun(
        /**
         * @param {Window.Window} window
         * @param {Client} client
         */
        async function (window, client) {
            switch (window.slots.length) {
                case 46:
                    const pins = client.config.minecraft.pin.split(' ')
                    await client.bot.simpleClick.leftMouse(pins[0])
                    await client.bot.simpleClick.leftMouse(pins[1])
                    await client.bot.simpleClick.leftMouse(pins[2])
                    await client.bot.simpleClick.leftMouse(pins[3])
            }
        }
    )