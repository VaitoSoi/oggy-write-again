import { SlashCommanderBuilder } from '../index'

export default new SlashCommanderBuilder()
    .setName('ping')
    .setDescription('Kiểm tra độ trễ của bot')
    .setRun(async function (interaction) {
        const client = interaction.client
        const message = await interaction.channel.send('⏳ Checking delay...')
        const msgPing = (await message.delete()).createdTimestamp - interaction.createdTimestamp
        const wsPing = client.ws.ping 
        /**
         * @param {Number} delay 
         */
        function delay (delay) {
            if (delay <= 100) return `🟢 ${delay}ms`
            else if (delay <= 500) return `🟡 ${delay}ms`
            else if (delay <= 1000) return `🟠 ${delay}ms`
            else return `🔴 ${delay}ms`
        }
        interaction.editReply({
            content:
                `**----- ${client.user.tag} Ping -----**\n` +
                `> Command response: ${delay(msgPing)}\n` +
                `> WS delay: ${delay(wsPing)}\n` 
        })
    })
    .toJSON()