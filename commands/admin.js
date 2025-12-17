const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { PlayerManager: playerManager } = require('../utils/playerManager');
const { ServerConfigManager } = require('../utils/serverConfigManager');

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
                        .setRequired(true))
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
                        .setMinValue(1))),

    async execute(interaction, guildId) {
        // Verificar permisos de admin
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({
                content: '❌ Solo los administradores pueden usar este comando.',
                ephemeral: true
            });
        }

        // Verificar que el servidor esté en modo solo-servidor
        const config = ServerConfigManager.getConfig(guildId);
        if (config.mode !== 'solo-servidor') {
            return interaction.reply({
                content: '❌ Este comando solo funciona en modo "solo-servidor".',
                ephemeral: true
            });
        }

        const subcommand = interaction.options.getSubcommand();
        const targetUser = interaction.options.getUser('jugador');
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

                const embed = new EmbedBuilder()
                    .setColor('#FFD700')
                    .setTitle('💰 Monedas Añadidas')
                    .addFields(
                        { name: '👤 Jugador', value: targetUser.username, inline: true },
                        { name: '💵 Cantidad', value: `+${cantidad}`, inline: true },
                        { name: '👑 Admin', value: interaction.user.username, inline: true }
                    )
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
                if (player.stats[stat]) {
                    player.stats[stat] += cantidad;
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
