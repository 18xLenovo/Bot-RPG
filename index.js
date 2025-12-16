require('dotenv').config();
const { Client, GatewayIntentBits, Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { ServerConfigManager: serverConfig } = require('./utils/serverConfigManager');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

// Cargar comandos
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    }
}

// Evento cuando el bot está listo
client.once('ready', () => {
    console.log(`✅ Bot conectado como ${client.user.tag}`);
    console.log(`🎮 Bot RPG iniciado correctamente`);
});

// Evento cuando el bot entra a un servidor
client.on('guildCreate', async guild => {
    console.log(`✅ Bot se unió al servidor: ${guild.name}`);

    // Crear configuración inicial
    const config = serverConfig.getServerConfig(guild.id);
    
    // Buscar canal para enviar mensaje de bienvenida
    const welcomeChannel = guild.channels.cache.find(ch => ch.isTextBased() && !ch.isDMBased());
    
    if (welcomeChannel) {
        const modeButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`mode_solo_${guild.id}`)
                    .setLabel('🏠 Solo Servidor')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(`mode_shared_${guild.id}`)
                    .setLabel('🌍 Compartido')
                    .setStyle(ButtonStyle.Secondary)
            );

        const welcomeEmbed = new EmbedBuilder()
            .setColor('#9B59B6')
            .setTitle('🎮 ¡Bienvenida Bot RPG!')
            .setDescription('Hola! Soy un bot de RPG para Discord. Puedo ayudarte a crear personajes, luchar, hacer mazmorras y mucho más.')
            .addFields(
                { name: '⚙️ Configuración Inicial', value: 'Elige cómo deseas usar este bot en este servidor:' },
                { name: '🏠 **Modo Solo Servidor**', value: 'Los personajes, clanes e inventarios solo funcionan en este servidor.\nSi usas el bot en otro servidor, no podrás acceder a tus datos.' },
                { name: '🌍 **Modo Compartido**', value: 'Los personajes, clanes e inventarios funcionan en TODOS los servidores donde esté el bot.\nTus datos son accesibles desde cualquier servidor.' },
                { name: '❓ ¿Qué debo elegir?', value: '**Solo Servidor**: Si quieres datos separados por servidor (más privacidad)\n**Compartido**: Si quieres tus datos en todos los servidores (más comodidad)' }
            )
            .setFooter({ text: 'Elige un modo para continuar' });

        await welcomeChannel.send({ embeds: [welcomeEmbed], components: [modeButtons] });
    }
});

// Manejar botones de configuración
client.on('interactionCreate', async interaction => {
    if (interaction.isButton()) {
        if (interaction.customId.startsWith('mode_solo_')) {
            const guildId = interaction.customId.replace('mode_solo_', '');
            serverConfig.setServerMode(guildId, 'solo-servidor');
            
            await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#00FF00')
                    .setTitle('✅ Modo Configurado: Solo Servidor')
                    .setDescription('Los datos se guardarán solo para este servidor.\nUsa `/ayuda` para ver todos los comandos disponibles.')
                ],
                ephemeral: true
            });
        }

        if (interaction.customId.startsWith('mode_shared_')) {
            const guildId = interaction.customId.replace('mode_shared_', '');
            serverConfig.setServerMode(guildId, 'compartido');
            
            await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#00FF00')
                    .setTitle('✅ Modo Configurado: Compartido')
                    .setDescription('Los datos funcionarán en todos los servidores.\nUsa `/ayuda` para ver todos los comandos disponibles.')
                ],
                ephemeral: true
            });
        }

        // Botones de reconfiguracion del servidor
        if (interaction.customId.startsWith('config_solo_')) {
            if (!interaction.member.permissions.has('Administrator')) {
                return interaction.reply({
                    content: '❌ Solo administradores pueden cambiar la configuración.',
                    ephemeral: true
                });
            }

            const guildId = interaction.customId.replace('config_solo_', '');
            serverConfig.setServerMode(guildId, 'solo-servidor');
            
            await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#00FF00')
                    .setTitle('✅ Modo Cambiado: Solo Servidor')
                    .setDescription('De ahora en adelante, los datos se guardarán solo en este servidor.\n\n⚠️ Los datos compartidos anteriores seguirán siendo accesibles en otros servidores.')
                ],
                ephemeral: true
            });
        }

        if (interaction.customId.startsWith('config_shared_')) {
            if (!interaction.member.permissions.has('Administrator')) {
                return interaction.reply({
                    content: '❌ Solo administradores pueden cambiar la configuración.',
                    ephemeral: true
                });
            }

            const guildId = interaction.customId.replace('config_shared_', '');
            serverConfig.setServerMode(guildId, 'compartido');
            
            await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#00FF00')
                    .setTitle('✅ Modo Cambiado: Compartido')
                    .setDescription('De ahora en adelante, los datos se compartirán en todos los servidores.\n\n⚠️ Los datos de solo servidor seguirán siendo privados.')
                ],
                ephemeral: true
            });
        }
    }

    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        // Pasar el guildId a los comandos
        await command.execute(interaction, interaction.guildId);
    } catch (error) {
        console.error(error);
        const errorMessage = '❌ Hubo un error ejecutando este comando.';
        
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: errorMessage, ephemeral: true });
        } else {
            await interaction.reply({ content: errorMessage, ephemeral: true });
        }
    }
});

// Login
client.login(process.env.DISCORD_TOKEN);
