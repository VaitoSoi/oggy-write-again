const { Client } = require('discord.js')

module.exports = {
    name:'ready',
    /**
     * 
     * @param {Client} client 
     */
    async run (client) {
        require('../handler/slash.js')(client)
        console.log(`[CLIENT]\x1b[32m ${client.user.tag} IS READY\x1b[0m`);
    }
}