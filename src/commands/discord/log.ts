import { SlashCommandBuilder } from "../../index";

export default new SlashCommandBuilder()
    .setName('log')
    .setDescription('Log thông tin về một player')
    .addStringOption(option => option
        .setName('player')
        .setDescription('Player cần log')
        .setRequired(true)
        .setAutocomplete(true)
    )
    .setRun(async function (interaction, client) {
        try { console.log(client?.bot?.players[<string>interaction.options.getString('player')]) }
        catch (e) { console.error(e) }
        interaction.editReply('Logged')
    })
    .setAutocompleteRun(async function (interaction, client) {
        const focusedValue = interaction.options.getFocused();
		const choices = Object.keys(client?.bot?.players ?? {})
		const filtered = choices.filter(choice => choice.startsWith(focusedValue));
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		);
    })