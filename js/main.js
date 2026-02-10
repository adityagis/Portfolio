// ===== Navbar Scroll Effect =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== Mobile Menu Toggle =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        navToggle.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('open');
            navToggle.classList.remove('active');
        }
    });
}

// ===== Counter Animation =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.floor(target * eased);
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    });
}

// ===== Intersection Observer for Animations =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.classList.contains('hero-stats')) {
                animateCounters();
            }
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.fade-in, .overview-card, .hero-stats').forEach(el => {
    observer.observe(el);
});

// ===== Language Toggle =====
let currentLang = 'en';

document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        if (lang === currentLang) return;

        currentLang = lang;
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        document.querySelectorAll('[data-' + lang + ']').forEach(el => {
            const text = el.getAttribute('data-' + lang);
            if (text) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = text;
                } else {
                    // Preserve child elements like SVGs
                    const svg = el.querySelector('svg');
                    const span = el.querySelector('span');
                    if (el.classList.contains('btn') && span) {
                        span.textContent = text;
                    } else if (!svg || el.childNodes.length === 1) {
                        el.textContent = text;
                    } else {
                        // Replace only text nodes
                        for (let node of el.childNodes) {
                            if (node.nodeType === 3 && node.textContent.trim()) {
                                node.textContent = text;
                                break;
                            }
                        }
                    }
                }
            }
        });
    });
});

// ===== Particles Effect =====
const particlesContainer = document.getElementById('particles');
if (particlesContainer) {
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background: rgba(212, 168, 67, ${Math.random() * 0.3 + 0.1});
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: float ${Math.random() * 6 + 4}s ease-in-out infinite;
            animation-delay: ${Math.random() * 4}s;
        `;
        particlesContainer.appendChild(particle);
    }

    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
            25% { transform: translate(${Math.random() * 40 - 20}px, -${Math.random() * 30 + 10}px) scale(1.2); opacity: 0.7; }
            50% { transform: translate(${Math.random() * 40 - 20}px, -${Math.random() * 40 + 20}px) scale(0.8); opacity: 0.5; }
            75% { transform: translate(${Math.random() * 20 - 10}px, -${Math.random() * 20 + 5}px) scale(1.1); opacity: 0.4; }
        }
    `;
    document.head.appendChild(style);
}

// ===== Smooth scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== Active nav link highlight =====
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
    if (href === currentPage) {
        link.classList.add('active');
    } else {
        link.classList.remove('active');
    }
});
