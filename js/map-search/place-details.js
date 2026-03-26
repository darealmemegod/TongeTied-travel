// place-details.js — ИСПРАВЛЕНО
// Баг: window.translations не существует → TypeError при показе деталей места
// Исправлено: заменено на window.t()

window.PlaceDetails = {
    currentPlace: null,

    show(place) {
        this.currentPlace = place;
        const lang = localStorage.getItem('language') || 'ru';
        const userLoc = window.MapPanel?.userLocation || window.MapSearch?.userLocation;

        const distance = userLoc
            ? window.MapSearchEngine?.calculateDistance(
                userLoc.lat, userLoc.lng, place.lat, place.lon
              )?.toFixed(1)
            : null;

        const name = typeof place.name === 'object'
            ? (place.name[lang] || place.name.en || place.name.ru || '')
            : (place.name || '');

        // ИСПРАВЛЕНО: window.translations → window.t()
        const categoryLabel = window.t?.(`category_${place.category}`) || place.category || '';

        const html = `
            <div class="place-details-content">
                <h3>${name}</h3>
                <div class="place-meta">
                    <span class="place-category ${place.category || ''}">
                        <i class="fas fa-${this._categoryIcon(place.category)}"></i>
                        ${categoryLabel}
                    </span>
                    ${distance ? `<span class="place-distance"><i class="fas fa-walking"></i> ${distance} км</span>` : ''}
                </div>
                ${place.address ? `
                <div class="place-address">
                    <i class="fas fa-map-marker-alt"></i> ${place.address}
                </div>` : ''}
                <div class="place-actions">
                    <button class="btn-save" id="pdSaveBtn">
                        <i class="fas fa-heart"></i> Сохранить
                    </button>
                    <button class="btn-directions" id="pdDirectionsBtn">
                        <i class="fas fa-directions"></i> Маршрут
                    </button>
                </div>
            </div>
        `;

        // Показываем в обоих возможных контейнерах
        ['mapSidebar', 'panelPlaceDetails'].forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            el.innerHTML = html;
            el.style.display = 'block';
            el.classList.add('active');
        });

        this._bindEvents(place);
    },

    _categoryIcon(category) {
        const icons = {
            hospital: 'hospital', hotel: 'bed', restaurant: 'utensils',
            attraction: 'mountain', pharmacy: 'pills', police: 'shield-alt', embassy: 'flag'
        };
        return icons[category] || 'map-marker';
    },

    _bindEvents(place) {
        document.getElementById('pdSaveBtn')?.addEventListener('click', () => {
            window.SavedPlaces?.save({
                ...place,
                id: place.id || `${place.lat}-${place.lon}-${Date.now()}`
            });
        });
        document.getElementById('pdDirectionsBtn')?.addEventListener('click', () => {
            this.getDirections(place.lat, place.lon);
        });
    },

    // Псевдоним для обратной совместимости
    getDirections(lat, lon) {
        window.open(`https://www.openstreetmap.org/directions?from=&to=${lat},${lon}`, '_blank');
    },

    // Псевдоним для обратной совместимости
    savePlace(lat, lon) {
        if (this.currentPlace) {
            window.SavedPlaces?.save({
                ...this.currentPlace,
                id: `${lat}-${lon}-${Date.now()}`
            });
        }
    }
};
