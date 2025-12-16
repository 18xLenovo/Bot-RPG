const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { PlayerManager: playerManager } = require('../utils/playerManager');
const { SHOP_ITEMS } = require('../utils/gameData');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tienda')
        .setDescription('Abre la tienda para comprar items')
        .addStringOption(option =>
            option.setName('categoria')
                .setDescription('Categoría de items')
                .setRequired(false)
                .addChoices(
                    { name: '🧪 Consumibles', value: 'consumibles' },
                    { name: '⚔️ Armas', value: 'armas' },
                    { name: '🛡️ Armaduras', value: 'armaduras' },
                    { name: '💍 Accesorios', value: 'accesorios' }
                )),

    async execute(interaction, guildId) {
        const userId = interaction.user.id;
        const player = playerManager.getPlayer(userId, guildId);

        if (!player) {
            return interaction.reply({ 
                content: '❌ No tienes un personaje. Usa `/crear` para crear uno.', 
                ephemeral: true 
            });
        }

        const category = interaction.options.getString('categoria') || 'consumibles';
        const items = SHOP_ITEMS[category];

        const embed = new EmbedBuilder()
            .setColor('#ffaa00')
            .setTitle('🏪 Tienda del Aventurero')
            .setDescription(`💰 Tu oro: **${player.gold}**\n\n**Categoría:** ${getCategoryName(category)}`);

        items.forEach(item => {
            const statsText = item.stats ? 
                Object.entries(item.stats).map(([stat, val]) => `+${val} ${stat.toUpperCase()}`).join(', ') 
                : item.description;

            embed.addFields({
                name: `${item.name} - ${item.price}🪙`,
                value: statsText,
                inline: true
            });
        });

        // Menú de selección
        const options = items.map(item => ({
            label: `${item.name} (${item.price}🪙)`,
            description: item.description || 'Comprar item',
            value: item.id
        }));

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('buy_item')
            .setPlaceholder('Selecciona un item para comprar')
            .addOptions(options);

        const row = new ActionRowBuilder().addComponents(selectMenu);

        await interaction.reply({ 
            embeds: [embed], 
            components: [row],
            ephemeral: true 
        });

        // Collector para compras
        const filter = i => i.customId === 'buy_item' && i.user.id === userId;
        const collector = interaction.channel.createMessageComponentCollector({ 
            filter, 
            time: 60000,
            max: 1
        });

        collector.on('collect', async i => {
            const itemId = i.values[0];
            const item = items.find(it => it.id === itemId);

            if (!item) {
                return i.update({ content: '❌ Item no encontrado', components: [] });
            }

            const currentPlayer = playerManager.getPlayer(userId, guildId);

            if (currentPlayer.gold < item.price) {
                return i.update({ 
                    content: `❌ No tienes suficiente oro. Necesitas ${item.price}🪙 pero solo tienes ${currentPlayer.gold}🪙`, 
                    components: [] 
                });
            }

            // Comprar item
            playerManager.addGold(userId,  -item.price);
            const itemCopy = { ...item, quantity: 1 };
            delete itemCopy.price;
            playerManager.addItem(userId,  itemCopy);

            await i.update({ 
                content: `✅ ¡Has comprado **${item.name}** por ${item.price}🪙!`, 
                components: [] 
            });
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                interaction.editReply({ components: [] }).catch(() => {});
            }
        });
    },
};

function getCategoryName(category) {
    const names = {
        consumibles: '🧪 Consumibles',
        armas: '⚔️ Armas',
        armaduras: '🛡️ Armaduras',
        accesorios: '💍 Accesorios'
    };
    return names[category] || category;
}
