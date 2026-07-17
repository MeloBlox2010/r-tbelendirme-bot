const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const noblox = require('noblox.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rütbe-terfi')
        .setDescription('Bir kişiyi Roblox grubunda terfi ettirir.')
        .addStringOption(option =>
            option
                .setName('kişi')
                .setDescription('Roblox kullanıcı adı')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('sebep')
                .setDescription('Terfi sebebi')
                .setRequired(true)
        ),

    async execute(interaction) {

        console.log("Terfi komutu başladı");

        await interaction.deferReply();

        try {

            const yetkiliId = await noblox.getIdFromUsername(
                process.env.BOT_USERNAME
            );

            const yetkiliRank = await noblox.getRankInGroup(
                process.env.GROUP_ID,
                yetkiliId
            );

            if (yetkiliRank < Number(process.env.MIN_RANK)) {
                return interaction.editReply(
                    'Bu komutu kullanacak yetkiye sahip değilsin.'
                );
            }


            const username = interaction.options.getString('kişi');
            const reason = interaction.options.getString('sebep');


            const userId = await noblox.getIdFromUsername(username);


            const oldRankName = await noblox.getRankNameInGroup(
                process.env.GROUP_ID,
                userId
            );


            await noblox.promote(
                process.env.GROUP_ID,
                userId
            );


            const newRankName = await noblox.getRankNameInGroup(
                process.env.GROUP_ID,
                userId
            );


            const embed = new EmbedBuilder()
                .setColor("#57F287")
                .setTitle("İşlem Başarıyla Tamamlandı")
                .setDescription(
                    `**${username}** isimli kişiye terfi verildi.\n\n` +
                    `Eski Rütbe: ${oldRankName}\n` +
                    `Yeni Rütbe: ${newRankName}\n\n` +
                    `Sebep: ${reason}`
                )
                .setFooter({
                    text: `Yetkili: ${interaction.user.username}`
                })
                .setTimestamp();


            await interaction.editReply({
                embeds: [embed]
            });


        } catch (error) {

            console.error(error);

            await interaction.editReply({
                content:
                    `Terfi sırasında hata oluştu.\n\nHata: ${error.message}`
            });

        }
    }
};