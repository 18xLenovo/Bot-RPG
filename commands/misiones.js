const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { QUESTS } = require('../utils/gameData');
const { PlayerManager: playerManager } = require('../utils/playerManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('misiones')
        .setDescription('Muestra las misiones disponibles'),

    async execute(interaction, guildId) {
        const userId = interaction.user.id;
        const player = playerManager.getPlayer(userId, guildId);

        if (!player) {
            return interaction.reply({ 
                content: '❌ No tienes un personaje. Usa `/crear` para crear uno.', 
                ephemeral: true 
            });
        }

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('📜 Misiones Disponibles')
            .setDescription('Completa misiones para obtener recompensas');

        QUESTS.forEach(quest => {
            const completed = player.completedQuests?.includes(quest.id);
            const canAccept = player.level >= quest.levelRequired;
            
            let status = completed ? '✅ Completada' : canAccept ? '📋 Disponible' : '🔒 Bloqueada';
            let requirements = [];

            if (quest.requirements.wins) {
                const current = player.wins || 0;
                requirements.push(`Victorias: ${current}/${quest.requirements.wins}`);
            }
            if (quest.requirements.level) {
                requirements.push(`Nivel: ${quest.requirements.level}`);
            }
            if (quest.requirements.completedQuests) {
                const current = player.completedQuests?.length || 0;
                requirements.push(`Misiones completadas: ${current}/${quest.requirements.completedQuests}`);
            }

            const rewards = `💰 ${quest.rewards.gold} oro, ⭐ ${quest.rewards.exp} EXP`;

            embed.addFields({
                name: `${status} ${quest.name} [${quest.difficulty}]`,
                value: `*${quest.description}*\n**Requisitos:** ${requirements.join(', ')}\n**Recompensas:** ${rewards}\n**Nivel mínimo:** ${quest.levelRequired}`,
                inline: false
            });
        });

        await interaction.reply({ embeds: [embed] });
    },
};
