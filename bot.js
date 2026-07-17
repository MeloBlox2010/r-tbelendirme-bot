const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});


client.once("ready", () => {
    console.log(`✅ Bot aktif: ${client.user.tag}`);
});


client.on("interactionCreate", async interaction => {

    if (!interaction.isChatInputCommand()) return;

    console.log("Komut geldi:", interaction.commandName);

    try {

        const command = require(`./commands/${interaction.commandName}.js`);

        console.log("Dosya bulundu");

        await command.execute(interaction);

        console.log("Komut çalıştı");

    } catch (error) {

        console.error(error);

        if (interaction.deferred || interaction.replied) {

            await interaction.editReply({
                content: "❌ Hata oluştu."
            });

        } else {

            await interaction.reply({
                content: "❌ Hata oluştu.",
                ephemeral: true
            });

        }
    }

});


client.login(process.env.TOKEN);
const noblox = require("noblox.js");

client.once("ready", async () => {
    console.log(`✅ Bot aktif: ${client.user.tag}`);

    try {
        await noblox.setCookie(process.env.ROBLOX_COOKIE);
        console.log("✅ Roblox giriş başarılı");

    } catch (err) {
        console.log("❌ Roblox giriş hatası:", err.message);
    }
});