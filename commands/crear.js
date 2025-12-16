const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { PlayerManager: playerManager, CLASSES } = require('../utils/playerManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('crear')
        .setDescription('Crea tu personaje RPG')
        .addStringOption(option =>
            option.setName('clase')
                .setDescription('Elige tu clase')
                .setRequired(true)
                .addChoices(
                    { name: '⚔️ Guerrero - Fuerte y resistente', value: 'guerrero' },
                    { name: '🔮 Mago - Maestro de la magia', value: 'mago' },
                    { name: '🏹 Arquero - Rápido y preciso', value: 'arquero' },
                    { name: '✨ Clérigo - Sanador del grupo', value: 'clerigo' }
                )),

    async execute(interaction, guildId) {
        const userId = interaction.user.id;
        const className = interaction.options.getString('clase');

        const result = playerManager.createPlayer(userId, className, guildId);

        if (!result.success) {
            return interaction.reply({ content: `❌ ${result.message}`, ephemeral: true });
        }

        const player = playerManager.getPlayer(userId, guildId);
        const classInfo = CLASSES[className];

        const embed = new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle('🎉 ¡Personaje Creado!')
            .setDescription(`${classInfo.emoji} **${classInfo.name}**\n*${classInfo.description}*`)
            .addFields(
                { 
                    name: '📊 Estadísticas Iniciales', 
                    value: `❤️ HP: ${player.stats.hp}\n⚔️ ATK: ${player.stats.atk}\n🛡️ DEF: ${player.stats.def}\n⚡ SPD: ${player.stats.spd}`,
                    inline: true 
                },
                { 
                    name: '💰 Recursos', 
                    value: `🪙 Oro: ${player.gold}\n⭐ Nivel: ${player.level}`,
                    inline: true 
                }
            )
            .setFooter({ text: 'Usa /ayuda para ver todos los comandos' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
