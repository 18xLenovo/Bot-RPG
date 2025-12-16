// Tienda de items
const SHOP_ITEMS = {
    consumibles: [
        { id: 'pocion_vida', name: 'Poción de Vida', type: 'consumible', effect: 'heal', value: 50, price: 30, description: 'Restaura 50 HP' },
        { id: 'pocion_grande', name: 'Poción Grande de Vida', type: 'consumible', effect: 'heal', value: 100, price: 60, description: 'Restaura 100 HP' },
        { id: 'elixir', name: 'Elixir', type: 'consumible', effect: 'heal', value: 200, price: 120, description: 'Restaura 200 HP' },
        { id: 'pocion_mana', name: 'Poción de Maná', type: 'consumible', effect: 'mana', value: 30, price: 35, description: 'Restaura 30 Maná' },
        { id: 'pocion_mana_grande', name: 'Poción Grande de Maná', type: 'consumible', effect: 'mana', value: 60, price: 70, description: 'Restaura 60 Maná' },
        { id: 'elixir_completo', name: 'Elixir Completo', type: 'consumible', effect: 'full', value: 100, price: 150, description: 'Restaura HP y Maná' }
    ],
    armas: [
        { id: 'daga', name: 'Daga', type: 'weapon', stats: { atk: 3 }, price: 50, description: '+3 ATK - Rápida y ligera' },
        { id: 'espada_hierro', name: 'Espada de Hierro', type: 'weapon', stats: { atk: 7 }, price: 150, description: '+7 ATK - Arma básica confiable' },
        { id: 'hacha_batalla', name: 'Hacha de Batalla', type: 'weapon', stats: { atk: 10, spd: -2 }, price: 200, description: '+10 ATK, -2 SPD - Golpes devastadores' },
        { id: 'espada_acero', name: 'Espada de Acero', type: 'weapon', stats: { atk: 12 }, price: 300, description: '+12 ATK - Forjada con maestría' },
        { id: 'arco_largo', name: 'Arco Largo', type: 'weapon', stats: { atk: 14, spd: 4 }, price: 350, description: '+14 ATK, +4 SPD - Preciso y rápido' },
        { id: 'baston_mago', name: 'Bastón de Mago', type: 'weapon', stats: { atk: 16, maxMana: 20 }, price: 400, description: '+16 ATK, +20 Maná máximo' },
        { id: 'espada_legendaria', name: 'Espada Legendaria', type: 'weapon', stats: { atk: 20, spd: 3 }, price: 800, description: '+20 ATK, +3 SPD - Legendaria' }
    ],
    armaduras: [
        { id: 'armadura_cuero', name: 'Armadura de Cuero', type: 'armor', stats: { def: 5, hp: 20 }, price: 100, description: '+5 DEF, +20 HP' },
        { id: 'armadura_hierro', name: 'Armadura de Hierro', type: 'armor', stats: { def: 10, hp: 40 }, price: 250, description: '+10 DEF, +40 HP' },
        { id: 'armadura_acero', name: 'Armadura de Acero', type: 'armor', stats: { def: 15, hp: 60 }, price: 500, description: '+15 DEF, +60 HP' },
        { id: 'armadura_dragon', name: 'Armadura de Dragón', type: 'armor', stats: { def: 25, hp: 100 }, price: 1000, description: '+25 DEF, +100 HP' }
    ],
    accesorios: [
        { id: 'anillo_fuerza', name: 'Anillo de Fuerza', type: 'accessory', stats: { atk: 4 }, price: 120, description: '+4 ATK' },
        { id: 'amuleto_velocidad', name: 'Amuleto de Velocidad', type: 'accessory', stats: { spd: 5 }, price: 150, description: '+5 SPD' },
        { id: 'anillo_titan', name: 'Anillo del Titán', type: 'accessory', stats: { atk: 6, def: 4, hp: 30 }, price: 400, description: '+6 ATK, +4 DEF, +30 HP' }
    ]
};

// Misiones disponibles
const QUESTS = [
    {
        id: 'primera_caza',
        name: 'Primera Caza',
        description: 'Derrota a 3 enemigos para demostrar tu valía',
        requirements: { wins: 3 },
        rewards: { gold: 100, exp: 50 },
        difficulty: 'Fácil',
        levelRequired: 1
    },
    {
        id: 'cazador_goblins',
        name: 'Cazador de Goblins',
        description: 'Los goblins están causando problemas. Derrota a 5 enemigos.',
        requirements: { wins: 8 },
        rewards: { gold: 250, exp: 150 },
        difficulty: 'Media',
        levelRequired: 3
    },
    {
        id: 'explorador',
        name: 'Explorador Veterano',
        description: 'Completa 5 misiones para convertirte en un héroe reconocido',
        requirements: { completedQuests: 5 },
        rewards: { gold: 500, exp: 300 },
        difficulty: 'Difícil',
        levelRequired: 5
    },
    {
        id: 'cazador_dragones',
        name: 'Cazador de Dragones',
        description: 'Derrota a 20 enemigos y alcanza el nivel 10',
        requirements: { wins: 20, level: 10 },
        rewards: { gold: 1000, exp: 500 },
        difficulty: 'Legendaria',
        levelRequired: 8
    }
];

// Mazmorras
const DUNGEONS = {
    bosque_oscuro: {
        name: 'Bosque Oscuro',
        description: 'Un bosque lleno de criaturas peligrosas',
        emoji: '🌲',
        levels: 3,
        minLevel: 1,
        enemies: ['goblin', 'lobo'],
        rewards: { gold: 200, exp: 150 }
    },
    cueva_maldita: {
        name: 'Cueva Maldita',
        description: 'Una cueva donde los muertos no descansan',
        emoji: '🕳️',
        levels: 5,
        minLevel: 3,
        enemies: ['esqueleto', 'orco'],
        rewards: { gold: 500, exp: 400 }
    },
    torre_dragon: {
        name: 'Torre del Dragón',
        description: 'La guarida del temible dragón antiguo',
        emoji: '🏰',
        levels: 7,
        minLevel: 8,
        enemies: ['orco', 'dragon'],
        rewards: { gold: 1500, exp: 1000 }
    }
};

module.exports = { SHOP_ITEMS, QUESTS, DUNGEONS };
