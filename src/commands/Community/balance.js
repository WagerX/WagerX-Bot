const { SlashCommandBuilder } = require('discord.js');
const User = require('../../models/userAccount');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Check your account balance.'),

    async execute(interaction) {
        try {
            const existingUser = await User.findOne({ userId: interaction.user.id });
            
            if (existingUser) {
                const formattedBalance = existingUser.balance.toLocaleString();
                await interaction.reply(`Your account balance is **${formattedBalance}**`);
            } else {
                await interaction.reply("You don't have an account yet. Create one by running the '/start' slash command.");
            }
        } catch (err) {
            console.error('Error:', err);
            await interaction.reply('An error occurred while checking your balance.');
        }
    }
};