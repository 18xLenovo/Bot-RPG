const fs = require('fs');
const path = require('path');
const { ServerConfigManager: serverConfig } = require('./serverConfigManager');

const DATA_DIR = path.join(__dirname, '../data');
const PLAYERS_FILE = path.join(DATA_DIR, 'players.json');
const SERVERS_DIR = path.join(DATA_DIR, 'servers');

// Asegurar que los directorios de datos existen
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(SERVERS_DIR)) {
    fs.mkdirSync(SERVERS_DIR, { recursive: true });
}

// Clases disponibles con habilidades únicas
const CLASSES = {
    guerrero: {
        name: 'Guerrero',
        emoji: '⚔️',
        stats: { hp: 120, atk: 15, def: 12, spd: 8, maxMana: 50, mana: 50 },
        description: 'Fuerte en combate cuerpo a cuerpo con alta defensa',
        abilities: [
            { 
                id: 'golpe_poderoso', 
                name: 'Golpe Poderoso', 
                description: 'Ataque devastador (200% ATK)',
                manaCost: 15,
                damage: 2.0,
                cooldown: 0
            },
            { 
                id: 'escudo_hierro', 
                name: 'Escudo de Hierro', 
                description: 'Aumenta DEF 50% por 2 turnos',
                manaCost: 20,
                type: 'buff',
                effect: { def: 1.5, duration: 2 }
            },
            { 
                id: 'furia_guerrera', 
                name: 'Furia Guerrera', 
                description: 'Ataque múltiple (3 golpes al 70% ATK)',
                manaCost: 25,
                damage: 0.7,
                hits: 3
            }
        ]
    },
    mago: {
        name: 'Mago',
        emoji: '🔮',
        stats: { hp: 80, atk: 20, def: 6, spd: 10, maxMana: 100, mana: 100 },
        description: 'Maestro de la magia con alto daño pero baja defensa',
        abilities: [
            { 
                id: 'bola_fuego', 
                name: 'Bola de Fuego', 
                description: 'Hechizo ígneo (250% ATK)',
                manaCost: 25,
                damage: 2.5,
                element: 'fire'
            },
            { 
                id: 'rayo_hielo', 
                name: 'Rayo de Hielo', 
                description: 'Congela al enemigo reduciendo su SPD',
                manaCost: 30,
                damage: 1.8,
                debuff: { spd: 0.5, duration: 2 }
            },
            { 
                id: 'tormenta_arcana', 
                name: 'Tormenta Arcana', 
                description: 'Devastador hechizo final (400% ATK)',
                manaCost: 50,
                damage: 4.0,
                element: 'arcane'
            }
        ]
    },
    arquero: {
        name: 'Arquero',
        emoji: '🏹',
        stats: { hp: 100, atk: 18, def: 8, spd: 14, maxMana: 60, mana: 60 },
        description: 'Rápido y preciso con ataques a distancia',
        abilities: [
            { 
                id: 'disparo_preciso', 
                name: 'Disparo Preciso', 
                description: 'Alta probabilidad de crítico (150% ATK, 50% crit)',
                manaCost: 15,
                damage: 1.5,
                critBonus: 0.5
            },
            { 
                id: 'lluvia_flechas', 
                name: 'Lluvia de Flechas', 
                description: 'Múltiples flechas (5 golpes al 60% ATK)',
                manaCost: 25,
                damage: 0.6,
                hits: 5
            },
            { 
                id: 'flecha_perforante', 
                name: 'Flecha Perforante', 
                description: 'Ignora 80% de la defensa (180% ATK)',
                manaCost: 20,
                damage: 1.8,
                armorPierce: 0.8
            }
        ]
    },
    clerigo: {
        name: 'Clérigo',
        emoji: '✨',
        stats: { hp: 90, atk: 10, def: 10, spd: 9, maxMana: 80, mana: 80 },
        description: 'Sanador del grupo con habilidades de apoyo',
        abilities: [
            { 
                id: 'destello_sagrado', 
                name: 'Destello Sagrado', 
                description: 'Ataque de luz sagrada (180% ATK)',
                manaCost: 15,
                damage: 1.8,
                element: 'holy'
            },
            { 
                id: 'curacion', 
                name: 'Curación Divina', 
                description: 'Restaura 40% HP máximo',
                manaCost: 30,
                type: 'heal',
                healPercent: 0.4
            },
            { 
                id: 'juicio_divino', 
                name: 'Juicio Divino', 
                description: 'Poderoso ataque sagrado (300% ATK)',
                manaCost: 40,
                damage: 3.0,
                element: 'holy'
            }
        ]
    }
};

class PlayerManager {
    constructor() {
        this.players = this.loadPlayers();
        this.serverPlayers = {}; // Almacenamiento en memoria de jugadores por servidor
    }

    // Obtener el archivo de jugadores correctamente según el modo
    getPlayersFile(serverId = null) {
        if (serverId && serverConfig.isSoloServerMode(serverId)) {
            return path.join(SERVERS_DIR, `${serverId}-players.json`);
        }
        return PLAYERS_FILE;
    }

    loadPlayers() {
        try {
            if (fs.existsSync(PLAYERS_FILE)) {
                const data = fs.readFileSync(PLAYERS_FILE, 'utf8');
                const parsed = JSON.parse(data);
                console.log(`✅ Cargados ${Object.keys(parsed).length} jugadores desde el archivo global`);
                return parsed;
            }
        } catch (error) {
            console.error('Error cargando jugadores:', error);
        }
        console.log('⚠️ No se encontró archivo de jugadores, iniciando nuevo');
        return {};
    }

    // Cargar jugadores de un servidor específico (solo-servidor mode)
    loadServerPlayers(serverId) {
        try {
            const file = this.getPlayersFile(serverId);
            if (fs.existsSync(file)) {
                const data = fs.readFileSync(file, 'utf8');
                const parsed = JSON.parse(data);
                this.serverPlayers[serverId] = parsed;
                return parsed;
            }
        } catch (error) {
            console.error(`Error cargando jugadores del servidor ${serverId}:`, error);
        }
        this.serverPlayers[serverId] = {};
        return {};
    }

    savePlayers(serverId = null) {
        try {
            let file, data;
            
            if (serverId && serverConfig.isSoloServerMode(serverId)) {
                file = this.getPlayersFile(serverId);
                data = this.serverPlayers[serverId] || {};
            } else {
                file = PLAYERS_FILE;
                data = this.players;
            }

            fs.writeFileSync(file, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('Error guardando jugadores:', error);
        }
    }

    // Obtener datos de jugadores según el modo
    getPlayersData(serverId = null) {
        if (serverId && serverConfig.isSoloServerMode(serverId)) {
            if (!this.serverPlayers[serverId]) {
                this.loadServerPlayers(serverId);
            }
            return this.serverPlayers[serverId];
        }
        return this.players;
    }

    createPlayer(userId, className, serverId = null) {
        const players = this.getPlayersData(serverId);

        if (players[userId]) {
            return { success: false, message: '¡Ya tienes un personaje creado!' };
        }

        if (!CLASSES[className]) {
            return { success: false, message: 'Clase no válida' };
        }

        const classData = CLASSES[className];
        players[userId] = {
            class: className,
            level: 1,
            exp: 0,
            expToNext: 100,
            gold: 100,
            stats: { ...classData.stats },
            baseStats: { ...classData.stats },
            inventory: [
                { id: 'pocion_vida', name: 'Poción de Vida', type: 'consumible', effect: 'heal', value: 50, quantity: 3 },
                { id: 'pocion_mana', name: 'Poción de Maná', type: 'consumible', effect: 'mana', value: 30, quantity: 2 }
            ],
            equipment: {
                weapon: null,
                armor: null,
                accessory: null
            },
            abilities: [...classData.abilities],
            completedQuests: [],
            currentQuest: null,
            wins: 0,
            losses: 0,
            events: [],
            reputation: 0,
            createdAt: Date.now()
        };

        this.savePlayers(serverId);
        return { success: true, message: `¡Personaje ${classData.emoji} ${classData.name} creado exitosamente!` };
    }

    getPlayer(userId, serverId = null) {
        const players = this.getPlayersData(serverId);
        return players[userId] || null;
    }

    updatePlayer(userId, data, serverId = null) {
        const players = this.getPlayersData(serverId);
        if (!players[userId]) return false;
        
        players[userId] = { ...players[userId], ...data };
        this.savePlayers(serverId);
        return true;
    }

    addExp(userId, amount, serverId = null) {
        const players = this.getPlayersData(serverId);
        const player = players[userId];
        if (!player) return null;

        player.exp += amount;
        let levelsGained = 0;

        while (player.exp >= player.expToNext) {
            player.exp -= player.expToNext;
            player.level++;
            levelsGained++;

            // Aumentar stats por nivel
            player.baseStats.hp += 10;
            player.baseStats.atk += 2;
            player.baseStats.def += 2;
            player.baseStats.spd += 1;

            player.stats = { ...player.baseStats };
            player.expToNext = Math.floor(player.expToNext * 1.5);
        }

        this.savePlayers(serverId);
        return levelsGained;
    }

    addGold(userId, amount, serverId = null) {
        const players = this.getPlayersData(serverId);
        if (!players[userId]) return false;
        players[userId].gold += amount;
        this.savePlayers(serverId);
        return true;
    }

    addItem(userId, item, serverId = null) {
        const players = this.getPlayersData(serverId);
        const player = players[userId];
        if (!player) return false;

        const existing = player.inventory.find(i => i.id === item.id);
        if (existing) {
            existing.quantity = (existing.quantity || 1) + (item.quantity || 1);
        } else {
            player.inventory.push(item);
        }

        this.savePlayers(serverId);
        return true;
    }

    removeItem(userId, itemId, quantity = 1, serverId = null) {
        const players = this.getPlayersData(serverId);
        const player = players[userId];
        if (!player) return false;

        const itemIndex = player.inventory.findIndex(i => i.id === itemId);
        if (itemIndex === -1) return false;

        const item = player.inventory[itemIndex];
        item.quantity = (item.quantity || 1) - quantity;

        if (item.quantity <= 0) {
            player.inventory.splice(itemIndex, 1);
        }

        this.savePlayers(serverId);
        return true;
    }

    equipItem(userId, itemId, serverId = null) {
        const players = this.getPlayersData(serverId);
        const player = players[userId];
        if (!player) return { success: false, message: 'Jugador no encontrado' };

        const item = player.inventory.find(i => i.id === itemId);
        if (!item) return { success: false, message: 'Item no encontrado en tu inventario' };

        if (item.type !== 'weapon' && item.type !== 'armor' && item.type !== 'accessory') {
            return { success: false, message: 'Este item no se puede equipar' };
        }

        const slot = item.type;
        const previousItem = player.equipment[slot];

        // Desequipar item anterior
        if (previousItem) {
            this.removeItemStats(player, previousItem);
        }

        // Equipar nuevo item
        player.equipment[slot] = item;
        this.applyItemStats(player, item);

        this.savePlayers(serverId);
        return { success: true, message: `¡${item.name} equipado!` };
    }

    applyItemStats(player, item) {
        if (item.stats) {
            for (const stat in item.stats) {
                player.stats[stat] = (player.stats[stat] || 0) + item.stats[stat];
            }
        }
    }

    removeItemStats(player, item) {
        if (item.stats) {
            for (const stat in item.stats) {
                player.stats[stat] = (player.stats[stat] || 0) - item.stats[stat];
            }
        }
    }

    deletePlayer(userId, serverId = null) {
        const players = this.getPlayersData(serverId);
        if (!players[userId]) return false;
        delete players[userId];
        this.savePlayers(serverId);
        return true;
    }
}

// Singleton - una única instancia compartida
const playerManagerInstance = new PlayerManager();

module.exports = { PlayerManager: playerManagerInstance, CLASSES };
