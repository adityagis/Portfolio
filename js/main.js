// ===== 3D Earth Globe with Three.js =====
let scene, camera, renderer, earth, clouds, stars;
let earthDayTexture, earthNightTexture, cloudTexture;
let isNightMode = false;
let animationFrameId;

function initEarth() {
    const canvas = document.getElementById('earthCanvas');
    if (!canvas) return;

    // Scene setup
    scene = new THREE.Scene();
    
    // Camera setup
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 2.5;

    // Renderer setup
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Lighting for day mode
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // Create starfield
    createStarfield();

    // Texture loader
    const textureLoader = new THREE.TextureLoader();

    // Load textures from public CDN sources
    // Using high-quality Earth textures
    const earthDayUrl = 'https://raw.githubusercontent.com/turban/webgl-earth/master/images/2_no_clouds_4k.jpg';
    const earthNightUrl = 'https://raw.githubusercontent.com/turban/webgl-earth/master/images/5_night_4k.jpg';
    const cloudUrl = 'https://raw.githubusercontent.com/turban/webgl-earth/master/images/fair_clouds_4k.png';

    // Load day texture
    textureLoader.load(
        earthDayUrl,
        (texture) => {
            earthDayTexture = texture;
            createEarth();
        },
        undefined,
        (error) => {
            console.warn('Day texture failed, using fallback');
            createEarth(); // Create with basic material
        }
    );

    // Load night texture
    textureLoader.load(
        earthNightUrl,
        (texture) => {
            earthNightTexture = texture;
        },
        undefined,
        (error) => {
            console.warn('Night texture failed');
        }
    );

    // Load cloud texture
    textureLoader.load(
        cloudUrl,
        (texture) => {
            cloudTexture = texture;
            if (earth) createClouds();
        },
        undefined,
        (error) => {
            console.warn('Cloud texture failed');
        }
    );

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
}

function createStarfield() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.7,
        transparent: true,
        opacity: 0.8
    });

    const starsVertices = [];
    for (let i = 0; i < 10000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
}

function createEarth() {
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    
    let material;
    if (earthDayTexture) {
        material = new THREE.MeshPhongMaterial({
            map: earthDayTexture,
            shininess: 5,
            transparent: false
        });
    } else {
        // Fallback material with Earth-like colors
        material = new THREE.MeshPhongMaterial({
            color: 0x2d6a4f,
            shininess: 5,
            transparent: false
        });
    }

    earth = new THREE.Mesh(geometry, material);
    earth.rotation.y = -Math.PI / 2; // Rotate to show better view
    scene.add(earth);

    // Create clouds if texture is already loaded
    if (cloudTexture) createClouds();

    // Start animation
    animate();
}

function createClouds() {
    if (!cloudTexture || clouds) return;
    
    const cloudGeometry = new THREE.SphereGeometry(1.01, 64, 64);
    const cloudMaterial = new THREE.MeshPhongMaterial({
        map: cloudTexture,
        transparent: true,
        opacity: 0.4,
        depthWrite: false
    });

    clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    scene.add(clouds);
}

function animate() {
    animationFrameId = requestAnimationFrame(animate);

    // Slow rotation
    if (earth) {
        earth.rotation.y += 0.001;
    }
    if (clouds) {
        clouds.rotation.y += 0.0012; // Slightly faster than Earth
    }
    if (stars) {
        stars.rotation.y += 0.0001;
    }

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function toggleEarthMode() {
    isNightMode = !isNightMode;
    const toggleBtn = document.getElementById('earthModeToggle');
    const toggleIcon = toggleBtn.querySelector('.toggle-icon');
    const toggleText = toggleBtn.querySelector('.toggle-text');
    
    if (isNightMode) {
        // Switch to night mode
        toggleBtn.classList.add('night-mode');
        toggleIcon.textContent = '🌙';
        
        // Update text based on current language
        const currentLang = document.querySelector('.lang-btn.active').getAttribute('data-lang');
        if (currentLang === 'hi') {
            toggleText.textContent = 'रात मोड';
            toggleText.setAttribute('data-hi', 'रात मोड');
        } else {
            toggleText.textContent = 'Night Mode';
            toggleText.setAttribute('data-en', 'Night Mode');
        }
        
        // Update Earth material to night texture
        if (earth && earthNightTexture) {
            earth.material.map = earthNightTexture;
            earth.material.emissive = new THREE.Color(0x112244);
            earth.material.emissiveIntensity = 0.3;
            earth.material.needsUpdate = true;
        }
        
        // Adjust lighting for night mode
        scene.children.forEach(child => {
            if (child instanceof THREE.AmbientLight) {
                child.intensity = 0.15;
            } else if (child instanceof THREE.DirectionalLight) {
                child.intensity = 0.3;
            }
        });
        
        // Make clouds less visible
        if (clouds) {
            clouds.material.opacity = 0.15;
        }
        
        // Brighten stars
        if (stars) {
            stars.material.opacity = 1;
            stars.material.size = 1;
        }
        
    } else {
        // Switch to day mode
        toggleBtn.classList.remove('night-mode');
        toggleIcon.textContent = '☀️';
        
        // Update text based on current language
        const currentLang = document.querySelector('.lang-btn.active').getAttribute('data-lang');
        if (currentLang === 'hi') {
            toggleText.textContent = 'दिन मोड';
            toggleText.setAttribute('data-hi', 'दिन मोड');
        } else {
            toggleText.textContent = 'Day Mode';
            toggleText.setAttribute('data-en', 'Day Mode');
        }
        
        // Update Earth material to day texture
        if (earth && earthDayTexture) {
            earth.material.map = earthDayTexture;
            earth.material.emissive = new THREE.Color(0x000000);
            earth.material.emissiveIntensity = 0;
            earth.material.needsUpdate = true;
        }
        
        // Restore lighting for day mode
        scene.children.forEach(child => {
            if (child instanceof THREE.AmbientLight) {
                child.intensity = 0.4;
            } else if (child instanceof THREE.DirectionalLight) {
                child.intensity = 1.2;
            }
        });
        
        // Restore cloud visibility
        if (clouds) {
            clouds.material.opacity = 0.4;
        }
        
        // Dim stars
        if (stars) {
            stars.material.opacity = 0.8;
            stars.material.size = 0.7;
        }
    }
}

// Initialize Earth when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initEarth();
    
    // Add event listener to toggle button
    const earthToggle = document.getElementById('earthModeToggle');
    if (earthToggle) {
        earthToggle.addEventListener('click', toggleEarthMode);
    }
});

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
        
        // Update Earth mode toggle text
        updateEarthToggleText();
    });
});

function updateEarthToggleText() {
    const toggleBtn = document.getElementById('earthModeToggle');
    if (!toggleBtn) return;
    
    const toggleText = toggleBtn.querySelector('.toggle-text');
    const currentLang = document.querySelector('.lang-btn.active').getAttribute('data-lang');
    
    if (isNightMode) {
        toggleText.textContent = currentLang === 'hi' ? 'रात मोड' : 'Night Mode';
    } else {
        toggleText.textContent = currentLang === 'hi' ? 'दिन मोड' : 'Day Mode';
    }
}

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
