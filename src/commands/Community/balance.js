const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
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

        const balanceEmbed = new EmbedBuilder()
          .setColor('#00ffff') // Aqua color for info
          .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
          })
          .setDescription(`Your account balance is **${formattedBalance}**`);

        await interaction.reply({ embeds: [balanceEmbed] });
      } else {
        const noAccountEmbed = new EmbedBuilder()
          .setColor('#ff0000') // Red color for error
          .setTitle('No Account Found')
          .setDescription("You don't have an account yet. Create one by running the '/start' slash command.");

        await interaction.reply({ embeds: [noAccountEmbed] });
      }
    } catch (err) {
      console.error('Error:', err);
      const errorEmbed = new EmbedBuilder()
        .setColor('#ff0000') // Red color for error
        .setTitle('Error')
        .setDescription('An error occurred while checking your balance.');

      await interaction.reply({ embeds: [errorEmbed] });
    }
  }
};
