
const fs = require('fs');
const path = require('path');

const CONFIG_FILE = path.join(__dirname, '../data/server-config.json');

class ServerConfigManager {
    constructor() {
        this.configs = this.loadConfigs();
    }

    loadConfigs() {
        try {
            if (fs.existsSync(CONFIG_FILE)) {
                const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
                return JSON.parse(data);
            }
        } catch (error) {
            console.error('Error cargando configuraciones:', error);
        }
        return {};
    }

    saveConfigs() {
        try {
            fs.writeFileSync(CONFIG_FILE, JSON.stringify(this.configs, null, 2));
        } catch (error) {
            console.error('Error guardando configuraciones:', error);
        }
    }

    // Obtener configuración de un servidor
    getServerConfig(serverId) {
        if (!this.configs[serverId]) {
            // Crear configuración por defecto
            this.configs[serverId] = {
                serverId,
                mode: 'solo-servidor', // 'solo-servidor' o 'compartido'
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            this.saveConfigs();
        }
        return this.configs[serverId];
    }

    // Cambiar modo del servidor
    setServerMode(serverId, mode) {
        if (mode !== 'solo-servidor' && mode !== 'compartido') {
            throw new Error('Modo inválido. Usa "solo-servidor" o "compartido"');
        }

        if (!this.configs[serverId]) {
            this.configs[serverId] = {
                serverId,
                mode,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
        } else {
            this.configs[serverId].mode = mode;
            this.configs[serverId].updatedAt = new Date().toISOString();
        }

        this.saveConfigs();
        return this.configs[serverId];
    }

    // Verificar si un servidor está en modo solo-servidor
    isSoloServerMode(serverId) {
        const config = this.getServerConfig(serverId);
        return config.mode === 'solo-servidor';
    }

    // Obtener todos los servidores en modo compartido
    getSharedServers() {
        return Object.values(this.configs).filter(config => config.mode === 'compartido');
    }

    // Eliminar configuración de un servidor
    deleteServerConfig(serverId) {
        delete this.configs[serverId];
        this.saveConfigs();
    }

    // Obtener estadísticas
    getStats() {
        const soloServidores = Object.values(this.configs).filter(c => c.mode === 'solo-servidor').length;
        const compartidosServidores = Object.values(this.configs).filter(c => c.mode === 'compartido').length;

        return {
            totalServidores: Object.keys(this.configs).length,
            soloServidores,
            compartidosServidores
        };
    }
}

// Singleton
const serverConfigManagerInstance = new ServerConfigManager();

module.exports = { ServerConfigManager: serverConfigManagerInstance };
