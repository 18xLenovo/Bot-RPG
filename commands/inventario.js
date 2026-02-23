const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { PlayerManager: playerManager } = require('../utils/playerManager');
const { createInventoryEmbed } = require('../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('inventario')
        .setDescription('Muestra tu inventario'),

    async execute(interaction, guildId) {
        const userId = interaction.user.id;
        const player = playerManager.getPlayer(userId, guildId);

        if (!player) {
            return interaction.reply({ 
                content: '❌ No tienes un personaje. Usa `/crear` para crear uno.', 
                ephemeral: true 
            });
        }

        const embed = createInventoryEmbed(player, interaction.user.username);

        // Si tiene items equipables, mostrar menú
        const equipableItems = player.inventory.filter(item => 
            ['weapon', 'armor', 'accessory'].includes(item.type)
        );

        if (equipableItems.length > 0) {
            const options = equipableItems.slice(0, 25).map(item => ({
                label: item.name,
                description: `Equipar ${item.type}`,
                value: item.id
            }));

            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId('equip_item')
                .setPlaceholder('Selecciona un item para equipar')
                .addOptions(options);

            const row = new ActionRowBuilder().addComponents(selectMenu);

            await interaction.reply({ 
                embeds: [embed], 
                components: [row],
                ephemeral: true 
            });

            // Listener para el menú de selección
            const filter = i => i.customId === 'equip_item' && i.user.id === userId;
            const collector = interaction.channel.createMessageComponentCollector({ 
                filter, 
                time: 60000,
                max: 1
            });

            collector.on('collect', async i => {
                const itemId = i.values[0];
                const result = playerManager.equipItem(userId,  itemId);
                
                await i.update({ 
                    content: result.success ? `✅ ${result.message}` : `❌ ${result.message}`,
                    components: []
                });
            });

            collector.on('end', collected => {
                if (collected.size === 0) {
                    interaction.editReply({ components: [] }).catch(() => {});
                }
            });
        } else {
            await interaction.reply({ embeds: [embed] });
        }
    },
};
