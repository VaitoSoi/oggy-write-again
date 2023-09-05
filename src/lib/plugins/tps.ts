import { Bot } from "mineflayer"

export default function Tps (bot: Bot & { [key: string]: any }) {
    let time = Number(bot.time.age)
    const calcTps: number[] = []
    function run(bot: Bot & { [key: string]: any }) {
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
