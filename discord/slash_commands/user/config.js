const { CommandInteraction } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { PermissionFlagsBits } = require('discord-api-types/v10')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription('Cài đặt bot')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand => subcommand
            .setName('create')
            .setDescription('Tạo cài đặt mới')
        )
        .addSubcommandGroup(scg => scg
            .setName('set')
            .setDescription('Chỉnh cài đặt của bot')
            .addSubcommand(sc => sc
                .setName('channel')
                .setDescription('Cài 1 channel')
                .addStringOption(o => o
                    .setName('type')
                    .setDescription('Loại channel muốn cài')
                    .addChoices(
                        {
                            name: 'livechat',
                            value: 'livechat'
                        },
                        {
                            name: 'restart',
                            value: 'restart'
                        },
                        {
                            name: 'status',
                            value: 'status'
                        }
                    )
                    .setRequired(true)
                )
                .addChannelOption(o => o
                    .setName('channel')
                    .setDescription('Channel muốn cài')
                    .addChannelTypes(0)
                    .setRequired(true)
                )
            )
        )
        .addSubcommand(scg => scg
            .setName('show')
            .setDescription('Hiển thị cài đặt của bot')
        ),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */ 
    run: async(interaction) => {
        const client = interaction.client

    }
} 