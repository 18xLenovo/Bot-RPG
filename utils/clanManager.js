const fs = require('fs');
const path = require('path');
const { ServerConfigManager: serverConfig } = require('./serverConfigManager');

const DATA_DIR = path.join(__dirname, '../data');
const CLANS_FILE = path.join(DATA_DIR, 'clans.json');
const SERVERS_DIR = path.join(DATA_DIR, 'servers');

// Beneficios por nivel de clan
const CLAN_BENEFITS = {
    1: { maxMembers: 5, bonusGold: 0, bonusExp: 0, description: 'Clan Novato' },
    2: { maxMembers: 10, bonusGold: 5, bonusExp: 5, description: 'Clan Emergente' },
    3: { maxMembers: 15, bonusGold: 10, bonusExp: 10, description: 'Clan Experimentado' },
    4: { maxMembers: 20, bonusGold: 15, bonusExp: 15, description: 'Clan Veterano' },
    5: { maxMembers: 30, bonusGold: 25, bonusExp: 25, description: 'Clan Legendario' }
};

class ClanManager {
    constructor() {
        this.clans = this.loadClans();
        this.serverClans = {}; // Almacenamiento en memoria de clanes por servidor
        this.pendingInvites = new Map(); // userId -> {clanId, inviterId, timestamp}
    }

    // Obtener el archivo de clanes según el modo
    getClansFile(serverId = null) {
        if (serverId && serverConfig.isSoloServerMode(serverId)) {
            return path.join(SERVERS_DIR, `${serverId}-clans.json`);
        }
        return CLANS_FILE;
    }

    loadClans() {
        try {
            if (fs.existsSync(CLANS_FILE)) {
                const data = fs.readFileSync(CLANS_FILE, 'utf8');
                const parsed = JSON.parse(data);
                console.log(`✅ Cargados ${Object.keys(parsed).length} clanes globales`);
                return parsed;
            }
        } catch (error) {
            console.error('Error cargando clanes:', error);
        }
        return {};
    }

    // Cargar clanes de un servidor específico (solo-servidor mode)
    loadServerClans(serverId) {
        try {
            const file = this.getClansFile(serverId);
            if (fs.existsSync(file)) {
                const data = fs.readFileSync(file, 'utf8');
                const parsed = JSON.parse(data);
                this.serverClans[serverId] = parsed;
                return parsed;
            }
        } catch (error) {
            console.error(`Error cargando clanes del servidor ${serverId}:`, error);
        }
        this.serverClans[serverId] = {};
        return {};
    }

    saveClans(serverId = null) {
        try {
            let file, data;

            if (serverId && serverConfig.isSoloServerMode(serverId)) {
                file = this.getClansFile(serverId);
                data = this.serverClans[serverId] || {};
            } else {
                file = CLANS_FILE;
                data = this.clans;
            }

            fs.writeFileSync(file, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('Error guardando clanes:', error);
        }
    }

    // Obtener datos de clanes según el modo
    getClansData(serverId = null) {
        if (serverId && serverConfig.isSoloServerMode(serverId)) {
            if (!this.serverClans[serverId]) {
                this.loadServerClans(serverId);
            }
            return this.serverClans[serverId];
        }
        return this.clans;
    }

    createClan(leaderId, name, description = '', serverId = null) {
        // Verificar si el jugador ya está en un clan
        const existingClan = this.getPlayerClan(leaderId, serverId);
        if (existingClan) {
            return { success: false, message: 'Ya estás en un clan. Debes salir primero.' };
        }

        // Verificar si el nombre ya existe
        const clans = this.getClansData(serverId);
        const nameExists = Object.values(clans).some(c => c.name.toLowerCase() === name.toLowerCase());
        if (nameExists) {
            return { success: false, message: 'Ya existe un clan con ese nombre.' };
        }

        const clanId = `clan_${Date.now()}`;
        clans[clanId] = {
            id: clanId,
            name,
            description,
            leader: leaderId,
            members: [leaderId],
            level: 1,
            exp: 0,
            expToNext: 1000,
            treasury: 0,
            wins: 0,
            dungeonClears: 0,
            createdAt: Date.now(),
            announcements: []
        };

        this.saveClans(serverId);
        return { success: true, message: `¡Clan "${name}" creado exitosamente!`, clanId };
    }

    invitePlayer(clanId, inviterId, invitedId, serverId = null) {
        const clans = this.getClansData(serverId);
        const clan = clans[clanId];
        if (!clan) return { success: false, message: 'Clan no encontrado.' };

        // Verificar que el invitador es líder o miembro
        if (!clan.members.includes(inviterId)) {
            return { success: false, message: 'No eres miembro de este clan.' };
        }

        // Verificar si el jugador ya está en un clan
        const targetClan = this.getPlayerClan(invitedId, serverId);
        if (targetClan) {
            return { success: false, message: 'Ese jugador ya está en un clan.' };
        }

        // Verificar límite de miembros
        const benefits = CLAN_BENEFITS[clan.level];
        if (clan.members.length >= benefits.maxMembers) {
            return { success: false, message: `El clan está lleno (máximo ${benefits.maxMembers} miembros).` };
        }

        // Crear invitación
        this.pendingInvites.set(invitedId, {
            clanId,
            inviterId,
            timestamp: Date.now()
        });

        return { success: true, message: 'Invitación enviada.' };
    }

    acceptInvite(userId, serverId = null) {
        const invite = this.pendingInvites.get(userId);
        if (!invite) {
            return { success: false, message: 'No tienes invitaciones pendientes.' };
        }

        // Verificar que la invitación no haya expirado (10 minutos)
        if (Date.now() - invite.timestamp > 600000) {
            this.pendingInvites.delete(userId);
            return { success: false, message: 'La invitación ha expirado.' };
        }

        const clans = this.getClansData(serverId);
        const clan = clans[invite.clanId];
        if (!clan) {
            this.pendingInvites.delete(userId);
            return { success: false, message: 'El clan ya no existe.' };
        }

        clan.members.push(userId);
        this.pendingInvites.delete(userId);
        this.saveClans(serverId);

        return { success: true, message: `¡Te has unido a ${clan.name}!`, clan };
    }

    rejectInvite(userId) {
        const invite = this.pendingInvites.get(userId);
        if (!invite) {
            return { success: false, message: 'No tienes invitaciones pendientes.' };
        }

        this.pendingInvites.delete(userId);
        return { success: true, message: 'Invitación rechazada.' };
    }

    getPlayerClan(userId, serverId = null) {
        const clans = this.getClansData(serverId);
        for (const clan of Object.values(clans)) {
            if (clan.members.includes(userId)) {
                return clan;
            }
        }
        return null;
    }

    leaveClan(userId, serverId = null) {
        const clans = this.getClansData(serverId);
        const clan = this.getPlayerClan(userId, serverId);
        if (!clan) {
            return { success: false, message: 'No estás en ningún clan.' };
        }

        // Si es el líder, transferir liderazgo o disolver
        if (clan.leader === userId) {
            if (clan.members.length === 1) {
                // Disolver el clan
                delete clans[clan.id];
                this.saveClans(serverId);
                return { success: true, message: 'Clan disuelto.' };
            } else {
                // Transferir liderazgo al siguiente miembro
                clan.members = clan.members.filter(m => m !== userId);
                clan.leader = clan.members[0];
                this.saveClans(serverId);
                return { success: true, message: 'Has dejado el clan. El liderazgo fue transferido.' };
            }
        }

        // Remover miembro
        clan.members = clan.members.filter(m => m !== userId);
        this.saveClans(serverId);
        return { success: true, message: 'Has dejado el clan.' };
    }

    addExp(clanId, amount, serverId = null) {
        const clans = this.getClansData(serverId);
        const clan = clans[clanId];
        if (!clan) return 0;

        clan.exp += amount;
        let levelsGained = 0;

        while (clan.exp >= clan.expToNext && clan.level < 5) {
            clan.exp -= clan.expToNext;
            clan.level++;
            levelsGained++;
            clan.expToNext = Math.floor(clan.expToNext * 1.5);
        }

        this.saveClans(serverId);
        return levelsGained;
    }

    addToTreasury(clanId, amount, serverId = null) {
        const clans = this.getClansData(serverId);
        const clan = clans[clanId];
        if (!clan) return false;

        clan.treasury += amount;
        this.saveClans(serverId);
        return true;
    }

    withdrawFromTreasury(clanId, userId, amount, serverId = null) {
        const clans = this.getClansData(serverId);
        const clan = clans[clanId];
        if (!clan) return { success: false, message: 'Clan no encontrado.' };

        if (clan.leader !== userId) {
            return { success: false, message: 'Solo el líder puede retirar del tesoro.' };
        }

        if (clan.treasury < amount) {
            return { success: false, message: 'Fondos insuficientes en el tesoro.' };
        }

        clan.treasury -= amount;
        this.saveClans(serverId);
        return { success: true, message: `Retirados ${amount} oro del tesoro.` };
    }

    addAnnouncement(clanId, message, serverId = null) {
        const clans = this.getClansData(serverId);
        const clan = clans[clanId];
        if (!clan) return false;

        if (!clan.announcements) clan.announcements = [];
        
        clan.announcements.unshift({
            message,
            timestamp: Date.now()
        });

        // Mantener solo los últimos 10 anuncios
        if (clan.announcements.length > 10) {
            clan.announcements = clan.announcements.slice(0, 10);
        }

        this.saveClans(serverId);
        return true;
    }

    getClanRankings(serverId = null) {
        const clans = this.getClansData(serverId);
        return Object.values(clans)
            .sort((a, b) => {
                // Ordenar por nivel, luego por victorias
                if (b.level !== a.level) return b.level - a.level;
                return b.wins - a.wins;
            })
            .slice(0, 10);
    }
}

// Singleton
const clanManagerInstance = new ClanManager();

module.exports = { ClanManager: clanManagerInstance, CLAN_BENEFITS };
