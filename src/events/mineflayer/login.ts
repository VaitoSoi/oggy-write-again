import { EventBuilder, MineflayerEvents } from "../../index.js";

export default new EventBuilder()
    .setName(MineflayerEvents.Login)
    .setOnce(false)
    .setRun(function (client) {
        client.data.currentCluster++
    })