const fs = require('fs');
const path = require('path');

class PvPSystem {
    constructor() {
        this.dataPath = path.join(__dirname, '../data/pvp-stats.json');
        this.loadStats();
    }

    loadStats() {
        try {
            if (fs.existsSync(this.dataPath)) {
                this.stats = JSON.parse(fs.readFileSync(this.dataPath, 'utf-8'));
            } else {
                this.stats = {};
            }
        } catch (error) {
            console.error('Error cargando PvP stats:', error);
            this.stats = {};
        }
    }

    saveStats() {
        try {
            fs.writeFileSync(this.dataPath, JSON.stringify(this.stats, null, 2));
        } catch (error) {
            console.error('Error guardando PvP stats:', error);
        }
    }

    getOrCreatePlayer(userId) {
        if (!this.stats[userId]) {
            this.stats[userId] = {
                victorias: 0,
                derrotas: 0,
                empates: 0,
                oro_ganado: 0,
                oro_perdido: 0,
                racha_actual: 0,
                racha_maxima: 0,
                historial: []
            };
            this.saveStats();
        }
        return this.stats[userId];
    }

    calculateVictory(attacker, defender) {
        const atkPower = attacker.stats.atk + (attacker.stats.atk * 0.1 * (attacker.level - 1));
        const defPower = defender.stats.def + (defender.stats.def * 0.1 * (defender.level - 1));
        const atkRng = Math.random() * 0.2 + 0.9; // 90-110%
        const defRng = Math.random() * 0.2 + 0.9;

        const finalAttack = atkPower * atkRng;
        const finalDefense = defPower * defRng;

        return finalAttack > finalDefense;
    }

    startPvP(player1, player2, apuesta = 0) {
        const p1Stats = this.getOrCreatePlayer(player1.userId);
        const p2Stats = this.getOrCreatePlayer(player2.userId);

        // Simular 3 rondas (mejor de 3)
        let p1Wins = 0;
        let p2Wins = 0;

        for (let i = 0; i < 3; i++) {
            if (this.calculateVictory(player1, player2)) {
                p1Wins++;
            } else {
                p2Wins++;
            }
        }

        let resultado = {
            ganador: p1Wins > p2Wins ? player1.userId : player2.userId,
            perdedor: p1Wins > p2Wins ? player2.userId : player1.userId,
            scoreFinal: `${p1Wins}-${p2Wins}`,
            apuesta: apuesta
        };

        // Actualizar estadísticas
        if (resultado.ganador === player1.userId) {
            p1Stats.victorias++;
            p2Stats.derrotas++;
            p1Stats.racha_actual++;
            p2Stats.racha_actual = 0;
        } else {
            p2Stats.victorias++;
            p1Stats.derrotas++;
            p2Stats.racha_actual++;
            p1Stats.racha_actual = 0;
        }

        // Actualizar racha máxima
        if (p1Stats.racha_actual > p1Stats.racha_maxima) {
            p1Stats.racha_maxima = p1Stats.racha_actual;
        }
        if (p2Stats.racha_actual > p2Stats.racha_maxima) {
            p2Stats.racha_maxima = p2Stats.racha_actual;
        }

        // Actualizar oro si hay apuesta
        if (apuesta > 0) {
            if (resultado.ganador === player1.userId) {
                p1Stats.oro_ganado += apuesta;
                p2Stats.oro_perdido += apuesta;
            } else {
                p2Stats.oro_ganado += apuesta;
                p1Stats.oro_perdido += apuesta;
            }
        }

        // Agregar al historial
        const fecha = new Date().toLocaleString('es-ES');
        p1Stats.historial.push({
            fecha,
            rival: player2.userId,
            resultado: resultado.ganador === player1.userId ? 'victoria' : 'derrota',
            score: resultado.scoreFinal,
            apuesta
        });
        p2Stats.historial.push({
            fecha,
            rival: player1.userId,
            resultado: resultado.ganador === player2.userId ? 'victoria' : 'derrota',
            score: `${p2Wins}-${p1Wins}`,
            apuesta
        });

        // Limitar historial a últimos 20 combates
        if (p1Stats.historial.length > 20) p1Stats.historial.shift();
        if (p2Stats.historial.length > 20) p2Stats.historial.shift();

        this.saveStats();
        return resultado;
    }

    getStats(userId) {
        return this.getOrCreatePlayer(userId);
    }

    getRanking(limit = 10) {
        return Object.entries(this.stats)
            .map(([userId, stats]) => ({
                userId,
                ...stats,
                winRate: ((stats.victorias / (stats.victorias + stats.derrotas)) * 100).toFixed(2)
            }))
            .sort((a, b) => b.victorias - a.victorias)
            .slice(0, limit);
    }

    getHistorial(userId, limit = 10) {
        const stats = this.getOrCreatePlayer(userId);
        return stats.historial.slice(-limit).reverse();
    }
}

module.exports = new PvPSystem();
