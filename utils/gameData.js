// Sistema de rarezas
const RARITIES = {
    comun: { emoji: '⚪', color: '#808080', name: 'Común' },
    poco_comun: { emoji: '🟢', color: '#00FF00', name: 'Poco Común' },
    especial: { emoji: '🔵', color: '#0066FF', name: 'Especial' },
    epico: { emoji: '🟣', color: '#9933FF', name: 'Épico' },
    legendario: { emoji: '⭐', color: '#FFD700', name: 'Legendario' }
};

// Tienda de items con sistema de rarezas
const SHOP_ITEMS = {
    consumibles: [
        // Común
        { id: 'pocion_vida', name: '⚪ Poción de Vida', rarity: 'comun', type: 'consumible', effect: 'heal', value: 50, price: 30, description: 'Restaura 50 HP', source: 'shop' },
        { id: 'pocion_mana', name: '⚪ Poción de Maná', rarity: 'comun', type: 'consumible', effect: 'mana', value: 30, price: 35, description: 'Restaura 30 Maná', source: 'shop' },
        
        // Poco Común
        { id: 'pocion_grande', name: '🟢 Poción Grande de Vida', rarity: 'poco_comun', type: 'consumible', effect: 'heal', value: 100, price: 60, description: 'Restaura 100 HP', source: 'shop' },
        { id: 'pocion_mana_grande', name: '🟢 Poción Grande de Maná', rarity: 'poco_comun', type: 'consumible', effect: 'mana', value: 60, price: 70, description: 'Restaura 60 Maná', source: 'shop' },
        { id: 'antidoto', name: '🟢 Antídoto', rarity: 'poco_comun', type: 'consumible', effect: 'cure', value: 0, price: 80, description: 'Cura los venenos', source: 'shop' },
        
        // Especial
        { id: 'elixir', name: '🔵 Elixir Especial', rarity: 'especial', type: 'consumible', effect: 'heal', value: 200, price: 120, description: 'Restaura 200 HP', source: 'shop' },
        { id: 'tonica_mana', name: '🔵 Tónica de Maná', rarity: 'especial', type: 'consumible', effect: 'mana', value: 100, price: 150, description: 'Restaura 100 Maná', source: 'shop' },
        
        // Épico
        { id: 'elixir_completo', name: '🟣 Elixir Completo', rarity: 'epico', type: 'consumible', effect: 'full', value: 100, price: 150, description: 'Restaura HP y Maná completamente', source: 'shop' },
        { id: 'pocion_poder', name: '🟣 Poción de Poder', rarity: 'epico', type: 'consumible', effect: 'boost', value: 0, price: 200, description: 'Aumenta ATK +5 por 3 turnos', source: 'shop' },
    ],
    armas: [
        // Común
        { id: 'daga', name: '⚪ Daga', rarity: 'comun', type: 'weapon', stats: { atk: 3 }, price: 50, description: '+3 ATK - Rápida y ligera', source: 'shop' },
        { id: 'espada_madera', name: '⚪ Espada de Madera', rarity: 'comun', type: 'weapon', stats: { atk: 2 }, price: 25, description: '+2 ATK - Para principiantes', source: 'shop' },
        
        // Poco Común
        { id: 'espada_hierro', name: '🟢 Espada de Hierro', rarity: 'poco_comun', type: 'weapon', stats: { atk: 7 }, price: 150, description: '+7 ATK - Arma confiable', source: 'shop' },
        { id: 'hacha_pequeña', name: '🟢 Hacha Pequeña', rarity: 'poco_comun', type: 'weapon', stats: { atk: 8, spd: -1 }, price: 140, description: '+8 ATK, -1 SPD', source: 'shop' },
        { id: 'lanza', name: '🟢 Lanza', rarity: 'poco_comun', type: 'weapon', stats: { atk: 9, spd: 1 }, price: 160, description: '+9 ATK, +1 SPD', source: 'shop' },
        
        // Especial
        { id: 'hacha_batalla', name: '🔵 Hacha de Batalla', rarity: 'especial', type: 'weapon', stats: { atk: 10, spd: -2 }, price: 200, description: '+10 ATK, -2 SPD - Golpes devastadores', source: 'shop' },
        { id: 'espada_acero', name: '🔵 Espada de Acero', rarity: 'especial', type: 'weapon', stats: { atk: 12 }, price: 300, description: '+12 ATK - Forjada con maestría', source: 'shop' },
        { id: 'arco_largo', name: '🔵 Arco Largo', rarity: 'especial', type: 'weapon', stats: { atk: 14, spd: 4 }, price: 350, description: '+14 ATK, +4 SPD - Preciso y rápido', source: 'shop' },
        { id: 'baston_mago', name: '🔵 Bastón de Mago', rarity: 'especial', type: 'weapon', stats: { atk: 16, maxMana: 20 }, price: 400, description: '+16 ATK, +20 Maná - Maestro de magia', source: 'shop' },
        
        // Épico
        { id: 'claymore', name: '🟣 Claymore Épica', rarity: 'epico', type: 'weapon', stats: { atk: 18, hp: 30 }, price: 600, description: '+18 ATK, +30 HP - Espada de dos manos', source: 'shop' },
        { id: 'arco_fuego', name: '🟣 Arco de Fuego', rarity: 'epico', type: 'weapon', stats: { atk: 17, spd: 5 }, price: 550, description: '+17 ATK, +5 SPD - Inflamado', source: 'shop' },
        
        // Legendario - Solo Mazmorras
        { id: 'espada_legendaria', name: '⭐ Espada Legendaria', rarity: 'legendario', type: 'weapon', stats: { atk: 25, spd: 3, def: 2 }, price: 0, description: '+25 ATK, +3 SPD, +2 DEF - Forjada por dioses', source: 'dungeon' },
        { id: 'hacha_dragon', name: '⭐ Hacha del Dragón', rarity: 'legendario', type: 'weapon', stats: { atk: 28, hp: 50 }, price: 0, description: '+28 ATK, +50 HP - Del corazón de un dragón', source: 'dungeon' },
        { id: 'arco_infinito', name: '⭐ Arco Infinito', rarity: 'legendario', type: 'weapon', stats: { atk: 22, spd: 8 }, price: 0, description: '+22 ATK, +8 SPD - Nunca se acaba', source: 'dungeon' },
        
        // Especial - Solo Mazmorras (No legendario)
        { id: 'espada_sombra', name: '🔵 Espada de Sombra', rarity: 'especial', type: 'weapon', stats: { atk: 15, spd: 6, def: -1 }, price: 0, description: '+15 ATK, +6 SPD, -1 DEF - De otro mundo', source: 'dungeon' },
    ],
    armaduras: [
        // Común
        { id: 'armadura_tela', name: '⚪ Armadura de Tela', rarity: 'comun', type: 'armor', stats: { def: 2, hp: 10 }, price: 40, description: '+2 DEF, +10 HP', source: 'shop' },
        
        // Poco Común
        { id: 'armadura_cuero', name: '🟢 Armadura de Cuero', rarity: 'poco_comun', type: 'armor', stats: { def: 5, hp: 20 }, price: 100, description: '+5 DEF, +20 HP - Flexible y resistente', source: 'shop' },
        { id: 'peto_hierro', name: '🟢 Peto de Hierro', rarity: 'poco_comun', type: 'armor', stats: { def: 7, hp: 25 }, price: 120, description: '+7 DEF, +25 HP', source: 'shop' },
        
        // Especial
        { id: 'armadura_hierro', name: '🔵 Armadura de Hierro', rarity: 'especial', type: 'armor', stats: { def: 10, hp: 40 }, price: 250, description: '+10 DEF, +40 HP - Protección sólida', source: 'shop' },
        { id: 'armadura_acero', name: '🔵 Armadura de Acero', rarity: 'especial', type: 'armor', stats: { def: 15, hp: 60 }, price: 500, description: '+15 DEF, +60 HP - Forjada por maestros', source: 'shop' },
        { id: 'cota_mithril', name: '🔵 Cota de Mithril', rarity: 'especial', type: 'armor', stats: { def: 13, hp: 50, spd: 1 }, price: 480, description: '+13 DEF, +50 HP, +1 SPD - Metal místico', source: 'shop' },
        
        // Épico
        { id: 'armadura_cristal', name: '🟣 Armadura de Cristal', rarity: 'epico', type: 'armor', stats: { def: 20, hp: 80 }, price: 800, description: '+20 DEF, +80 HP - Impenetrable', source: 'shop' },
        
        // Legendario - Solo Mazmorras
        { id: 'armadura_dragon', name: '⭐ Armadura de Dragón', rarity: 'legendario', type: 'armor', stats: { def: 30, hp: 120, spd: -1 }, price: 0, description: '+30 DEF, +120 HP, -1 SPD - Piel de dragón antiguo', source: 'dungeon' },
        { id: 'armadura_dioses', name: '⭐ Armadura de los Dioses', rarity: 'legendario', type: 'armor', stats: { def: 28, hp: 100 }, price: 0, description: '+28 DEF, +100 HP - Creada por divinidades', source: 'dungeon' },
    ],
    accesorios: [
        // Común
        { id: 'anillo_bronce', name: '⚪ Anillo de Bronce', rarity: 'comun', type: 'accessory', stats: { atk: 1 }, price: 30, description: '+1 ATK', source: 'shop' },
        { id: 'collar_sencillo', name: '⚪ Collar Sencillo', rarity: 'comun', type: 'accessory', stats: { hp: 5 }, price: 25, description: '+5 HP', source: 'shop' },
        
        // Poco Común
        { id: 'anillo_fuerza', name: '🟢 Anillo de Fuerza', rarity: 'poco_comun', type: 'accessory', stats: { atk: 4 }, price: 120, description: '+4 ATK', source: 'shop' },
        { id: 'amuleto_velocidad', name: '🟢 Amuleto de Velocidad', rarity: 'poco_comun', type: 'accessory', stats: { spd: 5 }, price: 150, description: '+5 SPD', source: 'shop' },
        { id: 'brazalete_defensa', name: '🟢 Brazalete de Defensa', rarity: 'poco_comun', type: 'accessory', stats: { def: 3 }, price: 130, description: '+3 DEF', source: 'shop' },
        
        // Especial
        { id: 'anillo_titan', name: '🔵 Anillo del Titán', rarity: 'especial', type: 'accessory', stats: { atk: 6, def: 4, hp: 30 }, price: 400, description: '+6 ATK, +4 DEF, +30 HP - Equilibrio perfecto', source: 'shop' },
        { id: 'collar_sabiduria', name: '🔵 Collar de Sabiduría', rarity: 'especial', type: 'accessory', stats: { maxMana: 25 }, price: 350, description: '+25 Maná Máximo', source: 'shop' },
        
        // Épico
        { id: 'anillo_poder', name: '🟣 Anillo de Poder', rarity: 'epico', type: 'accessory', stats: { atk: 10, hp: 50, def: 3 }, price: 700, description: '+10 ATK, +50 HP, +3 DEF - Increíble poder', source: 'shop' },
        
        // Legendario - Solo Mazmorras
        { id: 'anillo_infinito', name: '⭐ Anillo Infinito', rarity: 'legendario', type: 'accessory', stats: { atk: 15, def: 8, hp: 100, maxMana: 50 }, price: 0, description: '+15 ATK, +8 DEF, +100 HP, +50 Maná - Poder supremo', source: 'dungeon' },
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

module.exports = { SHOP_ITEMS, QUESTS, DUNGEONS, RARITIES };
