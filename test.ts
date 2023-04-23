import * as mineflayer from "mineflayer";
function start() {
    const bot = mineflayer.createBot({
        username: 'testbot',
        host: 'anarchyvn.net',
        version: '1.16.5',
        hideErrors: true
    })
    bot.once('spawn', () => console.log('spawned'))
    bot.once('end', console.log)
    bot.on('message', console.log)
}
console.log('starting')
start()