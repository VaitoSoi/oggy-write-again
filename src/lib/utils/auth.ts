import { Oggy } from "..";

export async function enterPIN(oggy: Oggy): Promise<boolean> {
    const bot = oggy.mineflayer
    if (!bot) return false

    const pin = oggy.config.mineflayer.account.pin?.split(' ').map(Number)
    const slot = oggy.config.mineflayer.server.pinPattern
    if (!pin || !slot) return false

    for (let i = 0; i < pin.length; i++) {
        try {
            await bot.simpleClick.leftMouse(slot?.find(val => val.pin == pin[i])?.slot || 0)
        } catch (error) {
            return false
        }
    }

    return true
}

export async function enterPass(oggy: Oggy): Promise<boolean> {
    const bot = oggy.mineflayer
    if (!bot) return false

    const password = oggy.config.mineflayer.account.password
    const chatPattern = oggy.config.mineflayer.server.chatPattern
    if (!password || !chatPattern) return false

    bot.chat(chatPattern.replace('{password}', password))
    return true
}