const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions, MessageManager, Embed, Collection, Events } = require(`discord.js`);
const fs = require('fs');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers ] }); 

client.commands = new Collection();
client.prefix = new Map();

require('dotenv').config();

const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");
const prefixFolders = fs.readdirSync("./src/prefix").filter((f) => f.endsWith(".js"));

for (arx of prefixFolders) {
    const Cmd = require('./prefix/' + arx)
    client.prefix.set(Cmd.name, Cmd)
}

(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./src/events");
    client.handleCommands(commandFolders, "./src/commands");
    client.login(process.env.token)
})();



//Prefix Commands MessageCreate
client.on('messageCreate', async message => {
    const prefix = "?";

    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    const prefixcmd = client.prefix.get(command);
    if (prefixcmd) {
        prefixcmd.run(client, message, args)
    }
});

