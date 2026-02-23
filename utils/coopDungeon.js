const { PlayerManager: playerManager } = require('./playerManager');
const { ClanManager: clanManager } = require('./clanManager');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

// Mazmorras cooperativas mejoradas
const COOP_DUNGEONS = {
    bosque_encantado: {
        name: '🌲 Bosque Encantado',
        description: 'Un bosque místico lleno de criaturas mágicas',
        minLevel: 1,
        maxPlayers: 4,
        rooms: 5,
        difficulty: 'Fácil',
        rewardDescription: '100-200 oro, 50-100 EXP, Items raros',
        rewards: {
            gold: 300,
            exp: 200,
            clanExp: 50,
            items: [
                { id: 'anillo_bosque', name: 'Anillo del Bosque', type: 'accessory', stats: { hp: 20, def: 5 }, value: 250 }
            ]
        },
        enemies: [
            { name: 'Duende', emoji: '🧚', hp: 60, atk: 10, def: 6 },
            { name: 'Treant', emoji: '🌳', hp: 100, atk: 15, def: 12 }
        ],
        boss: {
            name: 'Señor del Bosque',
            emoji: '👑🌲',
            hp: 300,
            atk: 25,
            def: 15,
            abilities: ['Enredar', 'Espinas Venenosas']
        },
        events: [
            {
                type: 'treasure',
                description: 'Encuentran un cofre antiguo',
                reward: { gold: 50 }
            },
            {
                type: 'trap',
                description: 'Una trampa de espinas los daña',
                damage: 15
            },
            {
                type: 'fountain',
                description: 'Una fuente mágica restaura su energía',
                heal: 30
            }
        ]
    },
    minas_profundas: {
        name: '⛏️ Minas Profundas',
        description: 'Antiguas minas infestadas de criaturas oscuras',
        minLevel: 3,
        maxPlayers: 5,
        rooms: 7,
        difficulty: 'Media',
        rewardDescription: '200-400 oro, 100-200 EXP, Equipamiento especial',
        rewards: {
            gold: 600,
            exp: 400,
            clanExp: 100,
            items: [
                { id: 'pico_adamantita', name: 'Pico de Adamantita', type: 'weapon', stats: { atk: 15, def: 8 }, value: 500 }
            ]
        },
        enemies: [
            { name: 'Golem de Roca', emoji: '🗿', hp: 120, atk: 18, def: 20 },
            { name: 'Murciélago Gigante', emoji: '🦇', hp: 80, atk: 22, def: 8 }
        ],
        boss: {
            name: 'Dragón de Cristal',
            emoji: '💎🐉',
            hp: 500,
            atk: 35,
            def: 25,
            abilities: ['Aliento Cristalino', 'Armadura de Diamante']
        },
        events: [
            {
                type: 'treasure',
                description: 'Descubren vetas de oro en las paredes',
                reward: { gold: 100 }
            },
            {
                type: 'collapse',
                description: 'Un derrumbe daña al grupo',
                damage: 25
            },
            {
                type: 'shrine',
                description: 'Un altar antiguo bendice al grupo',
                buff: { atk: 5, duration: 2 }
            }
        ]
    },
    templo_maldito: {
        name: '🏛️ Templo Maldito',
        description: 'Un templo olvidado donde los muertos no descansan',
        minLevel: 5,
        maxPlayers: 6,
        rooms: 10,
        difficulty: 'Difícil',
        rewardDescription: '400-800 oro, 200-400 EXP, Artículos legendarios',
        rewards: {
            gold: 1200,
            exp: 800,
            clanExp: 200,
            items: [
                { id: 'corona_rey_oscuro', name: 'Corona del Rey Oscuro', type: 'accessory', stats: { atk: 12, hp: 50, def: 10 }, value: 1000 }
            ]
        },
        enemies: [
            { name: 'Caballero Esqueleto', emoji: '☠️⚔️', hp: 150, atk: 28, def: 22 },
            { name: 'Liche', emoji: '💀🔮', hp: 120, atk: 35, def: 15 }
        ],
        boss: {
            name: 'Rey Oscuro Resucitado',
            emoji: '👑💀',
            hp: 800,
            atk: 45,
            def: 30,
            abilities: ['Ejército de Muertos', 'Aura Maldita', 'Golpe Devastador']
        },
        events: [
            {
                type: 'puzzle',
                description: 'Deben resolver un acertijo antiguo',
                success: { exp: 100 },
                failure: { damage: 30 }
            },
            {
                type: 'sacrifice',
                description: 'Un altar pide un sacrificio de oro por poder',
                cost: { gold: 50 },
                reward: { buff: { atk: 10, def: 10, duration: 3 } }
            },
            {
                type: 'ghost',
                description: 'Un espíritu antiguo les advierte del peligro',
                effect: 'reveal_boss'
            }
        ]
    },
    ciudadela_demonio: {
        name: '🏰 Ciudadela del Demonio',
        description: 'La fortaleza del señor demonio y su ejército',
        minLevel: 8,
        maxPlayers: 8,
        rooms: 15,
        difficulty: 'Legendaria',
        rewardDescription: '1000-2000 oro, 500-1000 EXP, Tesoros épicos',
        rewards: {
            gold: 2500,
            exp: 1500,
            clanExp: 500,
            items: [
                { id: 'espada_demon_slayer', name: 'Espada Mata-Demonios', type: 'weapon', stats: { atk: 35, spd: 10 }, value: 2000 },
                { id: 'armadura_celestial', name: 'Armadura Celestial', type: 'armor', stats: { def: 30, hp: 100 }, value: 2500 }
            ]
        },
        enemies: [
            { name: 'Demonio Menor', emoji: '😈', hp: 200, atk: 35, def: 25 },
            { name: 'Guardia Infernal', emoji: '🔥👹', hp: 250, atk: 40, def: 30 }
        ],
        boss: {
            name: 'Señor Demonio',
            emoji: '😈👑',
            hp: 1500,
            atk: 60,
            def: 40,
            abilities: ['Llamas del Infierno', 'Invocación Demoníaca', 'Ira Infernal', 'Regeneración Oscura']
        },
        events: [
            {
                type: 'miniboss',
                description: 'Un campeón demonio bloquea el camino',
                enemy: { name: 'Campeón Infernal', emoji: '👹', hp: 400, atk: 45, def: 30 }
            },
            {
                type: 'lava',
                description: 'Cruzan un río de lava ardiente',
                damage: 40
            },
            {
                type: 'arsenal',
                description: 'Encuentran un arsenal con armas legendarias',
                reward: { buff: { atk: 15, duration: 5 } }
            }
        ]
    }
};

class CoopDungeonSession {
    constructor(dungeonKey, leader, interaction, guildId) {
        this.dungeon = COOP_DUNGEONS[dungeonKey];
        this.dungeonKey = dungeonKey;
        this.leader = leader;
        this.guildId = guildId;
        this.interaction = interaction;
        this.players = [leader];
        this.playersData = new Map();
        this.started = false;
        this.currentRoom = 0;
        this.log = [];
        this.activeBattles = [];
        
        // Cargar datos del líder
        const leaderPlayer = playerManager.getPlayer(leader, guildId);
        this.playersData.set(leader, {
            hp: leaderPlayer.stats.hp,
            maxHp: leaderPlayer.stats.hp,
            mana: leaderPlayer.stats.mana || leaderPlayer.stats.maxMana,
            maxMana: leaderPlayer.stats.maxMana,
            buffs: []
        });
    }

    addPlayer(userId) {
        if (this.started) {
            return { success: false, message: 'La mazmorra ya comenzó.' };
        }

        if (this.players.length >= this.dungeon.maxPlayers) {
            return { success: false, message: `La party está llena (máximo ${this.dungeon.maxPlayers} jugadores).` };
        }

        if (this.players.includes(userId)) {
            return { success: false, message: 'Ya estás en esta party.' };
        }

        const player = playerManager.getPlayer(userId, this.guildId);
        if (!player) {
            return { success: false, message: 'El jugador no tiene un personaje.' };
        }

        if (player.level < this.dungeon.minLevel) {
            return { success: false, message: `Nivel mínimo requerido: ${this.dungeon.minLevel}` };
        }

        this.players.push(userId);
        this.playersData.set(userId, {
            hp: player.stats.hp,
            maxHp: player.stats.hp,
            mana: player.stats.mana || player.stats.maxMana,
            maxMana: player.stats.maxMana,
            buffs: []
        });

        return { success: true, message: `¡Jugador añadido! (${this.players.length}/${this.dungeon.maxPlayers})` };
    }

    async start() {
        this.started = true;
        this.log.push(`🏰 **${this.dungeon.name}**`);
        this.log.push(`*${this.dungeon.description}*`);
        this.log.push(`\n👥 **Party:** ${this.players.length} jugador(es)`);
        this.log.push(`📊 Salas: ${this.dungeon.rooms} | Dificultad: ${this.dungeon.difficulty}`);
        this.log.push('\n🚪 **Entrando a la mazmorra...**\n');

        return await this.nextRoom();
    }

    async nextRoom() {
        this.currentRoom++;

        if (this.currentRoom > this.dungeon.rooms) {
            return await this.completeDungeon();
        }

        // Sala del jefe
        if (this.currentRoom === this.dungeon.rooms) {
            return await this.bossFight();
        }

        this.log.push(`\n═══ **Sala ${this.currentRoom}/${this.dungeon.rooms}** ═══`);

        // Evento aleatorio o combate
        const roll = Math.random();
        
        if (roll < 0.3 && this.dungeon.events.length > 0) {
            return await this.handleEvent();
        } else {
            return await this.handleCombat();
        }
    }

    async handleEvent() {
        const event = this.dungeon.events[Math.floor(Math.random() * this.dungeon.events.length)];
        
        this.log.push(`\n🎲 **Evento:** ${event.description}`);

        switch (event.type) {
            case 'treasure':
                this.log.push(`💰 +${event.reward.gold} oro para cada miembro!`);
                this.players.forEach(userId => {
                    playerManager.addGold(userId, event.reward.gold, this.guildId);
                });
                break;

            case 'trap':
            case 'collapse':
            case 'lava':
                this.log.push(`💥 ¡Todos reciben ${event.damage} de daño!`);
                this.players.forEach(userId => {
                    const playerData = this.playersData.get(userId);
                    playerData.hp = Math.max(0, playerData.hp - event.damage);
                });
                break;

            case 'fountain':
            case 'shrine':
                if (event.heal) {
                    this.log.push(`💚 ¡Todos recuperan ${event.heal} HP!`);
                    this.players.forEach(userId => {
                        const playerData = this.playersData.get(userId);
                        playerData.hp = Math.min(playerData.maxHp, playerData.hp + event.heal);
                    });
                }
                if (event.buff) {
                    this.log.push(`💪 ¡El grupo recibe un buff de ATK y DEF!`);
                }
                break;

            case 'puzzle':
                const puzzleSuccess = Math.random() < 0.6;
                if (puzzleSuccess) {
                    this.log.push(`✅ ¡Resolvieron el acertijo! +${event.success.exp} EXP`);
                    this.players.forEach(userId => {
                        playerManager.addExp(userId, event.success.exp, this.guildId);
                    });
                } else {
                    this.log.push(`❌ Fallaron... Reciben ${event.failure.damage} de daño`);
                    this.players.forEach(userId => {
                        const playerData = this.playersData.get(userId);
                        playerData.hp = Math.max(0, playerData.hp - event.failure.damage);
                    });
                }
                break;
        }

        return await this.showRoomResult();
    }

    async handleCombat() {
        const enemy = this.dungeon.enemies[Math.floor(Math.random() * this.dungeon.enemies.length)];
        const enemyCount = Math.min(this.players.length, Math.floor(Math.random() * 2) + 1);

        this.log.push(`\n⚔️ **Combate:** ${enemyCount}x ${enemy.emoji} ${enemy.name}`);

        // Combate simplificado para el grupo
        const totalPlayerAtk = this.players.reduce((sum, userId) => {
            const player = playerManager.getPlayer(userId, this.guildId);
            return sum + player.stats.atk;
        }, 0);

        const totalEnemyAtk = enemy.atk * enemyCount;
        const totalEnemyHp = enemy.hp * enemyCount;

        // Simular combate
        const playerDamage = Math.floor(totalPlayerAtk * (1.2 + Math.random() * 0.4));
        const enemyDamage = Math.floor(totalEnemyAtk * (0.8 + Math.random() * 0.4));

        this.log.push(`⚔️ El grupo ataca: **${playerDamage}** de daño total`);
        this.log.push(`🗡️ Los enemigos contraatacan: **${enemyDamage}** de daño distribuido`);

        // Distribuir daño entre jugadores
        const damagePerPlayer = Math.floor(enemyDamage / this.players.length);
        this.players.forEach(userId => {
            const playerData = this.playersData.get(userId);
            playerData.hp = Math.max(0, playerData.hp - damagePerPlayer);
        });

        if (playerDamage >= totalEnemyHp) {
            this.log.push(`✅ ¡Victoria! Los enemigos fueron derrotados.`);
            const expReward = 30 * enemyCount;
            const goldReward = 20 * enemyCount;
            this.log.push(`💰 +${goldReward} oro | ⭐ +${expReward} EXP (cada uno)`);
            
            this.players.forEach(userId => {
                playerManager.addGold(userId, goldReward, this.guildId);
                playerManager.addExp(userId, expReward, this.guildId);
            });
        }

        return await this.showRoomResult();
    }

    async bossFight() {
        const boss = this.dungeon.boss;
        
        this.log.push(`\n\n╔═══════════════════════════╗`);
        this.log.push(`║  🏆 **JEFE FINAL** 🏆  ║`);
        this.log.push(`╚═══════════════════════════╝`);
        this.log.push(`\n${boss.emoji} **${boss.name}**`);
        this.log.push(`❤️ HP: ${boss.hp} | ⚔️ ATK: ${boss.atk} | 🛡️ DEF: ${boss.def}`);
        this.log.push(`✨ Habilidades: ${boss.abilities.join(', ')}\n`);

        // Combate épico contra el jefe
        const totalPlayerAtk = this.players.reduce((sum, userId) => {
            const player = playerManager.getPlayer(userId, this.guildId);
            return sum + player.stats.atk;
        }, 0);

        let bossHp = boss.hp;
        let turn = 0;

        while (bossHp > 0 && this.players.some(id => this.playersData.get(id).hp > 0)) {
            turn++;
            this.log.push(`\n**─── Turno ${turn} ───**`);

            // Ataque del grupo
            const playerDamage = Math.floor(totalPlayerAtk * (1.5 + Math.random() * 0.5));
            bossHp -= playerDamage;
            this.log.push(`⚔️ El grupo ataca: **${playerDamage}** de daño`);

            if (bossHp <= 0) break;

            // Ataque del jefe (habilidad especial cada 2 turnos)
            const bossDamage = turn % 2 === 0
                ? Math.floor(boss.atk * 2.5)
                : Math.floor(boss.atk * 1.5);

            const abilityUsed = turn % 2 === 0 
                ? boss.abilities[Math.floor(Math.random() * boss.abilities.length)]
                : 'Ataque';

            this.log.push(`${boss.emoji} ${boss.name} usa **${abilityUsed}**: ${bossDamage} de daño!`);

            // Distribuir daño
            const damagePerPlayer = Math.floor(bossDamage / this.players.length);
            this.players.forEach(userId => {
                const playerData = this.playersData.get(userId);
                playerData.hp = Math.max(0, playerData.hp - damagePerPlayer);
            });

            // Límite de 10 turnos
            if (turn >= 10) break;
        }

        const victory = bossHp <= 0;

        if (victory) {
            this.log.push(`\n\n🎉 **¡JEFE DERROTADO!** 🎉`);
            return await this.completeDungeon();
        } else {
            this.log.push(`\n\n💀 **El grupo fue derrotado por el jefe...**`);
            return await this.failDungeon();
        }
    }

    async completeDungeon() {
        this.log.push(`\n\n╔═══════════════════════════════╗`);
        this.log.push(`║  🎊 **¡MAZMORRA COMPLETADA!** 🎊  ║`);
        this.log.push(`╚═══════════════════════════════╝\n`);

        const rewards = this.dungeon.rewards;
        this.log.push(`**🏆 Recompensas:**`);
        this.log.push(`💰 ${rewards.gold} oro (cada uno)`);
        this.log.push(`⭐ ${rewards.exp} EXP (cada uno)`);

        // Distribuir recompensas
        this.players.forEach(userId => {
            playerManager.addGold(userId, rewards.gold, this.guildId);
            const levelsGained = playerManager.addExp(userId, rewards.exp, this.guildId);
            
            if (levelsGained > 0) {
                this.log.push(`🆙 <@${userId}> subió ${levelsGained} nivel(es)!`);
            }

            // Item aleatorio
            if (Math.random() < 0.4 && rewards.items.length > 0) {
                const item = rewards.items[Math.floor(Math.random() * rewards.items.length)];
                playerManager.addItem(userId, { ...item }, this.guildId);
                this.log.push(`📦 <@${userId}> obtuvo: **${item.name}**!`);
            }
        });

        // Recompensa de clan si están en uno
        const leaderClan = clanManager.getPlayerClan(this.leader);
        if (leaderClan) {
            const allInSameClan = this.players.every(id => {
                const playerClan = clanManager.getPlayerClan(id);
                return playerClan && playerClan.id === leaderClan.id;
            });

            if (allInSameClan) {
                this.log.push(`\n⚜️ **Bonificación de Clan:**`);
                this.log.push(`+${rewards.clanExp} EXP de clan`);
                clanManager.addExp(leaderClan.id, rewards.clanExp);
                leaderClan.dungeonClears = (leaderClan.dungeonClears || 0) + 1;
            }
        }

        return await this.showFinalResult();
    }

    async failDungeon() {
        this.log.push(`\n**💀 Mazmorra Fallida**`);
        this.log.push(`El grupo fue derrotado en la sala ${this.currentRoom}/${this.dungeon.rooms}`);
        
        // Penalización menor
        const goldLost = 50;
        this.log.push(`\nPenalización: -${goldLost} oro (cada uno)`);
        
        this.players.forEach(userId => {
            playerManager.addGold(userId, -goldLost, this.guildId);
        });

        return await this.showFinalResult();
    }

    async showRoomResult() {
        const embed = new EmbedBuilder()
            .setColor('#00aaff')
            .setTitle(`${this.dungeon.name} - Sala ${this.currentRoom}/${this.dungeon.rooms}`)
            .setDescription(this.log.slice(-15).join('\n'))
            .addFields(
                { 
                    name: '👥 Estado del Grupo', 
                    value: this.players.map(id => {
                        const player = playerManager.getPlayer(id, this.guildId);
                        const data = this.playersData.get(id);
                        return `<@${id}>: ❤️ ${data.hp}/${data.maxHp}`;
                    }).join('\n')
                }
            );

        const continueButton = new ButtonBuilder()
            .setCustomId('dungeon_continue')
            .setLabel('➡️ Continuar')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(continueButton);

        await this.interaction.editReply({ embeds: [embed], components: [row] });

        // Esperar que el líder continúe
        const filter = i => i.customId === 'dungeon_continue' && i.user.id === this.leader;
        
        try {
            const response = await this.interaction.channel.awaitMessageComponent({ 
                filter, 
                time: 120000 
            });

            await response.deferUpdate();
            
            // Pausa dramática
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            return await this.nextRoom();
        } catch (error) {
            this.log.push('\n⏱️ Tiempo agotado. La mazmorra fue abandonada.');
            return await this.showFinalResult();
        }
    }

    async showFinalResult() {
        const embed = new EmbedBuilder()
            .setColor(this.log.some(l => l.includes('COMPLETADA')) ? '#00ff00' : '#ff0000')
            .setTitle(`${this.dungeon.name}`)
            .setDescription(this.log.join('\n'))
            .setTimestamp();

        await this.interaction.editReply({ embeds: [embed], components: [] });
    }
}

module.exports = { CoopDungeonSession, COOP_DUNGEONS };
