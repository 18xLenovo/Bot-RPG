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
                    { name: '✨ Clérigo - Sanador del grupo', value: 'clerigo' },
                    { name: '🗡️ Asesino - Críticos letales', value: 'asesino' },
                    { name: '🛡️ Paladín - Defensor sagrado', value: 'paladin' },
                    { name: '🔥 Berserker - Furia salvaje', value: 'berserker' },
                    { name: '❄️ Nigromante - Artes oscuras', value: 'nigromante' }
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
            .setColor('#00FF7F')
            .setTitle('🎉 ¡PERSONAJE CREADO CON ÉXITO!')
            .setDescription(`╔═══════════════════════════╗\n${classInfo.emoji} **${classInfo.name.toUpperCase()}**\n📜 *${classInfo.description}*\n╚═══════════════════════════╝`)
            .addFields(
                { 
                    name: '━━ 📊 ESTADÍSTICAS ━━', 
                    value: `\`\`\`yaml\n❤️  HP:   ${player.stats.hp}\n⚔️  ATK:  ${player.stats.atk}\n🛡️  DEF:  ${player.stats.def}\n⚡  SPD:  ${player.stats.spd}\n💙  Maná: ${player.stats.maxMana}\n\`\`\``,
                    inline: true 
                },
                { 
                    name: '━━ 💰 RECURSOS ━━', 
                    value: `\`\`\`yaml\n🪙  Oro:   ${player.gold}\n⭐  Nivel: ${player.level}\n🎯  EXP:   0/${player.expToNext}\n\`\`\``,
                    inline: true 
                }
            )
            .setFooter({ text: '💡 Usa /ayuda para ver todos los comandos disponibles' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
