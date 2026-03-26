// i18n.js — ИСПРАВЛЕНО
// Баг 1: переменная `updated` использовалась без объявления → ReferenceError
// Баг 2: дублировала логику из translations-loader.js и language-switcher.js
// Решение: этот файл теперь тонкая обёртка — вся реальная логика в translations-loader.js

if (typeof window.currentInterfaceLanguage === 'undefined') {
    window.currentInterfaceLanguage = localStorage.getItem('language') || 'ru';
}

// Единый список поддерживаемых языков — используется language-switcher.js
window.SUPPORTED_LANGUAGES = window.SUPPORTED_LANGUAGES || [
    { code: 'en', name: 'English',    nativeName: 'English',    flag: '🇬🇧', dir: 'ltr' },
    { code: 'ru', name: 'Russian',    nativeName: 'Русский',    flag: '🇷🇺', dir: 'ltr' },
    { code: 'es', name: 'Spanish',    nativeName: 'Español',    flag: '🇪🇸', dir: 'ltr' },
    { code: 'fr', name: 'French',     nativeName: 'Français',   flag: '🇫🇷', dir: 'ltr' },
    { code: 'it', name: 'Italian',    nativeName: 'Italiano',   flag: '🇮🇹', dir: 'ltr' },
    { code: 'de', name: 'German',     nativeName: 'Deutsch',    flag: '🇩🇪', dir: 'ltr' },
    { code: 'zh', name: 'Chinese',    nativeName: '中文',        flag: '🇨🇳', dir: 'ltr' },
    { code: 'ja', name: 'Japanese',   nativeName: '日本語',      flag: '🇯🇵', dir: 'ltr' },
    { code: 'ko', name: 'Korean',     nativeName: '한국어',      flag: '🇰🇷', dir: 'ltr' },
    { code: 'hi', name: 'Hindi',      nativeName: 'हिन्दी',    flag: '🇮🇳', dir: 'ltr' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português',  flag: '🇵🇹', dir: 'ltr' }
];

// initI18n вызывается из main.js после partialsLoaded
// Делегирует в translations-loader.js (updateInterfaceLanguage там уже правильно реализована)
window.initI18n = async function () {
    const lang = localStorage.getItem('language') || 'ru';
    window.currentInterfaceLanguage = lang;
    if (window.updateInterfaceLanguage) {
        await window.updateInterfaceLanguage(lang);
    }
};

// Получить перевод по ключу (алиас для window.t из translations-loader.js)
window.getTranslation = function (key) {
    return window.t ? window.t(key) : key;
};

// Смена языка — единая точка входа
window.changeInterfaceLanguage = async function (langCode) {
    window.currentInterfaceLanguage = langCode;
    localStorage.setItem('language', langCode);
    if (window.updateInterfaceLanguage) {
        await window.updateInterfaceLanguage(langCode);
    }
    // Обновить MapSearch если активен
    if (window.MapSearch) {
        window.MapSearch.currentLanguage = langCode;
    }
};
