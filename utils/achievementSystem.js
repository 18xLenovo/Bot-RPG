const fs = require('fs');
const path = require('path');

class AchievementSystem {
    constructor() {
        this.dataPath = path.join(__dirname, '../data/achievements.json');
        this.loadAchievements();
    }

    loadAchievements() {
        try {
            if (fs.existsSync(this.dataPath)) {
                this.userAchievements = JSON.parse(fs.readFileSync(this.dataPath, 'utf-8'));
            } else {
                this.userAchievements = {};
            }
        } catch (error) {
            console.error('Error cargando achievements:', error);
            this.userAchievements = {};
        }
    }

    saveAchievements() {
        try {
            fs.writeFileSync(this.dataPath, JSON.stringify(this.userAchievements, null, 2));
        } catch (error) {
            console.error('Error guardando achievements:', error);
        }
    }

    // Base de datos de logros
    getAchievementDatabase() {
        return {
            // Logros de Combate
            primer_combate: {
                id: 'primer_combate',
                nombre: 'Primer Sangre',
                descripcion: 'Gana tu primer combate contra un enemigo',
                emoji: '⚔️',
                categoria: 'combate',
                puntos: 10,
                condicion: { tipo: 'combates_ganados', valor: 1 }
            },
            combates_10: {
                id: 'combates_10',
                nombre: 'Guerrero Experimentado',
                descripcion: 'Gana 10 combates',
                emoji: '🛡️',
                categoria: 'combate',
                puntos: 25,
                condicion: { tipo: 'combates_ganados', valor: 10 }
            },
            combates_50: {
                id: 'combates_50',
                nombre: 'Leyenda del Campo de Batalla',
                descripcion: 'Gana 50 combates',
                emoji: '⭐',
                categoria: 'combate',
                puntos: 100,
                condicion: { tipo: 'combates_ganados', valor: 50 }
            },
            
            // Logros de PvP
            primer_pvp: {
                id: 'primer_pvp',
                nombre: 'Primer Duelo',
                descripcion: 'Gana tu primer duelo contra otro jugador',
                emoji: '🎯',
                categoria: 'pvp',
                puntos: 15,
                condicion: { tipo: 'pvp_victorias', valor: 1 }
            },
            pvp_victorias_10: {
                id: 'pvp_victorias_10',
                nombre: 'Campeón de Duelos',
                descripcion: 'Gana 10 duelos PvP',
                emoji: '🏆',
                categoria: 'pvp',
                puntos: 50,
                condicion: { tipo: 'pvp_victorias', valor: 10 }
            },
            winning_streak_5: {
                id: 'winning_streak_5',
                nombre: 'Racha de Fuego',
                descripcion: 'Consigue una racha de 5 victorias consecutivas',
                emoji: '🔥',
                categoria: 'pvp',
                puntos: 30,
                condicion: { tipo: 'racha_maxima_pvp', valor: 5 }
            },

            // Logros de Mazmorras
            primer_dungeon: {
                id: 'primer_dungeon',
                nombre: 'Explorador de Mazmorras',
                descripcion: 'Completa tu primera mazmorra',
                emoji: '🕷️',
                categoria: 'mazmorras',
                puntos: 20,
                condicion: { tipo: 'dungeons_completados', valor: 1 }
            },
            dungeon_10: {
                id: 'dungeon_10',
                nombre: 'Domador de Mazmorras',
                descripcion: 'Completa 10 mazmorras',
                emoji: '👹',
                categoria: 'mazmorras',
                puntos: 75,
                condicion: { tipo: 'dungeons_completados', valor: 10 }
            },
            item_legendario: {
                id: 'item_legendario',
                nombre: 'Cazador de Legendarios',
                descripcion: 'Obtén un item legendario',
                emoji: '💎',
                categoria: 'mazmorras',
                puntos: 80,
                condicion: { tipo: 'items_legendarios', valor: 1 }
            },

            // Logros de Economia
            oro_1000: {
                id: 'oro_1000',
                nombre: 'Primer Millón',
                descripcion: 'Acumula 1,000 de oro',
                emoji: '🪙',
                categoria: 'economia',
                puntos: 15,
                condicion: { tipo: 'oro_acumulado', valor: 1000 }
            },
            oro_10000: {
                id: 'oro_10000',
                nombre: 'Magnate',
                descripcion: 'Acumula 10,000 de oro',
                emoji: '💰',
                categoria: 'economia',
                puntos: 50,
                condicion: { tipo: 'oro_acumulado', valor: 10000 }
            },
            items_50: {
                id: 'items_50',
                nombre: 'Coleccionista',
                descripcion: 'Recolecta 50 items diferentes',
                emoji: '🎁',
                categoria: 'economia',
                puntos: 40,
                condicion: { tipo: 'items_unicos', valor: 50 }
            },

            // Logros de Progresión
            nivel_10: {
                id: 'nivel_10',
                nombre: 'Aprendiz',
                descripcion: 'Alcanza nivel 10',
                emoji: '📈',
                categoria: 'progresion',
                puntos: 20,
                condicion: { tipo: 'nivel', valor: 10 }
            },
            nivel_50: {
                id: 'nivel_50',
                nombre: 'Maestro',
                descripcion: 'Alcanza nivel 50',
                emoji: '🌟',
                categoria: 'progresion',
                puntos: 100,
                condicion: { tipo: 'nivel', valor: 50 }
            },
            nivel_100: {
                id: 'nivel_100',
                nombre: 'Supremo',
                descripcion: 'Alcanza nivel 100',
                emoji: '👑',
                categoria: 'progresion',
                puntos: 250,
                condicion: { tipo: 'nivel', valor: 100 }
            },

            // Logros Especiales
            todas_clases: {
                id: 'todas_clases',
                nombre: 'Políglota',
                descripcion: 'Crea un personaje de cada clase',
                emoji: '🎭',
                categoria: 'especial',
                puntos: 150,
                condicion: { tipo: 'clases_creadas', valor: 8 }
            },
            clan_lider: {
                id: 'clan_lider',
                nombre: 'Líder Nato',
                descripcion: 'Crea y lidera un clan',
                emoji: '👨‍💼',
                categoria: 'especial',
                puntos: 100,
                condicion: { tipo: 'es_lider_clan', valor: 1 }
            },
            primer_logro: {
                id: 'primer_logro',
                nombre: '¡Lo Hiciste!',
                descripcion: 'Desbloquea tu primer logro',
                emoji: '🎉',
                categoria: 'especial',
                puntos: 5,
                condicion: { tipo: 'logros_desbloqueados', valor: 1 }
            }
        };
    }

    getOrCreatePlayer(userId) {
        if (!this.userAchievements[userId]) {
            this.userAchievements[userId] = {
                desbloqueados: [],
                puntos: 0,
                progreso: {}
            };
            this.saveAchievements();
        }
        return this.userAchievements[userId];
    }

    verificarLogros(userId, stats) {
        const player = this.getOrCreatePlayer(userId);
        const db = this.getAchievementDatabase();
        const nuevosLogros = [];

        Object.values(db).forEach(logro => {
            if (player.desbloqueados.includes(logro.id)) return; // Ya desbloqueado

            let cumple = false;
            const { tipo, valor } = logro.condicion;

            if (tipo === 'combates_ganados') cumple = (stats.combatesGanados || 0) >= valor;
            else if (tipo === 'pvp_victorias') cumple = (stats.pvpVictorias || 0) >= valor;
            else if (tipo === 'racha_maxima_pvp') cumple = (stats.rachaMaximaPvP || 0) >= valor;
            else if (tipo === 'dungeons_completados') cumple = (stats.dungeonsCompletados || 0) >= valor;
            else if (tipo === 'items_legendarios') cumple = (stats.itemsLegendarios || 0) >= valor;
            else if (tipo === 'oro_acumulado') cumple = (stats.oro || 0) >= valor;
            else if (tipo === 'items_unicos') cumple = (stats.itemsUnicos || 0) >= valor;
            else if (tipo === 'nivel') cumple = (stats.nivel || 1) >= valor;
            else if (tipo === 'clases_creadas') cumple = (stats.clasesCreadas || 0) >= valor;
            else if (tipo === 'es_lider_clan') cumple = (stats.esLiderClan || false) === true;
            else if (tipo === 'logros_desbloqueados') cumple = (stats.logrosDesbloqueados || 0) >= valor;

            if (cumple) {
                player.desbloqueados.push(logro.id);
                player.puntos += logro.puntos;
                nuevosLogros.push(logro);
            }
        });

        if (nuevosLogros.length > 0) {
            this.saveAchievements();
        }

        return nuevosLogros;
    }

    getPlayerAchievements(userId) {
        const player = this.getOrCreatePlayer(userId);
        const db = this.getAchievementDatabase();

        return player.desbloqueados.map(id => db[id]).filter(Boolean);
    }

    getAchievementInfo(id) {
        return this.getAchievementDatabase()[id];
    }

    getAllAchievements() {
        return Object.values(this.getAchievementDatabase());
    }

    getPlayerStats(userId) {
        const player = this.getOrCreatePlayer(userId);
        return {
            desbloqueados: player.desbloqueados.length,
            puntos: player.puntos,
            progreso: player.progreso
        };
    }

    getAchievementsByCategory(categoria) {
        const db = this.getAchievementDatabase();
        return Object.values(db).filter(a => a.categoria === categoria);
    }
}

module.exports = new AchievementSystem();
