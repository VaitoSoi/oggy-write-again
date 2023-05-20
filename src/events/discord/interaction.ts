import { Interaction, Events, InteractionType, ChannelType, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js'
import { EventBuilder } from '../../index'

export default new EventBuilder()
    .setName(Events.InteractionCreate)
    .setOnce(false)
    .setRun(async function (config, interaction: Interaction) {
        if (interaction.type == InteractionType.ApplicationCommand) {
            const cmd = config.commands.get(interaction.commandName)
            if (!cmd) return void interaction.reply('😥 Không tìm thấy lệnh bạn vừa gửi.')
            await interaction.deferReply()
            Promise.resolve(cmd.run(<ChatInputCommandInteraction>interaction, config))
                .then(() => { })
                .catch(console.error)
                .finally(async function () {
                    const logChannel =
                        config.client_1.channels.cache.get(config.config.discord.channel.log) ??
                        config.client_2.channels.cache.get(config.config.discord.channel.log)
                    const command: string = `${interaction.commandName} ${[...interaction.options.data].shift()?.name ?? ''} ${[...interaction.options.data].shift()?.options?.shift()?.name ?? ''}`
                    if (logChannel?.type == ChannelType.GuildText)
                        return void logChannel?.send({
                            embeds: [
                                new EmbedBuilder()
                                    .setAuthor({
                                        name: `${interaction.client.user.tag} Command Excute`,
                                        iconURL: interaction.client.user.avatarURL() ?? undefined
                                    })
                                    .setTitle('Vừa có một lệnh đươc thực thi')
                                    .addFields(
                                        {
                                            name: 'Thông tin',
                                            value:
                                                'Lệnh:\n' +
                                                'Người dùng:\n' +
                                                'Guild:\n',
                                            inline: true
                                        },
                                        {
                                            name: 'Giá trị',
                                            value:
                                                `${command}\n` +
                                                `${interaction.user.tag}\n` +
                                                `${interaction.guild?.name}`,
                                            inline: true
                                        }
                                    )
                                    .setFooter({
                                        text: `OggyTheCode ${config.package.version}`,
                                        iconURL: `https://github.com/${config.package.github}.png`
                                    })
                                    .setTimestamp()
                                    .setColor((await interaction.guild?.fetch())?.members.me?.displayHexColor ?? 'Random')
                            ]
                        })
                })
        } else if (interaction.type == InteractionType.ApplicationCommandAutocomplete) {
            const cmd = config.commands.get(interaction.commandName)
            if (cmd) Promise.resolve(cmd.autocompleteRun)
                .then(async func => await func(interaction, config))
                .catch(console.error)
        } //else console.log(interaction)
    })