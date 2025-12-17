const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ayuda')
        .setDescription('Muestra todos los comandos disponibles'),

    async execute(interaction, guildId) {
        const embed = new EmbedBuilder()
            .setColor('#9B59B6')
            .setTitle('🎮 Hexfall - Bot RPG de Discord')
            .setDescription('Bienvenido a **Hexfall**, tu bot RPG completo con personajes, combates, clanes y mazmorras cooperativas.\n\n**Total de comandos disponibles: 16**')
            .addFields(
                {
                    name: '👤 Personaje',
                    value: '`/crear` - Crea tu personaje eligiendo una clase\n`/perfil` - Ver tu perfil completo o el de otro usuario\n`/habilidades` - Ver las habilidades de tu clase\n`/inventario` - Ver y equipar items',
                    inline: false
                },
                {
                    name: '⚔️ Combate',
                    value: '`/combate` - Combate interactivo por turnos\n`/mazmorra` - Explora mazmorras (solo o cooperativo con amigos)',
                    inline: false
                },
                {
                    name: '🛡️ Clanes',
                    value: '`/clan crear` - Crear un nuevo clan (500 oro)\n`/clan info` - Ver información de tu clan\n`/clan invitar` - Invitar miembros\n`/clan salir` - Abandonar el clan\n`/clan donar` - Donar oro a la tesorería\n`/clan anuncio` - Hacer anuncio (solo líder)\n`/clan ranking` - Ver ranking de clanes',
                    inline: false
                },
                {
                    name: '🏪 Tienda & Economía',
                    value: '`/tienda` - Compra armas, armaduras, accesorios y consumibles\n`/usar` - Usa items consumibles (pociones, etc)',
                    inline: false
                },
                {
                    name: '📊 Progreso & Aventura',
                    value: '`/misiones` - Ver y completar misiones\n`/ranking` - Ver clasificación de jugadores\n`/evento` - Vive eventos con decisiones que afectan tu historia',
                    inline: false
                },
                {
                    name: '⚙️ Configuración & Administración',
                    value: '`/config-servidor` - Configurar modo del servidor (admin)\n`/admin` - Comandos administrativos (solo modo solo-servidor)\n`/ayuda` - Mostrar este mensaje\n`/borrar` - Eliminar tu personaje permanentemente',
                    inline: false
                }
            )
            .addFields(
                {
                    name: '✨ Sistema de Rarezas',
                    value: '⚪ **Común** - Items básicos para empezar\n🟢 **Poco Común** - Mejoras tempranas (+50% poder)\n🔵 **Especial** - Items de mediojuego (+100% poder)\n🟣 **Épico** - Items muy poderosos (+200% poder)\n⭐ **Legendario** - Items únicos de mazmorras (+300% poder)',
                    inline: false
                },
                {
                    name: '🎯 Clases Disponibles',
                    value: '⚔️ **Guerrero** - Fuerte y resistente\n🔮 **Mago** - Maestro de la magia\n🏹 **Arquero** - Rápido y preciso\n✨ **Clérigo** - Sanador del grupo',
                    inline: false
                },
                {
                    name: '📦 Items Legendarios',
                    value: 'Los items ⭐ **Legendarios** solo se consiguen en mazmorras cooperativas:\n• Espada Legendaria (+25 ATK)\n• Hacha del Dragón (+28 ATK)\n• Arco Infinito (+22 ATK, +8 SPD)\n• Armadura de Dragón (+30 DEF)\n• Anillo Infinito (Stats supremos)\n\n**También hay items especiales 🔵 exclusivos de mazmorras**',
                    inline: false
                },
                {
                    name: '👑 Comandos de Admin (Solo modo solo-servidor)',
                    value: '`/admin monedas` - Dar oro a jugadores\n`/admin xp` - Dar experiencia\n`/admin item` - Dar cualquier item\n`/admin stats` - Aumentar stats\n`/admin listar` - Ver todos los items disponibles',
                    inline: false
                },
                {
                    name: '🌟 Características Principales',
                    value: '✅ **42 items diferentes** con sistema de rarezas\n✅ Combate interactivo por turnos\n✅ Sistema de clanes con 5 niveles\n✅ Mazmorras cooperativas (hasta 8 jugadores)\n✅ Eventos con decisiones\n✅ Sistema de reputación\n✅ Modo solo-servidor o compartido',
                    inline: false
                },
                {
                    name: '💡 Primeros Pasos',
                    value: '1. Usa `/crear` para hacer tu personaje\n2. Lee `/habilidades` para conocer tus poderes\n3. Prueba `/combate` contra enemigos\n4. Compra equipo en `/tienda` (fíjate en las rarezas)\n5. Crea o únete a un clan con `/clan`\n6. Explora `/mazmorra` con amigos para obtener legendarios',
                    inline: false
                }
            )
            .setFooter({ text: 'Hexfall v2.0 - Sistema de Rarezas Implementado' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
