const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { PlayerManager: playerManager, CLASSES } = require('../utils/playerManager');
const { SHOP_ITEMS } = require('../utils/gameData');
const marketSystem = require('../utils/marketSystem');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mercado')
        .setDescription('Sistema de mercado para comprar/vender items')
        .addSubcommand(sub =>
            sub.setName('listar')
                .setDescription('Lista un item en el mercado')
                .addStringOption(option =>
                    option.setName('item')
                        .setDescription('ID del item a vender')
                        .setRequired(true)
                        .setAutocomplete(true))
                .addIntegerOption(option =>
                    option.setName('precio')
                        .setDescription('Precio en oro')
                        .setRequired(true)
                        .setMinValue(1)))
        .addSubcommand(sub =>
            sub.setName('ver')
                .setDescription('Ve los items en venta')
                .addStringOption(option =>
                    option.setName('buscar')
                        .setDescription('Buscar por nombre de item (opcional)')
                        .setRequired(false)))
        .addSubcommand(sub =>
            sub.setName('comprar')
                .setDescription('Compra un item del mercado')
                .addStringOption(option =>
                    option.setName('id')
                        .setDescription('ID del listing')
                        .setRequired(true)))
        .addSubcommand(sub =>
            sub.setName('mis-listings')
                .setDescription('Ve tus anuncios activos'))
        .addSubcommand(sub =>
            sub.setName('cancelar')
                .setDescription('Cancela un anuncio')
                .addStringOption(option =>
                    option.setName('id')
                        .setDescription('ID del listing')
                        .setRequired(true)))
        .addSubcommand(sub =>
            sub.setName('historial')
                .setDescription('Ve el historial de transacciones'))
        .addSubcommand(sub =>
            sub.setName('estadisticas')
                .setDescription('Ve las estadísticas del mercado')),

    async execute(interaction, guildId) {
        const subcommand = interaction.options.getSubcommand();
        const userId = interaction.user.id;
        const player = playerManager.getPlayer(userId, guildId);

        if (!player) {
            return interaction.reply({ content: '❌ Debes crear un personaje primero con `/crear`', ephemeral: true });
        }

        if (subcommand === 'listar') {
            const itemId = interaction.options.getString('item');
            const precio = interaction.options.getInteger('precio');

            // Buscar item en inventario del jugador
            const itemEnInventario = player.inventario.find(i => i.id === itemId);
            if (!itemEnInventario) {
                return interaction.reply({ content: '❌ No tienes ese item en tu inventario', ephemeral: true });
            }

            // Obtener info del item
            const itemInfo = Object.values(SHOP_ITEMS)
                .flat()
                .find(i => i.id === itemId);

            if (!itemInfo) {
                return interaction.reply({ content: '❌ Item no encontrado en la base de datos', ephemeral: true });
            }

            // Crear listing
            const listing = marketSystem.crearListing(userId, itemInfo, precio);

            // Remover del inventario
            player.inventario = player.inventario.filter(i => !(i.id === itemId && i.id === itemId));
            playerManager.savePlayer(userId, player, guildId);

            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('✅ Item Listado en el Mercado')
                .addFields(
                    { name: '📦 Item', value: itemInfo.name, inline: true },
                    { name: '💰 Precio', value: `${precio} oro`, inline: true },
                    { name: '📍 ID del Listing', value: `\`${listing.id}\``, inline: false }
                )
                .setFooter({ text: 'Usa /mercado ver para ver todos los listings' })
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        }

        if (subcommand === 'ver') {
            const buscar = interaction.options.getString('buscar');
            let listings = [];

            if (buscar) {
                listings = marketSystem.obtenerListingsPorItem(buscar);
            } else {
                listings = marketSystem.obtenerListings(true).slice(0, 15);
            }

            if (listings.length === 0) {
                return interaction.reply({ content: '❌ No hay items disponibles en el mercado', ephemeral: true });
            }

            let descripcion = '```\n';
            descripcion += 'ID           | Item                    | Precio\n';
            descripcion += ''.padEnd(60, '-') + '\n';

            listings.forEach(listing => {
                const id = listing.id.slice(0, 8);
                const itemName = listing.item.name.slice(0, 21);
                descripcion += `${id.padEnd(12)} | ${itemName.padEnd(23)} | ${listing.precio} oro\n`;
            });
            descripcion += '```';

            const embed = new EmbedBuilder()
                .setColor('#0066FF')
                .setTitle('🛍️ Mercado de Jugadores')
                .setDescription(descripcion)
                .addFields(
                    { name: '💡 Tip', value: 'Usa `/mercado comprar` con el ID para comprar un item' }
                )
                .setFooter({ text: `${listings.length} items disponibles` })
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        }

        if (subcommand === 'comprar') {
            const listingId = interaction.options.getString('id');
            const listing = marketSystem.listings.find(l => l.id === listingId && l.activo);

            if (!listing) {
                return interaction.reply({ content: '❌ Listing no encontrado', ephemeral: true });
            }

            const resultado = marketSystem.comprarListing(listingId, userId, player.gold);

            if (!resultado.success) {
                return interaction.reply({ content: `❌ ${resultado.message}`, ephemeral: true });
            }

            // Actualizar oro del comprador
            player.gold -= listing.precio;
            player.inventario.push(resultado.item);
            playerManager.savePlayer(userId, player, guildId);

            // Actualizar oro del vendedor
            const vendedor = playerManager.getPlayer(listing.vendedor, guildId);
            if (vendedor) {
                vendedor.gold += resultado.oroVendedor;
                playerManager.savePlayer(listing.vendedor, vendedor, guildId);
            }

            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('✅ ¡Compra Exitosa!')
                .addFields(
                    { name: '📦 Item', value: resultado.item.name, inline: true },
                    { name: '💰 Precio', value: `${listing.precio} oro`, inline: true },
                    { name: '🏛️ Comisión del Mercado', value: `-${resultado.comision} oro (5%)`, inline: true },
                    { name: '💵 Vendedor Recibió', value: `+${resultado.oroVendedor} oro`, inline: true }
                )
                .setFooter({ text: 'Item agregado a tu inventario' })
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        }

        if (subcommand === 'mis-listings') {
            const misListings = marketSystem.obtenerListingsPorVendedor(userId);

            if (misListings.length === 0) {
                return interaction.reply({ content: '📭 No tienes listings activos', ephemeral: true });
            }

            let descripcion = '';
            misListings.forEach((listing, index) => {
                descripcion += `**${index + 1}. ${listing.item.name}**\n`;
                descripcion += `   ID: \`${listing.id}\`\n`;
                descripcion += `   Precio: ${listing.precio} oro\n\n`;
            });

            const embed = new EmbedBuilder()
                .setColor('#9933FF')
                .setTitle('📦 Mis Anuncios en el Mercado')
                .setDescription(descripcion)
                .addFields(
                    { name: '💡 Tip', value: 'Usa `/mercado cancelar` con el ID para quitar un anuncio' }
                )
                .setFooter({ text: `${misListings.length} listings activos` })
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        }

        if (subcommand === 'cancelar') {
            const listingId = interaction.options.getString('id');

            if (!marketSystem.cancelarListing(listingId, userId)) {
                return interaction.reply({ content: '❌ Listing no encontrado o no es tuyo', ephemeral: true });
            }

            const listing = marketSystem.listings.find(l => l.id === listingId);
            player.inventario.push(listing.item);
            playerManager.savePlayer(userId, player, guildId);

            const embed = new EmbedBuilder()
                .setColor('#FF6600')
                .setTitle('✅ Anuncio Cancelado')
                .addFields(
                    { name: '📦 Item', value: listing.item.name, inline: true },
                    { name: '↩️ Acción', value: 'Item devuelto a tu inventario', inline: true }
                )
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        }

        if (subcommand === 'historial') {
            const historial = marketSystem.obtenerHistorial(10);

            if (historial.length === 0) {
                return interaction.reply({ content: '📖 No hay transacciones registradas', ephemeral: true });
            }

            let descripcion = '';
            historial.forEach((venta, index) => {
                const fecha = new Date(venta.fecha).toLocaleDateString('es-ES');
                descripcion += `**${index + 1}. ${venta.item.name}**\n`;
                descripcion += `   Precio: ${venta.precio} oro\n`;
                descripcion += `   Comisión: ${venta.comision} oro\n`;
                descripcion += `   Fecha: ${fecha}\n\n`;
            });

            const embed = new EmbedBuilder()
                .setColor('#FFD700')
                .setTitle('📜 Historial de Mercado')
                .setDescription(descripcion)
                .setFooter({ text: 'Últimas 10 transacciones' })
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        }

        if (subcommand === 'estadisticas') {
            const stats = marketSystem.obtenerEstadisticas();

            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('📊 Estadísticas del Mercado')
                .addFields(
                    { name: '📦 Listings Activos', value: stats.listingsActivos.toString(), inline: true },
                    { name: '✅ Items Vendidos', value: stats.listingsVendidos.toString(), inline: true },
                    { name: '📍 Total Transacciones', value: stats.ventasRegistradas.toString(), inline: true },
                    { name: '💰 Oro Movido', value: `${stats.oroMovido} oro`, inline: true },
                    { name: '🏛️ Comisión Acumulada', value: `${stats.comisionTotal} oro`, inline: true },
                    { name: '💵 Promedio por Venta', value: stats.ventasRegistradas > 0 ? `${Math.floor(stats.oroMovido / stats.ventasRegistradas)} oro` : 'N/A', inline: true }
                )
                .setFooter({ text: 'Mercado activo y dinámico' })
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        }
    }
};
