const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const noblox = require('noblox.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rütbe-tenzil')
        .setDescription('Bir kişiyi Roblox grubunda tenzil eder.')
        .addStringOption(option =>
            option
                .setName('kişi')
                .setDescription('Roblox kullanıcı adı')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('sebep')
                .setDescription('Tenzil sebebi')
                .setRequired(true)
        ),

    async execute(interaction) {

        await interaction.deferReply();

        try {

            // Yetkili kontrolü
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


            const kisi = interaction.options.getString('kişi');
            const sebep = interaction.options.getString('sebep');


            const userId = await noblox.getIdFromUsername(kisi);


            const eskiRutbe = await noblox.getRankNameInGroup(
                process.env.GROUP_ID,
                userId
            );


            await noblox.demote(
                process.env.GROUP_ID,
                userId
            );


            const yeniRutbe = await noblox.getRankNameInGroup(
                process.env.GROUP_ID,
                userId
            );


            const embed = new EmbedBuilder()
                .setColor("#FEE75C")
                .setTitle("İşlem Başarıyla Tamamlandı")
                .setDescription(
                    `**${kisi}** isimli kişinin rütbesi düşürüldü.\n\n` +
                    `Eski Rütbe: ${eskiRutbe}\n` +
                    `Yeni Rütbe: ${yeniRutbe}\n\n` +
                    `Sebep: ${sebep}`
                )
                .setFooter({
                    text: `Yetkili: ${interaction.user.username}`
                })
                .setTimestamp();


            await interaction.editReply({
                embeds: [embed]
            });


            // Log kanalları
            const logChannel1 = interaction.guild.channels.cache.get(
                process.env.LOG_CHANNEL_1
            );

            const logChannel2 = interaction.guild.channels.cache.get(
                process.env.LOG_CHANNEL_2
            );


            if (logChannel1) {
                await logChannel1.send({
                    embeds: [embed]
                });
            }


            if (logChannel2) {
                await logChannel2.send({
                    embeds: [embed]
                });
            }


        } catch (error) {

            console.error(error);

            await interaction.editReply({
                content:
                    `Tenzil sırasında hata oluştu.\n\n` +
                    `Hata: ${error.message}`
            });

        }
    }
};