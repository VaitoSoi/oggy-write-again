import { MinecraftCommandBuilder } from "../../index.js";

export default new MinecraftCommandBuilder()
    .setName('ping')
    .setRun(function (args, bot) {
        bot.chat(`Ping: ${bot.player.ping}`)
    })