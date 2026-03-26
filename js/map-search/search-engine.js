// search-engine.js — ИСПРАВЛЕНО
// Баг: переменная currentLang не была объявлена в displayPOIs → ReferenceError
// Также: window.translations не существует — заменено на window.t()

window.MapSearchEngine = {
    map: null,
    markersLayer: null,
    currentCategory: null,

    init(mapInstance) {
        this.map = mapInstance;
        this.markersLayer = L.layerGroup().addTo(this.map);
        this.bindEvents();
    },

    bindEvents() {
        document.getElementById('executeSearch')?.addEventListener('click', () => this.search());
        document.getElementById('mapSearchInput')?.addEventListener('keypress', e => {
            if (e.key === 'Enter') this.search();
        });
        document.querySelectorAll('.quick-category').forEach(btn => {
            btn.addEventListener('click', e => {
                this.searchByCategory(e.currentTarget.dataset.category);
            });
        });
        document.getElementById('clearSearch')?.addEventListener('click', () => this.clearSearch());
    },

    async search() {
        const input = document.getElementById('mapSearchInput');
        const query = input?.value.trim();
        if (!query) return;
        const results = await window.MapGeocoder.forward(query);
        this.displayResults(results);
        window.SearchHistory.add(query, results[0]);
    },

    async searchByCategory(category) {
        this.currentCategory = category;
        this.clearMarkers();
        const center = this.map.getCenter();
        const pois = window.POIData.getByCategory(category);
        const filtered = pois.filter(poi =>
            this.calculateDistance(center.lat, center.lng, poi.lat, poi.lon) <= 5000
        );
        this.displayPOIs(filtered);
    },

    displayResults(results) {
        this.clearMarkers();
        results.forEach(result => {
            const marker = L.marker([result.lat, result.lon])
                .addTo(this.markersLayer)
                .bindPopup(`
                    <strong>${result.name}</strong><br>
                    ${result.address.road ? result.address.road + '<br>' : ''}
                    ${result.address.city || ''}
                `);
            marker.on('click', () => window.PlaceDetails?.show(result));
        });
        if (results.length > 0) {
            this.map.setView([results[0].lat, results[0].lon], 15);
        }
    },

    displayPOIs(pois) {
        // ИСПРАВЛЕНО: currentLang не был объявлен → ReferenceError
        const currentLang = localStorage.getItem('language') || 'ru';

        pois.forEach(poi => {
            const icon = this.getIconForCategory(poi.category);
            // ИСПРАВЛЕНО: window.translations не существует → используем window.t()
            const categoryLabel = window.t?.(`category_${poi.category}`) || poi.category;
            const poiName = (typeof poi.name === 'object')
                ? (poi.name[currentLang] || poi.name.en || poi.name.ru || '')
                : (poi.name || '');

            const marker = L.marker([poi.lat, poi.lon], { icon })
                .addTo(this.markersLayer)
                .bindPopup(`<strong>${poiName}</strong><br><em>${categoryLabel}</em>`);
            marker.on('click', () => window.PlaceDetails?.show(poi));
        });
    },

    getIconForCategory(category) {
        const colors = {
            hospital: '#dc2626', hotel: '#2563eb', restaurant: '#059669',
            attraction: '#d97706', pharmacy: '#7c3aed', police: '#4b5563', embassy: '#0284c7'
        };
        return L.divIcon({
            html: `<div style="
                background:${colors[category] || '#666'};width:28px;height:28px;
                border-radius:50%;border:2px solid white;display:flex;
                align-items:center;justify-content:center;font-size:14px;
                box-shadow:0 2px 6px rgba(0,0,0,.3)">
                ${this.getCategoryEmoji(category)}
            </div>`,
            className: 'custom-marker',
            iconSize: [28, 28],
            iconAnchor: [14, 14]
        });
    },

    getCategoryEmoji(category) {
        const map = {
            hospital: '🏥', hotel: '🏨', restaurant: '🍴',
            attraction: '🏛️', pharmacy: '💊', police: '🚔', embassy: '🏢'
        };
        return map[category] || '📍';
    },

    clearMarkers() {
        this.markersLayer?.clearLayers();
    },

    clearSearch() {
        const input = document.getElementById('mapSearchInput');
        if (input) input.value = '';
        this.clearMarkers();
        window.Autocomplete?.hide();
    },

    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
};
