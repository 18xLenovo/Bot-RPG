const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { PlayerManager: playerManager } = require('../utils/playerManager');
const { InteractiveCombat, generateEnemy } = require('../utils/interactiveCombat');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('combate')
        .setDescription('Inicia un combate interactivo contra un enemigo'),

    async execute(interaction, guildId) {
        const userId = interaction.user.id;
        const player = playerManager.getPlayer(userId, guildId);

        if (!player) {
            return interaction.reply({ 
                content: '❌ No tienes un personaje. Usa `/crear` para crear uno.', 
                ephemeral: true 
            });
        }

        await interaction.deferReply();

        // Generar enemigo
        const enemy = generateEnemy(player.level);

        // Iniciar combate interactivo
        const combat = new InteractiveCombat(userId, enemy, interaction, guildId);
        await combat.start();
    },
};
