// Инициализация карты - простая версия без ES6 импортов
class MapInit {
    constructor() {
        this.map = null;
        this.searchEngine = null;
        this.isInitialized = false;
        console.log('🗺️ MapInit создан');
    }

    // Инициализация основной карты
    initMainMap() {
        if (this.isInitialized) return;
        
        console.log('🔄 Инициализация основной карты...');
        
        try {
            // Создаем карту
            this.map = L.map('map', {
                center: [55.7558, 37.6173], // Москва
                zoom: 12,
                zoomControl: false,
                attributionControl: true,
                preferCanvas: true
            });

            // Добавляем тайлы OpenStreetMap
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19
            }).addTo(this.map);

            // Инициализируем поисковый движок
            this.initSearchEngine();

            // Добавляем тестовые маркеры
            this.addSampleMarkers();

            // Настраиваем обработчики событий
            this.setupEventListeners();

            // Обновляем размер карты
            setTimeout(() => {
                if (this.map) {
                    this.map.invalidateSize();
                }
            }, 100);

            this.isInitialized = true;
            console.log('✅ Карта инициализирована');

        } catch (error) {
            console.error('❌ Ошибка инициализации карты:', error);
        }
    }

    // Инициализация поискового движка
    initSearchEngine() {
        if (window.MapSearchEngine) {
            this.searchEngine = new MapSearchEngine(this.map);
            console.log('✅ Поисковый движок инициализирован');
        } else {
            console.warn('⚠️ MapSearchEngine не найден');
        }
    }

    // Добавление тестовых маркеров
    addSampleMarkers() {
        if (!this.map) return;

        // Тестовые данные
        const samplePlaces = [
            {
                name: 'Красная площадь',
                lat: 55.7539,
                lng: 37.6208,
                type: 'attraction'
            },
            {
                name: 'ГУМ',
                lat: 55.7547,
                lng: 37.6215,
                type: 'shopping'
            },
            {
                name: 'Отель Москва',
                lat: 55.7552,
                lng: 37.6179,
                type: 'hotel'
            }
        ];

        samplePlaces.forEach(place => {
            const marker = L.marker([place.lat, place.lng])
                .addTo(this.map)
                .bindPopup(`<b>${place.name}</b><br>${place.type}`)
                .on('click', () => {
                    this.showPlaceDetails(place);
                });
        });

        console.log('✅ Тестовые маркеры добавлены');
    }

    // Настройка обработчиков событий
    setupEventListeners() {
        // Геолокация
        document.getElementById('locateMe')?.addEventListener('click', () => {
            this.locateUser();
        });

        // Зум
        document.getElementById('zoomIn')?.addEventListener('click', () => {
            if (this.map) this.map.zoomIn();
        });

        document.getElementById('zoomOut')?.addEventListener('click', () => {
            if (this.map) this.map.zoomOut();
        });

        // Переключение слоев
        document.getElementById('toggleLayers')?.addEventListener('click', () => {
            this.toggleLayers();
        });

        console.log('✅ Обработчики событий настроены');
    }

    // Геолокация пользователя
    locateUser() {
        if (!navigator.geolocation) {
            alert('Геолокация не поддерживается вашим браузером');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                if (this.map) {
                    this.map.setView([latitude, longitude], 15);
                    
                    // Добавляем маркер пользователя
                    L.marker([latitude, longitude])
                        .addTo(this.map)
                        .bindPopup('Ваше местоположение')
                        .openPopup();
                }
            },
            (error) => {
                console.error('Ошибка геолокации:', error);
                alert('Не удалось определить местоположение');
            }
        );
    }

    // Переключение слоев
    toggleLayers() {
        // Базовая реализация - можно расширить
        alert('Функция переключения слоев в разработке');
    }

    // Показать детали места
    showPlaceDetails(place) {
        const sidebar = document.getElementById('mapSidebar');
        if (!sidebar) return;

        const content = `
            <div class="place-details">
                <h3>${place.name}</h3>
                <p>Тип: ${place.type}</p>
                <p>Координаты: ${place.lat.toFixed(6)}, ${place.lng.toFixed(6)}</p>
                <button class="btn-primary" onclick="mapInit.saveToFavorites(${JSON.stringify(place)})">
                    <i class="fas fa-heart"></i> Сохранить
                </button>
            </div>
        `;

        sidebar.innerHTML = content;
        sidebar.classList.add('active');
    }

    // Сохранение в избранное
    saveToFavorites(place) {
        try {
            const favorites = JSON.parse(localStorage.getItem('mapFavorites') || '[]');
            favorites.push({
                ...place,
                savedAt: new Date().toISOString()
            });
            localStorage.setItem('mapFavorites', JSON.stringify(favorites));
            alert(`"${place.name}" сохранен в избранное`);
        } catch (error) {
            console.error('Ошибка сохранения:', error);
        }
    }

    // Открыть панель карты
    openMapPanel() {
        if (window.mapPanel) {
            window.mapPanel.open();
        }
    }
}

// Глобальный экземпляр
window.mapInit = new MapInit();

// Автоматическая инициализация
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.mapInit.initMainMap();
        console.log('✅ MapInit готов');
    }, 1000);
});