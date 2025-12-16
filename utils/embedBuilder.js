const { EmbedBuilder } = require('discord.js');
const { CLASSES } = require('../utils/playerManager');

function createCharacterEmbed(player, userId, username) {
    const classInfo = CLASSES[player.class];
    
    const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle(`${classInfo.emoji} Personaje de ${username}`)
        .setDescription(`**Clase:** ${classInfo.name}\n**Nivel:** ${player.level}\n**Reputación:** ${player.reputation || 0}`)
        .addFields(
            { 
                name: '📊 Estadísticas', 
                value: `❤️ HP: ${player.stats.hp}\n⚔️ ATK: ${player.stats.atk}\n🛡️ DEF: ${player.stats.def}\n⚡ SPD: ${player.stats.spd}\n💙 Maná: ${player.stats.mana || player.stats.maxMana}/${player.stats.maxMana}`,
                inline: true 
            },
            { 
                name: '💰 Recursos', 
                value: `🪙 Oro: ${player.gold}\n⭐ EXP: ${player.exp}/${player.expToNext}`,
                inline: true 
            },
            { 
                name: '🏆 Récord', 
                value: `✅ Victorias: ${player.wins || 0}\n❌ Derrotas: ${player.losses || 0}`,
                inline: true 
            }
        )
        .setFooter({ text: `ID: ${userId}` })
        .setTimestamp();

    // Mostrar equipo
    if (player.equipment) {
        const equipmentText = [];
        if (player.equipment.weapon) equipmentText.push(`⚔️ ${player.equipment.weapon.name}`);
        if (player.equipment.armor) equipmentText.push(`🛡️ ${player.equipment.armor.name}`);
        if (player.equipment.accessory) equipmentText.push(`💍 ${player.equipment.accessory.name}`);
        
        if (equipmentText.length > 0) {
            embed.addFields({ name: '🎒 Equipamiento', value: equipmentText.join('\n') });
        }
    }

    return embed;
}

function createInventoryEmbed(player, username) {
    const embed = new EmbedBuilder()
        .setColor('#ffaa00')
        .setTitle(`🎒 Inventario de ${username}`)
        .setDescription(`💰 Oro: **${player.gold}**\n\n__Items:__`);

    if (!player.inventory || player.inventory.length === 0) {
        embed.setDescription(`💰 Oro: **${player.gold}**\n\n*Tu inventario está vacío*`);
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
                const qty = item.quantity ? ` x${item.quantity}` : '';
                return `${typeEmojis[type]} **${item.name}**${qty}`;
            }).join('\n');

            embed.addFields({ 
                name: `${typeEmojis[type]} ${typeNames[type]}`, 
                value: itemList 
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
    const embed = new EmbedBuilder()
        .setColor('#ffd700')
        .setTitle('🏆 Tabla de Clasificación')
        .setTimestamp();

    if (!players || players.length === 0) {
        embed.setDescription('*No hay jugadores en el ranking*');
        return embed;
    }

    const rankings = players.slice(0, 10).map((p, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
        if (type === 'level') {
            return `${medal} **<@${p.userId}>** - Nivel ${p.level} (${p.exp} EXP)`;
        } else if (type === 'gold') {
            return `${medal} **<@${p.userId}>** - ${p.gold} 🪙`;
        } else if (type === 'wins') {
            return `${medal} **<@${p.userId}>** - ${p.wins || 0} victorias`;
        }
    });

    embed.setDescription(rankings.join('\n'));
    return embed;
}

module.exports = {
    createCharacterEmbed,
    createInventoryEmbed,
    createShopEmbed,
    createCombatEmbed,
    createLeaderboardEmbed
};
