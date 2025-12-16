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

        const embed = new EmbedBuilder()
            .setColor('#9b59b6')
            .setTitle(`✨ Habilidades de ${classInfo.emoji} ${classInfo.name}`)
            .setDescription(`**Nivel:** ${player.level}\n**Maná:** ${player.stats.mana || player.stats.maxMana}/${player.stats.maxMana}\n\n*Usa estas habilidades durante el combate con el comando \`/combate\`*`)
            .setFooter({ text: interaction.user.username })
            .setTimestamp();

        if (abilities.length === 0) {
            embed.addFields({ 
                name: '❌ Sin habilidades', 
                value: 'No tienes habilidades especiales disponibles.' 
            });
        } else {
            abilities.forEach(ability => {
                let description = ability.description;
                description += `\n💙 **Coste:** ${ability.manaCost} maná`;
                
                if (ability.type === 'heal') {
                    description += `\n💚 Curación: ${Math.floor(ability.healPercent * 100)}% HP`;
                } else if (ability.type === 'buff') {
                    description += `\n💪 Duración: ${ability.effect.duration} turnos`;
                } else if (ability.damage) {
                    description += `\n⚔️ Daño: ${Math.floor(ability.damage * 100)}% ATK`;
                    if (ability.hits > 1) {
                        description += ` x${ability.hits} golpes`;
                    }
                }

                if (ability.critBonus) {
                    description += `\n💥 +${Math.floor(ability.critBonus * 100)}% probabilidad crítico`;
                }

                if (ability.armorPierce) {
                    description += `\n🗡️ Ignora ${Math.floor(ability.armorPierce * 100)}% defensa`;
                }

                embed.addFields({ 
                    name: `${ability.name}`, 
                    value: description,
                    inline: false 
                });
            });
        }

        // Mostrar habilidades de arma si está equipada
        if (player.equipment && player.equipment.weapon && player.equipment.weapon.ability) {
            const weaponAbility = player.equipment.weapon.ability;
            embed.addFields({ 
                name: `⚔️ Habilidad de Arma: ${weaponAbility.name}`, 
                value: weaponAbility.description,
                inline: false 
            });
        }

        await interaction.reply({ embeds: [embed] });
    },
};
