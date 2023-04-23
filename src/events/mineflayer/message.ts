import { EmbedBuilder } from 'discord.js'
import { EventBuilder, MineflayerEvents } from '../../index.js'
import { sendMessage } from '../../modules/message.js'

export default new EventBuilder()
    .setName(MineflayerEvents.Message)
    .setOnce(true)
    .setRun(function (client, message: String | any) {
            sendMessage(client, new EmbedBuilder()
                
            )
        }
    )