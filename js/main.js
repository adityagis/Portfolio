// Navbar scroll
const navbar = document.getElementById('navbar');
if (navbar) {
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) { requestAnimationFrame(() => { navbar.classList.toggle('scrolled', window.scrollY > 60); ticking = false; }); ticking = true; }
    }, { passive: true });
}

// Mobile menu
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', isOpen);
    });
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
    navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
    }));
}

// Counter animation
function animateCounters() {
    document.querySelectorAll('.stat-num[data-count]').forEach(c => {
        if (c.dataset.animated) return;
        c.dataset.animated = '1';
        const target = +c.dataset.count, dur = 2000, start = performance.now();
        (function tick(now) {
            const p = Math.min((now - start) / dur, 1);
            c.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3)));
            if (p < 1) requestAnimationFrame(tick); else c.textContent = target;
        })(start);
    });
}

// Scroll reveal
const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); if (e.target.querySelector('.stat-num') || e.target.classList.contains('hero-stats')) animateCounters(); }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal, .svc-card, .feat-card, .exp-row, .hero-stats').forEach(el => obs.observe(el));
document.querySelectorAll('.svc-card').forEach((c, i) => { c.style.transitionDelay = `${i * 0.1}s`; c.classList.add('reveal'); });
document.querySelectorAll('.stack-pills span').forEach((p, i) => { p.style.transitionDelay = `${i * 0.03}s`; p.classList.add('reveal'); obs.observe(p); });

// Language toggle
let lang = 'en';
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const l = btn.dataset.lang;
        if (l === lang) return;
        lang = l;
        document.querySelectorAll('.lang-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.lang === l);
            b.setAttribute('aria-checked', b.dataset.lang === l);
        });
        document.querySelectorAll(`[data-${l}]`).forEach(el => {
            const t = el.getAttribute(`data-${l}`);
            if (!t) return;
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') { el.placeholder = t; return; }
            const span = el.querySelector('span'), svg = el.querySelector('svg');
            if (el.classList.contains('btn') && span) { span.textContent = t; }
            else if (!svg || el.childNodes.length === 1) { el.textContent = t; }
            else { for (let n of el.childNodes) { if (n.nodeType === 3 && n.textContent.trim()) { n.textContent = t; break; } } }
        });
    });
});

// Active nav
const pg = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a:not(.nav-cta-link)').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href').split('/').pop() === pg);
});
