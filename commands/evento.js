const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { PlayerManager: playerManager } = require('../utils/playerManager');

// Eventos aleatorios con decisiones
const EVENTS = [
    {
        id: 'mercader_misterioso',
        title: '🎭 Mercader Misterioso',
        description: 'Un mercader encapuchado te ofrece un objeto brillante por 50 oro. Parece valioso pero también sospechoso.',
        choices: [
            {
                id: 'comprar',
                label: 'Comprar (50 oro)',
                emoji: '💰',
                outcome: {
                    text: 'El objeto resulta ser un amuleto mágico que aumenta tu fuerza.',
                    effects: { gold: -50, item: { id: 'amuleto_misterioso', name: 'Amuleto Misterioso', type: 'accessory', stats: { atk: 5, def: 3 }, value: 200 } }
                },
                requirements: { gold: 50 }
            },
            {
                id: 'rechazar',
                label: 'Rechazar',
                emoji: '❌',
                outcome: {
                    text: 'El mercader desaparece en una nube de humo. Sientes que perdiste una oportunidad.',
                    effects: {}
                }
            },
            {
                id: 'robar',
                label: 'Intentar robar',
                emoji: '🗡️',
                outcome: {
                    text: 'El mercader era un hechicero disfrazado. Te lanza un hechizo de castigo.',
                    effects: { gold: -30, reputation: -10 }
                }
            }
        ],
        minLevel: 1
    },
    {
        id: 'aldeano_necesitado',
        title: '👨 Aldeano Necesitado',
        description: 'Un aldeano te pide ayuda. Su hijo está enfermo y necesita una poción de vida urgentemente.',
        choices: [
            {
                id: 'dar_pocion',
                label: 'Dar Poción de Vida',
                emoji: '🧪',
                outcome: {
                    text: 'El aldeano llora de alegría. Te recompensa con oro y su gratitud eterna.',
                    effects: { gold: 100, exp: 50, reputation: 20, removeItem: 'pocion_vida' }
                },
                requirements: { item: 'pocion_vida' }
            },
            {
                id: 'vender_pocion',
                label: 'Vender poción (150 oro)',
                emoji: '💵',
                outcome: {
                    text: 'El aldeano acepta pagarte, pero parece decepcionado de tu codicia.',
                    effects: { gold: 150, reputation: -5, removeItem: 'pocion_vida' }
                },
                requirements: { item: 'pocion_vida' }
            },
            {
                id: 'ignorar',
                label: 'Ignorar',
                emoji: '🚶',
                outcome: {
                    text: 'Sigues tu camino. Los problemas de otros no son tuyos.',
                    effects: { reputation: -10 }
                }
            }
        ],
        minLevel: 1
    },
    {
        id: 'tesoro_escondido',
        title: '🗺️ Mapa del Tesoro',
        description: 'Encuentras un mapa viejo que marca un tesoro escondido. Parece peligroso pero prometedor.',
        choices: [
            {
                id: 'buscar_tesoro',
                label: 'Buscar el tesoro',
                emoji: '⛏️',
                outcome: {
                    text: '¡Encuentras un cofre con oro y equipo legendario!',
                    effects: { gold: 200, exp: 100, item: { id: 'espada_legendaria', name: 'Espada Legendaria', type: 'weapon', stats: { atk: 20, spd: 3 }, value: 800 } }
                },
                success: 0.6
            },
            {
                id: 'vender_mapa',
                label: 'Vender el mapa (100 oro)',
                emoji: '💰',
                outcome: {
                    text: 'Vendes el mapa a un coleccionista. Ganancia segura.',
                    effects: { gold: 100 }
                }
            },
            {
                id: 'ignorar_mapa',
                label: 'Ignorar',
                emoji: '❌',
                outcome: {
                    text: 'Tiras el mapa. Era probablemente una trampa de todos modos.',
                    effects: {}
                }
            }
        ],
        minLevel: 3,
        failureOutcome: {
            text: 'Era una trampa! Guardias te emboscan y pierdes oro en la huida.',
            effects: { gold: -80 }
        }
    },
    {
        id: 'duelo_honor',
        title: '⚔️ Duelo de Honor',
        description: 'Un guerrero te desafía a un duelo honorable. Rechazarlo dañaría tu reputación.',
        choices: [
            {
                id: 'aceptar',
                label: 'Aceptar duelo',
                emoji: '⚔️',
                outcome: {
                    text: '¡Victoria honorable! El guerrero te respeta y te enseña una técnica especial.',
                    effects: { exp: 150, reputation: 30 }
                },
                success: 0.5
            },
            {
                id: 'negociar',
                label: 'Proponer apuesta',
                emoji: '🤝',
                outcome: {
                    text: 'Acuerdan apostar oro. Ganas el duelo y el oro!',
                    effects: { gold: 150, exp: 100, reputation: 15 }
                },
                success: 0.4
            },
            {
                id: 'rechazar',
                label: 'Rechazar',
                emoji: '🏃',
                outcome: {
                    text: 'Tu cobardía se difunde por el reino. Tu reputación sufre.',
                    effects: { reputation: -25 }
                }
            }
        ],
        minLevel: 5,
        failureOutcome: {
            text: 'Pierdes el duelo. Tu orgullo y tu bolsa sufren.',
            effects: { gold: -100, reputation: -15 }
        }
    },
    {
        id: 'ruinas_antiguas',
        title: '🏛️ Ruinas Antiguas',
        description: 'Descubres unas ruinas antiguas con inscripciones mágicas. Podrías aprender algo valioso... o despertar algo peligroso.',
        choices: [
            {
                id: 'estudiar',
                label: 'Estudiar inscripciones',
                emoji: '📖',
                outcome: {
                    text: '¡Aprendes un hechizo antiguo! Tu poder aumenta permanentemente.',
                    effects: { exp: 200, statBonus: { atk: 3, def: 2 } }
                },
                success: 0.7
            },
            {
                id: 'saquear',
                label: 'Saquear el lugar',
                emoji: '💎',
                outcome: {
                    text: 'Encuentras artefactos valiosos para vender.',
                    effects: { gold: 300 }
                }
            },
            {
                id: 'retirarse',
                label: 'Retirarse con cuidado',
                emoji: '🚶',
                outcome: {
                    text: 'Decides no tentar a la suerte. Sabia decisión.',
                    effects: { exp: 25 }
                }
            }
        ],
        minLevel: 7,
        failureOutcome: {
            text: '¡Despertaste un guardián antiguo! Apenas escapas con vida.',
            effects: { gold: -150 }
        }
    }
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('evento')
        .setDescription('Experimenta un evento aleatorio que afectará tu historia'),

    async execute(interaction, guildId) {
        const userId = interaction.user.id;
        const player = playerManager.getPlayer(userId, guildId);

        if (!player) {
            return interaction.reply({ 
                content: '❌ No tienes un personaje. Usa `/crear` para crear uno.', 
                ephemeral: true 
            });
        }

        // Filtrar eventos disponibles según nivel
        const availableEvents = EVENTS.filter(event => player.level >= event.minLevel);

        if (availableEvents.length === 0) {
            return interaction.reply({ 
                content: '❌ No hay eventos disponibles para tu nivel actual.', 
                ephemeral: true 
            });
        }

        // Seleccionar evento aleatorio
        const event = availableEvents[Math.floor(Math.random() * availableEvents.length)];

        // Verificar si el jugador ya vivió este evento recientemente
        const recentEvents = player.events || [];
        const lastEventTime = recentEvents.find(e => e.id === event.id);
        
        if (lastEventTime && Date.now() - lastEventTime.timestamp < 3600000) { // 1 hora
            return interaction.reply({ 
                content: '⏱️ Ya experimentaste un evento similar recientemente. Espera un poco más.', 
                ephemeral: true 
            });
        }

        const embed = new EmbedBuilder()
            .setColor('#ffa500')
            .setTitle(event.title)
            .setDescription(event.description)
            .setFooter({ text: 'Elige sabiamente, tus decisiones tienen consecuencias...' })
            .setTimestamp();

        // Crear botones para las opciones
        const buttons = event.choices.map(choice => {
            let disabled = false;
            
            // Verificar requisitos
            if (choice.requirements) {
                if (choice.requirements.gold && player.gold < choice.requirements.gold) {
                    disabled = true;
                }
                if (choice.requirements.item) {
                    const hasItem = player.inventory.some(i => i.id === choice.requirements.item && i.quantity > 0);
                    if (!hasItem) disabled = true;
                }
            }

            return new ButtonBuilder()
                .setCustomId(`event_${choice.id}`)
                .setLabel(choice.label)
                .setEmoji(choice.emoji)
                .setStyle(disabled ? ButtonStyle.Secondary : ButtonStyle.Primary)
                .setDisabled(disabled);
        });

        const rows = [];
        for (let i = 0; i < buttons.length; i += 4) {
            rows.push(new ActionRowBuilder().addComponents(buttons.slice(i, i + 4)));
        }

        await interaction.reply({ embeds: [embed], components: rows });

        // Esperar decisión del jugador
        const filter = i => i.user.id === userId && i.customId.startsWith('event_');
        
        try {
            const decision = await interaction.channel.awaitMessageComponent({ 
                filter, 
                time: 60000 
            });

            await decision.deferUpdate();

            const choiceId = decision.customId.replace('event_', '');
            const choice = event.choices.find(c => c.id === choiceId);

            let outcome = choice.outcome;
            let success = true;

            // Si la elección tiene probabilidad de éxito
            if (choice.success !== undefined) {
                success = Math.random() < choice.success;
                if (!success && event.failureOutcome) {
                    outcome = event.failureOutcome;
                }
            }

            // Aplicar efectos
            const resultEmbed = new EmbedBuilder()
                .setColor(success ? '#00ff00' : '#ff6600')
                .setTitle(success ? '✅ Resultado' : '⚠️ Resultado')
                .setDescription(outcome.text)
                .setTimestamp();

            const changes = [];

            if (outcome.effects) {
                if (outcome.effects.gold) {
                    playerManager.addGold(userId,  outcome.effects.gold);
                    changes.push(`${outcome.effects.gold > 0 ? '+' : ''}${outcome.effects.gold} 🪙 oro`);
                }

                if (outcome.effects.exp) {
                    const levelsGained = playerManager.addExp(userId,  outcome.effects.exp);
                    changes.push(`+${outcome.effects.exp} ⭐ EXP`);
                    
                    if (levelsGained > 0) {
                        changes.push(`🆙 ¡Subiste ${levelsGained} nivel(es)!`);
                    }
                }

                if (outcome.effects.reputation) {
                    player.reputation = (player.reputation || 0) + outcome.effects.reputation;
                    changes.push(`${outcome.effects.reputation > 0 ? '+' : ''}${outcome.effects.reputation} reputación`);
                }

                if (outcome.effects.item) {
                    playerManager.addItem(userId,  outcome.effects.item);
                    changes.push(`📦 Obtienes: **${outcome.effects.item.name}**`);
                }

                if (outcome.effects.removeItem) {
                    playerManager.removeItem(userId,  outcome.effects.removeItem, 1);
                }

                if (outcome.effects.statBonus) {
                    const updatedPlayer = playerManager.getPlayer(userId, guildId);
                    Object.entries(outcome.effects.statBonus).forEach(([stat, bonus]) => {
                        updatedPlayer.baseStats[stat] += bonus;
                        updatedPlayer.stats[stat] += bonus;
                        changes.push(`+${bonus} ${stat.toUpperCase()} permanente`);
                    });
                    playerManager.updatePlayer(userId,  updatedPlayer);
                }
            }

            if (changes.length > 0) {
                resultEmbed.addFields({ name: '📊 Cambios', value: changes.join('\n') });
            }

            // Registrar evento
            if (!player.events) player.events = [];
            player.events.push({ id: event.id, choice: choiceId, timestamp: Date.now() });
            playerManager.updatePlayer(userId,  player);

            await interaction.editReply({ embeds: [resultEmbed], components: [] });

        } catch (error) {
            await interaction.editReply({ 
                content: '⏱️ Tiempo agotado. La oportunidad se perdió...', 
                components: [] 
            });
        }
    },
};
