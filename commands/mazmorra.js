const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { PlayerManager: playerManager } = require('../utils/playerManager');
const { CoopDungeonSession, COOP_DUNGEONS } = require('../utils/coopDungeon');

// Sesiones activas
const activeSessions = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mazmorra')
        .setDescription('Explora una mazmorra cooperativa con amigos')
        .addStringOption(option =>
            option.setName('nombre')
                .setDescription('Elige una mazmorra')
                .setRequired(true)
                .addChoices(
                    { name: '🌲 Bosque Encantado (1-4 jugadores, Fácil)', value: 'bosque_encantado' },
                    { name: '⛏️ Minas Profundas (1-5 jugadores, Media)', value: 'minas_profundas' },
                    { name: '🏛️ Templo Maldito (1-6 jugadores, Difícil)', value: 'templo_maldito' },
                    { name: '🏰 Ciudadela del Demonio (1-8 jugadores, Legendaria)', value: 'ciudadela_demonio' }
                ))
        .addBooleanOption(option =>
            option.setName('cooperativo')
                .setDescription('¿Invitar amigos? (Espera 60s para que se unan)')
                .setRequired(false)),

    async execute(interaction, guildId) {
        const userId = interaction.user.id;
        const player = playerManager.getPlayer(userId, guildId);

        if (!player) {
            return interaction.reply({
                content: '❌ No tienes un personaje creado. Usa `/crear` primero.',
                ephemeral: true
            });
        }

        const dungeonId = interaction.options.getString('nombre');
        const isCoop = interaction.options.getBoolean('cooperativo') || false;
        const dungeon = COOP_DUNGEONS[dungeonId];

        if (player.level < dungeon.minLevel) {
            return interaction.reply({
                content: `❌ Necesitas nivel ${dungeon.minLevel}+ para explorar ${dungeon.name}.`,
                ephemeral: true
            });
        }

        // Modo cooperativo
        if (isCoop) {
            const sessionId = `${interaction.channelId}-${Date.now()}`;
            const session = new CoopDungeonSession(dungeonId);
            session.addPlayer(userId, player, interaction.user.username);
            activeSessions.set(sessionId, session);

            const joinButton = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`join_dungeon_${sessionId}`)
                        .setLabel('🎮 Unirse a la Mazmorra')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId(`start_dungeon_${sessionId}`)
                        .setLabel('▶️ Comenzar Ahora')
                        .setStyle(ButtonStyle.Primary)
                );

            const embed = new EmbedBuilder()
                .setColor('#9B59B6')
                .setTitle(`🗺️ ${dungeon.name} - Mazmorra Cooperativa`)
                .setDescription(dungeon.description)
                .addFields(
                    { name: '👥 Jugadores', value: `${session.players.size}/${dungeon.maxPlayers}`, inline: true },
                    { name: '🎯 Dificultad', value: `Nivel ${dungeon.minLevel}+`, inline: true },
                    { name: '🏆 Recompensas', value: dungeon.rewardDescription, inline: true },
                    { name: '⏱️ Esperando', value: '60 segundos para que se unan más jugadores...', inline: false }
                )
                .setFooter({ text: 'Los jugadores pueden unirse presionando el botón' });

            await interaction.reply({ embeds: [embed], components: [joinButton] });

            // Timeout para auto-iniciar
            const timeout = setTimeout(async () => {
                if (activeSessions.has(sessionId)) {
                    await startDungeonSession(interaction, sessionId);
                }
            }, 60000);

            // Collector para botones
            const collector = interaction.channel.createMessageComponentCollector({
                filter: i => i.customId.startsWith('join_dungeon_') || i.customId.startsWith('start_dungeon_'),
                time: 60000
            });

            collector.on('collect', async (i) => {
                if (i.customId === `join_dungeon_${sessionId}`) {
                    const joiningPlayer = playerManager.getPlayer(i.user.id);
                    if (!joiningPlayer) {
                        return i.reply({ content: '❌ No tienes un personaje. Usa `/crear` primero.', ephemeral: true });
                    }

                    if (joiningPlayer.level < dungeon.minLevel) {
                        return i.reply({ content: `❌ Necesitas nivel ${dungeon.minLevel}+ para esta mazmorra.`, ephemeral: true });
                    }

                    if (session.players.has(i.user.id)) {
                        return i.reply({ content: '❌ Ya estás en esta mazmorra.', ephemeral: true });
                    }

                    if (session.players.size >= dungeon.maxPlayers) {
                        return i.reply({ content: '❌ La mazmorra está llena.', ephemeral: true });
                    }

                    session.addPlayer(i.user.id, joiningPlayer, i.user.username);

                    const updatedEmbed = EmbedBuilder.from(interaction.message.embeds[0])
                        .spliceFields(0, 1, { name: '👥 Jugadores', value: `${session.players.size}/${dungeon.maxPlayers}`, inline: true });

                    await interaction.editReply({ embeds: [updatedEmbed] });
                    await i.reply({ content: `✅ ${i.user.username} se ha unido a la mazmorra!`, ephemeral: false });
                }

                if (i.customId === `start_dungeon_${sessionId}`) {
                    if (i.user.id !== userId) {
                        return i.reply({ content: '❌ Solo el creador puede iniciar la mazmorra.', ephemeral: true });
                    }

                    clearTimeout(timeout);
                    collector.stop();
                    await i.deferUpdate();
                    await startDungeonSession(interaction, sessionId);
                }
            });

        } else {
            // Modo solitario - crear sesión de 1 jugador
            const sessionId = `${interaction.channelId}-${Date.now()}`;
            const session = new CoopDungeonSession(dungeonId);
            session.addPlayer(userId, player, interaction.user.username);
            activeSessions.set(sessionId, session);

            await interaction.deferReply();
            await startDungeonSession(interaction, sessionId);
        }
    }
};

async function startDungeonSession(interaction, sessionId) {
    const session = activeSessions.get(sessionId);
    if (!session) return;

    const dungeon = session.dungeon;

    // Actualizar mensaje inicial si existe
    if (interaction.message) {
        const startEmbed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle(`⚔️ ${dungeon.name} - ¡Comenzando!`)
            .setDescription(`${session.players.size} jugador(es) entran a la mazmorra...`);

        await interaction.message.edit({ embeds: [startEmbed], components: [] });
    }

    // Iniciar sesión
    await session.start(interaction);

    // Limpiar sesión
    activeSessions.delete(sessionId);
}
