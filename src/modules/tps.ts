export default tps
import Mineflayer from 'mineflayer'

function tps(bot: Mineflayer.Bot | any): void {
    let time = Number(bot.time.age)
    let calcTps: Array<Number> = []
    function run(bot: Mineflayer.Bot) {
        time = Number(bot.time.age)
        setTimeout(() => {
            const diff = Number(bot.time.age) - time
            calcTps.push(diff)
            if (calcTps.length > 20) {
                calcTps.shift()
            }
            run(bot)
        }, 1000)
    }
    run(bot)

    bot.getTps = function () {
        return calcTps.filter(tps => tps === 20).length
    }
}
