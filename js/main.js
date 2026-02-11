// ===== Navbar =====
const navbar = document.getElementById('navbar');
if (navbar) {
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                navbar.classList.toggle('scrolled', window.scrollY > 60);
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// ===== Mobile Menu =====
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
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

// ===== Counter Animation =====
function animateCounters() {
    document.querySelectorAll('.metric-value[data-count]').forEach(counter => {
        const target = parseInt(counter.dataset.count);
        if (counter.dataset.animated) return;
        counter.dataset.animated = 'true';
        const duration = 2000;
        const start = performance.now();
        function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.floor(target * eased);
            if (progress < 1) requestAnimationFrame(tick);
            else counter.textContent = target;
        }
        requestAnimationFrame(tick);
    });
}

// ===== Scroll Reveal =====
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.classList.contains('hero-metrics') || entry.target.querySelector('.metric-value')) {
                animateCounters();
            }
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .service-card, .project-item, .exp-row, .stack-pill, .hero-metrics').forEach(el => {
    revealObserver.observe(el);
});

// Add reveal class with stagger to service cards
document.querySelectorAll('.service-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
    card.classList.add('reveal');
});
document.querySelectorAll('.stack-pill').forEach((pill, i) => {
    pill.style.transitionDelay = `${i * 0.03}s`;
    pill.classList.add('reveal');
});

// ===== Language Toggle =====
let currentLang = 'en';
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        if (lang === currentLang) return;
        currentLang = lang;
        document.querySelectorAll('.lang-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.lang === lang);
            b.setAttribute('aria-checked', b.dataset.lang === lang);
        });
        document.querySelectorAll(`[data-${lang}]`).forEach(el => {
            const text = el.getAttribute(`data-${lang}`);
            if (!text) return;
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = text;
            } else {
                const span = el.querySelector('span');
                const svg = el.querySelector('svg');
                if ((el.classList.contains('btn-primary') || el.classList.contains('btn-ghost') || el.classList.contains('btn-outline')) && span) {
                    span.textContent = text;
                } else if (!svg || el.childNodes.length === 1) {
                    el.textContent = text;
                } else {
                    for (let node of el.childNodes) {
                        if (node.nodeType === 3 && node.textContent.trim()) {
                            node.textContent = text;
                            break;
                        }
                    }
                }
            }
        });
    });
});

// ===== Active Nav Link =====
const page = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a:not(.nav-cta)').forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
    link.classList.toggle('active', href === page);
});
