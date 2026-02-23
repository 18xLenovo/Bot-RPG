const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { PlayerManager: playerManager } = require('../utils/playerManager');
const achievementSystem = require('../utils/achievementSystem');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('logros')
        .setDescription('Sistema de logros y desafíos')
        .addSubcommand(sub =>
            sub.setName('ver')
                .setDescription('Ve tus logros desbloqueados'))
        .addSubcommand(sub =>
            sub.setName('todos')
                .setDescription('Ve todos los logros disponibles')
                .addStringOption(option =>
                    option.setName('categoria')
                        .setDescription('Filtrar por categoría')
                        .setRequired(false)
                        .addChoices(
                            { name: '⚔️ Combate', value: 'combate' },
                            { name: '🎯 PvP', value: 'pvp' },
                            { name: '🕷️ Mazmorras', value: 'mazmorras' },
                            { name: '🪙 Economía', value: 'economia' },
                            { name: '📈 Progresión', value: 'progresion' },
                            { name: '🎭 Especiales', value: 'especial' }
                        )))
        .addSubcommand(sub =>
            sub.setName('estadisticas')
                .setDescription('Ve tus estadísticas de logros'))
        .addSubcommand(sub =>
            sub.setName('info')
                .setDescription('Información detallada de un logro')
                .addStringOption(option =>
                    option.setName('id')
                        .setDescription('ID del logro')
                        .setRequired(true)
                        .setAutocomplete(true))),

    async execute(interaction, guildId) {
        const subcommand = interaction.options.getSubcommand();
        const userId = interaction.user.id;
        const player = playerManager.getPlayer(userId, guildId);

        if (!player) {
            return interaction.reply({ content: '❌ Debes crear un personaje primero con `/crear`', ephemeral: true });
        }

        if (subcommand === 'ver') {
            const logros = achievementSystem.getPlayerAchievements(userId);
            const stats = achievementSystem.getPlayerStats(userId);

            if (logros.length === 0) {
                return interaction.reply({ content: '🔒 No tienes logros desbloqueados aún. ¡Sigue jugando!', ephemeral: true });
            }

            let descripcion = '';
            logros.forEach((logro, index) => {
                descripcion += `${logro.emoji} **${logro.nombre}**\n`;
                descripcion += `   _${logro.descripcion}_\n`;
                descripcion += `   +${logro.puntos} puntos\n\n`;
            });

            const embed = new EmbedBuilder()
                .setColor('#FFD700')
                .setTitle('🏆 Mis Logros Desbloqueados')
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                .setDescription(descripcion)
                .addFields(
                    { name: '📊 Total Desbloqueados', value: `${stats.desbloqueados}`, inline: true },
                    { name: '⭐ Puntos Totales', value: `${stats.puntos}`, inline: true }
                )
                .setFooter({ text: '¡Sigue desbloqueando más logros!' })
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        }

        if (subcommand === 'todos') {
            const categoria = interaction.options.getString('categoria');
            let logros = achievementSystem.getAllAchievements();

            if (categoria) {
                logros = achievementSystem.getAchievementsByCategory(categoria);
            }

            const playerLogros = achievementSystem.getPlayerAchievements(userId);
            const playerLogroIds = playerLogros.map(l => l.id);

            let descripcion = '';
            logros.forEach((logro, index) => {
                const estado = playerLogroIds.includes(logro.id) ? '✅' : '🔒';
                descripcion += `${estado} ${logro.emoji} **${logro.nombre}** (${logro.puntos} pts)\n`;
                descripcion += `   _${logro.descripcion}_\n\n`;
            });

            const categoriaNombre = {
                combate: '⚔️ Combate',
                pvp: '🎯 PvP',
                mazmorras: '🕷️ Mazmorras',
                economia: '🪙 Economía',
                progresion: '📈 Progresión',
                especial: '🎭 Especiales'
            };

            const embed = new EmbedBuilder()
                .setColor('#9933FF')
                .setTitle(`📜 ${categoria ? categoriaNombre[categoria] : 'Todos los Logros'}`)
                .setDescription(descripcion || '❌ No hay logros en esta categoría')
                .addFields(
                    { name: '✅ = Desbloqueado | 🔒 = Bloqueado', value: '\u200b' }
                )
                .setFooter({ text: `${logros.length} logros disponibles` })
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        }

        if (subcommand === 'estadisticas') {
            const stats = achievementSystem.getPlayerStats(userId);
            const todosLosLogros = achievementSystem.getAllAchievements();
            const logrosJugador = achievementSystem.getPlayerAchievements(userId);

            // Contar por categoría
            const categorias = {
                combate: achievementSystem.getAchievementsByCategory('combate'),
                pvp: achievementSystem.getAchievementsByCategory('pvp'),
                mazmorras: achievementSystem.getAchievementsByCategory('mazmorras'),
                economia: achievementSystem.getAchievementsByCategory('economia'),
                progresion: achievementSystem.getAchievementsByCategory('progresion'),
                especial: achievementSystem.getAchievementsByCategory('especial')
            };

            let categoriasText = '';
            Object.entries(categorias).forEach(([cat, logros]) => {
                const desbloqueados = logros.filter(l => logrosJugador.map(j => j.id).includes(l.id)).length;
                categoriasText += `**${cat.charAt(0).toUpperCase() + cat.slice(1)}**: ${desbloqueados}/${logros.length}\n`;
            });

            const porcentaje = ((stats.desbloqueados / todosLosLogros.length) * 100).toFixed(1);
            const siguienteLogro = todosLosLogros
                .filter(l => !stats.desbloqueados.includes(l.id))
                .sort((a, b) => a.puntos - b.puntos)[0];

            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('📈 Estadísticas de Logros')
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                .addFields(
                    { name: '🏆 Total Desbloqueados', value: `${stats.desbloqueados}/${todosLosLogros.length}`, inline: true },
                    { name: '📊 Porcentaje', value: `${porcentaje}%`, inline: true },
                    { name: '⭐ Puntos Totales', value: `${stats.puntos}`, inline: true },
                    { name: '📋 Por Categoría', value: categoriasText, inline: false }
                );

            if (siguienteLogro) {
                embed.addFields(
                    { name: '🎯 Próximo Logro Cercano', value: `${siguienteLogro.emoji} **${siguienteLogro.nombre}**\n_${siguienteLogro.descripcion}_\n+${siguienteLogro.puntos} puntos` }
                );
            }

            embed.setFooter({ text: '¡Sigue progresando!' })
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        }

        if (subcommand === 'info') {
            const logroId = interaction.options.getString('id');
            const logro = achievementSystem.getAchievementInfo(logroId);

            if (!logro) {
                return interaction.reply({ content: '❌ Logro no encontrado', ephemeral: true });
            }

            const estaBloqueado = !achievementSystem.getPlayerAchievements(userId).map(l => l.id).includes(logroId);

            const embed = new EmbedBuilder()
                .setColor(estaBloqueado ? '#808080' : '#FFD700')
                .setTitle(`${logro.emoji} ${logro.nombre}`)
                .setDescription(logro.descripcion)
                .addFields(
                    { name: '⭐ Puntos de Recompensa', value: `${logro.puntos}`, inline: true },
                    { name: '📂 Categoría', value: logro.categoria, inline: true },
                    { name: '🔐 Estado', value: estaBloqueado ? '🔒 Bloqueado' : '✅ Desbloqueado', inline: true }
                )
                .setFooter({ text: estaBloqueado ? 'Sigue jugando para desbloquear este logro' : '¡Felicidades!' })
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        }
    }
};
