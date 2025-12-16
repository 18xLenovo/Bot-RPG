const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { PlayerManager: playerManager } = require('../utils/playerManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('borrar')
        .setDescription('Elimina tu personaje (¡ACCIÓN PERMANENTE!)'),

    async execute(interaction, guildId) {
        const userId = interaction.user.id;
        const player = playerManager.getPlayer(userId, guildId);

        if (!player) {
            return interaction.reply({ 
                content: '❌ No tienes un personaje creado.', 
                ephemeral: true 
            });
        }

        // Crear botones de confirmación
        const confirmButton = new ButtonBuilder()
            .setCustomId('confirm_delete')
            .setLabel('Sí, eliminar')
            .setStyle(ButtonStyle.Danger);

        const cancelButton = new ButtonBuilder()
            .setCustomId('cancel_delete')
            .setLabel('Cancelar')
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder()
            .addComponents(cancelButton, confirmButton);

        await interaction.reply({
            content: `⚠️ **¿Estás seguro que quieres eliminar tu personaje?**\n\nPerderás:\n- Nivel ${player.level}\n- ${player.gold}🪙\n- Todo tu inventario y progreso\n\n**Esta acción NO se puede deshacer.**`,
            components: [row],
            ephemeral: true
        });

        // Collector para los botones
        const filter = i => (i.customId === 'confirm_delete' || i.customId === 'cancel_delete') && i.user.id === userId;
        const collector = interaction.channel.createMessageComponentCollector({ 
            filter, 
            time: 30000,
            max: 1
        });

        collector.on('collect', async i => {
            if (i.customId === 'confirm_delete') {
                playerManager.deletePlayer(userId, guildId);
                await i.update({ 
                    content: '✅ Tu personaje ha sido eliminado. Puedes crear uno nuevo con `/crear`', 
                    components: [] 
                });
            } else {
                await i.update({ 
                    content: '✅ Operación cancelada. Tu personaje está a salvo.', 
                    components: [] 
                });
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                interaction.editReply({ 
                    content: '⏱️ Tiempo agotado. Operación cancelada.', 
                    components: [] 
                }).catch(() => {});
            }
        });
    },
};
