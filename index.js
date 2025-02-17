const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

// Initialize Discord client
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

// Initialize Express server
const app = express();
app.use(bodyParser.json());

// Discord bot ready event
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// Handle GitHub webhook
app.post('/webhook', async (req, res) => {
    try {
        const payload = req.body;
        
        // Check if it's a push event
        if (payload.commits && payload.commits.length > 0) {
            const repository = payload.repository.name;
            const branch = payload.ref.split('/').pop();
            const commits = payload.commits;

            // Format message
            let message = `🔨 New commits to **${repository}** (${branch}):\n\n`;
            
            commits.forEach(commit => {
                message += `• \`${commit.id.substring(0, 7)}\`: ${commit.message}\n`;
                message += `  Author: ${commit.author.name}\n`;
            });

            // Send to Discord
            const channel = await client.channels.fetch(process.env.DISCORD_CHANNEL_ID);
            await channel.send(message);
        }

        res.status(200).send('Webhook received');
    } catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).send('Error processing webhook');
    }
});

// Start Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Webhook server is running on port ${PORT}`);
});

// Login Discord bot
client.login(process.env.DISCORD_TOKEN);
