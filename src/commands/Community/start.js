const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

const User = require('../../models/userAccount');

module.exports = {
    data: new SlashCommandBuilder() 
        .setName('start')
        .setDescription('Create a user account and earn coins.'),
    async execute(interaction) {
        try {
            const existingUser = await User.findOne({ userId: interaction.user.id });

            if (existingUser) {
                await interaction.reply('You already have an account!');
                return;
            }

            const termsEmbed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('Terms & Conditions')
                .setDescription('SUSSY BAKA IM TOO LAZY TO MAKE SOMETHING RIGHT NOW')
                .setTimestamp()

            const acceptButton = new ButtonBuilder()
                .setCustomId('accept_terms')
                .setLabel('Accept')
                .setStyle(ButtonStyle .Success);

            const row = new ActionRowBuilder().addComponents(acceptButton);
            const termsMessage = await interaction.reply({
                embeds: [termsEmbed],
                components: [row],
            });

            const filter = (i) => i.customId === "accept_terms" && i.user.id === 
            interaction.user.id;

            const collector = termsMessage.createMessageComponentCollector({
                filter,
                time: 10000,
            });

            collector.on('collect', async (interaction) => {
                if (interaction.user.id !== interaction.user.id) {
                    await interaction.reply('This is not your message.');
                    return;
                }

                await interaction.update({
                    embeds: [termsEmbed],
                    components: [],
                });

                const newUser = new User({
                    userId: interaction.user.id,
                    userName: interaction.user.username,
                    balance: 1000,
                });

                await newUser.save();

                const successMessage = 'Your Account has been created with **1000**';

                await interaction.editReply({ content: successMessage, embeds: [] });
                collector.stop();

            });

            collector.on('end', (collected) => {
                if (collected.size === 0) {
                    interaction.editReply({
                        embeds: [termsEmbed],
                        components: [],
                    });
                    interaction.followUp(
                        "You did not accept the terms & conditions in time."
                    );
                }
            });
        } catch (err) {
            console.error('Error:', err);
            await interaction.reply('An error occurred while creating your account');
        }
    }
};
