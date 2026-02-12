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

// ===== ENHANCED VISITOR COUNTER WITH MULTIPLE FALLBACKS =====
(function initVisitorCounter() {
    const counterElement = document.getElementById('totalVisits');
    
    if (!counterElement) {
        console.log('❌ Visitor counter element (#totalVisits) not found in DOM');
        return;
    }

    console.log('✅ Visitor counter element found, initializing...');
    counterElement.textContent = '...';

    // Animated counter function
    function animateCounter(target, duration = 2000) {
        if (!target || target <= 0) {
            console.log('⚠️ Invalid target value:', target);
            counterElement.textContent = '---';
            return;
        }

        console.log('🎬 Starting animation to:', target);
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(target * easeOutCubic);
            
            counterElement.textContent = current.toLocaleString('en-IN');
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counterElement.textContent = target.toLocaleString('en-IN');
                console.log('✅ Animation complete. Final count:', target);
            }
        }

        requestAnimationFrame(updateCounter);
    }

    // Method 1: Try CountAPI (Primary)
    function tryCountAPI() {
        console.log('🔄 Attempting CountAPI...');
        const url = 'https://api.countapi.xyz/hit/adityagis-portfolio/total-visits';
        
        return fetch(url, { 
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache'
        })
        .then(response => {
            console.log('📡 CountAPI Response Status:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('📊 CountAPI Data:', data);
            if (data && typeof data.value === 'number' && data.value > 0) {
                animateCounter(data.value);
                return true;
            }
            throw new Error('Invalid data structure');
        })
        .catch(error => {
            console.log('❌ CountAPI failed:', error.message);
            return false;
        });
    }

    // Method 2: Try GoatCounter (Fallback)
    function tryGoatCounter() {
        console.log('🔄 Attempting GoatCounter...');
        const url = 'https://adityagis.goatcounter.com/counter/' + encodeURIComponent('/') + '.json';
        
        return fetch(url, {
            method: 'GET',
            mode: 'cors'
        })
        .then(response => {
            console.log('📡 GoatCounter Response Status:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('📊 GoatCounter Data:', data);
            if (data && data.count && data.count > 0) {
                animateCounter(data.count);
                return true;
            }
            throw new Error('Invalid data structure');
        })
        .catch(error => {
            console.log('❌ GoatCounter failed:', error.message);
            return false;
        });
    }

    // Method 3: Use localStorage as last resort (for development/testing)
    function useLocalStorageFallback() {
        console.log('🔄 Using localStorage fallback...');
        let count = parseInt(localStorage.getItem('visitor-count') || '0');
        count += 1;
        localStorage.setItem('visitor-count', count.toString());
        animateCounter(count);
        console.log('✅ LocalStorage count:', count);
    }

    // Execute counter with cascade fallback
    async function loadCounter() {
        try {
            // Try CountAPI first
            const countAPISuccess = await tryCountAPI();
            if (countAPISuccess) return;

            // Wait a bit, then try GoatCounter
            console.log('⏳ Waiting 500ms before trying GoatCounter...');
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const goatCounterSuccess = await tryGoatCounter();
            if (goatCounterSuccess) return;

            // If both fail, use localStorage for testing
            console.log('⚠️ All APIs failed, using localStorage fallback');
            useLocalStorageFallback();

        } catch (error) {
            console.error('💥 Critical error in counter initialization:', error);
            counterElement.textContent = '---';
            counterElement.style.opacity = '0.5';
        }
    }

    // Initialize counter
    loadCounter();

    // Auto-refresh every 60 seconds (optional)
    setInterval(() => {
        console.log('🔄 Auto-refreshing counter...');
        tryCountAPI().then(success => {
            if (!success) {
                console.log('⏭️ Skipping auto-refresh, API not available');
            }
        });
    }, 60000); // 60 seconds

})();

// ===== VISITOR COUNTER SCROLL REVEAL =====
const visitorBox = document.querySelector('.visitor-box');
if (visitorBox) {
    visitorBox.classList.add('reveal');
    obs.observe(visitorBox);
}

console.log('✅ Main.js loaded successfully');
