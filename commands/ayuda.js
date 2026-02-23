const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ayuda')
        .setDescription('Muestra todos los comandos disponibles')
        .addStringOption(option =>
            option.setName('categoria')
                .setDescription('Categoría de ayuda')
                .setRequired(false)
                .addChoices(
                    { name: '📋 General - Todos los comandos', value: 'general' },
                    { name: '⚔️ Combate y Mazmorras', value: 'combate' },
                    { name: '🛡️ Clanes y Social', value: 'clanes' },
                    { name: '🏪 Tienda e Items', value: 'tienda' },
                    { name: '✨ Rarezas y Clases', value: 'rarezas' },
                    { name: '👑 Administración', value: 'admin' }
                )),

    async execute(interaction, guildId) {
        const categoria = interaction.options.getString('categoria') || 'general';
        
        let embed;
        
        if (categoria === 'general') {
            embed = new EmbedBuilder()
                .setColor('#9B59B6')
                .setTitle('🎮 Hexfall - Bot RPG Mítico')
                .setDescription('**Bienvenido a Hexfall**, el bot RPG con mitología épica.\n\n*Usa `/ayuda categoria:(nombre)` para ver detalles*')
                .addFields(
                    { name: '👤 Personaje', value: '`/crear` `/perfil` `/habilidades` `/inventario`', inline: true },
                    { name: '⚔️ Combate', value: '`/combate` `/mazmorra`', inline: true },
                    { name: '🛡️ Clanes', value: '`/clan crear/info/invitar/salir/donar`', inline: true },
                    { name: '🏪 Tienda', value: '`/tienda` `/usar`', inline: true },
                    { name: '📊 Progreso', value: '`/misiones` `/ranking` `/evento`', inline: true },
                    { name: '⚙️ Admin', value: '`/admin` `/config-servidor` `/borrar`', inline: true },
                    { name: '📚 Categorías de Ayuda', value: '⚔️ `combate` - Combate y mazmorras\n🛡️ `clanes` - Sistema de clanes\n🏪 `tienda` - Items y economía\n✨ `rarezas` - Clases y rarezas\n👑 `admin` - Comandos admin', inline: false }
                )
                .setFooter({ text: 'Hexfall v2.0 - 16 comandos disponibles' })
                .setTimestamp();
        }
        
        else if (categoria === 'combate') {
            embed = new EmbedBuilder()
                .setColor('#FF4444')
                .setTitle('⚔️ Combate y Mazmorras')
                .setDescription('**Sistema de combate interactivo y mazmorras cooperativas**')
                .addFields(
                    {
                        name: '🗡️ Combate Individual',
                        value: '`/combate` - Combate por turnos contra enemigos\n\n**Características:**\n• Sistema de turnos interactivo\n• Usa ataques normales o habilidades especiales\n• Gana oro y experiencia\n• Diferentes enemigos según tu nivel',
                        inline: false
                    },
                    {
                        name: '🏰 Mazmorras Cooperativas',
                        value: '`/mazmorra` - Explora con hasta 8 jugadores\n\n**Mazmorras Disponibles:**\n🌲 Bosque Encantado (Fácil, 1-4 jugadores)\n⛏️ Minas Profundas (Media, 1-5 jugadores)\n🏛️ Templo Maldito (Difícil, 1-6 jugadores)\n🏰 Ciudadela del Demonio (Legendaria, 1-8 jugadores)',
                        inline: false
                    },
                    {
                        name: '⭐ Recompensas Legendarias',
                        value: '**Items exclusivos de mazmorras:**\n• ⭐ Espada Legendaria\n• ⭐ Hacha del Dragón\n• ⭐ Arco Infinito\n• ⭐ Armadura de Dragón\n• ⭐ Anillo Infinito\n• 🔵 Espada de Sombra (especial)',
                        inline: false
                    }
                )
                .setFooter({ text: 'Usa /ayuda categoria:general para volver' })
                .setTimestamp();
        }
        
        else if (categoria === 'clanes') {
            embed = new EmbedBuilder()
                .setColor('#3498DB')
                .setTitle('🛡️ Sistema de Clanes')
                .setDescription('**Crea o únete a un clan y conquisten juntos**')
                .addFields(
                    {
                        name: 'Comandos de Clan',
                        value: '`/clan crear [nombre]` - Crear clan (500 oro)\n`/clan info` - Ver información del clan\n`/clan invitar [@usuario]` - Invitar miembro\n`/clan salir` - Abandonar el clan\n`/clan donar [cantidad]` - Donar a la tesorería\n`/clan anuncio [mensaje]` - Anuncio (solo líder)\n`/clan ranking` - Ranking de clanes',
                        inline: false
                    },
                    {
                        name: '⬆️ Niveles de Clan',
                        value: '**Nivel 1** - 3 miembros\n**Nivel 2** - 5 miembros (1000 oro)\n**Nivel 3** - 7 miembros (2500 oro)\n**Nivel 4** - 10 miembros (5000 oro)\n**Nivel 5** - 15 miembros (10000 oro)',
                        inline: false
                    },
                    {
                        name: '💰 Tesorería',
                        value: 'Los miembros pueden donar oro para subir el nivel del clan y desbloquear más espacios.',
                        inline: false
                    }
                )
                .setFooter({ text: 'Usa /ayuda categoria:general para volver' })
                .setTimestamp();
        }
        
        else if (categoria === 'tienda') {
            embed = new EmbedBuilder()
                .setColor('#F39C12')
                .setTitle('🏪 Tienda e Items')
                .setDescription('**Compra y gestiona tu equipamiento**')
                .addFields(
                    {
                        name: 'Comandos',
                        value: '`/tienda` - Ver y comprar items\n`/inventario` - Ver y equipar items\n`/usar [item]` - Usar consumibles',
                        inline: false
                    },
                    {
                        name: '📦 Categorías de Items',
                        value: '**Consumibles** - Pociones, elixires, antídotos\n**Armas** - Espadas, hachas, arcos, bastones\n**Armaduras** - Protección de tela hasta dragón\n**Accesorios** - Anillos, amuletos, brazaletes',
                        inline: false
                    },
                    {
                        name: '✨ Sistema de Rarezas',
                        value: '⚪ **Común** - Stats base (x1)\n🟢 **Poco Común** - Stats mejoradas (x1.5)\n🔵 **Especial** - Stats avanzadas (x2)\n🟣 **Épico** - Stats poderosas (x3)\n⭐ **Legendario** - Stats supremas (x4)\n🔮 **Mítico** - Stats divinas (x5)\n🌟 **Celestial** - Stats trascendentales (x6)',
                        inline: false
                    },
                    {
                        name: '💡 Cómo Obtener Items',
                        value: '• ⚪🟢🔵🟣 Compra en `/tienda`\n• ⭐🔮 Solo en mazmorras cooperativas\n• 🌟 Solo en eventos especiales y jefes finales',
                        inline: false
                    }
                )
                .setFooter({ text: 'Total: 65+ items disponibles' })
                .setTimestamp();
        }
        
        else if (categoria === 'rarezas') {
            embed = new EmbedBuilder()
                .setColor('#9B59B6')
                .setTitle('✨ Clases y Sistema de Rarezas')
                .setDescription('**Elige tu camino y descubre items legendarios**')
                .addFields(
                    {
                        name: '🎯 Clases de Personaje',
                        value: '⚔️ **Guerrero** - Tanque resistente (HP+, DEF+)\n🔮 **Mago** - Maestro arcano (MANA++, ATK mágico)\n🏹 **Arquero** - DPS veloz (SPD++, ATK+)\n✨ **Clérigo** - Sanador (HEAL+, MANA+)\n🗡️ **Asesino** - Críticos letales (SPD++, CRIT+)\n🛡️ **Paladín** - Híbrido equilibrado (DEF+, HEAL+)\n🔥 **Berserker** - Daño explosivo (ATK++, HP-)\n❄️ **Nigromante** - Maestro oscuro (MANA++, DARK)',
                        inline: false
                    },
                    {
                        name: '💎 Rarezas de Items',
                        value: '⚪ **Común** - Inicio (2-5 stats)\n🟢 **Poco Común** - Temprano (6-10 stats)\n🔵 **Especial** - Medio (11-15 stats)\n🟣 **Épico** - Avanzado (16-20 stats)\n⭐ **Legendario** - Mazmorras (21-28 stats)\n🔮 **Mítico** - Élite (29-35 stats)\n🌟 **Celestial** - Dioses (36-50 stats)',
                        inline: false
                    },
                    {
                        name: '🏆 Items Celestiales',
                        value: '**Los más raros del juego:**\n🌟 Espada de los Cielos (+50 ATK)\n🌟 Armadura Celestial (+45 DEF)\n🌟 Corona de las Estrellas (+100 HP, +30 MANA)\n\n*Solo en eventos legendarios*',
                        inline: false
                    }
                )
                .setFooter({ text: '8 clases | 7 rarezas | 65+ items' })
                .setTimestamp();
        }
        
        else if (categoria === 'admin') {
            embed = new EmbedBuilder()
                .setColor('#E74C3C')
                .setTitle('👑 Comandos de Administración')
                .setDescription('**Solo disponibles en modo solo-servidor**')
                .addFields(
                    {
                        name: 'Comandos /admin',
                        value: '`/admin monedas [@usuario] [cantidad]` - Dar oro\n`/admin xp [@usuario] [cantidad]` - Dar XP\n`/admin item [@usuario] [nombre]` - Dar item\n`/admin stats [@usuario] [stat] [cantidad]` - Aumentar stats\n`/admin listar` - Ver todos los items',
                        inline: false
                    },
                    {
                        name: 'Configuración',
                        value: '`/config-servidor` - Cambiar modo del servidor\n\n**Modos disponibles:**\n• **Solo-servidor** - Datos únicos por servidor\n• **Compartido** - Datos globales',
                        inline: false
                    },
                    {
                        name: '⚠️ Otros Comandos',
                        value: '`/borrar` - Eliminar personaje permanentemente',
                        inline: false
                    }
                )
                .setFooter({ text: 'Requiere permisos de Administrador' })
                .setTimestamp();
        }

        await interaction.reply({ embeds: [embed] });
    },
};
