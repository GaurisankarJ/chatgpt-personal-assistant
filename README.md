# Discord Chatbot using OpenAI GPT-3.5-turbo

This is a Discord chatbot that uses OpenAI's GPT-3.5-turbo model to provide responses to user messages. The chatbot utilizes the Discord.js library for interacting with Discord and the OpenAI API for generating AI-powered responses.

## Features

- Interactive chatbot for Discord using OpenAI's GPT-3.5-turbo model
- Conversation history management
- Error handling and response chunking for better user experience

## Prerequisites

- Node.js
- Discord.js library
- OpenAI API library
- OpenAI API key
- Discord bot token

## Installation

1. Clone the repository:
```
git clone https://github.com/GaurisankarJ/chatgpt-personal-assistant
cd chatgpt-personal-assistant
```

2. Install the required packages:
```
npm install
```


3. Create a `.env` file in the root directory of your project and add your Discord bot token and OpenAI API key:
```
DISCORD_BOT_TOKEN=your_discord_bot_token
OPENAI_API_KEY=your_openai_api_key
TARGET_CHANNEL_ID=your_target_channel_id
```

## Usage

1. Start the chatbot:
```
npm start
```

2. Invite the bot to your Discord server and interact with it in the specified target channel.

## Customization

You can customize the chatbot by adjusting the following parameters:

- `temperature`: Controls the randomness of the AI-generated responses (higher values result in more diverse responses)
- `max_tokens`: Limits the length of the AI-generated responses
- `stop`: An array of possible stopping sequences to help the model conclude its response more naturally

Additionally, you can modify the input sanitization and validation process to better suit your use case.


