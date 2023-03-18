// Load environment variables from .env file
require('dotenv').config();

// Import required libraries
const { Client, GatewayIntentBits } = require('discord.js');
const { OpenAIApi, Configuration } = require('openai');

// Create a configuration object for the OpenAI API
// Set the organization and API key for authentication
const configuration = new Configuration({
  organization: 'org-Mqhsx8vkRMipSWG5pa6TCl6j',
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize OpenAI API
const openai = new OpenAIApi(configuration);

// Create a Discord bot instance
const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

// Store conversations
const conversations = new Map();

// Event: Bot is ready and connected to Discord
bot.on('ready', () => {
  console.log(`${bot.user.tag} has connected to Discord!`);
});

// Event: Message is created in a text channel
bot.on('messageCreate', async (message) => {
  if (message.author.bot || message.author.id !== '832135466483974196' || message.channel.id !== process.env.TARGET_CHANNEL_ID) return;

  // Extract user message and create prompt for ChatGPT
  const userMessage = message.content.trim();
  const userId = message.author.id;
  const sanitizedUserMessage = userMessage.replace(/[^\w\s]/gi, '');

  // Initialize conversation if it doesn't exist
  if (!conversations.has(userId)) {
    conversations.set(userId, [
      {
        role: 'system',
        content: 'You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible. Knowledge cutoff: September 2021 Current date: ' + new Date().toLocaleString(),
      },
    ]);
  }

  // Add user message to conversation
  conversations.get(userId).push({ role: 'user', content: sanitizedUserMessage });

  try {
    // Call OpenAI API to get a response from ChatGPT
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: conversations.get(userId),
      max_tokens: 150,
      n: 1,
      stop: null,
      temperature: 0.1,
    });

    // Check the reply content
    const reply = response.data.choices[0].message.content.trim();
    // Check the finish_reason
    const finishReason = response.data.choices[0].finish_reason;

    // Add AI message to conversation only if it's not null
    if (reply) {
      conversations.get(userId).push({ role: 'assistant', content: reply });
    }

    // Handle edge cases based on finish_reason
    let warningMessage = '';
    if (finishReason === 'stop') {
      // Natural stopping point; proceed as normal
    } else if (finishReason === 'max_tokens') {
      // Model reached max tokens; inform user that the response might be cut off
      warningMessage = 'The response might be cut off as it reached the maximum token limit.';
    } else if (finishReason === 'length') {
      // Model reached its own token limit; inform user that the response might be incomplete
      warningMessage = 'The response might be incomplete as it reached the model\'s token limit.';
    }

    // Split the message into smaller chunks
    const messageChunks = splitText(reply, 200);

    // Send message chunks one by one
    for (const chunk of messageChunks) {
      await message.reply(chunk);
    }

    // Send the warning message if it's not empty
    if (warningMessage) {
      await message.reply(warningMessage);
    }
  } catch (error) {
    // Log the error and inform the user
    console.error('Error interacting with ChatGPT:', error);
    message.reply('An error occurred while processing your request.');
  }
});

// Function to split text into chunks of specified size
function splitText(text, maxLength) {
  const chunks = [];
  let startIndex = 0;

  while (startIndex < text.length) {
    const endIndex = startIndex + maxLength;
    chunks.push(text.slice(startIndex, endIndex));
    startIndex = endIndex;
  }

  return chunks;
}

// Log in to Discord using the bot token
bot.login(process.env.DISCORD_BOT_TOKEN);