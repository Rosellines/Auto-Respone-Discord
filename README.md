# 🤖 Discord Gemini Bot

![Sample](image1.png)

Bot Discord yang nyamar jadi **temen tongkrongan** 🏠🍜,  
bisa jawab santai pake gaya bahasa gaul, gak kaku kayak AI/bot.  
Ditenagai oleh **Google Gemini AI** 🚀.

---

## ✨ Fitur
- ⚡ **/ask** → nanya langsung ke Gemini AI dengan gaya casual.
- 🖱️ **Reply with Gemini** → klik kanan pesan, balas otomatis pake Gemini.
- 🔔 **Auto-reply** kalau bot di-mention.
- 🎭 Jawaban dibuat seakan-akan bot ini manusia biasa, bukan AI.

---

## 🛠️ Setup
🔑 Scope & Permission

Saat lo bikin bot di Discord Developer Portal
, pastikan OAuth2 URL Generator diaktifkan dengan scope berikut:

Scopes:
 
- bot
- applications.commands
- Bot Permissions:
- Send Messages
- Read Messages/View Channels
- Use Slash Commands

### 1. Clone repo
```bash
git clone <repo-url>
cd <nama-folder>

```bash
npm install

```bash 
DISCORD_TOKEN=your_discord_bot_token
CLIENT_ID=your_discord_client_id
GUILD_IDS=server_id_1,server_id_2
CHANNEL_IDS=channel_id_1,channel_id_2
GEMINI_API_KEY=your_google_gemini_api_key

```bash
node deploy-commands.js

```bash
node index.js

📝 Contoh Perintah

/ask
💬 Input: makan enak apa ya?
🤖 Output: ramen sih, gw jadi laper juga

Klik kanan pesan → Apps → Reply with Gemini
Bot bakal bales sesuai konteks.

Mention bot:
@GeminiBot ayo nongkrong
→ gaskeun lah, dimana? 🍻

```bash
📦 project
 ┣ 📜 index.js          # main bot
 ┣ 📜 deploy-commands.js # daftar slash commands
 ┣ 📜 .env               # config token & API key
 ┣ 📜 package.json
 ┗ 📜 README.md

Catatan
Bot nyamar jadi manusia biasa, jangan sampe ngaku AI/bot.
Jangan lupa invite bot ke server pake scope:

bot applications.commands



