const fs = require('fs');
const path = require('path');

class MarketSystem {
    constructor() {
        this.dataPath = path.join(__dirname, '../data/market-listings.json');
        this.historialPath = path.join(__dirname, '../data/market-historial.json');
        this.loadListings();
        this.loadHistorial();
    }

    loadListings() {
        try {
            if (fs.existsSync(this.dataPath)) {
                this.listings = JSON.parse(fs.readFileSync(this.dataPath, 'utf-8'));
            } else {
                this.listings = [];
            }
        } catch (error) {
            console.error('Error cargando listings:', error);
            this.listings = [];
        }
    }

    saveListings() {
        try {
            fs.writeFileSync(this.dataPath, JSON.stringify(this.listings, null, 2));
        } catch (error) {
            console.error('Error guardando listings:', error);
        }
    }

    loadHistorial() {
        try {
            if (fs.existsSync(this.historialPath)) {
                this.historial = JSON.parse(fs.readFileSync(this.historialPath, 'utf-8'));
            } else {
                this.historial = [];
            }
        } catch (error) {
            console.error('Error cargando historial:', error);
            this.historial = [];
        }
    }

    saveHistorial() {
        try {
            fs.writeFileSync(this.historialPath, JSON.stringify(this.historial, null, 2));
        } catch (error) {
            console.error('Error guardando historial:', error);
        }
    }

    crearListing(vendedor, item, precio) {
        const listing = {
            id: Math.random().toString(36).substr(2, 9),
            vendedor,
            item,
            precio,
            fecha: new Date().toISOString(),
            activo: true
        };

        this.listings.push(listing);
        this.saveListings();
        return listing;
    }

    comprarListing(id, comprador, oroDisponible) {
        const listing = this.listings.find(l => l.id === id && l.activo);
        if (!listing) return { success: false, message: 'Listing no encontrado' };

        if (oroDisponible < listing.precio) {
            return { success: false, message: 'No tienes suficiente oro' };
        }

        // Marcar como vendido
        listing.activo = false;
        listing.comprador = comprador;
        listing.fecha_venta = new Date().toISOString();

        // Calcular comisión (5%)
        const comision = Math.floor(listing.precio * 0.05);
        const oroVendedor = listing.precio - comision;

        this.saveListings();

        // Agregar al historial
        this.historial.push({
            vendedor: listing.vendedor,
            comprador,
            item: listing.item,
            precio: listing.precio,
            comision,
            oroVendedor,
            fecha: listing.fecha_venta
        });
        this.saveHistorial();

        return {
            success: true,
            item: listing.item,
            precio: listing.precio,
            comision,
            oroVendedor
        };
    }

    obtenerListings(activos = true) {
        return this.listings.filter(l => l.activo === activos).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    }

    obtenerListingsPorVendedor(vendedor) {
        return this.listings.filter(l => l.vendedor === vendedor && l.activo);
    }

    obtenerListingsPorItem(itemName) {
        return this.listings.filter(l => 
            l.activo && 
            l.item.name.toLowerCase().includes(itemName.toLowerCase())
        ).sort((a, b) => a.precio - b.precio);
    }

    cancelarListing(id, vendedor) {
        const listing = this.listings.find(l => l.id === id && l.vendedor === vendedor && l.activo);
        if (!listing) return false;

        listing.activo = false;
        listing.cancelado = true;
        this.saveListings();
        return true;
    }

    obtenerHistorial(limit = 20) {
        return this.historial.slice(-limit).reverse();
    }

    obtenerEstadisticas() {
        const listingsActivos = this.listings.filter(l => l.activo).length;
        const listingsVendidos = this.listings.filter(l => !l.activo && !l.cancelado).length;
        
        let oroMovido = 0;
        let comisionTotal = 0;
        this.historial.forEach(venta => {
            oroMovido += venta.precio;
            comisionTotal += venta.comision;
        });

        return {
            listingsActivos,
            listingsVendidos,
            oroMovido,
            comisionTotal,
            ventasRegistradas: this.historial.length
        };
    }

    obtenerPrecioPromedio(itemName) {
        const transacciones = this.historial.filter(v => 
            v.item.name.toLowerCase().includes(itemName.toLowerCase())
        );

        if (transacciones.length === 0) return null;

        const promedio = transacciones.reduce((sum, v) => sum + v.precio, 0) / transacciones.length;
        return Math.floor(promedio);
    }
}

module.exports = new MarketSystem();
