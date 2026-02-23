const { EmbedBuilder } = require('discord.js');
const { CLASSES } = require('../utils/playerManager');

function createCharacterEmbed(player, userId, username) {
    const classInfo = CLASSES[player.class];
    const winRate = ((player.wins || 0) + (player.losses || 0)) > 0 
        ? Math.round(((player.wins || 0) / ((player.wins || 0) + (player.losses || 0))) * 100) 
        : 0;
    
    const embed = new EmbedBuilder()
        .setColor('#7289DA')
        .setTitle(`${classInfo.emoji} ${username.toUpperCase()}`)
        .setDescription(`╔══════════════════╗\n**${classInfo.name}** | Nivel **${player.level}** | 🌟 ${player.reputation || 0} Reputación\n╚══════════════════╝`)
        .addFields(
            { 
                name: '━━━━ 📊 ESTADÍSTICAS ━━━━', 
                value: `\`\`\`yaml\n❤️  HP:    ${player.stats.hp}\n⚔️  ATK:   ${player.stats.atk}\n🛡️  DEF:   ${player.stats.def}\n⚡  SPD:   ${player.stats.spd}\n💙  Maná:  ${player.stats.mana || player.stats.maxMana}/${player.stats.maxMana}\n\`\`\``,
                inline: true 
            },
            { 
                name: '━━━━ 💰 RECURSOS ━━━━', 
                value: `\`\`\`yaml\n🪙  Oro:  ${player.gold.toLocaleString()}\n⭐  EXP:  ${player.exp}/${player.expToNext}\n📊  Prog: ${'█'.repeat(Math.floor((player.exp/player.expToNext)*10))}${'░'.repeat(10-Math.floor((player.exp/player.expToNext)*10))}\n\`\`\``,
                inline: true 
            },
            { 
                name: '━━━━ 🏆 RÉCORD ━━━━', 
                value: `\`\`\`yaml\n✅  Victorias: ${player.wins || 0}\n❌  Derrotas:  ${player.losses || 0}\n📈  Ratio:     ${winRate}%\n\`\`\``,
                inline: true 
            }
        )
        .setFooter({ text: `⚡ Aventurero ID: ${userId}` })
        .setTimestamp();

    // Mostrar equipo
    if (player.equipment) {
        const equipmentText = [];
        if (player.equipment.weapon) equipmentText.push(`⚔️ **Arma:** ${player.equipment.weapon.name}`);
        if (player.equipment.armor) equipmentText.push(`🛡️ **Armadura:** ${player.equipment.armor.name}`);
        if (player.equipment.accessory) equipmentText.push(`💍 **Accesorio:** ${player.equipment.accessory.name}`);
        
        if (equipmentText.length > 0) {
            embed.addFields({ 
                name: '━━━━━━━━━━ 🎒 EQUIPAMIENTO ━━━━━━━━━━', 
                value: `\`\`\`\n${equipmentText.join('\n')}\n\`\`\``,
                inline: false 
            });
        } else {
            embed.addFields({ 
                name: '━━━━━━━━━━ 🎒 EQUIPAMIENTO ━━━━━━━━━━', 
                value: '```\n❌ Sin equipo equipado\n```',
                inline: false 
            });
        }
    }

    return embed;
}

function createInventoryEmbed(player, username) {
    const totalItems = player.inventory ? player.inventory.reduce((sum, item) => sum + (item.quantity || 1), 0) : 0;
    const embed = new EmbedBuilder()
        .setColor('#FFA500')
        .setTitle(`🎒 INVENTARIO DE ${username.toUpperCase()}`)
        .setDescription(`╔═══════════════════════════╗\n💰 **Oro:** \`${player.gold.toLocaleString()}\` 🪙\n📦 **Total Items:** \`${totalItems}\`\n╚═══════════════════════════╝`);

    if (!player.inventory || player.inventory.length === 0) {
        embed.addFields({ 
            name: '📭 Inventario Vacío', 
            value: '```\n¡Visita la tienda para comprar items!\nUsa /tienda para ver los items disponibles.\n```' 
        });
        return embed;
    }

    // Agrupar items por tipo
    const grouped = {
        consumible: [],
        weapon: [],
        armor: [],
        accessory: []
    };

    player.inventory.forEach(item => {
        const type = item.type || 'consumible';
        if (!grouped[type]) grouped[type] = [];
        grouped[type].push(item);
    });

    const typeEmojis = {
        consumible: '🧪',
        weapon: '⚔️',
        armor: '🛡️',
        accessory: '💍'
    };

    const typeNames = {
        consumible: 'Consumibles',
        weapon: 'Armas',
        armor: 'Armaduras',
        accessory: 'Accesorios'
    };

    for (const [type, items] of Object.entries(grouped)) {
        if (items.length > 0) {
            const itemList = items.map(item => {
                const qty = item.quantity ? ` \`x${item.quantity}\`` : '';
                const stats = item.stats ? ` | ${Object.entries(item.stats).map(([stat, val]) => `+${val} ${stat.toUpperCase()}`).join(' ')}` : '';
                return `➤ ${item.name}${qty}${stats}`;
            }).join('\n');

            embed.addFields({ 
                name: `━━━ ${typeEmojis[type]} ${typeNames[type].toUpperCase()} ━━━`, 
                value: `\`\`\`yaml\n${itemList}\n\`\`\``,
                inline: false
            });
        }
    }

    return embed;
}

function createShopEmbed(category) {
    const embed = new EmbedBuilder()
        .setColor('#ffaa00')
        .setTitle('🏪 Tienda del Aventurero')
        .setDescription('Compra items para mejorar tu aventura');

    return embed;
}

function createCombatEmbed(result, username) {
    const embed = new EmbedBuilder()
        .setTitle(`⚔️ Combate: ${username} vs ${result.enemy.emoji} ${result.enemy.name}`)
        .setDescription(result.log)
        .setColor(result.victory ? '#00ff00' : '#ff0000')
        .setTimestamp();

    return embed;
}

function createLeaderboardEmbed(players, type = 'level') {
    const typeInfo = {
        level: { emoji: '⭐', title: 'NIVEL', color: '#FFD700' },
        gold: { emoji: '💰', title: 'ORO', color: '#FFA500' },
        wins: { emoji: '🏆', title: 'VICTORIAS', color: '#00FF00' }
    };
    
    const info = typeInfo[type];
    const embed = new EmbedBuilder()
        .setColor(info.color)
        .setTitle(`${info.emoji} RANKING - TOP ${info.title}`)
        .setDescription('╔═══════════════════════════════╗\n    🏆 Los mejores aventureros 🏆\n╚═══════════════════════════════╝')
        .setTimestamp();

    if (!players || players.length === 0) {
        embed.addFields({ name: '❌ Sin datos', value: '```\nNo hay jugadores en el ranking\n```' });
        return embed;
    }

    const rankings = players.slice(0, 10).map((p, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `\`${(index + 1).toString().padStart(2, ' ')}.\``;
        if (type === 'level') {
            return `${medal} <@${p.userId}> ━ **Nv.${p.level}** | ${p.exp} EXP`;
        } else if (type === 'gold') {
            return `${medal} <@${p.userId}> ━ **${p.gold.toLocaleString()}** 🪙`;
        } else if (type === 'wins') {
            const totalBattles = (p.wins || 0) + (p.losses || 0);
            const winRate = totalBattles > 0 ? Math.round((p.wins || 0) / totalBattles * 100) : 0;
            return `${medal} <@${p.userId}> ━ **${p.wins || 0}** victorias (${winRate}%)`;
        }
    });

    embed.addFields({ 
        name: '━━━━━━━━ CLASIFICACIÓN ━━━━━━━━', 
        value: rankings.join('\n') 
    });
    return embed;
}

module.exports = {
    createCharacterEmbed,
    createInventoryEmbed,
    createShopEmbed,
    createCombatEmbed,
    createLeaderboardEmbed
};
