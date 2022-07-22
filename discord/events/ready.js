const { Client } = require('discord.js')
const util = require('minecraft-server-util')

module.exports = {
    name:'ready',
    /**
     * Ready event
     * @param {Client} client 
     */
    async run (client) {
        console.log(`[CLIENT]\x1b[32m ${client.user.tag} IS READY\x1b[0m`)
        require('../handler/slash.js')(client)
        let mc = () => {
            util.statusLegacy(process.env.MINECRAFT_HOST, Number(process.env.MINECRAFT_PORT))
                .then((res) => require('../../minecraft/main')(client))
                .catch((e) => setTimeout(() => mc(), 5 * 60 * 1000))
        }
        mc()
    }
}