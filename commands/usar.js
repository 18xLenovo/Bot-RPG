const { SlashCommandBuilder } = require('discord.js');
const { PlayerManager: playerManager } = require('../utils/playerManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('usar')
        .setDescription('Usa un item consumible')
        .addStringOption(option =>
            option.setName('item')
                .setDescription('ID del item a usar')
                .setRequired(true)),

    async execute(interaction, guildId) {
        const userId = interaction.user.id;
        const itemId = interaction.options.getString('item');
        const player = playerManager.getPlayer(userId, guildId);

        if (!player) {
            return interaction.reply({ 
                content: '❌ No tienes un personaje. Usa `/crear` para crear uno.', 
                ephemeral: true 
            });
        }

        const item = player.inventory.find(i => i.id === itemId);

        if (!item) {
            return interaction.reply({ 
                content: '❌ No tienes este item en tu inventario.', 
                ephemeral: true 
            });
        }

        if (item.type !== 'consumible') {
            return interaction.reply({ 
                content: '❌ Este item no se puede usar. Usa `/inventario` para equipar items.', 
                ephemeral: true 
            });
        }

        // Aplicar efecto del item
        if (item.effect === 'heal') {
            playerManager.removeItem(userId,  itemId, 1);
            
            return interaction.reply({ 
                content: `✅ Has usado **${item.name}**. Úsalo durante el combate para restaurar ${item.value} HP.`,
                ephemeral: true 
            });
        }

        if (item.effect === 'mana') {
            playerManager.removeItem(userId,  itemId, 1);
            
            return interaction.reply({ 
                content: `✅ Has usado **${item.name}**. Úsalo durante el combate para restaurar ${item.value} Maná.`,
                ephemeral: true 
            });
        }

        if (item.effect === 'full') {
            playerManager.removeItem(userId,  itemId, 1);
            
            return interaction.reply({ 
                content: `✅ Has usado **${item.name}**. Restaura HP y Maná durante el combate.`,
                ephemeral: true 
            });
        }

        await interaction.reply({ content: '❌ Efecto del item no implementado.' });
    },
};
