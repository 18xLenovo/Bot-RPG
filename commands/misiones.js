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

        const totalCompleted = player.completedQuests?.length || 0;
        const embed = new EmbedBuilder()
            .setColor('#3498DB')
            .setTitle('📜 TABLA DE MISIONES')
            .setDescription(`╔═══════════════════════════╗\n⭐ **Nivel:** \`${player.level}\` | 🎯 **Completadas:** \`${totalCompleted}/${QUESTS.length}\`\n╚═══════════════════════════╝\n\n💡 *Completa misiones para ganar oro y experiencia*`);

        QUESTS.forEach((quest, index) => {
            const completed = player.completedQuests?.includes(quest.id);
            const canAccept = player.level >= quest.levelRequired;
            
            let status = completed ? '✅' : canAccept ? '🟢' : '🔴';
            let statusText = completed ? 'COMPLETADA' : canAccept ? 'DISPONIBLE' : 'BLOQUEADA';
            let requirements = [];

            if (quest.requirements.wins) {
                const current = player.wins || 0;
                const progress = Math.min(100, Math.floor((current / quest.requirements.wins) * 100));
                requirements.push(`🎯 Victorias: ${current}/${quest.requirements.wins} (${progress}%)`);
            }
            if (quest.requirements.level) {
                requirements.push(`⭐ Nivel: ${quest.requirements.level}`);
            }
            if (quest.requirements.completedQuests) {
                const current = player.completedQuests?.length || 0;
                requirements.push(`📜 Misiones: ${current}/${quest.requirements.completedQuests}`);
            }

            const difficulty = {
                'Fácil': '🟢',
                'Media': '🟡',
                'Difícil': '🔴',
                'Muy Difícil': '🔵'
            }[quest.difficulty] || '⚪';

            const value = `\`\`\`yaml\n${quest.description}\n\nEstado: ${statusText}\nDificultad: ${quest.difficulty}\nNivel Mínimo: ${quest.levelRequired}\n\nRequisitos:\n${requirements.map(r => `  • ${r}`).join('\n')}\n\nRecompensas:\n  🪙 ${quest.rewards.gold.toLocaleString()} oro\n  ⭐ ${quest.rewards.exp.toLocaleString()} EXP\n\`\`\``;            embed.addFields({
                name: `━━ ${status} ${index + 1}. ${quest.name.toUpperCase()} ${difficulty}`,
                value: value,
                inline: false
            });
        });

        await interaction.reply({ embeds: [embed] });
    },
};
