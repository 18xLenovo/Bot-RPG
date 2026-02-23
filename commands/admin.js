const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { PlayerManager: playerManager } = require('../utils/playerManager');
const { ServerConfigManager } = require('../utils/serverConfigManager');
const { SHOP_ITEMS } = require('../utils/gameData');

// Obtener todos los items disponibles para los choices
function getAllItemChoices() {
    const choices = [];
    for (const category in SHOP_ITEMS) {
        SHOP_ITEMS[category].forEach(item => {
            choices.push({ name: `${item.name} (${category})`, value: item.name });
        });
    }
    return choices;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('admin')
        .setDescription('Herramientas administrativas para solo-servidor')
        .setDefaultMemberPermissions(8)
        .addSubcommand(sub =>
            sub.setName('monedas')
                .setDescription('Dar monedas a un jugador')
                .addUserOption(option =>
                    option.setName('jugador')
                        .setDescription('Jugador a quien dar monedas')
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName('cantidad')
                        .setDescription('Cantidad de monedas')
                        .setRequired(true)
                        .setMinValue(1)))
        .addSubcommand(sub =>
            sub.setName('xp')
                .setDescription('Dar XP a un jugador')
                .addUserOption(option =>
                    option.setName('jugador')
                        .setDescription('Jugador a quien dar XP')
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName('cantidad')
                        .setDescription('Cantidad de XP')
                        .setRequired(true)
                        .setMinValue(1)))
        .addSubcommand(sub =>
            sub.setName('item')
                .setDescription('Dar un item a un jugador')
                .addUserOption(option =>
                    option.setName('jugador')
                        .setDescription('Jugador a quien dar el item')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('nombre')
                        .setDescription('Nombre del item')
                        .setRequired(true)
                        .addChoices(...getAllItemChoices().slice(0, 25)))
                .addIntegerOption(option =>
                    option.setName('cantidad')
                        .setDescription('Cantidad de items')
                        .setRequired(false)
                        .setMinValue(1)))
        .addSubcommand(sub =>
            sub.setName('stats')
                .setDescription('Aumentar stats de un jugador')
                .addUserOption(option =>
                    option.setName('jugador')
                        .setDescription('Jugador')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('stat')
                        .setDescription('Stat a aumentar')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Ataque (ATK)', value: 'atk' },
                            { name: 'Defensa (DEF)', value: 'def' },
                            { name: 'HP', value: 'hp' },
                            { name: 'Mana', value: 'mana' },
                            { name: 'Velocidad (SPD)', value: 'spd' }
                        ))
                .addIntegerOption(option =>
                    option.setName('cantidad')
                        .setDescription('Cantidad a aumentar')
                        .setRequired(true)
                        .setMinValue(1)))
        .addSubcommand(sub =>
            sub.setName('listar')
                .setDescription('Ver lista de items disponibles')),

    async execute(interaction, guildId) {
        // Verificar que haya miembro
        if (!interaction.member) {
            return interaction.reply({
                content: '❌ Este comando solo funciona en servidores.',
                ephemeral: true
            });
        }

        // Verificar permisos de admin
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({
                content: '❌ Solo los administradores pueden usar este comando.',
                ephemeral: true
            });
        }

        // Verificar que el servidor esté en modo solo-servidor
        const config = ServerConfigManager.getServerConfig(guildId);
        if (config.mode !== 'solo-servidor') {
            return interaction.reply({
                content: '❌ Este comando solo funciona en modo "solo-servidor".',
                ephemeral: true
            });
        }

        const subcommand = interaction.options.getSubcommand();

        // Subcomando listar no requiere jugador
        if (subcommand === 'listar') {
            const embeds = [];
            
            // Crear embeds para cada categoría
            for (const category in SHOP_ITEMS) {
                const items = SHOP_ITEMS[category];
                let itemList = '';
                
                items.forEach(item => {
                    itemList += `**${item.name}** - ${item.description}\n`;
                });

                const embed = new EmbedBuilder()
                    .setColor('#00AFF4')
                    .setTitle(`📦 ${category.charAt(0).toUpperCase() + category.slice(1)}`)
                    .setDescription(itemList || 'No hay items en esta categoría');
                
                embeds.push(embed);
            }

            return await interaction.reply({ embeds: embeds });
        }

        // Para otros subcomandos, necesitamos el jugador
        const targetUser = interaction.options.getUser('jugador');
        if (!targetUser) {
            return interaction.reply({
                content: '❌ Debes especificar un jugador.',
                ephemeral: true
            });
        }

        const targetId = targetUser.id;
        
        // Verificar que el jugador tenga personaje
        const player = playerManager.getPlayer(targetId, guildId);
        if (!player) {
            return interaction.reply({
                content: `❌ ${targetUser.username} no tiene un personaje creado.`,
                ephemeral: true
            });
        }

        try {
            if (subcommand === 'monedas') {
                const cantidad = interaction.options.getInteger('cantidad');
                playerManager.addGold(targetId, cantidad, guildId);

                const newPlayer = playerManager.getPlayer(targetId, guildId);
                const embed = new EmbedBuilder()
                    .setColor('#FFD700')
                    .setTitle('🛠️ COMANDO ADMIN - MONEDAS')
                    .setDescription(`╔═══════════════════════════╗\n✅ Operación completada exitosamente\n╚═══════════════════════════╝`)
                    .addFields(
                        { name: '━━━ 👤 JUGADOR ━━━', value: `\`\`\`\n${targetUser.username}\n\`\`\``, inline: true },
                        { name: '━━━ 💰 CANTIDAD ━━━', value: `\`\`\`diff\n+ ${cantidad.toLocaleString()} 🪙\n\`\`\``, inline: true },
                        { name: '━━━ 👑 ADMIN ━━━', value: `\`\`\`\n${interaction.user.username}\n\`\`\``, inline: true },
                        { name: '━━━━━━━━━━ 💵 TOTAL ORO ━━━━━━━━━━', value: `\`\`\`yaml\nOro actual: ${newPlayer.gold.toLocaleString()} 🪙\n\`\`\``, inline: false }
                    )
                    .setFooter({ text: `ID: ${targetId}` })
                    .setTimestamp();

                await interaction.reply({ embeds: [embed] });
            }

            else if (subcommand === 'xp') {
                const cantidad = interaction.options.getInteger('cantidad');
                const levelsGained = playerManager.addExp(targetId, cantidad, guildId);

                const embed = new EmbedBuilder()
                    .setColor('#00FF00')
                    .setTitle('⭐ XP Añadido')
                    .addFields(
                        { name: '👤 Jugador', value: targetUser.username, inline: true },
                        { name: '✨ XP', value: `+${cantidad}`, inline: true },
                        { name: '🆙 Niveles', value: `+${levelsGained}`, inline: true },
                        { name: '👑 Admin', value: interaction.user.username, inline: true }
                    )
                    .setTimestamp();

                await interaction.reply({ embeds: [embed] });
            }

            else if (subcommand === 'item') {
                const nombreItem = interaction.options.getString('nombre');
                const cantidad = interaction.options.getInteger('cantidad') || 1;

                playerManager.addItem(targetId, { name: nombreItem, quantity: cantidad }, guildId);

                const embed = new EmbedBuilder()
                    .setColor('#9B59B6')
                    .setTitle('📦 Item Añadido')
                    .addFields(
                        { name: '👤 Jugador', value: targetUser.username, inline: true },
                        { name: '📦 Item', value: nombreItem, inline: true },
                        { name: '🔢 Cantidad', value: `${cantidad}`, inline: true },
                        { name: '👑 Admin', value: interaction.user.username, inline: true }
                    )
                    .setTimestamp();

                await interaction.reply({ embeds: [embed] });
            }

            else if (subcommand === 'stats') {
                const stat = interaction.options.getString('stat');
                const cantidad = interaction.options.getInteger('cantidad');

                // Obtener el personaje y aumentar la stat
                const player = playerManager.getPlayer(targetId, guildId);
                if (!player) {
                    return interaction.reply({
                        content: `❌ ${targetUser.username} no tiene un personaje creado.`,
                        ephemeral: true
                    });
                }

                if (player.stats && player.stats[stat] !== undefined) {
                    player.stats[stat] += cantidad;
                } else {
                    return interaction.reply({
                        content: `❌ La stat ${stat} no existe.`,
                        ephemeral: true
                    });
                }

                // Guardar cambios
                playerManager.updatePlayer(targetId, player, guildId);

                const statNames = {
                    'atk': '⚔️ Ataque',
                    'def': '🛡️ Defensa',
                    'hp': '❤️ HP',
                    'mana': '💙 Mana',
                    'spd': '⚡ Velocidad'
                };

                const embed = new EmbedBuilder()
                    .setColor('#FF6B6B')
                    .setTitle('📊 Stats Aumentadas')
                    .addFields(
                        { name: '👤 Jugador', value: targetUser.username, inline: true },
                        { name: '📊 Stat', value: statNames[stat], inline: true },
                        { name: '➕ Cantidad', value: `+${cantidad}`, inline: true },
                        { name: '👑 Admin', value: interaction.user.username, inline: true }
                    )
                    .setTimestamp();

                await interaction.reply({ embeds: [embed] });
            }

        } catch (error) {
            console.error('Error en comando admin:', error);
            await interaction.reply({
                content: `❌ Ocurrió un error: ${error.message}`,
                ephemeral: true
            });
        }
    }
};
