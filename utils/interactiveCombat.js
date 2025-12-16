const { PlayerManager: playerManager } = require('./playerManager');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, StringSelectMenuBuilder } = require('discord.js');

// Tipos de enemigos
const ENEMIES = {
    goblin: {
        name: 'Goblin',
        emoji: '👺',
        level: 1,
        hp: 50,
        maxHp: 50,
        atk: 8,
        def: 5,
        spd: 6,
        expReward: 25,
        goldReward: 15,
        abilities: ['golpe_basico']
    },
    lobo: {
        name: 'Lobo',
        emoji: '🐺',
        level: 2,
        hp: 70,
        maxHp: 70,
        atk: 12,
        def: 6,
        spd: 10,
        expReward: 35,
        goldReward: 20,
        abilities: ['golpe_basico', 'mordida_feroz']
    },
    esqueleto: {
        name: 'Esqueleto',
        emoji: '💀',
        level: 3,
        hp: 80,
        maxHp: 80,
        atk: 14,
        def: 8,
        spd: 7,
        expReward: 50,
        goldReward: 30,
        abilities: ['golpe_basico', 'corte_maldito']
    },
    orco: {
        name: 'Orco',
        emoji: '👹',
        level: 4,
        hp: 120,
        maxHp: 120,
        atk: 18,
        def: 12,
        spd: 5,
        expReward: 75,
        goldReward: 50,
        abilities: ['golpe_basico', 'golpe_aplastante']
    },
    dragon: {
        name: 'Dragón',
        emoji: '🐉',
        level: 10,
        hp: 300,
        maxHp: 300,
        atk: 30,
        def: 20,
        spd: 12,
        expReward: 200,
        goldReward: 150,
        abilities: ['golpe_basico', 'aliento_fuego', 'rugido_aterrador']
    }
};

class InteractiveCombat {
    constructor(userId, enemy, interaction) {
        this.userId = userId;
        this.enemy = enemy;
        this.interaction = interaction;
        this.player = playerManager.getPlayer(userId);
        this.playerHp = this.player.stats.hp;
        this.playerMana = this.player.stats.mana || this.player.stats.maxMana || 50;
        this.enemyHp = enemy.hp;
        this.turn = 0;
        this.log = [];
        this.playerBuffs = [];
        this.enemyDebuffs = [];
        this.defending = false;
    }

    async start() {
        this.log.push(`⚔️ **Combate Iniciado**`);
        this.log.push(`${this.player.class === 'guerrero' ? '⚔️' : this.player.class === 'mago' ? '🔮' : this.player.class === 'arquero' ? '🏹' : '✨'} **${this.interaction.user.username}** (Nivel ${this.player.level}) vs ${this.enemy.emoji} **${this.enemy.name}** (Nivel ${this.enemy.level})`);
        this.log.push('');

        return await this.playerTurn();
    }

    async playerTurn() {
        this.turn++;
        
        // Regenerar maná
        this.playerMana = Math.min(this.playerMana + 5, this.player.stats.maxMana);

        // Actualizar buffs
        this.updateBuffs();

        const embed = new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle(`⚔️ Turno ${this.turn} - Tu Turno`)
            .setDescription(this.log.slice(-10).join('\n'))
            .addFields(
                { 
                    name: '👤 Tu Estado', 
                    value: `❤️ HP: ${this.playerHp}/${this.player.stats.hp}\n💙 Maná: ${this.playerMana}/${this.player.stats.maxMana}`,
                    inline: true 
                },
                { 
                    name: `${this.enemy.emoji} ${this.enemy.name}`, 
                    value: `❤️ HP: ${this.enemyHp}/${this.enemy.maxHp}`,
                    inline: true 
                }
            );

        // Botones de acción
        const row1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('ataque_basico')
                .setLabel('⚔️ Ataque Básico')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('habilidades')
                .setLabel('✨ Habilidades')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('defender')
                .setLabel('🛡️ Defender')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('usar_item')
                .setLabel('🎒 Usar Item')
                .setStyle(ButtonStyle.Primary)
        );

        const components = [row1];

        if (this.turn === 1) {
            await this.interaction.editReply({ embeds: [embed], components });
        } else {
            await this.interaction.editReply({ embeds: [embed], components });
        }

        // Esperar acción del jugador
        return await this.waitForPlayerAction();
    }

    async waitForPlayerAction() {
        const filter = i => i.user.id === this.userId;
        
        try {
            const action = await this.interaction.channel.awaitMessageComponent({ 
                filter, 
                time: 60000 
            });

            if (action.customId === 'ataque_basico') {
                await action.deferUpdate();
                return await this.executeBasicAttack();
            } else if (action.customId === 'habilidades') {
                return await this.showAbilities(action);
            } else if (action.customId === 'defender') {
                await action.deferUpdate();
                return await this.executeDefend();
            } else if (action.customId === 'usar_item') {
                return await this.showItems(action);
            }
        } catch (error) {
            this.log.push('⏱️ Tiempo agotado - El enemigo aprovecha tu distracción...');
            return await this.enemyTurn();
        }
    }

    async showAbilities(interaction) {
        const abilities = this.player.abilities || [];
        
        if (abilities.length === 0) {
            await interaction.reply({ content: '❌ No tienes habilidades disponibles', ephemeral: true });
            return await this.playerTurn();
        }

        const options = abilities.map(ability => ({
            label: `${ability.name} (${ability.manaCost} maná)`,
            description: ability.description,
            value: ability.id
        }));

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('select_ability')
            .setPlaceholder('Elige una habilidad')
            .addOptions(options);

        const row = new ActionRowBuilder().addComponents(selectMenu);

        await interaction.reply({ 
            content: '✨ **Elige una habilidad:**',
            components: [row],
            ephemeral: true 
        });

        const filter = i => i.customId === 'select_ability' && i.user.id === this.userId;
        
        try {
            const abilityChoice = await this.interaction.channel.awaitMessageComponent({ 
                filter, 
                time: 30000 
            });

            await abilityChoice.deferUpdate();
            const abilityId = abilityChoice.values[0];
            return await this.executeAbility(abilityId);
        } catch (error) {
            return await this.playerTurn();
        }
    }

    async showItems(interaction) {
        const consumables = this.player.inventory.filter(i => i.type === 'consumible' && i.quantity > 0);
        
        if (consumables.length === 0) {
            await interaction.reply({ content: '❌ No tienes items consumibles', ephemeral: true });
            return await this.playerTurn();
        }

        const options = consumables.map(item => ({
            label: `${item.name} (${item.quantity})`,
            description: `Restaura ${item.value} ${item.effect === 'heal' ? 'HP' : 'Maná'}`,
            value: item.id
        }));

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('select_item')
            .setPlaceholder('Elige un item')
            .addOptions(options);

        const row = new ActionRowBuilder().addComponents(selectMenu);

        await interaction.reply({ 
            content: '🎒 **Elige un item:**',
            components: [row],
            ephemeral: true 
        });

        const filter = i => i.customId === 'select_item' && i.user.id === this.userId;
        
        try {
            const itemChoice = await this.interaction.channel.awaitMessageComponent({ 
                filter, 
                time: 30000 
            });

            await itemChoice.deferUpdate();
            const itemId = itemChoice.values[0];
            return await this.useItem(itemId);
        } catch (error) {
            return await this.playerTurn();
        }
    }

    async executeBasicAttack() {
        const damage = this.calculateDamage(this.player.stats, this.enemy, 1.0);
        this.enemyHp -= damage.damage;
        
        this.log.push(`⚔️ Atacas al ${this.enemy.name}: **${damage.damage}** de daño ${damage.isCritical ? '💥 ¡CRÍTICO!' : ''}`);

        if (this.enemyHp <= 0) {
            return await this.endCombat(true);
        }

        return await this.enemyTurn();
    }

    async executeAbility(abilityId) {
        const ability = this.player.abilities.find(a => a.id === abilityId);
        
        if (!ability) {
            this.log.push('❌ Habilidad no encontrada');
            return await this.playerTurn();
        }

        if (this.playerMana < ability.manaCost) {
            this.log.push(`❌ No tienes suficiente maná (necesitas ${ability.manaCost}, tienes ${this.playerMana})`);
            return await this.playerTurn();
        }

        this.playerMana -= ability.manaCost;

        // Habilidad de curación
        if (ability.type === 'heal') {
            const healAmount = Math.floor(this.player.stats.hp * ability.healPercent);
            this.playerHp = Math.min(this.playerHp + healAmount, this.player.stats.hp);
            this.log.push(`✨ Usas **${ability.name}**: Recuperas **${healAmount}** HP 💚`);
            return await this.enemyTurn();
        }

        // Habilidad de buff
        if (ability.type === 'buff') {
            this.playerBuffs.push({ ...ability.effect, turnsLeft: ability.effect.duration });
            this.log.push(`🛡️ Usas **${ability.name}**: ${ability.description} 💪`);
            return await this.enemyTurn();
        }

        // Habilidades de ataque
        let totalDamage = 0;
        const hits = ability.hits || 1;

        for (let i = 0; i < hits; i++) {
            const damage = this.calculateDamage(
                this.player.stats, 
                this.enemy, 
                ability.damage,
                ability.critBonus,
                ability.armorPierce
            );
            totalDamage += damage.damage;
            this.enemyHp -= damage.damage;
        }

        if (hits > 1) {
            this.log.push(`✨ Usas **${ability.name}**: ${hits} golpes por **${totalDamage}** de daño total! 💥`);
        } else {
            this.log.push(`✨ Usas **${ability.name}**: **${totalDamage}** de daño! 💥`);
        }

        if (ability.debuff) {
            this.enemyDebuffs.push({ ...ability.debuff, turnsLeft: ability.debuff.duration });
            this.log.push(`🔥 ¡${this.enemy.name} está debilitado!`);
        }

        if (this.enemyHp <= 0) {
            return await this.endCombat(true);
        }

        return await this.enemyTurn();
    }

    async executeDefend() {
        this.defending = true;
        this.log.push(`🛡️ Te preparas para defender el próximo ataque`);
        return await this.enemyTurn();
    }

    async useItem(itemId) {
        const item = this.player.inventory.find(i => i.id === itemId);
        
        if (!item || item.quantity <= 0) {
            this.log.push('❌ Item no disponible');
            return await this.playerTurn();
        }

        if (item.effect === 'heal') {
            this.playerHp = Math.min(this.playerHp + item.value, this.player.stats.hp);
            this.log.push(`🧪 Usas **${item.name}**: Recuperas **${item.value}** HP`);
        } else if (item.effect === 'mana') {
            this.playerMana = Math.min(this.playerMana + item.value, this.player.stats.maxMana);
            this.log.push(`🧪 Usas **${item.name}**: Recuperas **${item.value}** Maná`);
        }

        playerManager.removeItem(this.userId, itemId, 1);
        return await this.enemyTurn();
    }

    async enemyTurn() {
        // Mostrar que el enemigo está preparando su ataque
        const preparingEmbed = new EmbedBuilder()
            .setColor('#ff6600')
            .setTitle(`⚔️ Turno ${this.turn} - Turno del Enemigo`)
            .setDescription([...this.log.slice(-10), '', `⏳ ${this.enemy.emoji} **${this.enemy.name}** está preparando su ataque...`].join('\n'))
            .addFields(
                { 
                    name: '👤 Tu Estado', 
                    value: `❤️ HP: ${this.playerHp}/${this.player.stats.hp}\n💙 Maná: ${this.playerMana}/${this.player.stats.maxMana}`,
                    inline: true 
                },
                { 
                    name: `${this.enemy.emoji} ${this.enemy.name}`, 
                    value: `❤️ HP: ${this.enemyHp}/${this.enemy.maxHp}`,
                    inline: true 
                }
            );

        await this.interaction.editReply({ embeds: [preparingEmbed], components: [] });

        // Esperar 2 segundos antes de mostrar el ataque del enemigo
        await new Promise(resolve => setTimeout(resolve, 2000));

        const enemyAbility = this.enemy.abilities[Math.floor(Math.random() * this.enemy.abilities.length)];
        let damage = this.calculateDamage(this.enemy, this.player.stats, 1.5);
        
        if (this.defending) {
            damage.damage = Math.floor(damage.damage * 0.5);
            this.log.push(`🛡️ Bloqueas parte del daño!`);
            this.defending = false;
        }

        this.playerHp -= damage.damage;
        this.log.push(`🗡️ ${this.enemy.name} ataca: **${damage.damage}** de daño ${damage.isCritical ? '💥 ¡CRÍTICO!' : ''}`);

        if (this.playerHp <= 0) {
            return await this.endCombat(false);
        }

        // Mostrar el resultado del ataque del enemigo
        const resultEmbed = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle(`⚔️ Turno ${this.turn} - Ataque Enemigo`)
            .setDescription(this.log.slice(-10).join('\n'))
            .addFields(
                { 
                    name: '👤 Tu Estado', 
                    value: `❤️ HP: ${this.playerHp}/${this.player.stats.hp}\n💙 Maná: ${this.playerMana}/${this.player.stats.maxMana}`,
                    inline: true 
                },
                { 
                    name: `${this.enemy.emoji} ${this.enemy.name}`, 
                    value: `❤️ HP: ${this.enemyHp}/${this.enemy.maxHp}`,
                    inline: true 
                }
            )
            .setFooter({ text: 'Preparándose para tu turno...' });

        await this.interaction.editReply({ embeds: [resultEmbed], components: [] });

        // Esperar 2 segundos más antes de continuar con el turno del jugador
        await new Promise(resolve => setTimeout(resolve, 2000));

        return await this.playerTurn();
    }

    calculateDamage(attacker, defender, multiplier = 1.0, critBonus = 0, armorPierce = 0) {
        let baseDamage = Math.floor(attacker.atk * multiplier);
        const defense = Math.floor(defender.def * (1 - armorPierce));
        
        let damage = Math.max(1, baseDamage - Math.floor(defense / 2));
        
        const variance = 0.85 + Math.random() * 0.3;
        damage = Math.floor(damage * variance);

        const criticalChance = 0.15 + (critBonus || 0);
        const isCritical = Math.random() < criticalChance;
        if (isCritical) {
            damage = Math.floor(damage * 1.5);
        }

        return { damage, isCritical };
    }

    updateBuffs() {
        this.playerBuffs = this.playerBuffs.filter(buff => {
            buff.turnsLeft--;
            return buff.turnsLeft > 0;
        });

        this.enemyDebuffs = this.enemyDebuffs.filter(debuff => {
            debuff.turnsLeft--;
            return debuff.turnsLeft > 0;
        });
    }

    async endCombat(victory) {
        const embed = new EmbedBuilder()
            .setTitle(victory ? '🎉 ¡VICTORIA!' : '💀 Derrota...')
            .setDescription(this.log.join('\n'))
            .setColor(victory ? '#00ff00' : '#ff0000')
            .setTimestamp();

        if (victory) {
            playerManager.addGold(this.userId, this.enemy.goldReward);
            const levelsGained = playerManager.addExp(this.userId, this.enemy.expReward);

            embed.addFields(
                { name: '💰 Recompensas', value: `+${this.enemy.goldReward} oro\n+${this.enemy.expReward} EXP` }
            );

            if (levelsGained > 0) {
                embed.addFields({ 
                    name: '🆙 ¡Subiste de nivel!', 
                    value: `Ahora eres nivel ${this.player.level + levelsGained}` 
                });
            }

            this.player.wins = (this.player.wins || 0) + 1;
            playerManager.updatePlayer(this.userId, this.player);
        } else {
            const goldLost = Math.floor(this.player.gold * 0.1);
            playerManager.addGold(this.userId, -goldLost);
            embed.addFields({ name: '💔 Penalización', value: `Pierdes ${goldLost} oro` });

            this.player.losses = (this.player.losses || 0) + 1;
            playerManager.updatePlayer(this.userId, this.player);
        }

        await this.interaction.editReply({ embeds: [embed], components: [] });
    }
}

function generateEnemy(playerLevel) {
    const enemyTypes = Object.keys(ENEMIES);
    
    const suitableEnemies = enemyTypes.filter(type => {
        const enemy = ENEMIES[type];
        return enemy.level <= playerLevel + 2 && enemy.level >= Math.max(1, playerLevel - 1);
    });

    const enemyType = suitableEnemies.length > 0 
        ? suitableEnemies[Math.floor(Math.random() * suitableEnemies.length)]
        : 'goblin';

    const baseEnemy = ENEMIES[enemyType];
    const levelDiff = playerLevel - baseEnemy.level;
    const scale = 1 + (levelDiff * 0.2);

    return {
        ...baseEnemy,
        hp: Math.floor(baseEnemy.hp * scale),
        maxHp: Math.floor(baseEnemy.maxHp * scale),
        atk: Math.floor(baseEnemy.atk * scale),
        def: Math.floor(baseEnemy.def * scale),
        expReward: Math.floor(baseEnemy.expReward * scale),
        goldReward: Math.floor(baseEnemy.goldReward * scale)
    };
}

module.exports = { InteractiveCombat, generateEnemy, ENEMIES };
