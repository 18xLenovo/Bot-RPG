const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { ClanManager: clanManager, CLAN_BENEFITS } = require('../utils/clanManager');
const { PlayerManager: playerManager } = require('../utils/playerManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clan')
        .setDescription('Gestiona tu clan')
        .addSubcommand(subcommand =>
            subcommand
                .setName('crear')
                .setDescription('Crea un nuevo clan')
                .addStringOption(option =>
                    option.setName('nombre')
                        .setDescription('Nombre del clan')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('descripcion')
                        .setDescription('Descripción del clan')
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('info')
                .setDescription('Ver información de tu clan'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('invitar')
                .setDescription('Invitar un jugador al clan')
                .addUserOption(option =>
                    option.setName('jugador')
                        .setDescription('Jugador a invitar')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('salir')
                .setDescription('Abandonar tu clan actual'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('donar')
                .setDescription('Donar oro al tesoro del clan')
                .addIntegerOption(option =>
                    option.setName('cantidad')
                        .setDescription('Cantidad de oro a donar')
                        .setRequired(true)
                        .setMinValue(1)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('anuncio')
                .setDescription('Hacer un anuncio en el clan (solo líder)')
                .addStringOption(option =>
                    option.setName('mensaje')
                        .setDescription('Mensaje del anuncio')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('ranking')
                .setDescription('Ver el ranking de clanes')),

    async execute(interaction, guildId) {
        const subcommand = interaction.options.getSubcommand();
        const userId = interaction.user.id;

        if (subcommand === 'crear') {
            const name = interaction.options.getString('nombre');
            const description = interaction.options.getString('descripcion') || 'Un clan de aventureros';

            const player = playerManager.getPlayer(userId, guildId);
            if (!player) {
                return interaction.reply({ 
                    content: '❌ Necesitas un personaje para crear un clan. Usa `/crear`', 
                    ephemeral: true 
                });
            }

            if (player.gold < 500) {
                return interaction.reply({ 
                    content: '❌ Necesitas 500 oro para crear un clan.', 
                    ephemeral: true 
                });
            }

            const result = clanManager.createClan(userId,  name, description, guildId);
            
            if (!result.success) {
                return interaction.reply({ content: `❌ ${result.message}`, ephemeral: true });
            }

            playerManager.addGold(userId, -500, guildId);

            const embed = new EmbedBuilder()
                .setColor('#FFD700')
                .setTitle('⚜️ ¡CLAN CREADO!')
                .setDescription(`╔═══════════════════════════╗\n🏰 **${name}**\n📜 *${description}*\n╚═══════════════════════════╝`)
                .addFields(
                    { name: '━ 👑 LÍDER ━', value: `\`\`\`\n<@${userId}>\n\`\`\``, inline: true },
                    { name: '━ 👥 MIEMBROS ━', value: '\`\`\`\n1/50\n\`\`\`', inline: true },
                    { name: '━ ⭐ NIVEL ━', value: '\`\`\`\n1\n\`\`\`', inline: true }
                )
                .setFooter({ text: '💡 Usa /clan invitar para añadir miembros' })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } else if (subcommand === 'info') {
            const clan = clanManager.getPlayerClan(userId, guildId);
            
            if (!clan) {
                return interaction.reply({ 
                    content: '❌ No estás en ningún clan. Usa `/clan crear` o espera una invitación.', 
                    ephemeral: true 
                });
            }

            const benefits = CLAN_BENEFITS[clan.level];
            
            const embed = new EmbedBuilder()
                .setColor('#ffd700')
                .setTitle(`⚜️ ${clan.name}`)
                .setDescription(`*${clan.description}*\n\n**${benefits.description}**`)
                .addFields(
                    { name: '👑 Líder', value: `<@${clan.leader}>`, inline: true },
                    { name: '👥 Miembros', value: `${clan.members.length}/${benefits.maxMembers}`, inline: true },
                    { name: '⭐ Nivel', value: `${clan.level}`, inline: true },
                    { name: '💰 Tesoro', value: `${clan.treasury} oro`, inline: true },
                    { name: '🏆 Victorias', value: `${clan.wins || 0}`, inline: true },
                    { name: '🏰 Mazmorras', value: `${clan.dungeonClears || 0}`, inline: true },
                    { name: '📊 EXP', value: `${clan.exp}/${clan.expToNext}`, inline: false }
                );

            // Bonificaciones
            if (benefits.bonusGold > 0 || benefits.bonusExp > 0) {
                embed.addFields({
                    name: '💎 Bonificaciones',
                    value: `+${benefits.bonusGold}% oro | +${benefits.bonusExp}% EXP`
                });
            }

            // Lista de miembros
            const membersList = clan.members.slice(0, 10).map(id => `<@${id}>`).join(', ');
            embed.addFields({ name: '👥 Miembros', value: membersList || 'Sin miembros' });

            // Anuncios recientes
            if (clan.announcements && clan.announcements.length > 0) {
                const lastAnnouncement = clan.announcements[0];
                const date = new Date(lastAnnouncement.timestamp).toLocaleString('es-ES');
                embed.addFields({ 
                    name: '📢 Último Anuncio', 
                    value: `${lastAnnouncement.message}\n*${date}*` 
                });
            }

            await interaction.reply({ embeds: [embed] });

        } else if (subcommand === 'invitar') {
            const targetUser = interaction.options.getUser('jugador');
            const clan = clanManager.getPlayerClan(userId, guildId);

            if (!clan) {
                return interaction.reply({ 
                    content: '❌ No estás en un clan.', 
                    ephemeral: true 
                });
            }

            const targetPlayer = playerManager.getPlayer(targetUser.id);
            if (!targetPlayer) {
                return interaction.reply({ 
                    content: '❌ Ese usuario no tiene un personaje.', 
                    ephemeral: true 
                });
            }

            const result = clanManager.invitePlayer(clan.id, userId, targetUser.id, guildId);
            
            if (!result.success) {
                return interaction.reply({ content: `❌ ${result.message}`, ephemeral: true });
            }

            // Enviar invitación al jugador
            const embed = new EmbedBuilder()
                .setColor('#ffd700')
                .setTitle('⚜️ Invitación a Clan')
                .setDescription(`**<@${userId}>** te ha invitado a unirte a **${clan.name}**!`)
                .addFields(
                    { name: '📜 Descripción', value: clan.description || 'Sin descripción' },
                    { name: '👥 Miembros', value: `${clan.members.length}`, inline: true },
                    { name: '⭐ Nivel', value: `${clan.level}`, inline: true }
                );

            const acceptButton = new ButtonBuilder()
                .setCustomId('clan_accept')
                .setLabel('✅ Aceptar')
                .setStyle(ButtonStyle.Success);

            const rejectButton = new ButtonBuilder()
                .setCustomId('clan_reject')
                .setLabel('❌ Rechazar')
                .setStyle(ButtonStyle.Danger);

            const row = new ActionRowBuilder().addComponents(acceptButton, rejectButton);

            const inviteMsg = await interaction.reply({ 
                content: `<@${targetUser.id}>`,
                embeds: [embed], 
                components: [row],
                fetchReply: true
            });

            // Esperar respuesta
            const filter = i => (i.customId === 'clan_accept' || i.customId === 'clan_reject') && i.user.id === targetUser.id;
            
            try {
                const response = await inviteMsg.awaitMessageComponent({ filter, time: 300000 });

                if (response.customId === 'clan_accept') {
                    const acceptResult = clanManager.acceptInvite(targetUser.id, guildId);
                    
                    if (acceptResult.success) {
                        await response.update({ 
                            content: `✅ <@${targetUser.id}> se ha unido a **${clan.name}**!`,
                            components: [] 
                        });
                    } else {
                        await response.update({ 
                            content: `❌ ${acceptResult.message}`,
                            components: [] 
                        });
                    }
                } else {
                    clanManager.rejectInvite(targetUser.id);
                    await response.update({ 
                        content: `❌ <@${targetUser.id}> rechazó la invitación.`,
                        components: [] 
                    });
                }
            } catch (error) {
                clanManager.rejectInvite(targetUser.id);
                await interaction.editReply({ 
                    content: '⏱️ La invitación expiró.',
                    components: [] 
                });
            }

        } else if (subcommand === 'salir') {
            const result = clanManager.leaveClan(userId, guildId);
            
            if (!result.success) {
                return interaction.reply({ content: `❌ ${result.message}`, ephemeral: true });
            }

            await interaction.reply({ content: `✅ ${result.message}` });

        } else if (subcommand === 'donar') {
            const amount = interaction.options.getInteger('cantidad');
            const player = playerManager.getPlayer(userId, guildId);
            const clan = clanManager.getPlayerClan(userId, guildId);

            if (!clan) {
                return interaction.reply({ content: '❌ No estás en un clan.', ephemeral: true });
            }

            if (player.gold < amount) {
                return interaction.reply({ content: '❌ No tienes suficiente oro.', ephemeral: true });
            }

            playerManager.addGold(userId, -amount, guildId);
            clanManager.addToTreasury(clan.id, amount, guildId);

            await interaction.reply({ 
                content: `✅ Donaste **${amount}** oro al tesoro del clan.\n💰 Tesoro actual: **${clan.treasury + amount}** oro`
            });

        } else if (subcommand === 'anuncio') {
            const message = interaction.options.getString('mensaje');
            const clan = clanManager.getPlayerClan(userId, guildId);

            if (!clan) {
                return interaction.reply({ content: '❌ No estás en un clan.', ephemeral: true });
            }

            if (clan.leader !== userId) {
                return interaction.reply({ content: '❌ Solo el líder puede hacer anuncios.', ephemeral: true });
            }

            clanManager.addAnnouncement(clan.id, message, guildId);

            const embed = new EmbedBuilder()
                .setColor('#ffd700')
                .setTitle(`📢 Anuncio de ${clan.name}`)
                .setDescription(message)
                .setFooter({ text: `Por: ${interaction.user.username}` })
                .setTimestamp();

            // Mencionar a todos los miembros
            const mentions = clan.members.map(id => `<@${id}>`).join(' ');

            await interaction.reply({ content: mentions, embeds: [embed] });

        } else if (subcommand === 'ranking') {
            const topClans = clanManager.getClanRankings(guildId);

            if (topClans.length === 0) {
                return interaction.reply({ content: '❌ No hay clanes registrados aún.', ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setColor('#ffd700')
                .setTitle('🏆 Ranking de Clanes')
                .setDescription('Los clanes más poderosos del reino')
                .setTimestamp();

            const rankings = topClans.map((clan, index) => {
                const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
                return `${medal} **${clan.name}** - Nivel ${clan.level} | ${clan.members.length} miembros | ${clan.wins || 0} victorias`;
            });

            embed.addFields({ name: '📊 Top Clanes', value: rankings.join('\n') });

            await interaction.reply({ embeds: [embed] });
        }
    },
};
