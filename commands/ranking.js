const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { PlayerManager: playerManager } = require('../utils/playerManager');
const { createLeaderboardEmbed } = require('../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ranking')
        .setDescription('Muestra la clasificación de jugadores')
        .addStringOption(option =>
            option.setName('tipo')
                .setDescription('Tipo de ranking')
                .setRequired(false)
                .addChoices(
                    { name: '⭐ Por Nivel', value: 'level' },
                    { name: '💰 Por Oro', value: 'gold' },
                    { name: '🏆 Por Victorias', value: 'wins' }
                )),

    async execute(interaction, guildId) {
        const type = interaction.options.getString('tipo') || 'level';
        const allPlayers = playerManager.players;

        const playerList = Object.entries(allPlayers).map(([userId, player]) => ({
            userId,
            ...player
        }));

        // Ordenar según el tipo
        if (type === 'level') {
            playerList.sort((a, b) => b.level - a.level || b.exp - a.exp);
        } else if (type === 'gold') {
            playerList.sort((a, b) => b.gold - a.gold);
        } else if (type === 'wins') {
            playerList.sort((a, b) => (b.wins || 0) - (a.wins || 0));
        }

        const embed = createLeaderboardEmbed(playerList, type);
        await interaction.reply({ embeds: [embed] });
    },
};
