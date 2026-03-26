// map-panel.js — ИСПРАВЛЕНО
// Баг 1: инициализировал карту на DOMContentLoaded, до загрузки партиала с #panelMap → тихий фейл
// Баг 2: переопределяет window.MapPanel, который уже создаётся в map-search.js (initMapPanel)
// Решение: map-search.js создаёт и управляет MapPanel полностью.
//          Этот файл — запасной, используется только если map-search.js НЕ подключён.

(function () {
    // Если map-search.js уже определил MapPanel — ничего не делаем
    if (window.MapSearch) {
        console.log('[map-panel.js] map-search.js handles MapPanel, skipping');
        return;
    }

    // --- Запасная реализация (если map-search.js не используется) ---
    window.MapPanel = window.MapPanel || {
        map: null,
        isOpen: false,
        _ready: false,

        init() {
            // Используем делегирование — элементы могут ещё не существовать
            document.addEventListener('click', (e) => {
                if (e.target.closest('#openMapPanel, .map-open-btn')) this.open();
                if (e.target.closest('#closeMapPanel, #closeAndSave'))  this.close();
            });
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) this.close();
            });
        },

        _initMap() {
            if (this._ready) return;
            const container = document.getElementById('panelMap');
            if (!container) { console.warn('[MapPanel] #panelMap not found'); return; }

            this.map = L.map('panelMap').setView([55.7558, 37.6173], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors', maxZoom: 19
            }).addTo(this.map);

            this._ready = true;
            this._bindControls();
        },

        _bindControls() {
            document.getElementById('panelLocateMe')?.addEventListener('click', () => this.locateUser());
            document.getElementById('panelZoomIn')?.addEventListener('click',    () => this.map?.zoomIn());
            document.getElementById('panelZoomOut')?.addEventListener('click',   () => this.map?.zoomOut());
        },

        open() {
            const panel = document.getElementById('mapPanel');
            if (!panel) return;
            if (!this._ready) this._initMap(); // ленивая инициализация
            panel.style.display = 'flex';
            requestAnimationFrame(() => {
                panel.classList.add('active');
                panel.setAttribute('aria-hidden', 'false');
                this.isOpen = true;
                document.body.style.overflow = 'hidden';
                if (this.map) setTimeout(() => this.map.invalidateSize(), 300);
            });
        },

        close() {
            const panel = document.getElementById('mapPanel');
            if (!panel) return;
            panel.classList.remove('active');
            panel.setAttribute('aria-hidden', 'true');
            this.isOpen = false;
            document.body.style.overflow = '';
            setTimeout(() => { panel.style.display = 'none'; }, 400);
        },

        locateUser() {
            if (!navigator.geolocation || !this.map) return;
            navigator.geolocation.getCurrentPosition(
                ({ coords }) => {
                    this.map.setView([coords.latitude, coords.longitude], 15);
                    L.marker([coords.latitude, coords.longitude])
                        .addTo(this.map).bindPopup('Вы здесь').openPopup();
                },
                (err) => console.error('[MapPanel] geolocation:', err)
            );
        }
    };

    document.addEventListener('partialsLoaded', () => {
        window.MapPanel.init();
    }, { once: true });
})();
