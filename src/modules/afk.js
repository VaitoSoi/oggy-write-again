import { Bot } from 'mineflayer'

/**
 * @param {Bot} bot 
 */
export default function (bot) {
    let rotated = false, interval;
    bot.afk = {};
    bot.afk.start = () => {
        bot.setControlState('jump', true)
        interval = setInterval(() => rotate(), 5000)
    }
    bot.afk.stop = () => {
        bot.setControlState('jump', false)
        clearInterval(interval)
    }
    function rotate () {
        bot.look(rotated ? Math.PI : 0);
        rotated = !rotated
    }
}