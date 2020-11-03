/**
 * BalBlasdasdasd
 */

import Discord from 'discord.js';
import { exit } from 'process';
import { loggerFile } from './src/logger';
import { config as dotenvConfig } from 'dotenv';
import { DoStatement } from 'typescript';

/**
 * CONFIGURATION
 */
dotenvConfig();

const discordToken = process.env.DISCORD_TOKEN;
const discordChannel = process.env.DISCORD_CHANNEL;


const emojiArray = [
    '💿',
    '📀',
    '🔴',
    '🟢',
    '🔵',
    '🍄',
    '🐸',
    '🏵️',
    '🕺',
    '🕺',
    '💃',
    '🍺',
];

// Initialize discord
const client = new Discord.Client();
client.once('ready', () => {
    loggerFile.info(`Logged in as ${client.user.tag}!`);
});

const latestMessages: Discord.Message[] = [];

client.on('message', (message) => {

    // if message contains the keyword, than start the party
    if (message.content.startsWith('!party')) return startParty();

    // else save the latest message to array
    const newLength = latestMessages.push(message);
    if (newLength >= 20) {
        // to many messages stored -> remove the oldest one
        latestMessages.shift();
    }
});


// Jede Nachricht speichern und die Älteste verwerfen

// Wenn keyword gelesen -> Party !! für 20 sekunden
function startParty() {

    latestMessages.forEach(async (message) => {

        let reactions: Promise<Discord.MessageReaction>[] = []
        
        // Set all emojis
        emojiArray.forEach(emoji => {
            const reaction = message.react(emoji);
            reactions.push(reaction);
        });

        startAnimation(message, reactions);
    });
}

function startAnimation(message: Discord.Message, reactions: Promise<Discord.MessageReaction>[]) : void {

    Promise.all(reactions).then(() => {
        const interval = setInterval(() => {
            const randomReaction = reactions[Math.round(Math.random() * reactions.length)];
            randomReaction.then((reaction) => {
                const emoji = reaction.emoji.toString()
                reaction.remove();
                message.react(emoji);
            })
        }, 1000)
    
        setTimeout(() => {
            clearInterval(interval);
            reactions.forEach(reaction => reaction.then(reaction => reaction.remove()))
        }, 20000)  
    })
}

// Let the party begin 🎉
client.login(discordToken).catch( (error) => {
    loggerFile.error('Failed to login with token: ', error.message);
    exit(1);
});
