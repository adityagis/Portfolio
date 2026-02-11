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

// ===== 3D Rotating Earth Background =====
const earthCanvas = document.getElementById('earthCanvas');
if (earthCanvas) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 2.5; // Closer view for background fill

    const renderer = new THREE.WebGLRenderer({ canvas: earthCanvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const textureLoader = new THREE.TextureLoader();
    const dayTexture = textureLoader.load('https://www.solarsystemscope.com/textures/download/8k_earth_daymap.jpg');
    const nightTexture = textureLoader.load('https://www.solarsystemscope.com/textures/download/8k_earth_nightmap.jpg');

    // Earth sphere
    const earthGeometry = new THREE.SphereGeometry(1, 64, 64);
    const earthMaterial = new THREE.MeshPhongMaterial({
        map: dayTexture,
        shininess: 10,
        emissive: new THREE.Color(0x000000),      // Start with no emission
        emissiveIntensity: 0
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    // Clouds layer (slightly larger sphere)
    const cloudsGeometry = new THREE.SphereGeometry(1.01, 64, 64); // Slightly larger
    const cloudsTexture = textureLoader.load('https://www.solarsystemscope.com/textures/download/8k_earth_clouds.jpg');
    const cloudsMaterial = new THREE.MeshPhongMaterial({
        map: cloudsTexture,
        transparent: true,
        opacity: 0.8
    });
    const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    scene.add(clouds);

    // Lights for colorful pop
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0x4040ff, 0.6); // Blue ambient for atmosphere glow
    scene.add(ambientLight);

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        earth.rotation.y += 0.0005; // Slow rotation (~2 min per full spin)
        clouds.rotation.y += 0.0007; // Clouds rotate slightly faster/different direction
        renderer.render(scene, camera);
    }
    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // ===== Day/Night Toggle =====
    const themeToggle = document.getElementById('themeToggle');
    let isNightMode = false;

    function toggleDayNight() {
        isNightMode = !isNightMode;

        if (isNightMode) {
            // Night mode: show city lights, darker ambient
            earthMaterial.map = nightTexture;          // Switch to night map
            earthMaterial.emissiveMap = nightTexture;  // Glow from lights
            earthMaterial.emissive = new THREE.Color(0x111144); // Slight blue tint to lights
            earthMaterial.emissiveIntensity = 1.2;
            ambientLight.intensity = 0.15;             // Dim ambient
            directionalLight.intensity = 0.4;          // Weaker sun
            themeToggle.classList.add('night');
            themeToggle.querySelector('.toggle-icon').textContent = '🌙';
            themeToggle.querySelector('.toggle-text').textContent = currentLang === 'hi' ? 'डे मोड' : 'Day Mode';
        } else {
            // Day mode: normal colors
            earthMaterial.map = dayTexture;            // Back to day map
            earthMaterial.emissiveMap = null;
            earthMaterial.emissiveIntensity = 0;
            ambientLight.intensity = 0.6;
            directionalLight.intensity = 1.2;
            themeToggle.classList.remove('night');
            themeToggle.querySelector('.toggle-icon').textContent = '☀️';
            themeToggle.querySelector('.toggle-text').textContent = currentLang === 'hi' ? 'नाइट मोड' : 'Night Mode';
        }

        earthMaterial.needsUpdate = true; // Important!
    }

    // Toggle click handler
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleDayNight);
    }

    // Optional: Respect system dark mode preference on load
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        toggleDayNight(); // Start in night if user prefers dark
    }
}
