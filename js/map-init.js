// map-init.js — ИСПРАВЛЕНО
// Баг: создавал L.map('map') одновременно с map-search.js → Leaflet ошибка "Map container is already initialized"
// Решение: map-search.js является главным модулем карты. map-init.js теперь no-op.
// Если нужна отдельная карта без map-search.js — раскомментируй и используй этот файл вместо map-search.js

class MapInit {
    constructor() {
        this.map = null;
        this.isInitialized = false;
    }

    initMainMap() {
        // map-search.js уже инициализирует #map
        // Если map-search.js НЕ используется — раскомментируй тело метода ниже

        if (window.MapSearch) {
            console.log('[MapInit] map-search.js handles map initialization, skipping');
            return;
        }

        // --- Раскомментируй если убрал map-search.js ---
        // if (this.isInitialized) return;
        // const container = document.getElementById('map');
        // if (!container) { console.warn('[MapInit] #map not found'); return; }
        // try {
        //     this.map = L.map('map', { center: [55.7558, 37.6173], zoom: 12, zoomControl: false, preferCanvas: true });
        //     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        //         attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        //         maxZoom: 19
        //     }).addTo(this.map);
        //     this.setupEventListeners();
        //     setTimeout(() => this.map?.invalidateSize(), 200);
        //     this.isInitialized = true;
        // } catch (e) { console.error('[MapInit]', e); }
    }

    setupEventListeners() {
        document.getElementById('locateMe')?.addEventListener('click', () => this.locateUser());
        document.getElementById('zoomIn')?.addEventListener('click',  () => this.map?.zoomIn());
        document.getElementById('zoomOut')?.addEventListener('click', () => this.map?.zoomOut());
    }

    locateUser() {
        if (!navigator.geolocation || !this.map) return;
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                this.map.setView([coords.latitude, coords.longitude], 15);
                L.marker([coords.latitude, coords.longitude])
                    .addTo(this.map).bindPopup('Ваше местоположение').openPopup();
            },
            () => console.warn('[MapInit] geolocation failed')
        );
    }
}

window.mapInit = new MapInit();

// ИСПРАВЛЕНО: убран setTimeout(1000) после DOMContentLoaded — вызывал двойную инициализацию
// Теперь вызывается после partialsLoaded если map-search.js не используется
document.addEventListener('partialsLoaded', () => {
    window.mapInit.initMainMap();
}, { once: true });
