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

// ===== VISITOR COUNTER WITH ANIMATED COUNT-UP =====
(function initVisitorCounter() {
    const counterElement = document.getElementById('totalVisits');
    
    if (!counterElement) {
        console.log('Visitor counter element not found');
        return;
    }

    // Set initial loading state
    counterElement.textContent = '...';

    // Animated counter function with easing
    function animateCounter(target, duration = 2000) {
        let start = 0;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation (ease-out cubic)
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(target * easeOutCubic);
            
            counterElement.textContent = current.toLocaleString('en-IN');
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counterElement.textContent = target.toLocaleString('en-IN');
            }
        }

        requestAnimationFrame(updateCounter);
    }

    // Primary: CountAPI (auto-increment on each visit)
    const countAPIUrl = 'https://api.countapi.xyz/hit/adityagis-portfolio/total-visits';
    
    fetch(countAPIUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`CountAPI HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data && typeof data.value === 'number') {
                animateCounter(data.value);
                console.log('✅ Visitor count loaded from CountAPI:', data.value);
            } else {
                throw new Error('Invalid CountAPI response');
            }
        })
        .catch(error => {
            console.log('⚠️ CountAPI failed, trying GoatCounter...', error.message);
            
            // Fallback: GoatCounter
            const goatCounterUrl = 'https://adityagis.goatcounter.com/counter/' + encodeURIComponent('/') + '.json';
            
            fetch(goatCounterUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`GoatCounter HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data && data.count) {
                        animateCounter(data.count);
                        console.log('✅ Visitor count loaded from GoatCounter:', data.count);
                    } else {
                        throw new Error('Invalid GoatCounter response');
                    }
                })
                .catch(gcError => {
                    console.error('❌ Both counters failed:', gcError.message);
                    counterElement.textContent = '---';
                    counterElement.style.opacity = '0.5';
                });
        });

    // Optional: Auto-refresh counter every 30 seconds (for live tracking effect)
    setInterval(() => {
        fetch('https://api.countapi.xyz/get/adityagis-portfolio/total-visits')
            .then(res => res.json())
            .then(data => {
                if (data && data.value) {
                    const currentCount = parseInt(counterElement.textContent.replace(/,/g, '')) || 0;
                    if (data.value > currentCount) {
                        animateCounter(data.value, 1000); // Faster animation for refresh
                    }
                }
            })
            .catch(err => console.log('Counter refresh skipped:', err.message));
    }, 30000); // 30 seconds

})();

// ===== VISITOR COUNTER SCROLL REVEAL =====
// Add visitor box to scroll reveal observer
const visitorBox = document.querySelector('.visitor-box');
if (visitorBox) {
    visitorBox.classList.add('reveal');
    obs.observe(visitorBox);
}
