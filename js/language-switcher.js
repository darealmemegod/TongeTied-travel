// language-switcher.js — ИСПРАВЛЕНО
// Убрано: дублирование объявления changeInterfaceLanguage (теперь только в i18n.js)
// Убрано: дублирование initLanguageSelector (теперь только здесь)
// Убрано: перезагрузка страницы как fallback

function _updateLanguageButton(langCode) {
    const lang = (window.SUPPORTED_LANGUAGES || []).find(l => l.code === langCode);
    if (!lang) return;
    const nameEl = document.getElementById('currentLanguage');
    const flagEl = document.querySelector('.language-btn .language-flag');
    if (nameEl) nameEl.textContent = lang.nativeName;
    if (flagEl) flagEl.textContent = lang.flag;
}

function _populateLanguageDropdown() {
    const dropdown = document.getElementById('languageDropdown');
    if (!dropdown) return;

    const langs = window.SUPPORTED_LANGUAGES || [];
    const current = localStorage.getItem('language') || 'ru';

    dropdown.innerHTML = langs.map(lang => `
        <button class="language-option${lang.code === current ? ' selected' : ''}"
                data-lang="${lang.code}"
                role="menuitem"
                aria-label="${lang.nativeName}">
            <span class="language-flag">${lang.flag}</span>
            <span class="language-name">${lang.nativeName}</span>
            ${lang.code === current ? '<i class="fas fa-check checkmark"></i>' : ''}
        </button>
    `).join('');

    dropdown.querySelectorAll('.language-option').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            const code = btn.dataset.lang;

            // Обновить UI дропдауна
            dropdown.querySelectorAll('.language-option').forEach(b => {
                b.classList.remove('selected');
                b.querySelector('.checkmark')?.remove();
            });
            btn.classList.add('selected');
            btn.insertAdjacentHTML('beforeend', '<i class="fas fa-check checkmark"></i>');

            // Закрыть дропдаун
            dropdown.style.display = 'none';
            document.getElementById('languageBtn')?.setAttribute('aria-expanded', 'false');

            // Обновить кнопку
            _updateLanguageButton(code);

            // Сменить язык
            if (window.changeInterfaceLanguage) {
                await window.changeInterfaceLanguage(code);
            }
        });
    });
}

function initLanguageSwitcher() {
    const btn = document.getElementById('languageBtn');
    const dropdown = document.getElementById('languageDropdown');

    if (!btn || !dropdown) {
        console.warn('[LangSwitcher] elements not found, will retry on partialsLoaded');
        return;
    }
    if (btn.dataset.lsInit) return; // уже инициализирован
    btn.dataset.lsInit = '1';

    _populateLanguageDropdown();
    _updateLanguageButton(localStorage.getItem('language') || 'ru');

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const open = dropdown.style.display === 'block';
        dropdown.style.display = open ? 'none' : 'block';
        btn.setAttribute('aria-expanded', open ? 'false' : 'true');
    });

    document.addEventListener('click', (e) => {
        if (!btn.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = 'none';
            btn.setAttribute('aria-expanded', 'false');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            dropdown.style.display = 'none';
            btn.setAttribute('aria-expanded', 'false');
        }
    });

    console.log('[LangSwitcher] ready');
}

// Запускать после partialsLoaded (элементы загружаются в партиалах)
document.addEventListener('partialsLoaded', () => {
    setTimeout(initLanguageSwitcher, 50);
}, { once: true });

window.initLanguageSwitcher = initLanguageSwitcher;
window.updateLanguageButton = _updateLanguageButton;
