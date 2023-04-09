import { EventBuilder, EventType, MineflayerEvents } from '../index.js'

export default new EventBuilder()
    .setName(MineflayerEvents.Message)
    .setType(EventType.Mineflayer)
    .setOnce(true)
    .setRun(
        /**
         * @param {String} message 
         */
        function (message) {
            console.log(message.toString())
        }
    )