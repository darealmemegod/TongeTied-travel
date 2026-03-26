// ===== ACCESSIBILITY FUNCTIONS =====

(function () {
  window.Accessibility = window.Accessibility || {};

  const A = window.Accessibility;
  A.__initialized = A.__initialized || false;

  function initAccessibility() {
    console.log('🔧 Инициализация доступности...');
    loadAccessibilitySettings();
    initAccessibilityButtons();
    console.log('✅ Доступность инициализирована');
  }

  function loadAccessibilitySettings() {
    try {
      const savedSettings = localStorage.getItem('tongueTiedSettings');
      if (!savedSettings) return;

      const settings = JSON.parse(savedSettings);

      if (settings.theme) {
        document.documentElement.setAttribute('data-theme', settings.theme);
        updateThemeIcon();
      }

      if (settings.fontSize) {
        document.documentElement.setAttribute('data-font-size', settings.fontSize);
      }

      if (settings.contrast === 'high') {
        document.documentElement.setAttribute('data-contrast', 'high');
      }
    } catch (error) {
      console.error('Ошибка загрузки настроек доступности:', error);
    }
  }

  function bindOnce(el, event, handler, key) {
    if (!el) return;
    const k = `__bound_${key}`;
    if (el[k]) return;
    el.addEventListener(event, handler);
    el[k] = true;
  }

  function initAccessibilityButtons() {
    console.log('🔘 Инициализация кнопок доступности...');

    const increaseBtn = document.getElementById('increaseFont');
    bindOnce(increaseBtn, 'click', function () {
      increaseFontSize();
      showTemporaryFeedback(this, '✓');
    }, 'increaseFont');

    const decreaseBtn = document.getElementById('decreaseFont');
    bindOnce(decreaseBtn, 'click', function () {
      decreaseFontSize();
      showTemporaryFeedback(this, '✓');
    }, 'decreaseFont');

    const contrastBtn = document.getElementById('toggleContrast');
    bindOnce(contrastBtn, 'click', function () {
      toggleHighContrast();
      showTemporaryFeedback(this, '◉');
    }, 'toggleContrast');

    const themeBtn = document.getElementById('toggleTheme');
    bindOnce(themeBtn, 'click', function () {
      toggleTheme();
      showTemporaryFeedback(this, '🔄');
    }, 'toggleTheme');
    updateThemeIcon();

    const readBtn = document.getElementById('readPage');
    bindOnce(readBtn, 'click', function () {
      readPageAloud();
      showTemporaryFeedback(this, '🔊');
    }, 'readPage');
  }

  function increaseFontSize() {
    const current = document.documentElement.getAttribute('data-font-size') || 'medium';
    const sizes = ['small', 'medium', 'large', 'xlarge'];
    const i = sizes.indexOf(current);
    if (i < sizes.length - 1) {
      const newSize = sizes[i + 1];
      document.documentElement.setAttribute('data-font-size', newSize);
      saveSetting('fontSize', newSize);
      console.log('Шрифт увеличен до:', newSize);
    }
  }

  function decreaseFontSize() {
    const current = document.documentElement.getAttribute('data-font-size') || 'medium';
    const sizes = ['small', 'medium', 'large', 'xlarge'];
    const i = sizes.indexOf(current);
    if (i > 0) {
      const newSize = sizes[i - 1];
      document.documentElement.setAttribute('data-font-size', newSize);
      saveSetting('fontSize', newSize);
      console.log('Шрифт уменьшен до:', newSize);
    }
  }

  function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    html.setAttribute('data-theme', newTheme);
    saveSetting('theme', newTheme);

    const icon = document.querySelector('#toggleTheme i');
    if (icon) icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

    console.log(`Тема переключена на ${newTheme}`);
  }

  function toggleHighContrast() {
    const html = document.documentElement;
    const isHigh = html.getAttribute('data-contrast') === 'high';

    if (isHigh) {
      html.removeAttribute('data-contrast');
      saveSetting('contrast', null);
    } else {
      html.setAttribute('data-contrast', 'high');
      saveSetting('contrast', 'high');
    }

    console.log(`Контраст ${isHigh ? 'выключен' : 'включён'}`);
  }

  function updateThemeIcon() {
    const themeBtn = document.getElementById('toggleTheme');
    if (!themeBtn) return;

    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const icon = themeBtn.querySelector('i');

    if (icon) {
      if (currentTheme === 'dark') {
        icon.className = 'fas fa-sun';
        themeBtn.setAttribute('title', 'Светлая тема');
      } else {
        icon.className = 'fas fa-moon';
        themeBtn.setAttribute('title', 'Тёмная тема');
      }
    }
  }

  function readPageAloud() {
    if (!('speechSynthesis' in window)) return;

    const title = document.querySelector('h1')?.textContent || '';
    const description = document.querySelector('.hero p')?.textContent || '';
    if (!title && !description) return;

    const utterance = new SpeechSynthesisUtterance(`${title}. ${description}`);
    utterance.lang = 'ru-RU';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
    console.log('Озвучивание страницы...');
  }

  function saveSetting(key, value) {
    try {
      const settings = JSON.parse(localStorage.getItem('tongueTiedSettings') || '{}');
      settings[key] = value;
      localStorage.setItem('tongueTiedSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Ошибка сохранения настройки:', error);
    }
  }

  function showTemporaryFeedback(button, symbol) {
    if (!button) return;
    const originalHTML = button.innerHTML;
    const originalBg = button.style.background;

    button.innerHTML = `<span>${symbol}</span>`;
    button.style.background = '#00C9B7';

    setTimeout(() => {
      button.innerHTML = originalHTML;
      button.style.background = originalBg;
    }, 500);
  }

  A.init = function () {
    if (A.__initialized) {
      console.log('♻️ Accessibility.init already ran, skipping');
      return;
    }
    A.__initialized = true;
    initAccessibility();
  };
})();
