// component-init.js — ИСПРАВЛЕНО
// Баг: addEventListener вешался на несуществующую функцию 'initComponents'
// Исправлено: правильное имя 'initComponentsAfterPartials'
// Убрано: попытки создать MapPanel/MapInit — за это отвечает map-search.js

function initComponentsAfterPartials() {
    console.log('[ComponentInit] initializing components after partials...');

    // Translator — создаётся как class instance
    if (typeof Translator !== 'undefined') {
        try {
            window.translatorInstance = new Translator();
            console.log('[ComponentInit] ✅ Translator');
        } catch (e) {
            console.error('[ComponentInit] ❌ Translator:', e);
        }
    }

    // MapSearch — главный модуль карты (инициализирует всё внутри себя)
    // Вызывается из main.js, НЕ здесь, чтобы избежать двойного вызова

    console.log('[ComponentInit] done');
    return true;
}

// ИСПРАВЛЕНО: было 'initComponents' (не существует) → 'initComponentsAfterPartials'
document.addEventListener('partialsLoaded', initComponentsAfterPartials, { once: true });

window.initComponentsAfterPartials = initComponentsAfterPartials;
