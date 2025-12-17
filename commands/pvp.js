const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { PlayerManager: playerManager } = require('../utils/playerManager');
const pvpSystem = require('../utils/pvpSystem');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pvp')
        .setDescription('Sistema de PvP entre jugadores')
        .addSubcommand(sub =>
            sub.setName('desafiar')
                .setDescription('Desafía a otro jugador')
                .addUserOption(option =>
                    option.setName('rival')
                        .setDescription('Jugador a desafiar')
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName('apuesta')
                        .setDescription('Oro a apostar (0 si no quieres apostar)')
                        .setRequired(false)
                        .setMinValue(0)))
        .addSubcommand(sub =>
            sub.setName('estadisticas')
                .setDescription('Ve tus estadísticas de PvP'))
        .addSubcommand(sub =>
            sub.setName('ranking')
                .setDescription('Ve el ranking global de PvP'))
        .addSubcommand(sub =>
            sub.setName('historial')
                .setDescription('Ve tu historial de combates')),

    async execute(interaction, guildId) {
        const subcommand = interaction.options.getSubcommand();
        const userId = interaction.user.id;
        const player = playerManager.getPlayer(userId, guildId);

        if (!player) {
            return interaction.reply({ content: '❌ Debes crear un personaje primero con `/crear`', ephemeral: true });
        }

        if (subcommand === 'desafiar') {
            const rival = interaction.options.getUser('rival');
            const apuesta = interaction.options.getInteger('apuesta') || 0;

            if (rival.id === userId) {
                return interaction.reply({ content: '❌ ¡No puedes desafiarte a ti mismo!', ephemeral: true });
            }

            if (rival.bot) {
                return interaction.reply({ content: '❌ ¡No puedes desafiar a un bot!', ephemeral: true });
            }

            const rivalPlayer = playerManager.getPlayer(rival.id, guildId);
            if (!rivalPlayer) {
                return interaction.reply({ content: '❌ El rival debe tener un personaje creado', ephemeral: true });
            }

            if (apuesta > 0) {
                if (player.gold < apuesta) {
                    return interaction.reply({ content: `❌ No tienes suficiente oro. Tienes: ${player.gold}`, ephemeral: true });
                }
                if (rivalPlayer.gold < apuesta) {
                    return interaction.reply({ content: `❌ El rival no tiene suficiente oro para la apuesta`, ephemeral: true });
                }
            }

            // Simular PvP
            const resultado = pvpSystem.startPvP(player, rivalPlayer, apuesta);

            // Actualizar oro si hay apuesta
            if (apuesta > 0) {
                if (resultado.ganador === userId) {
                    player.gold += apuesta;
                    rivalPlayer.gold -= apuesta;
                } else {
                    player.gold -= apuesta;
                    rivalPlayer.gold += apuesta;
                }
                playerManager.savePlayer(userId, player, guildId);
                playerManager.savePlayer(rival.id, rivalPlayer, guildId);
            }

            const ganador = resultado.ganador === userId ? interaction.user : rival;
            const perdedor = resultado.ganador === userId ? rival : interaction.user;

            const embed = new EmbedBuilder()
                .setColor(resultado.ganador === userId ? '#00FF00' : '#FF0000')
                .setTitle('⚔️ ¡COMBATE PvP!')
                .setDescription(`\`\`\`
${interaction.user.username.padEnd(20)} vs ${rival.username}
${player.stats.atk} ATK              ${rivalPlayer.stats.atk} ATK
${player.stats.def} DEF              ${rivalPlayer.stats.def} DEF
${player.stats.spd} SPD              ${rivalPlayer.stats.spd} SPD
\`\`\``)
                .addFields(
                    { name: '🏆 Ganador', value: `${ganador} (${resultado.scoreFinal})`, inline: true },
                    { name: '💀 Perdedor', value: perdedor.toString(), inline: true },
                    { name: '📊 Resultado', value: resultado.ganador === userId ? '✅ **VICTORIA**' : '❌ **DERROTA**', inline: false }
                );

            if (apuesta > 0) {
                embed.addFields(
                    { name: '💰 Apuesta', value: `${apuesta} oro`, inline: true },
                    { name: '🪙 Nuevo Oro', value: `${ganador.id === userId ? '+' : '-'}${apuesta}`, inline: true }
                );
            }

            embed.setFooter({ text: 'Mejor de 3 rondas' })
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        }

        if (subcommand === 'estadisticas') {
            const stats = pvpSystem.getStats(userId);
            const totalCombates = stats.victorias + stats.derrotas;
            const winRate = totalCombates > 0 ? ((stats.victorias / totalCombates) * 100).toFixed(2) : '0';

            const embed = new EmbedBuilder()
                .setColor('#9933FF')
                .setTitle('📊 Estadísticas PvP')
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                .addFields(
                    { name: '🏆 Victorias', value: stats.victorias.toString(), inline: true },
                    { name: '💀 Derrotas', value: stats.derrotas.toString(), inline: true },
                    { name: '⚖️ Win Rate', value: `${winRate}%`, inline: true },
                    { name: '🔥 Racha Actual', value: `${stats.racha_actual} combates`, inline: true },
                    { name: '🌟 Racha Máxima', value: `${stats.racha_maxima} combates`, inline: true },
                    { name: '📍 Total Combates', value: totalCombates.toString(), inline: true },
                    { name: '💰 Oro Ganado', value: `${stats.oro_ganado}`, inline: true },
                    { name: '😢 Oro Perdido', value: `${stats.oro_perdido}`, inline: true },
                    { name: '💵 Ganancia Neta', value: `${stats.oro_ganado - stats.oro_perdido}`, inline: true }
                )
                .setFooter({ text: '¡Sigue mejorando tus habilidades!' })
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        }

        if (subcommand === 'ranking') {
            const ranking = pvpSystem.getRanking(10);

            if (ranking.length === 0) {
                return interaction.reply({ content: '📊 No hay jugadores en el ranking aún', ephemeral: true });
            }

            let rankingText = '```\n';
            ranking.forEach((jugador, index) => {
                rankingText += `${(index + 1).toString().padEnd(2)}. ${jugador.userId.slice(0, 10).padEnd(10)} - V: ${jugador.victorias.toString().padEnd(3)} D: ${jugador.derrotas.toString().padEnd(3)} (${jugador.winRate}%)\n`;
            });
            rankingText += '```';

            const embed = new EmbedBuilder()
                .setColor('#FFD700')
                .setTitle('🏆 Ranking PvP Global')
                .setDescription(rankingText)
                .addFields(
                    { name: '🎯 Nota', value: 'Ranking basado en victorias y win rate' }
                )
                .setFooter({ text: 'Top 10 Jugadores' })
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        }

        if (subcommand === 'historial') {
            const historial = pvpSystem.getHistorial(userId, 10);

            if (historial.length === 0) {
                return interaction.reply({ content: '📖 No tienes historial de combates', ephemeral: true });
            }

            let historialText = '';
            historial.forEach((combate, index) => {
                const icono = combate.resultado === 'victoria' ? '✅' : '❌';
                const apuestaText = combate.apuesta > 0 ? ` [${combate.apuesta} oro]` : '';
                historialText += `${icono} ${combate.resultado.toUpperCase()} - ${combate.score}${apuestaText}\n`;
            });

            const embed = new EmbedBuilder()
                .setColor('#0066FF')
                .setTitle('📖 Historial de Combates')
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                .setDescription(historialText)
                .setFooter({ text: 'Últimos 10 combates' })
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        }
    }
};
