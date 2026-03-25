const { Client, GatewayIntentBits, Partials, REST, Routes, ChannelType } = require('discord.js');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const TOKEN = config.TOKEN;
const DEFAULT_SKULL_EMOJI = config.DEFAULT_SKULL_EMOJI;
const DEFAULT_SKULLBOARD_CHANNEL = config.DEFAULT_SKULLBOARD_CHANNEL;
const DEFAULT_THRESHOLD = config.DEFAULT_THRESHOLD;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

// In-memory storage
const skullboardMessages = new Map(); // messageId => skullboard message
const serverSettings = {}; // guildId => {emoji, channel, threshold}

// -----------------------
// Events
// -----------------------
client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// Reaction add
client.on('messageReactionAdd', async (reaction, user) => {
    if (user.bot) return;
    if (reaction.partial) await reaction.fetch();

    const guildId = reaction.message.guild.id;
    const settings = serverSettings[guildId] || {
        emoji: DEFAULT_SKULL_EMOJI,
        channel: DEFAULT_SKULLBOARD_CHANNEL,
        threshold: DEFAULT_THRESHOLD
    };

    if (String(reaction.emoji) !== settings.emoji) return;
    if (reaction.message.channel.name === settings.channel) return;

    if (reaction.count >= settings.threshold && !skullboardMessages.has(reaction.message.id)) {
        const channel = reaction.message.guild.channels.cache.find(c => c.name === settings.channel && c.isTextBased());
        if (!channel) return;
        const sent = await channel.send(`💀 **Skulled Message**\n${reaction.message.content}\n— ${reaction.message.author}`);
        await sent.pin();
        skullboardMessages.set(reaction.message.id, sent);
    }
});

// Reaction remove
client.on('messageReactionRemove', async (reaction, user) => {
    if (user.bot) return;
    if (reaction.partial) await reaction.fetch();

    const guildId = reaction.message.guild.id;
    const settings = serverSettings[guildId] || {
        emoji: DEFAULT_SKULL_EMOJI,
        channel: DEFAULT_SKULLBOARD_CHANNEL,
        threshold: DEFAULT_THRESHOLD
    };

    if (String(reaction.emoji) !== settings.emoji) return;

    if (skullboardMessages.has(reaction.message.id) && reaction.count < settings.threshold) {
        const sent = skullboardMessages.get(reaction.message.id);
        if (sent) await sent.delete();
        skullboardMessages.delete(reaction.message.id);
    }
});

// -----------------------
// Slash commands
// -----------------------
const commands = [
    {
        name: 'skullthreshold',
        description: 'Set required reactions for skullboard',
        options: [{ name: 'threshold', type: 4, description: 'Number of reactions required', required: true }]
    },
    {
        name: 'skullleaderboard',
        description: 'View top skullboard posts'
    },
    {
        name: 'skullreacts',
        description: 'View top users by total skull reactions'
    },
    {
        name: 'setup',
        description: 'Configure your skullboard server settings',
        options: [
            { name: 'channel', type: 3, description: 'Skullboard channel name', required: true },
            { name: 'emoji', type: 3, description: 'Emoji for skull', required: true },
            { name: 'threshold', type: 4, description: 'Reactions required to skull', required: true }
        ]
    },
    { name: 'ping', description: 'Check bot latency' }
];

const rest = new REST({ version: '10' }).setToken(TOKEN);
(async () => {
    try {
        console.log('Registering slash commands...');
        await rest.put(Routes.applicationCommands(client.user?.id || '0'), { body: commands });
        console.log('Slash commands registered.');
    } catch (error) {
        console.error(error);
    }
})();

// Command handling
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const guildId = interaction.guild.id;
    const data = serverSettings[guildId] || {};

    switch (interaction.commandName) {
        case 'skullthreshold':
            const threshold = interaction.options.getInteger('threshold');
            if (!serverSettings[guildId]) serverSettings[guildId] = {};
            serverSettings[guildId].threshold = threshold;
            await interaction.reply({ content: `Skull threshold set to ${threshold}`, ephemeral: true });
            break;

        case 'skullleaderboard':
            await interaction.reply({ content: `Total posts on skullboard: ${skullboardMessages.size}`, ephemeral: true });
            break;

        case 'skullreacts':
            await interaction.reply({ content: 'This feature is coming soon!', ephemeral: true });
            break;

        case 'setup':
            const channel = interaction.options.getString('channel');
            const emoji = interaction.options.getString('emoji');
            const thresholdVal = interaction.options.getInteger('threshold');
            serverSettings[guildId] = { channel, emoji, threshold: thresholdVal };
            await interaction.reply({ content: 'Server skullboard settings updated!', ephemeral: true });
            break;

        case 'ping':
            await interaction.reply({ content: `Pong! ${Math.round(client.ws.ping)}ms`, ephemeral: true });
            break;
    }
});

client.login(TOKEN);
