const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ayuda')
        .setDescription('Muestra todos los comandos disponibles'),

    async execute(interaction, guildId) {
        const embed = new EmbedBuilder()
            .setColor('#00aaff')
            .setTitle('🎮 Comandos del Bot RPG')
            .setDescription('Lista de todos los comandos disponibles')
            .addFields(
                {
                    name: '👤 Personaje',
                    value: '`/crear` - Crea tu personaje\n`/perfil` - Ver tu perfil o el de otro usuario\n`/inventario` - Ver tu inventario y equipar items',
                    inline: false
                },
                {
                    name: '⚔️ Combate',
                    value: '`/combate` - Combate interactivo (elige tus ataques)\n`/mazmorra` - Explora una mazmorra peligrosa',
                    inline: false
                },
                {
                    name: '🏪 Economía',
                    value: '`/tienda` - Compra items y equipamiento\n`/usar` - Usa un item consumible',
                    inline: false
                },
                {
                    name: '📊 Progreso',
                    value: '`/misiones` - Ver misiones disponibles\n`/ranking` - Ver la clasificación de jugadores\n`/evento` - Experimenta eventos con decisiones',
                    inline: false
                },
                {
                    name: '⚙️ Utilidades',
                    value: '`/ayuda` - Muestra este mensaje\n`/borrar` - Elimina tu personaje (permanente)',
                    inline: false
                }
            )
            .setFooter({ text: 'Bot RPG - ¡Comienza tu aventura!' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
