// features.js — ИСПРАВЛЕНО
// Убрано: дублирующий обработчик .map-open-btn (map-search.js уже обрабатывает)
// Убрано: alert() в качестве заглушек
// Исправлено: aiInput.disabled = false чтобы поле ввода работало
// Исправлено: animateCounter теперь вызывает window.animateCounter из utils.js

// ── ИИ-помощник ──────────────────────────────────────────────────────────────
function initAIAssistant() {
    const tryDemoBtn = document.querySelector('.ai-try-btn');
    const startAIBtn = document.querySelector('.ai-start-btn');
    const aiSendBtn  = document.querySelector('.ai-send-btn');
    const aiInput    = document.querySelector('.ai-input input');

    const demoQuestions = [
        'Как сказать "Где ближайшая аптека?" на испанском?',
        'Как вежливо отказаться от дополнительных услуг в отеле?',
        'Как спросить "Это блюдо содержит орехи?" на японском?',
        'Как объяснить аллергию на морепродукты в ресторане?',
        'Как попросить помощи при потере багажа в аэропорту?'
    ];

    // Разблокируем поле ввода
    if (aiInput) aiInput.disabled = false;

    tryDemoBtn?.addEventListener('click', () => {
        const q = demoQuestions[Math.floor(Math.random() * demoQuestions.length)];
        _addAIMessage(q, 'user');
        setTimeout(() => _generateAIResponse(q), 1000);
    });

    startAIBtn?.addEventListener('click', () => {
        aiInput?.focus();
        document.querySelector('.ai-interface')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    if (aiSendBtn && aiInput) {
        aiSendBtn.addEventListener('click', _sendAIMessage);
        aiInput.addEventListener('keypress', e => { if (e.key === 'Enter') _sendAIMessage(); });
    }

    function _sendAIMessage() {
        const text = aiInput.value.trim();
        if (!text) return;
        _addAIMessage(text, 'user');
        aiInput.value = '';
        setTimeout(() => _generateAIResponse(text), 1200);
    }

    function _addAIMessage(text, sender) {
        const chat = document.querySelector('.ai-chat');
        if (!chat) return;
        const div = document.createElement('div');
        div.className = `ai-message ${sender === 'user' ? 'user' : 'incoming'}`;
        div.innerHTML = `<div class="message-text">${text}</div>`;
        chat.appendChild(div);
        chat.scrollTop = chat.scrollHeight;
        if (sender === 'user') window.announceToScreenReader?.(`Вы: ${text}`);
    }

    function _generateAIResponse(q) {
        const lower = q.toLowerCase();
        let r;
        if      (lower.includes('аптек'))   r = '🇪🇸 "¿Dónde está la farmacia más cercana?" — произнесите медленно, с улыбкой.';
        else if (lower.includes('отел') || lower.includes('услуг')) r = '"No, gracias" (Но, грасьяс) — вежливый отказ в испаноязычных странах.';
        else if (lower.includes('орех'))    r = '🇯🇵 "この料理にナッツは入っていますか？" (Ко-но рёри ни наттцу ва хайттэ имасу ка?) — спросить про орехи в блюде.';
        else if (lower.includes('аллерги') || lower.includes('морепрод')) r = 'Покажите карточку аллергий — это надёжнее слов. Скачайте её в разделе "Визуальные карточки".';
        else if (lower.includes('багаж'))   r = '"I lost my luggage" + покажите номер рейса. Ищите стойку Lost & Found в аэропорту.';
        else if (lower.includes('скидк'))   r = '🇹🇷 "Biraz indirim yapabilir misiniz?" (Бираз индирим япабилир мисиниз?) — можете сделать скидку?';
        else r = 'Хороший вопрос! Используйте раздел "Переводчик" — введите фразу и получите перевод с произношением.';

        _addAIMessage(r, 'incoming');
        window.announceToScreenReader?.(`Помощник: ${r.substring(0, 80)}`);
    }
}

// ── PDF карточки ──────────────────────────────────────────────────────────────
function initPDFDownloads() {
    document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.dataset.pdf || 'card.pdf';
            const orig = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Подготовка…</span>';
            btn.disabled = true;
            setTimeout(() => {
                // TODO: заменить на реальное скачивание когда PDF файлы будут готовы
                console.log(`[PDF] download requested: ${name}`);
                btn.innerHTML = '<i class="fas fa-check"></i> <span>Готово</span>';
                setTimeout(() => {
                    btn.innerHTML = orig;
                    btn.disabled = false;
                }, 1500);
            }, 600);
        });
    });
}

// ── Анимация статистики ────────────────────────────────────────────────────────
function initStatsAnimation() {
    const section = document.getElementById('stats');
    if (!section) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            setTimeout(() => window.animateCounter?.('stat1', 72, '%'), 200);
            setTimeout(() => window.animateCounter?.('stat2', 3,  'x'), 600);
            setTimeout(() => window.animateCounter?.('stat3', 58, '%'), 1000);
            setTimeout(() => window.animateTimeStat?.('stat4', 2.5, 'ч'), 1400);
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.5 });

    observer.observe(section);
}

// ── Главная точка входа ───────────────────────────────────────────────────────
function initFeatures() {
    initStatsAnimation();
    initAIAssistant();
    initPDFDownloads();
    console.log('[Features] ✅ initialized');
}

window.initFeatures = initFeatures;

// ИСПРАВЛЕНО: убран дублирующий partialsLoaded обработчик для .map-open-btn
// (map-search.js сам вешает этот обработчик внутри себя)
// ИСПРАВЛЕНО: убран DOMContentLoaded → инициализация теперь через main.js после partialsLoaded
