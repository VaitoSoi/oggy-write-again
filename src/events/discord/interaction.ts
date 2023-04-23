import { Interaction, Events, InteractionType } from 'discord.js'
import { EventBuilder } from '../../index.js'

export default new EventBuilder()
    .setName(Events.InteractionCreate)
    .setOnce(false)
    .setRun(async function (config, interaction: Interaction) {
        if (interaction.type == InteractionType.ApplicationCommand) {
            const cmd = config.commands.get(interaction.commandName)
            if (!cmd) return void interaction.reply('😥 Không tìm thấy lệnh bạn vừa gửi.')
            await interaction.deferReply()
            Promise.resolve(cmd.run)
                .then(async func => await func(interaction, config))
                .catch(console.error)
        } else if (interaction.type == InteractionType.ApplicationCommandAutocomplete) {
            const cmd = config.commands.get(interaction.commandName)
            if (cmd) Promise.resolve(cmd.autocompleteRun)
                .then(async func => await func(interaction, config))
                .catch(console.error)
        } else console.log(interaction)
    })