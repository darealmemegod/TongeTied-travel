// saved-places.js — ИСПРАВЛЕНО
// Баг: window.translations не существует → ошибки при рендере
// Исправлено: заменено на window.t() из translations-loader.js

window.SavedPlaces = {
    KEY: 'saved_places',

    save(place) {
        const saved = this.getAll();
        if (saved.some(p => p.id === place.id)) return false;
        saved.push({ ...place, savedAt: Date.now() });
        localStorage.setItem(this.KEY, JSON.stringify(saved));
        this.updateUI();
        return true;
    },

    // Псевдоним для обратной совместимости с map-search.js
    savePlace(place) {
        return this.save(place);
    },

    remove(placeId) {
        const filtered = this.getAll().filter(p => p.id !== placeId);
        localStorage.setItem(this.KEY, JSON.stringify(filtered));
        this.updateUI();
    },

    clear() {
        localStorage.removeItem(this.KEY);
        this.updateUI();
    },

    getAll() {
        try {
            return JSON.parse(localStorage.getItem(this.KEY) || '[]');
        } catch {
            return [];
        }
    },

    updateUI() {
        const containers = [
            document.getElementById('savedPlacesList'),
            document.getElementById('panelSavedList')
        ];

        const saved = this.getAll();
        const lang = localStorage.getItem('language') || 'ru';

        containers.forEach(container => {
            if (!container) return;

            if (!saved.length) {
                container.innerHTML = '<p class="empty-state" style="padding:12px;color:#888;text-align:center;">Нет сохранённых мест</p>';
                return;
            }

            container.innerHTML = saved.map(place => {
                // ИСПРАВЛЕНО: window.translations → window.t()
                const categoryLabel = window.t?.(`category_${place.category}`) || place.category || '';
                const name = typeof place.name === 'object'
                    ? (place.name[lang] || place.name.en || place.name.ru || '')
                    : (place.name || '');

                return `
                    <div class="saved-place-item" data-id="${place.id}">
                        <div class="place-info">
                            <h4>${name}</h4>
                            ${categoryLabel ? `<p class="place-type">${categoryLabel}</p>` : ''}
                            ${place.address ? `<p class="place-address">${place.address}</p>` : ''}
                        </div>
                        <button class="remove-saved" title="Удалить" aria-label="Удалить место">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
            }).join('');

            container.querySelectorAll('.remove-saved').forEach(btn => {
                btn.addEventListener('click', e => {
                    const id = e.target.closest('.saved-place-item')?.dataset.id;
                    if (id) this.remove(id);
                });
            });
        });
    }
};
