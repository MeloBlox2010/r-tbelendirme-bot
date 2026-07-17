const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const noblox = require('noblox.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rütbe-değiştir')
        .setDescription('Kişinin rütbesini değiştirir.')
        .addStringOption(option =>
            option
                .setName('kişi')
                .setDescription('Roblox kullanıcı adı')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('rütbe')
                .setDescription('Verilecek rütbe adı')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('sebep')
                .setDescription('Değiştirme sebebi')
                .setRequired(true)
        ),

    async execute(interaction) {

        await interaction.deferReply();

        try {

            // Yetki kontrolü
            const yetkiliId = await noblox.getIdFromUsername(
                process.env.BOT_USERNAME
            );

            const yetkiliRank = await noblox.getRankInGroup(
                process.env.GROUP_ID,
                yetkiliId
            );

            if (yetkiliRank < Number(process.env.MIN_RANK)) {
                return interaction.editReply(
                    "Bu komutu kullanacak yetkiye sahip değilsin."
                );
            }


            const kisi = interaction.options.getString('kişi');
            const rutbe = interaction.options.getString('rütbe');
            const sebep = interaction.options.getString('sebep');


            const userId = await noblox.getIdFromUsername(kisi);


            const eskiRutbe = await noblox.getRankNameInGroup(
                process.env.GROUP_ID,
                userId
            );


            const roller = await noblox.getRoles(
                process.env.GROUP_ID
            );


            const hedefRol = roller.find(
                r => r.name.toLowerCase() === rutbe.toLowerCase()
            );


            if (!hedefRol) {
                return interaction.editReply(
                    "Böyle bir rütbe bulunamadı."
                );
            }


            await noblox.setRank(
                process.env.GROUP_ID,
                userId,
                hedefRol.rank
            );


            const yeniRutbe = await noblox.getRankNameInGroup(
                process.env.GROUP_ID,
                userId
            );


            const embed = new EmbedBuilder()
                .setColor("#57F287")
                .setTitle("İşlem Başarıyla Tamamlandı")
                .setDescription(
                    `**${kisi}** isimli kişinin rütbesi değiştirildi.\n\n` +
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
                    `Rütbe değiştirme sırasında hata oluştu.\n\n` +
                    `Hata: ${error.message}`
            });

        }
    }
};