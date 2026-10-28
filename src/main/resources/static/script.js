const toggle = document.getElementById('navtoggle');
const links = document.getElementById('navlinks');
toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
});
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
}));

// Pause the hero background video when it's off-screen (saves battery/CPU on long scrolls)
const heroVideo = document.querySelector('.hero-video');
if (heroVideo) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                heroVideo.play().catch(() => {});
            } else {
                heroVideo.pause();
            }
        });
    }, { threshold: 0.1 });
    observer.observe(heroVideo);
}

// ---- Materials "Details" popup ----
const dialog = document.getElementById('matDialog');
const dImg = document.getElementById('matDialogImg');
const dName = document.getElementById('matDialogName');
const dQty = document.getElementById('matDialogQty');
const dDesc = document.getElementById('matDialogDesc');
const dSpecs = document.getElementById('matDialogSpecs');

document.querySelectorAll('.mat-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
        dImg.src = btn.dataset.img;
        dImg.alt = btn.dataset.name;
        dName.textContent = btn.dataset.name;
        dQty.textContent = btn.dataset.qty;
        dDesc.textContent = btn.dataset.desc;

        dSpecs.innerHTML = '';
        let specs = [];
        try { specs = JSON.parse(btn.dataset.specs || '[]'); } catch (e) { specs = []; }
        specs.forEach(([label, value]) => {
            const row = document.createElement('div');
            row.className = 'mat-spec';
            const l = document.createElement('span');
            l.textContent = label;
            const v = document.createElement('span');
            v.textContent = value;
            row.appendChild(l);
            row.appendChild(v);
            dSpecs.appendChild(row);
        });

        openMatDialog();
    });
});

function openMatDialog(){
    dialog.showModal();
    requestAnimationFrame(() => {
        requestAnimationFrame(() => dialog.classList.add('is-open'));
    });
}

function closeMatDialog(){
    dialog.classList.remove('is-open');
    setTimeout(() => dialog.close(), 180);
}

document.getElementById('matDialogClose').addEventListener('click', closeMatDialog);
dialog.addEventListener('click', (e) => {
    if (e.target === dialog) closeMatDialog();
});
dialog.addEventListener('cancel', (e) => {
    e.preventDefault();
    closeMatDialog();
});

// ---- Scroll reveal ----
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ---- Scroll progress bar (fills as you scroll down the page) ----
const progressBar = document.getElementById('scrollProgress');
function updateScrollProgress(){
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

// ---- Nav bar shrinks/gets more opaque after scrolling past hero ----
const navEl = document.querySelector('nav');
function updateNavState(){
    if (window.scrollY > 40) {
        navEl.classList.add('nav-scrolled');
    } else {
        navEl.classList.remove('nav-scrolled');
    }
}
window.addEventListener('scroll', updateNavState, { passive: true });
updateNavState();

// ---- Simple, keyword-based project FAQ chatbot ----
const projectChat = document.getElementById('projectChat');
if (projectChat) {
    const chatOpen = document.getElementById('projectChatOpen');
    const chatPanel = document.getElementById('projectChatPanel');
    const chatClose = document.getElementById('projectChatClose');
    const chatForm = document.getElementById('projectChatForm');
    const chatInput = document.getElementById('projectChatInput');
    const chatMessages = document.getElementById('projectChatMessages');
    const quickReplies = projectChat.querySelectorAll('[data-chat-question]');

    function addChatMessage(text, sender) {
        const message = document.createElement('div');
        message.className = `project-chat-message is-${sender}`;
        const paragraph = document.createElement('p');
        paragraph.textContent = text;
        message.appendChild(paragraph);
        chatMessages.appendChild(message);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function getProjectAnswer(question) {
        const query = question.toLowerCase();

        if (/\b(hi|hello|hey)\b/.test(query)) {
            return 'Hello! Ask me how the system works, what hardware it uses, or what the Telegram bot reports.';
        }
        if (/telegram|alert|notification|message|bot/.test(query)) {
            return 'The Telegram bot sends status messages such as “Soil is dry! Water pump is turned ON” and “Soil moisture is normal. Water pump is turned OFF.” The website examples are not live readings.';
        }
        if (/how|work|process|flow/.test(query)) {
            return 'The soil-moisture probe checks the soil. The Arduino Uno switches the pump through a relay. The ESP32 uses Wi‑Fi to send the pump-status message to the Telegram bot.';
        }
        if (/control|remote|turn on|turn off|switch/.test(query)) {
            return 'The hardware controls the pump using the soil-moisture condition. This website chatbot only answers project FAQs; it cannot control the pump. Check Telegram for status alerts.';
        }
        if (/dry|wet|normal|moisture|pump|motor|status/.test(query)) {
            return 'When the soil is dry, the system reports that the pump is ON. When soil moisture is normal, it reports that the pump is OFF. Live status is available through the Telegram bot, not this website.';
        }
        if (/component|hardware|material|parts|sensor|arduino|esp32|relay/.test(query)) {
            return 'Main parts: Arduino Uno, ESP32 NodeMCU, YL‑69 soil-moisture sensor, one-channel relay, mini water pump, delivery tube, mini solar panel, 9V batteries, and jumper wires.';
        }
        if (/\bai\b|predict|model/.test(query)) {
            return 'AgriSense AI is the project name. The current prototype flow shown here is soil-moisture-based pump control with Telegram status alerts; this website does not provide AI predictions or live sensor data.';
        }
        return 'I can help with how the system works, its hardware, pump status, and Telegram alerts. Try asking “What Telegram alerts do you send?”';
    }

    function sendProjectQuestion(question) {
        const cleanQuestion = question.trim();
        if (!cleanQuestion) return;
        addChatMessage(cleanQuestion, 'user');
        addChatMessage(getProjectAnswer(cleanQuestion), 'bot');
    }

    chatOpen.addEventListener('click', () => {
        chatPanel.hidden = false;
        chatOpen.setAttribute('aria-expanded', 'true');
        chatInput.focus();
    });

    function closeProjectChat() {
        chatPanel.hidden = true;
        chatOpen.setAttribute('aria-expanded', 'false');
        chatOpen.focus();
    }

    chatClose.addEventListener('click', closeProjectChat);
    chatForm.addEventListener('submit', (event) => {
        event.preventDefault();
        sendProjectQuestion(chatInput.value);
        chatInput.value = '';
        chatInput.focus();
    });

    quickReplies.forEach((button) => {
        button.addEventListener('click', () => sendProjectQuestion(button.dataset.chatQuestion || ''));
    });
}
