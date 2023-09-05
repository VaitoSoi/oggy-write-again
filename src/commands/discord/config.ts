import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, ComponentType, Embed, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { SlashCommandBuilderWithData } from "../../lib/builders/command";
import { objectValue } from "../../lib/utils/utils";
import { DatabasePath } from "../../lib/database/database";

export default new SlashCommandBuilderWithData()
    .setData(
        new SlashCommandBuilder()
            .setName('config')
            .setDescription('Chỉnh sửa config của bot')
            .addSubcommand(sub => sub
                .setName('menu')
                .setDescription('Mở menu cài đặt')
            )
            .addSubcommand((sub) => sub
                .setName('create')
                .setDescription('Tạo config mới (chỉ dùng khi guild của bạn không có config)')
            )
            .addSubcommand(subgroup => subgroup
                .setName('edit')
                .setDescription('Chỉnh sửa config')
                .addChannelOption(opt => opt
                    .setName('channel')
                    .addChannelTypes(ChannelType.GuildText)
                    .setRequired(true)
                )
                .addStringOption(opt => opt
                    .setName('type')
                    .setDescription('Chức năng của kênh')
                    .addChoices(
                        {
                            name: 'Livechat - Nhận và gửi tin nhắn từ server',
                            value: 'livechat'
                        },
                        {
                            name: 'Status - Hiện thông tin về server',
                            value: 'status'
                        }
                    )
                    .setRequired(true)
                )
            )
            .addSubcommand((sub) => sub
                .setName('show')
                .setDescription('Hiển thị config của guild hiện tại')
            )
            .addSubcommand((sub) => sub
                .setName('delete')
                .setDescription('Xóa cài đặt hiện tại')
                .addStringOption(opt => opt
                    .setName('delete_what')
                    .setDescription('Xóa thứ gì')
                    .setRequired(true)
                    .addChoices(
                        {
                            name: 'Xóa toàn bộ config',
                            value: 'all'
                        },
                        {
                            name: 'Xóa toàn bộ cài đặt về channel',
                            value: 'channel'
                        }
                    )
                )
            )
    )
    .setExecute(async (oggy, interaction) => {
        const db = oggy.database
        if (!db) throw new Error('database is undefined')
        if (!interaction.guild) return void await interaction.editReply('🔴 Command chỉ dùng trong guild')

        switch (interaction.options.getSubcommand()) {
            case 'menu':
                break;

            case 'create':
                if (interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) return void await interaction.editReply('🔴 Bạn thiếu quyền `ADMIN` để thực thi câu lệnh này')
                if (await db.get(interaction.guildId || '') != null) void await interaction.editReply('🔴 Guild này đã config rồi')
                else {
                    const cb = await db.create({
                        guildid: interaction.guild.id,
                        guildname: interaction.guild.name,
                        config: {
                            channels: {
                                livechat: '0',
                                restart: '0',
                                status: '0'
                            }
                        }
                    })
                    if (cb instanceof Error) {
                        await interaction.editReply(`🔴 Gặp lỗi khi tạo config: \n \`\`\`${cb.stack}\`\`\``)
                        void oggy.logger.error(`[DISCORD.JS] Occur an error when running command (GuildID: ${interaction.guild.id}, Command: ${interaction.commandName})`)
                        void oggy.logger.error(`[DISCORD.JS] ${cb.stack}`)
                    } else void await interaction.editReply('🟢 Đã tạo config thành công')
                }
                break;

            case 'edit':
                if (interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) return void await interaction.editReply('🔴 Bạn thiếu quyền `ADMIN` để thực thi câu lệnh này')

                const channel = interaction.options.getChannel('channel', true, [ChannelType.GuildText])
                const type = <'livechat' | 'restart' | 'status'>interaction.options.getString('type', true)
                const cb = await db.set(interaction.guild.id, `config.channels.${type}`, channel.id)
                if (cb instanceof Error) {
                    await interaction.editReply(`🔴 Gặp lỗi khi edit config: \n \`\`\`${cb.stack}\`\`\``)
                    void oggy.logger.error(`[DISCORD.JS] Occur an error when running command (GuildID: ${interaction.guild.id}, Command: ${interaction.commandName})`)
                    void oggy.logger.error(`[DISCORD.JS] ${cb.stack}`)
                } else await interaction.editReply(`🟢 Đã tạo edit thành công`)
                break;

            case 'show':
                const callback = await db.get(interaction.guild.id)
                if (callback == null) await interaction.editReply(`🔴 Config chưa được tạo. Vui lòng dùng lệnh \`/config create\` để tạo config`)
                else if (callback instanceof Error) {
                    await interaction.editReply(`🔴 Gặp lỗi khi edit config: \n \`\`\`${callback.stack}\`\`\``)
                    void oggy.logger.error(`[DISCORD.JS] Occur an error when running command (GuildID: ${interaction.guild.id}, Command: ${interaction.commandName})`)
                    void oggy.logger.error(`[DISCORD.JS] ${callback.stack}`)
                } else if (typeof callback != 'string') {
                    let keys: string[] = [], values: string[] = []
                    const parsedValue = objectValue(callback)

                    for (let i in parsedValue) { keys.push(parsedValue[i][1]); values.push(parsedValue[i][2]) }
                    await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: `${interaction.guild.name}'s Config`,
                                    iconURL: `${interaction.guild.iconURL()}`
                                })
                                // .setTitle('Config Show')
                                .addFields(
                                    {
                                        name: 'Key',
                                        value: keys.join('\n'),
                                        inline: true
                                    },
                                    {
                                        name: 'Value',
                                        value: values.join('\n'),
                                        inline: true
                                    }
                                )
                                .setColor((await interaction.guild.members.fetchMe()).displayColor)
                                .setFooter({
                                    text: 'OggyTheCode',
                                    iconURL: `https://avatars.githubusercontent.com/VaitoSoi`
                                })
                        ]
                    })
                }
                break;

            case 'delete':
                if (interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) return void await interaction.editReply('🔴 Bạn thiếu quyền `ADMIN` để thực thi câu lệnh này')
                const deleteWhat = interaction.options.getString('delete_what', true)
                const collector = (await interaction.editReply({
                    content: `Bạn có chắc xóa ${deleteWhat == 'all' ? 'toàn bộ config' : `config về ${deleteWhat}`} ?`,
                    components: [
                        new ActionRowBuilder<ButtonBuilder>()
                            .addComponents(
                                new ButtonBuilder({
                                    emoji: '🟢',
                                    label: 'Có',
                                    style: ButtonStyle.Success,
                                    customId: 'yes'
                                }),
                                new ButtonBuilder({
                                    emoji: '🔴',
                                    label: 'Không',
                                    style: ButtonStyle.Danger,
                                    customId: 'no'
                                })
                            )
                    ]
                })).createMessageComponentCollector({ componentType: ComponentType.Button, filter: (button) => button.user.id === interaction.user.id, time: 5 * 60 * 1000 })
                collector.on('collect', async (button) => {
                    if (!button.guild) return
                    switch (button.customId) {
                        case 'yes':
                            if (deleteWhat == 'all') db.delete(button.guild.id)
                            else if (deleteWhat == 'channel') {
                                const data = await db.get(button.guild.id)
                                if (typeof data == 'string' || data == null) return

                                const parsedValue = objectValue(data).filter(val => val[0].startsWith('config.channels.'))
                                for (let i in parsedValue) { await db.set(button.guild.id, <keyof DatabasePath>parsedValue[i][1], '0') }
                            }

                            await button.update('🟢 Đã xóa.')
                            break;
                        case 'no':
                            await button.update('🟢 Đã dừng lại.')
                            break;
                        default: collector.stop()
                    }
                })
                collector.on('end', () => void interaction.editReply('🔴 Thời gian chờ đã hết.'))
                break;
        }
    })