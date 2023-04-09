import { EventBuilder, EventType, Client, MineflayerEvents } from '../index.js'

export default new EventBuilder()
    .setName(MineflayerEvents.Spawn)
    .setType(EventType.Mineflayer)
    .setOnce(true)
    .setRun(
        /**
         * @param {Client} config 
         */
        function (config) {
            console.log(`[MINEFLAYER] ${config.bot.username} spawned`)
        }
    )