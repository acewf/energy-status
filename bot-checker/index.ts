const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TOKEN_BOT || '';
const chatId = process.env.CHAT_ID || ''; // Default chat ID if not set
const apiUrl = process.env.API_URL || 'http://localhost:3000';
const bot = new TelegramBot(token, { polling: true });

type Message = {
    chat: {
        id: number;
    };
    text?: string;
};

let timeID: NodeJS.Timeout;
const timeInterval = 1000 * 60 * 30; // 30 minutes in milliseconds
// Replace with your actual chat ID

let previousStatus = true;

const checkStatus = async () => {
    clearTimeout(timeID);

    try {
        const req = await fetch(`${apiUrl}/api/status`);
        if (!req.ok && previousStatus) {
            bot.sendMessage(chatId, `Energy is OFF!`);
            previousStatus = false; // If the request fails, assume "OFF"
        } else if (!previousStatus && req.ok) {
            bot.sendMessage(chatId, `Energy is ON!`);
            previousStatus = req.status === 200;
        }
    } catch (error) {
        if (previousStatus) {
            console.log('SEND OFF MESSAGE');
            bot.sendMessage(chatId, `Energy is OFF!`);
        }
        previousStatus = false; // If there's an error, assume "OFF"
    }

    timeID = setTimeout(checkStatus, timeInterval); // Check status every 5 seconds
}

checkStatus(); // Start the status check loop