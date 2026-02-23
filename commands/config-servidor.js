const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { ServerConfigManager: serverConfig } = require('../utils/serverConfigManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config-servidor')
        .setDescription('⚙️ Configura el modo del servidor (solo para administradores)')
        .setDefaultMemberPermissions(8), // Requiere permisos de administrador

    async execute(interaction, guildId) {
        // Verificar permisos
        if (!interaction.member.permissions.has('Administrator')) {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('❌ Sin Permisos')
                    .setDescription('Solo los administradores del servidor pueden usar este comando.')
                ],
                ephemeral: true
            });
        }

        const config = serverConfig.getServerConfig(guildId);
        const stats = serverConfig.getStats();

        const configEmbed = new EmbedBuilder()
            .setColor('#9B59B6')
            .setTitle('⚙️ Configuración del Servidor')
            .addFields(
                { name: '📊 Modo Actual', value: config.mode === 'solo-servidor' ? '🏠 **Solo Servidor**' : '🌍 **Compartido**', inline: true },
                { name: '📅 Configurado el', value: new Date(config.createdAt).toLocaleDateString('es-ES'), inline: true },
                { name: '🔄 Último cambio', value: new Date(config.updatedAt).toLocaleDateString('es-ES'), inline: true },
                { name: '\u200B', value: '\u200B' },
                { name: '📈 Estadísticas Globales', value: `• Servidores total: **${stats.totalServidores}**\n• Solo Servidor: **${stats.soloServidores}**\n• Compartido: **${stats.compartidosServidores}**` }
            );

        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`config_solo_${guildId}`)
                    .setLabel('🏠 Cambiar a Solo Servidor')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(config.mode === 'solo-servidor'),
                new ButtonBuilder()
                    .setCustomId(`config_shared_${guildId}`)
                    .setLabel('🌍 Cambiar a Compartido')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(config.mode === 'compartido')
            );

        await interaction.reply({
            embeds: [configEmbed],
            components: [buttons],
            ephemeral: false
        });
    }
};
