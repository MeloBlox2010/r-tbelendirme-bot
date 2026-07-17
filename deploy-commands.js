const { REST, Routes } = require("discord.js");
const fs = require("fs");
require("dotenv").config();

const commands = [];

const commandFiles = fs.readdirSync("./commands")
    .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" })
    .setToken(process.env.TOKEN);

(async () => {
    try {
        console.log("Komutlar yükleniyor...");

        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.DISCORD_GUILD_ID
            ),
            {
                body: commands
            }
        );

        console.log("✅ Komutlar yüklendi!");
    } catch (error) {
        console.error(error);
    }
})();