const { SlashCommandBuilder } = require('discord.js');
const { PlayerManager: playerManager } = require('../utils/playerManager');
const { createCharacterEmbed } = require('../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('perfil')
        .setDescription('Muestra tu perfil de personaje')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Ver el perfil de otro usuario')
                .setRequired(false)),

    async execute(interaction, guildId) {
        const targetUser = interaction.options.getUser('usuario') || interaction.user;
        const userId = targetUser.id;
        const player = playerManager.getPlayer(userId, guildId);

        if (!player) {
            return interaction.reply({ 
                content: `❌ ${targetUser.id === interaction.user.id ? 'No tienes' : 'Este usuario no tiene'} un personaje. Usa \`/crear\` para crear uno.`, 
                ephemeral: true 
            });
        }

        const embed = createCharacterEmbed(player, userId, targetUser.username);
        await interaction.reply({ embeds: [embed] });
    },
};
