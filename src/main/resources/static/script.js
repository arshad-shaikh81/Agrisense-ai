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