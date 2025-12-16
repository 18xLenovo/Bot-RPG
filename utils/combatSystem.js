const { PlayerManager: playerManager } = require('./playerManager');

// Tipos de enemigos
const ENEMIES = {
    goblin: {
        name: 'Goblin',
        emoji: '👺',
        level: 1,
        hp: 50,
        atk: 8,
        def: 5,
        spd: 6,
        expReward: 25,
        goldReward: 15
    },
    lobo: {
        name: 'Lobo',
        emoji: '🐺',
        level: 2,
        hp: 70,
        atk: 12,
        def: 6,
        spd: 10,
        expReward: 35,
        goldReward: 20
    },
    esqueleto: {
        name: 'Esqueleto',
        emoji: '💀',
        level: 3,
        hp: 80,
        atk: 14,
        def: 8,
        spd: 7,
        expReward: 50,
        goldReward: 30
    },
    orco: {
        name: 'Orco',
        emoji: '👹',
        level: 4,
        hp: 120,
        atk: 18,
        def: 12,
        spd: 5,
        expReward: 75,
        goldReward: 50
    },
    dragon: {
        name: 'Dragón',
        emoji: '🐉',
        level: 10,
        hp: 300,
        atk: 30,
        def: 20,
        spd: 12,
        expReward: 200,
        goldReward: 150
    }
};

class CombatSystem {
    generateEnemy(playerLevel) {
        const enemyTypes = Object.keys(ENEMIES);
        
        // Filtrar enemigos apropiados para el nivel del jugador
        const suitableEnemies = enemyTypes.filter(type => {
            const enemy = ENEMIES[type];
            return enemy.level <= playerLevel + 2 && enemy.level >= Math.max(1, playerLevel - 1);
        });

        const enemyType = suitableEnemies.length > 0 
            ? suitableEnemies[Math.floor(Math.random() * suitableEnemies.length)]
            : 'goblin';

        const baseEnemy = ENEMIES[enemyType];
        
        // Escalar stats basado en el nivel del jugador
        const levelDiff = playerLevel - baseEnemy.level;
        const scale = 1 + (levelDiff * 0.2);

        return {
            ...baseEnemy,
            hp: Math.floor(baseEnemy.hp * scale),
            maxHp: Math.floor(baseEnemy.hp * scale),
            atk: Math.floor(baseEnemy.atk * scale),
            def: Math.floor(baseEnemy.def * scale),
            expReward: Math.floor(baseEnemy.expReward * scale),
            goldReward: Math.floor(baseEnemy.goldReward * scale)
        };
    }

    calculateDamage(attacker, defender) {
        const baseDamage = attacker.atk;
        const defense = defender.def;
        const criticalChance = 0.15; // 15% de crítico
        
        let damage = Math.max(1, baseDamage - Math.floor(defense / 2));
        
        // Variación aleatoria ±20%
        const variance = 0.8 + Math.random() * 0.4;
        damage = Math.floor(damage * variance);

        // Crítico
        const isCritical = Math.random() < criticalChance;
        if (isCritical) {
            damage = Math.floor(damage * 1.5);
        }

        return { damage, isCritical };
    }

    simulateCombat(userId, enemy) {
        const player = playerManager.getPlayer(userId);
        if (!player) return null;

        const combatLog = [];
        let playerHp = player.stats.hp;
        let enemyHp = enemy.hp;
        let turn = 0;

        combatLog.push(`⚔️ **Combate Iniciado**`);
        combatLog.push(`👤 Nivel ${player.level} vs ${enemy.emoji} ${enemy.name} Nivel ${enemy.level}`);
        combatLog.push('');

        // Determinar quién ataca primero basado en velocidad
        let playerFirst = player.stats.spd >= enemy.spd;

        while (playerHp > 0 && enemyHp > 0) {
            turn++;
            combatLog.push(`**═══ Turno ${turn} ═══**`);

            if (playerFirst) {
                // Ataque del jugador
                const { damage, isCritical } = this.calculateDamage(player.stats, enemy);
                enemyHp -= damage;
                combatLog.push(`⚔️ Atacas al ${enemy.name}: **${damage}** de daño ${isCritical ? '💥 ¡CRÍTICO!' : ''}`);
                
                if (enemyHp <= 0) break;

                // Ataque del enemigo
                const enemyAttack = this.calculateDamage(enemy, player.stats);
                playerHp -= enemyAttack.damage;
                combatLog.push(`🗡️ ${enemy.name} te ataca: **${enemyAttack.damage}** de daño ${enemyAttack.isCritical ? '💥 ¡CRÍTICO!' : ''}`);
            } else {
                // Ataque del enemigo
                const enemyAttack = this.calculateDamage(enemy, player.stats);
                playerHp -= enemyAttack.damage;
                combatLog.push(`🗡️ ${enemy.name} te ataca: **${enemyAttack.damage}** de daño ${enemyAttack.isCritical ? '💥 ¡CRÍTICO!' : ''}`);
                
                if (playerHp <= 0) break;

                // Ataque del jugador
                const { damage, isCritical } = this.calculateDamage(player.stats, enemy);
                enemyHp -= damage;
                combatLog.push(`⚔️ Atacas al ${enemy.name}: **${damage}** de daño ${isCritical ? '💥 ¡CRÍTICO!' : ''}`);
            }

            combatLog.push(`❤️ Tu HP: ${Math.max(0, playerHp)}/${player.stats.hp} | ${enemy.emoji} HP: ${Math.max(0, enemyHp)}/${enemy.maxHp}`);
            combatLog.push('');

            // Limitar a 20 turnos para evitar combates infinitos
            if (turn >= 20) {
                combatLog.push('⏱️ El combate termina en empate por tiempo...');
                break;
            }
        }

        const victory = enemyHp <= 0 && playerHp > 0;

        if (victory) {
            combatLog.push('');
            combatLog.push('🎉 **¡VICTORIA!**');
            combatLog.push(`💰 +${enemy.goldReward} oro`);
            combatLog.push(`⭐ +${enemy.expReward} EXP`);

            // Otorgar recompensas
            playerManager.addGold(userId, enemy.goldReward);
            const levelsGained = playerManager.addExp(userId, enemy.expReward);

            if (levelsGained > 0) {
                combatLog.push('');
                combatLog.push(`🆙 **¡Subiste ${levelsGained} nivel(es)!** Ahora eres nivel ${player.level + levelsGained}`);
            }

            // Posibilidad de drop de item
            if (Math.random() < 0.3) {
                const loot = this.generateLoot(player.level);
                playerManager.addItem(userId, loot);
                combatLog.push(`📦 ¡Encontraste: **${loot.name}**!`);
            }

            // Actualizar estadísticas
            player.wins = (player.wins || 0) + 1;
            playerManager.updatePlayer(userId, player);
        } else {
            combatLog.push('');
            combatLog.push('💀 **Derrota...**');
            combatLog.push('Pierdes 10% de tu oro');
            
            const goldLost = Math.floor(player.gold * 0.1);
            playerManager.addGold(userId, -goldLost);

            player.losses = (player.losses || 0) + 1;
            playerManager.updatePlayer(userId, player);
        }

        return {
            victory,
            log: combatLog.join('\n'),
            enemy
        };
    }

    generateLoot(playerLevel) {
        const lootTable = [
            { id: 'pocion_vida', name: 'Poción de Vida', type: 'consumible', effect: 'heal', value: 50, quantity: 1 },
            { id: 'pocion_grande', name: 'Poción Grande', type: 'consumible', effect: 'heal', value: 100, quantity: 1 },
            { id: 'espada_hierro', name: 'Espada de Hierro', type: 'weapon', stats: { atk: 5 }, value: 100 },
            { id: 'armadura_cuero', name: 'Armadura de Cuero', type: 'armor', stats: { def: 5, hp: 20 }, value: 120 },
            { id: 'anillo_fuerza', name: 'Anillo de Fuerza', type: 'accessory', stats: { atk: 3, def: 2 }, value: 150 },
        ];

        return { ...lootTable[Math.floor(Math.random() * lootTable.length)] };
    }
}

module.exports = { CombatSystem, ENEMIES };
