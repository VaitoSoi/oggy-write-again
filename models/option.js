const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
    guild_id: String,
    guild_name: String,
    config: {
        channels: {
            livechat: String,
            status: String,
            restart: String,
        },
        messages: {
            status: String,
            restart: String,
        },
        roles: {
            restart: String,
        },
        chatType: String,
        prefix: String,
    },
})

module.exports = mongoose.model('option', Schema)