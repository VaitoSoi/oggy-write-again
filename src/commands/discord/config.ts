import { SlashCommandBuilder } from "discord.js";
import { SlashCommandBuilderWithData } from "../../index.js";

export default new SlashCommandBuilderWithData()
    .setData(new SlashCommandBuilder()
        .setName('config')
        .setDescription('Chỉnh sửa cài đặt của bot tại guild hiện tại')
        .addSubcommand(sub => sub
            .setName('create')
            .setDescription('Tạo cơ sở dữ liệu mới cho guild')
        )
        .addSubcommandGroup(subgroup => subgroup
            .setName('edit')
            .setDescription('Chỉnh sửa cơ sở dữ liệu của guild')
            .addSubcommand(sub => sub
                .setName('channel')
                .setDescription('Chỉnh sửa các dữ liệu liên quan đến các kênh')
                .addStringOption(opt => opt
                    .setName('type')
                    .setDescription('Loại kênh muốn chỉnh')
                    .addChoices(
                        { name: 'Livechat: Kênh truyền tin nhắn trực tiếp từ máy chủ', value: 'livechat' },
                        { name: 'Status: Kênh thông tin về tình trạng của máy chủ', value: 'status' },
                        { name: 'Restart: Kênh thông tin về việc khởi động lại của máy chủ (Hiện không hoạt động)', value: 'restart' }
                    )
                )
            )
        )
        .addSubcommand(sub => sub
            
        )
    )