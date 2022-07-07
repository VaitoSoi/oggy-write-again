const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
    guild: {
        id: String,
        name: String,
    },
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
        disable: Array,
        chatType: String,
    },
})

module.exports = mongoose.model('option', Schema)