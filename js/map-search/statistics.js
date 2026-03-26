// map/statistics.js — ИСПРАВЛЕНО
// Баг 1: класс назывался 'Statistics' но в конце был export { MapStatistics } (не существовал)
// Баг 2: export {} в не-модульном скрипте → SyntaxError в браузере
// Решение: переименовал класс в MapStatistics, убрал ES module export

class MapStatistics {
    constructor() {
        this.startTime = Date.now();
        this.userLocation = null;
        this.statistics = {
            totalSearches: 0,
            totalDistance: 0,
            placesSaved: 0,
            routesPlanned: 0,
            timeSpent: 0
        };
        this.updateInterval = null;
        this.init();
    }

    init() {
        this.loadStatistics();
        this.startTime = Date.now();
        this.updateInterval = setInterval(() => this.updateTimeSpent(), 60000);
        console.log('[MapStatistics] initialized');
    }

    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) ** 2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    calculateDistanceToPlace(place) {
        if (!this.userLocation || !place) return null;
        return this.calculateDistance(
            this.userLocation.lat, this.userLocation.lng,
            place.lat, place.lng
        );
    }

    setUserLocation(lat, lng) {
        this.userLocation = { lat, lng };
    }

    addSearch()      { this.statistics.totalSearches++;  this.saveStatistics(); }
    addSavedPlace()  { this.statistics.placesSaved++;    this.saveStatistics(); }
    addRoute()       { this.statistics.routesPlanned++;  this.saveStatistics(); }

    addDistance(km) {
        this.statistics.totalDistance += km;
        this.saveStatistics();
    }

    updateTimeSpent() {
        this.statistics.timeSpent = Math.floor((Date.now() - this.startTime) / 60000);
        this.saveStatistics();
    }

    getStatistics() {
        return {
            ...this.statistics,
            averageDistance: this.statistics.totalSearches > 0
                ? (this.statistics.totalDistance / this.statistics.totalSearches).toFixed(2)
                : 0
        };
    }

    saveStatistics() {
        try {
            localStorage.setItem('mapStatistics', JSON.stringify(this.statistics));
        } catch (e) {
            console.error('[MapStatistics] save error:', e);
        }
    }

    loadStatistics() {
        try {
            const saved = localStorage.getItem('mapStatistics');
            if (saved) this.statistics = { ...this.statistics, ...JSON.parse(saved) };
        } catch (e) {
            console.error('[MapStatistics] load error:', e);
        }
    }

    resetStatistics() {
        this.statistics = { totalSearches: 0, totalDistance: 0, placesSaved: 0, routesPlanned: 0, timeSpent: 0 };
        this.saveStatistics();
    }

    destroy() {
        if (this.updateInterval) clearInterval(this.updateInterval);
    }
}

// ИСПРАВЛЕНО: убран 'export { MapStatistics, initStatistics }' — ломал скрипт в браузере
// Экспортируем через window (обычный браузерный способ)
window.MapStatistics = MapStatistics;

function initMapStatistics() {
    if (!window.mapStatistics) {
        window.mapStatistics = new MapStatistics();
    }
    return window.mapStatistics;
}

window.initMapStatistics = initMapStatistics;
