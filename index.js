const { Client, Collection } = require('discord.js')
const client = new Client({
    intents: 131071,
    partials: ['MESSAGE', 'REACTION', 'USER'],
    allowedMentions: {
        repliedUser: false,
        roles: false,
        users: false
    }
})

/**
 * 
 * Collection
 * 
 */

client.slash = new Collection()
client.message = new Collection()
client.aliases = new Collection()

/**
 * 
 * Handler
 * 
 */

require('./discord/handler/event')(client)
require('./discord/handler/message')(client)

/**
 * 
 * Load ENV
 * 
 */

require('dotenv').config('./.env')

/**
 * 
 * Connect Database
 * 
 */

require('mongoose').connect(
    process.env.MONGOOSE,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    }
).then(() => console.log('[MONGOOSE]\x1b[32m CONNECTED\x1b[0m'))

/**
 * 
 * Login
 * 
 */

client.login(process.env.TOKEN)
    .catch((e) => console.log(`[CLIENT] LOGIN ERROR: ${e}\x1b[0m`))