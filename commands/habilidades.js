const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { PlayerManager: playerManager, CLASSES } = require('../utils/playerManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('habilidades')
        .setDescription('Muestra tus habilidades especiales de clase'),

    async execute(interaction, guildId) {
        const userId = interaction.user.id;
        const player = playerManager.getPlayer(userId, guildId);

        if (!player) {
            return interaction.reply({ 
                content: '❌ No tienes un personaje. Usa `/crear` para crear uno.', 
                ephemeral: true 
            });
        }

        const classInfo = CLASSES[player.class];
        const abilities = player.abilities || classInfo.abilities || [];

        const manaPercent = Math.floor(((player.stats.mana || player.stats.maxMana) / player.stats.maxMana) * 10);
        const manaBar = '█'.repeat(manaPercent) + '░'.repeat(10 - manaPercent);
        
        const embed = new EmbedBuilder()
            .setColor('#9B59B6')
            .setTitle(`✨ HABILIDADES ${classInfo.emoji} ${classInfo.name.toUpperCase()}`)
            .setDescription(`╔═══════════════════════════╗\n**Nivel:** \`${player.level}\` | **Maná:** \`${player.stats.mana || player.stats.maxMana}/${player.stats.maxMana}\`\n💙 [${manaBar}] ${Math.floor(((player.stats.mana || player.stats.maxMana) / player.stats.maxMana) * 100)}%\n╚═══════════════════════════╝\n\n💡 *Usa estas habilidades en combate con* \`/combate\``)
            .setFooter({ text: `⚡ ${interaction.user.username}` })
            .setTimestamp();

        if (abilities.length === 0) {
            embed.addFields({ 
                name: '❌ Sin Habilidades', 
                value: '```\nNo hay habilidades disponibles\n```' 
            });
        } else {
            abilities.forEach((ability, index) => {
                let description = `\`\`\`yaml\n${ability.description}\n\n`;
                description += `💙 Coste: ${ability.manaCost} maná\n`;
                
                if (ability.type === 'heal') {
                    description += `💚 Curación: ${Math.floor(ability.healPercent * 100)}% HP\n`;
                } else if (ability.type === 'buff') {
                    description += `💪 Duración: ${ability.effect.duration} turnos\n`;
                } else if (ability.damage) {
                    description += `⚔️ Daño: ${Math.floor(ability.damage * 100)}% ATK`;
                    if (ability.hits > 1) {
                        description += ` x${ability.hits} golpes`;
                    }
                    description += '\n';
                }

                if (ability.critBonus) {
                    description += `💥 Crítico: +${Math.floor(ability.critBonus * 100)}%\n`;
                }

                if (ability.armorPierce) {
                    description += `🗡️ Penetración: ${Math.floor(ability.armorPierce * 100)}%\n`;
                }

                description += '\`\`\`';

                embed.addFields({ 
                    name: `━━━ ${index + 1}. ${ability.name.toUpperCase()} ━━━`, 
                    value: description,
                    inline: false 
                });
            });
        }

        // Mostrar habilidades de arma si está equipada
        if (player.equipment && player.equipment.weapon && player.equipment.weapon.ability) {
            const weaponAbility = player.equipment.weapon.ability;
            embed.addFields({ 
                name: '━━━━━━━ ⚔️ HABILIDAD DE ARMA ━━━━━━━', 
                value: `\`\`\`\n${weaponAbility.name}\n\n${weaponAbility.description}\n\`\`\``,
                inline: false 
            });
        }

        await interaction.reply({ embeds: [embed] });
    },
};
