import { Vec3 } from "vec3";
import { ScriptCommand } from "../../lib/builders/command";
import { distance } from "../../lib/utils/utils";
import { goals } from "mineflayer-pathfinder";

export default new ScriptCommand()
    .setName('clickNPC')
    .setExecute(async (args, compiler) => {
        if (!compiler.oggy.mineflayer) return

        const [nX, nY, nZ] = args.slice(1, 4).map(Number)
        if (!nX || !nY || !nZ) return new Error('invalid input')
        const nPos = new Vec3(nX, nY, nZ)

        const botPos = compiler.oggy.mineflayer.entity.position

        const distanceBotNPC = distance(botPos, nPos)
        if (distanceBotNPC > 3) await compiler.oggy.mineflayer.pathfinder.goto(new goals.GoalNear(nPos.x, nPos.y, nPos.z, 2))
        
        const nEntity = compiler.oggy.mineflayer.nearestEntity((entity) => !entity.player && entity.position == nPos)
        if (!nEntity || nEntity == null) return

        await compiler.oggy.mineflayer.activateEntity(nEntity)
    })