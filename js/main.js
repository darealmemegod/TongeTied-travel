// main.js — ИСПРАВЛЕНО
// Чёткий порядок инициализации, без дублирования

(function () {
    function attachGlobalGuards() {
        window.addEventListener('error', (e) => {
            console.error('[Global error]', e?.error?.message || e?.message, e);
        });

        window.addEventListener('offline', () => {
            if (document.querySelector('.offline-notification')) return;
            const el = document.createElement('div');
            el.className = 'offline-notification';
            el.style.cssText = [
                'position:fixed', 'top:20px', 'right:20px', 'z-index:99999',
                'background:var(--warning,#f59e0b)', 'color:#fff', 'padding:12px 18px',
                'border-radius:var(--radius-lg,8px)', 'box-shadow:var(--shadow-xl)',
                'display:flex', 'gap:10px', 'align-items:center'
            ].join(';');
            el.innerHTML = '<i class="fas fa-wifi-slash"></i><span>Нет подключения к интернету</span>';
            document.body.appendChild(el);
        });

        window.addEventListener('online', () => {
            document.querySelector('.offline-notification')?.remove();
        });
    }

    async function onPartialsLoaded() {
        console.log('[Main] partialsLoaded — starting init sequence');

        // 1. Переводы — сначала, всё остальное может зависеть от них
        try {
            await window.preloadTranslations(['ru', 'en']);
            const lang = localStorage.getItem('language') || 'ru';
            await window.updateInterfaceLanguage(lang);
            console.log('[Main] ✅ translations');
        } catch (e) {
            console.error('[Main] translations error:', e);
        }

        // 2. Доступность
        try {
            window.Accessibility?.init?.();
            console.log('[Main] ✅ accessibility');
        } catch (e) {
            console.error('[Main] accessibility error:', e);
        }

        // 3. Карта (map-search.js — главный модуль, создаёт все карты внутри)
        try {
            window.MapSearch?.init?.();
            console.log('[Main] ✅ map');
        } catch (e) {
            console.error('[Main] map error:', e);
        }

        // 4. Фичи (AI-помощник, PDF, анимации статистики)
        try {
            window.initFeatures?.();
            console.log('[Main] ✅ features');
        } catch (e) {
            console.error('[Main] features error:', e);
        }

        console.log('[Main] init sequence complete');
    }

    function boot() {
        attachGlobalGuards();
        document.addEventListener('partialsLoaded', onPartialsLoaded, { once: true });
        window.IncludeComponents.loadAll();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot, { once: true });
    } else {
        boot();
    }
})();

// Account инициализируется отдельно — не зависит от переводов и карты
document.addEventListener('partialsLoaded', () => {
    window.Account?.init?.();
}, { once: true });
