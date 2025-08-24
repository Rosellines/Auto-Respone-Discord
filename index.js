import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, ContextMenuCommandBuilder, ApplicationCommandType } from "discord.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// === Validasi .env ===
const { DISCORD_TOKEN, CLIENT_ID, GUILD_IDS, GEMINI_API_KEY } = process.env;
if (!DISCORD_TOKEN || !CLIENT_ID || !GUILD_IDS || !GEMINI_API_KEY) {
  console.error("❌ DISCORD_TOKEN, CLIENT_ID, GUILD_IDS, or GEMINI_API_KEY missing in .env");
  process.exit(1);
}

// === Prompt casual tongkrongan ===
const PROMPT_STYLE = `
Lu adalah temen tongkrongan Discord.
Jawaban harus singkat (1
 kalimat), santai, gaul, dan relevan.
Pake bahasa sehari-hari kayak chat WA/Discord, jangan kaku atau formal.
Jangan keliatan kayak bot/AI, pura-pura manusia biasa.
Aturan gaya bahasa:
- Gua = gw, lo = elu, gak = ga.
- Bisa nyeleneh/ngelantur dikit biar natural.
- Kurangi basa-basi, penjelasan panjang, dan jokes berlebihan.
- Jangan pakai kata: "bertanya", "tanya aja", "cuy", "bro", "anjay", "nanya aja".
Jawaban khusus:
- "Asli mana?" → "banten"
- "Kamu siapa?" → "gw bukan siapa siapa njiir, gw member sini"
- "Kamu bot?" / "AI?" → "gw bukan bot/AI njiir, gw member sini"
- "Umur berapa?" → "gw 30an"
- "Tinggal dimana?" → "di banten"
- Kalau serius → jawab singkat tapi santai
- Kalau absurd → boleh sotoy atau pura2 males mikir
Jangan pernah ngaku lu bot/AI.
`;

// === Inisialisasi Gemini ===
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// === Inisialisasi Discord Bot ===
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
});

// === Slash Command & Context Menu ===
const commands = [
  new SlashCommandBuilder()
    .setName("ask")
    .setDescription("Ask Gemini AI in casual style")
    .addStringOption(option =>
      option.setName("question")
        .setDescription("Your question")
        .setRequired(true)
    ),
  new ContextMenuCommandBuilder()
    .setName("Reply with Gemini")
    .setType(ApplicationCommandType.Message),
].map(cmd => cmd.toJSON());

// === REST client ===
const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);

// === Register Commands Multi-Guild ===
async function registerCommands() {
  const guildIds = GUILD_IDS.split(",").map(id => id.trim());
  console.log("Registering slash & context menu commands for guilds:", guildIds);

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
  console.log("✅ Done registering all commands!");
}

// === Event Ready ===
client.once("ready", () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
  registerCommands();
});

// === Handle Slash Command & Context Menu ===
client.on("interactionCreate", async interaction => {
  if (interaction.isChatInputCommand() && interaction.commandName === "ask") {
    const question = interaction.options.getString("question");
    await interaction.deferReply();

    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: `${PROMPT_STYLE}\nPertanyaan user: ${question}` }] }]
      });
      await interaction.editReply(result.response.text());
    } catch (err) {
      console.error("Gemini Error:", err);
      await interaction.editReply("❌ Error pas generate jawaban dari Gemini.");
    }
  }

  if (interaction.isMessageContextMenuCommand() && interaction.commandName === "Reply with Gemini") {
    await interaction.deferReply();
    const msgContent = interaction.targetMessage.content;

    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: `${PROMPT_STYLE}\nBalas chat ini: ${msgContent}` }] }]
      });
      await interaction.editReply(result.response.text());
    } catch (err) {
      console.error("Gemini Error:", err);
      await interaction.editReply("❌ Error pas generate jawaban dari Gemini.");
    }
  }
});

// === Auto Reply ke Mention ===
client.on("messageCreate", async message => {
  if (message.author.bot) return;
  if (message.mentions.has(client.user)) {
    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: `${PROMPT_STYLE}\nBalas chat ini: ${message.content}` }] }]
      });
      await message.reply(result.response.text());
    } catch (err) {
      console.error("Gemini Error:", err);
      await message.reply("❌ Gemini lagi error bro.");
    }
  }
});

// === Login Discord ===
client.login(DISCORD_TOKEN);
