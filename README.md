# 💀 Skullboard Discord Bot (JavaScript)

A reaction-based highlighting system for Discord with **slash commands**.
Members can react with 💀 (or your chosen emoji) to “skull” a message. When reactions hit the threshold, the message is automatically posted, pinned, and tracked in a **skullboard channel**.

---

## ✨ Features

* Posts messages that reach the skull threshold to **#skullboard**
* Removes posts if reactions drop below the threshold
* Pins skullboard messages automatically
* Tracks leaderboard of posts and skull reactions
* Configurable via `config.json`

### Slash Commands

* `/skullthreshold` — set required reactions
* `/skullleaderboard` — view top skullboard posts
* `/skullreacts` — view top users by total skull reactions
* `/setup` — configure skullboard channel, emoji, and threshold
* `/ping` — check bot latency

---

## ⚙️ Setup

### Step 1: Create a Discord Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click **New Application** and name it
3. Go to **Bot → Add Bot**
4. Enable **Message Content Intent**

---

### Step 2: Invite the Bot to Your Server

1. Go to **OAuth2 → URL Generator**
2. Select **Scopes:** `bot`
3. Select **Bot Permissions:**

   * View Channels
   * Send Messages
   * Read Message History
   * Add Reactions
   * Manage Messages (optional for pinning)
4. Use the generated URL to invite the bot

---

### Step 3: Install Dependencies

```bash
npm install
```

---

### Step 4: Configure the Bot

Edit **config.json**:

```json
{
  "TOKEN": "YOUR_BOT_TOKEN_HERE",
  "DEFAULT_SKULL_EMOJI": "💀",
  "DEFAULT_SKULLBOARD_CHANNEL": "skullboard",
  "DEFAULT_THRESHOLD": 3
}
```

---

### Step 5: Create Skullboard Channel

Create a text channel in your server named:

```
#skullboard
```

(Or whatever you set in `DEFAULT_SKULLBOARD_CHANNEL`)

---

### Step 6: Run the Bot

```bash
node index.js
```

The bot will now:

* Monitor 💀 reactions
* Post messages that hit the threshold
* Remove posts if reactions drop
* Pin skullboard posts automatically

---

## 📁 Project Files

### package.json

```json
{
  "name": "skullboard-bot-js",
  "version": "1.0.0",
  "description": "Discord Skullboard bot in JavaScript",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "discord.js": "^14.11.0"
  }
}
```

### config.json

```json
{
  "TOKEN": "YOUR_BOT_TOKEN_HERE",
  "DEFAULT_SKULL_EMOJI": "💀",
  "DEFAULT_SKULLBOARD_CHANNEL": "skullboard",
  "DEFAULT_THRESHOLD": 3
}
```

### index.js

```javascript
// (Paste the full JavaScript code I sent you earlier here)
```

---

## 🔧 Customization

Change emoji:

```json
"DEFAULT_SKULL_EMOJI": "🔥"
```

Change threshold:

```json
"DEFAULT_THRESHOLD": 5
```

Change channel:

```json
"DEFAULT_SKULLBOARD_CHANNEL": "hall-of-fame"
```

---

## 👑 Made By

**Tyler** and his friend **Chloe**
