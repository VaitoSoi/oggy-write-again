import { BaseInteraction, ChatInputCommandInteraction, Events } from "discord.js";
import { EventBuilder } from "../../lib/builders/event";

export default new EventBuilder()
    .setName(Events.InteractionCreate)
    .setExecute(async (oggy, interaction: BaseInteraction) => {
        if (interaction.isChatInputCommand()) {
            const commandName = interaction.commandName
            const command = oggy.commands.discord.collections.get(commandName)

            if (!command) return void await interaction.reply('Unknown command :c')

            await interaction.deferReply()
            return void await command.execute(oggy, interaction)
        }
    })