import { REST, Routes, SlashCommandBuilder } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

// ---------- Define slash commands ----------
const commands = [
  new SlashCommandBuilder()
    .setName("ask")
    .setDescription("Ask Gemini AI in casual style")
    .addStringOption(option =>
      option.setName("question")
        .setDescription("Your question")
        .setRequired(true)
    ),
].map(cmd => cmd.toJSON());

// ---------- Load env safely ----------
const { DISCORD_TOKEN, CLIENT_ID, GUILD_IDS } = process.env;

if (!DISCORD_TOKEN || !CLIENT_ID) {
  console.error("❌ DISCORD_TOKEN or CLIENT_ID missing in .env");
  process.exit(1);
}

const guildIds = GUILD_IDS?.split(",").map(id => id.trim());

if (!guildIds || guildIds.length === 0) {
  console.error("❌ GUILD_IDS is empty or missing in .env");
  process.exit(1);
}

// ---------- Initialize REST client ----------
const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);

// ---------- Register commands ----------
async function registerCommands() {
  console.log("Registering slash commands...");

  for (const guildId of guildIds) {
    try {
      await rest.put(
        Routes.applicationGuildCommands(CLIENT_ID, guildId),
        { body: commands }
      );
      console.log(`✅ Commands registered for guild ${guildId}`);
    } catch (err) {
      console.error(`❌ Error registering commands for guild ${guildId}:`, err);
    }
  }

  console.log("✅ Done registering commands!");
}

// ---------- Run ----------
registerCommands();
