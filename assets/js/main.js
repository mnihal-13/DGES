const lenis = new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    smooth: true,
    smoothTouch: false
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

gsap.registerPlugin(ScrollTrigger);

// ==========================================================
//   .gs-fade-up     → fade in + slide up
//   .gs-fade-down   → fade in + slide down
//   .gs-fade-left   → fade in + slide from left
//   .gs-fade-right  → fade in + slide from right
//   .gs-scale-up    → fade in + scale up from 0.9
//   .gs-reveal      → simple fade in
//   .gs-stagger     → staggered entrance (children animate in sequence)
//
// Optional data attributes:
//   data-delay="0.3"     → custom delay (seconds)
//   data-duration="1.2"  → custom duration (seconds)
//   data-start="top 90%" → custom ScrollTrigger start
// ==========================================================
(function initEntranceAnimations() {
    // Animation presets: [fromVars]
    const presets = {
        'gs-fade-up': { y: 50, opacity: 0 },
        'gs-fade-down': { y: -50, opacity: 0 },
        'gs-fade-left': { x: -60, opacity: 0 },
        'gs-fade-right': { x: 60, opacity: 0 },
        'gs-scale-up': { scale: 0.9, opacity: 0 },
        'gs-reveal-up': { y: 60, opacity: 0 },
    };

    // Single-element animations
    Object.entries(presets).forEach(([className, fromVars]) => {
        gsap.utils.toArray('.' + className).forEach(el => {
            gsap.from(el, {
                ...fromVars,
                duration: parseFloat(el.dataset.duration) || 1,
                delay: parseFloat(el.dataset.delay) || 0,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: el.dataset.start || 'top 85%',
                    once: true,
                }
            });
        });
    });

    // Staggered group animations — children of .gs-stagger animate in sequence
    gsap.utils.toArray('.gs-stagger').forEach(container => {
        const children = container.children;
        if (!children.length) return;
        gsap.from(children, {
            y: 40,
            opacity: 0,
            duration: parseFloat(container.dataset.duration) || 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: container,
                start: container.dataset.start || 'top 85%',
                once: true,
            }
        });
    });
})();

// --- 2. Liquid Background Orbit Animation ---
gsap.to(".blob-1", { x: "15vw", y: "10vh", duration: 15, repeat: -1, yoyo: true, ease: "sine.inOut" });
gsap.to(".blob-2", { x: "-15vw", y: "-10vh", duration: 18, repeat: -1, yoyo: true, ease: "sine.inOut" });
gsap.to(".blob-3", { x: "10vw", y: "-15vh", duration: 22, repeat: -1, yoyo: true, ease: "sine.inOut" });

// --- 3. Hero Load & Parallax Animations ---
gsap.from(".hero-anim", {
    y: 50,
    opacity: 0,
    duration: 1.2,
    stagger: 0.2,
    ease: "power3.out",
    delay: 0.2
});

gsap.from(".floating-img", {
    y: 100,
    opacity: 0,
    duration: 1.5,
    stagger: 0.15,
    ease: "power4.out"
});

const floatingImages = document.querySelectorAll(".floating-img");
floatingImages.forEach(img => {
    const speed = img.getAttribute("data-speed");
    gsap.to(img, {
        y: () => (window.innerHeight * speed),
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });
});

// --- 4. The Stunning Horizontal Scroll Effect ---
const container = document.querySelector(".horizontal-container");
const panels = gsap.utils.toArray(".panel");

if (container && panels.length) {
    let scrollTween = gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: "none",
        scrollTrigger: {
            trigger: ".horizontal-section",
            pin: true,
            scrub: 1,
            end: () => "+=" + (container.offsetWidth - window.innerWidth)
        }
    });

    // --- 5. Inner Image Parallax (While scrolling horizontally) ---
    gsap.utils.toArray(".horiz-img").forEach((img, i) => {
        gsap.fromTo(img,
            { x: "-20%" },
            {
                x: "20%",
                ease: "none",
                scrollTrigger: {
                    trigger: ".horizontal-section",
                    start: "top top",
                    end: () => "+=" + (container.offsetWidth - window.innerWidth),
                    scrub: true
                }
            }
        );
    });
} // end horizontal scroll guard


// --- Premium About Section Animations ---

// 1. The Glass Card "Breathe In" effect
gsap.to(".about-glass-card", {
    scrollTrigger: {
        trigger: ".premium-about",
        start: "top 80%",
        end: "top 20%",
        scrub: 1 // Ties the scaling of the card directly to the user's scroll speed
    },
    scale: 1,
    opacity: 1,
    ease: "power2.out"
});

// 2. Text Reveal Stagger
gsap.from(".about-anim-text", {
    scrollTrigger: {
        trigger: ".premium-about",
        start: "top 60%",
        toggleActions: "play none none reverse"
    },
    y: 50,
    opacity: 0,
    duration: 1.2,
    stagger: 0.15,
    ease: "power3.out"
});

// 3. Cluster Images Entrance
gsap.from(".cluster-anim", {
    scrollTrigger: {
        trigger: ".about-visual-cluster",
        start: "top 70%"
    },
    scale: 0.8,
    opacity: 0,
    y: 50,
    duration: 1.5,
    stagger: 0.2,
    ease: "expo.out"
});

// 4. Scroll Parallax for the Cluster Images
const clusterElements = document.querySelectorAll(".cluster-img, .rotating-blueprint");
clusterElements.forEach(el => {
    const speed = el.getAttribute("data-speed");
    gsap.to(el, {
        y: () => (window.innerHeight * speed),
        ease: "none",
        scrollTrigger: {
            trigger: ".premium-about",
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });
});


// 2. Interactive Dashboard Auto-Play & Hover Logic
const whyItems = document.querySelectorAll('.why-item');
const vizImages = document.querySelectorAll('.viz-img');

let currentIndex = 0;
let progressTween;
let isHovering = false;
let hasStarted = false; // Prevents auto-play before scrolling into view

// Function to transition to the next slide automatically
function goToNext() {
    if (isHovering) return;
    currentIndex = (currentIndex + 1) % whyItems.length;
    playItem(currentIndex);
}

// Core function to activate an item and start its timer
function playItem(index) {
    // Reset all states
    whyItems.forEach(i => i.classList.remove('active'));
    vizImages.forEach(img => img.classList.remove('active'));
    gsap.set('.progress-fill', { strokeDashoffset: 138.2 }); // Reset all progress rings

    if (progressTween) progressTween.kill(); // Stop any running animations

    // Activate the new target
    const item = whyItems[index];
    item.classList.add('active');
    document.getElementById(item.getAttribute('data-target')).classList.add('active');

    // If user isn't actively hovering, animate the progress ring over 3.5 seconds
    if (!isHovering) {
        progressTween = gsap.to(item.querySelector('.progress-fill'), {
            strokeDashoffset: 0,
            duration: 3.5,
            ease: "none",
            onComplete: goToNext // Move to next item when 3.5s is up
        });
    } else {
        // If they are hovering, just fill the ring instantly to show it's active
        gsap.set(item.querySelector('.progress-fill'), { strokeDashoffset: 0 });
    }
}

// Add mouse events for manual overrides
whyItems.forEach((item, i) => {
    item.addEventListener('mouseenter', () => {
        isHovering = true;
        currentIndex = i; // Update index to what they hovered
        playItem(currentIndex); // Play the hovered item
    });

    item.addEventListener('mouseleave', () => {
        isHovering = false;
        // Restart the 3-second timer for the current item when mouse leaves
        playItem(currentIndex);
    });
});

// Trigger the auto-play loop ONLY when the section comes into view
ScrollTrigger.create({
    trigger: ".why-section",
    start: "top 60%", // Starts when the section is 60% down the screen
    onEnter: () => {
        if (!hasStarted) {
            hasStarted = true;
            playItem(0); // Kick off the loop
        }
    }
});

// --- Industries Accordion Hover Logic ---
const accPanels = document.querySelectorAll('.acc-panel');

accPanels.forEach(panel => {
    // Use mouseenter for smooth desktop experience
    panel.addEventListener('mouseenter', () => {
        // Remove active class from all panels
        accPanels.forEach(p => p.classList.remove('active'));
        // Add active class to the hovered panel
        panel.classList.add('active');
    });

    // Fallback for mobile touch
    panel.addEventListener('click', () => {
        accPanels.forEach(p => p.classList.remove('active'));
        panel.classList.add('active');
    });
});

// Optional: Add GSAP scroll parallax to the images inside the accordion
gsap.utils.toArray(".acc-bg-img").forEach(img => {
    gsap.to(img, {
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
            trigger: ".glass-accordion",
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });
});


class GridSnake {
    constructor(overlay) {
        this.overlay = overlay;
        this.gridSize = 100;
        this.color = Math.random() > 0.5 ? "rgba(243, 145, 31, 0.4)" : "rgba(0, 168, 255, 0.4)";
        this.speed = 120; // pixels per second (slowed down)

        this.reset();
        this.moveNext();
    }

    reset() {
        const rect = this.overlay.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;

        const maxCols = Math.max(1, Math.floor(this.width / this.gridSize));
        const maxRows = Math.max(1, Math.floor(this.height / this.gridSize));

        this.x = Math.floor(Math.random() * maxCols) * this.gridSize;
        this.y = Math.floor(Math.random() * maxRows) * this.gridSize;

        this.dir = Math.floor(Math.random() * 4);

        this.pathCount = 0;
    }

    moveNext() {
        // Stop if it runs for too long or goes completely offscreen
        if (this.pathCount > 15 || this.x < 0 || this.x > this.width || this.y < 0 || this.y > this.height) {
            this.reset();
            this.moveNext();
            return;
        }

        // 30% chance to turn 90 degrees left or right at an intersection
        if (Math.random() < 0.3) {
            this.dir = (this.dir + (Math.random() > 0.5 ? 1 : 3)) % 4;
        }

        // Move forward between 1 and 3 grid blocks
        const blocks = Math.floor(Math.random() * 3) + 1;
        const distance = blocks * this.gridSize;

        let dx = 0, dy = 0;
        if (this.dir === 0) dy = -distance;
        if (this.dir === 1) dx = distance;
        if (this.dir === 2) dy = distance;
        if (this.dir === 3) dx = -distance;

        const endX = this.x + dx;
        const endY = this.y + dy;
        const duration = distance / this.speed;

        const segment = document.createElement('div');
        segment.className = 'snake-segment';

        // Create the gradient tail depending on the direction of travel
        let bgGradient = '';
        if (this.dir === 0) bgGradient = `linear-gradient(to bottom, ${this.color}, transparent)`;
        else if (this.dir === 1) bgGradient = `linear-gradient(to left, ${this.color}, transparent)`;
        else if (this.dir === 2) bgGradient = `linear-gradient(to top, ${this.color}, transparent)`;
        else if (this.dir === 3) bgGradient = `linear-gradient(to right, ${this.color}, transparent)`;

        segment.style.background = bgGradient;
        segment.style.boxShadow = `0 0 8px ${this.color}`;

        this.overlay.appendChild(segment);

        // Setup initial dimensions and animate based on direction
        if (this.dir === 0) { // Up
            segment.style.left = `${this.x}px`;
            segment.style.bottom = `${this.height - this.y}px`;
            segment.style.width = '2px';
            segment.style.height = '0px';
            segment.style.transform = 'translate(-50%, 0)';
            gsap.to(segment, { height: distance, duration: duration, ease: "none" });
        } else if (this.dir === 1) { // Right
            segment.style.left = `${this.x}px`;
            segment.style.top = `${this.y}px`;
            segment.style.height = '2px';
            segment.style.width = '0px';
            segment.style.transform = 'translate(0, -50%)';
            gsap.to(segment, { width: distance, duration: duration, ease: "none" });
        } else if (this.dir === 2) { // Down
            segment.style.left = `${this.x}px`;
            segment.style.top = `${this.y}px`;
            segment.style.width = '2px';
            segment.style.height = '0px';
            segment.style.transform = 'translate(-50%, 0)';
            gsap.to(segment, { height: distance, duration: duration, ease: "none" });
        } else if (this.dir === 3) { // Left
            segment.style.right = `${this.width - this.x}px`;
            segment.style.top = `${this.y}px`;
            segment.style.height = '2px';
            segment.style.width = '0px';
            segment.style.transform = 'translate(0, -50%)';
            gsap.to(segment, { width: distance, duration: duration, ease: "none" });
        }

        // Move synchronously using a delayed call
        gsap.delayedCall(duration, () => {
            this.x = endX;
            this.y = endY;
            this.pathCount++;

            // Slowly fade out the segment body we left behind
            gsap.to(segment, { opacity: 0, duration: 1.5, ease: "power2.out", onComplete: () => segment.remove() });

            // Pick a new movement
            this.moveNext();
        });
    }
}

function initGridGlows() {
    const gridOverlay = document.querySelector('.grid-overlay');
    if (!gridOverlay) return;

    // Reset overlay elements
    gridOverlay.innerHTML = '';

    // Spawn 3 distinct paths
    for (let i = 0; i < 3; i++) {
        setTimeout(() => new GridSnake(gridOverlay), i * 1800);
    }
}

// Start the animation
initGridGlows();

// Reset appropriately to new boundaries on window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(initGridGlows, 1000);
});

// --- 3D INTERACTIVE WEBGL GLOBE (Three.js) ---

const globeContainer = document.getElementById('globe-canvas-container');
if (globeContainer) {

    // 1. Setup Scene, Camera, Renderer
    const globeScene = new THREE.Scene();
    const globeCamera = new THREE.PerspectiveCamera(45, globeContainer.offsetWidth / globeContainer.offsetHeight, 1, 1000);
    globeCamera.position.z = 300;

    const globeRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    globeRenderer.setSize(globeContainer.offsetWidth, globeContainer.offsetHeight);
    globeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    globeContainer.appendChild(globeRenderer.domElement);

    // 2. Add OrbitControls for user interaction
    const controls = new THREE.OrbitControls(globeCamera, globeRenderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false; // Disable zoom to keep layout clean
    controls.enablePan = false;
    // Restrict rotation so they don't look at it upside down
    controls.minPolarAngle = Math.PI / 3;
    controls.maxPolarAngle = Math.PI / 1.5;

    // 3. Create the High-Tech Earth Globe
    const earthGroup = new THREE.Group();
    globeScene.add(earthGroup);

    const globeRadius = 100;
    const sphereGeo = new THREE.SphereGeometry(globeRadius, 64, 64);

    // --- Animated Procedural Earth Texture ---
    const earthCanvas = document.createElement('canvas');
    earthCanvas.width = 1024;
    earthCanvas.height = 512;
    const earthCtx = earthCanvas.getContext('2d');

    function toXY(lat, lng) {
        return [
            ((lng + 180) / 360) * earthCanvas.width,
            ((90 - lat) / 180) * earthCanvas.height
        ];
    }

    // All continent coordinate data
    const continents = [
        { color: '#1a6b8a', coords: [[60, -140], [64, -168], [70, -162], [72, -157], [71, -156], [65, -141], [61, -138], [60, -147], [58, -152], [57, -157], [55, -162], [52, -170], [56, -168], [58, -162], [60, -148], [70, -140], [72, -130], [72, -100], [72, -80], [70, -60], [65, -64], [60, -64], [55, -58], [50, -56], [47, -53], [46, -61], [44, -64], [42, -70], [40, -74], [38, -76], [35, -76], [32, -81], [30, -84], [29, -89], [29, -95], [26, -97], [25, -97], [22, -98], [20, -105], [18, -105], [16, -96], [16, -89], [18, -88], [21, -87], [21, -90], [25, -90], [28, -96], [30, -108], [32, -114], [33, -117], [35, -120], [38, -122], [40, -124], [43, -124], [46, -124], [49, -126], [52, -128], [54, -131], [57, -136], [60, -140]] },
        { color: '#1a6b8a', coords: [[18, -105], [16, -96], [16, -89], [14, -87], [12, -84], [10, -84], [9, -79], [8, -77], [10, -83], [12, -86], [14, -90], [16, -96], [18, -105]] },
        { color: '#1a6b8a', coords: [[12, -72], [12, -68], [10, -62], [7, -60], [5, -54], [2, -50], [0, -50], [-2, -44], [-5, -35], [-8, -35], [-12, -38], [-15, -39], [-18, -40], [-22, -41], [-25, -47], [-28, -49], [-32, -52], [-34, -54], [-38, -58], [-40, -62], [-42, -64], [-46, -66], [-48, -66], [-52, -69], [-55, -67], [-56, -70], [-54, -72], [-52, -74], [-48, -74], [-44, -72], [-40, -72], [-38, -73], [-34, -72], [-30, -71], [-24, -70], [-18, -71], [-16, -75], [-12, -77], [-8, -78], [-5, -80], [-2, -80], [0, -78], [4, -77], [8, -77], [10, -74], [12, -72]] },
        { color: '#1a6b8a', coords: [[71, -24], [70, -22], [65, -18], [63, -20], [62, -7], [58, -6], [56, -3], [51, 1], [50, -5], [48, -5], [44, -8], [43, -9], [37, -9], [36, -6], [36, -2], [38, 0], [39, -0.5], [42, 3], [43, 3], [44, 1], [44, 8], [46, 6], [47, 7], [47, 13], [45, 12], [41, 12], [39, 16], [38, 16], [40, 18], [41, 17], [44, 15], [45, 14], [46, 14], [47, 16], [48, 17], [50, 20], [52, 21], [54, 19], [55, 14], [56, 10], [57, 12], [59, 18], [60, 20], [62, 17], [63, 20], [66, 26], [68, 28], [70, 26], [71, 28], [71, -24]] },
        { color: '#2196a8', coords: [[71, 26], [70, 30], [68, 28], [64, 22], [62, 18], [60, 18], [58, 16], [57, 12], [56, 14], [60, 25], [63, 15], [64, 14], [66, 14], [68, 16], [70, 19], [71, 26]] },
        { color: '#1a6b8a', coords: [[37, -5], [37, 10], [35, 12], [33, 12], [32, 25], [31, 32], [30, 33], [27, 34], [23, 36], [20, 38], [15, 42], [12, 44], [10, 45], [8, 43], [5, 42], [2, 42], [0, 42], [-2, 41], [-5, 40], [-8, 39], [-10, 40], [-15, 38], [-18, 36], [-22, 35], [-26, 33], [-30, 30], [-33, 28], [-34, 26], [-34, 22], [-34, 18], [-32, 17], [-28, 16], [-24, 14], [-18, 12], [-13, 12], [-10, 14], [-6, 12], [-2, 10], [2, 10], [4, 7], [5, 1], [5, -3], [7, -6], [10, -10], [14, -14], [17, -16], [21, -17], [24, -17], [28, -14], [32, -9], [35, -5], [37, -5]] },
        { color: '#1e8fa8', coords: [[35, 75], [33, 72], [30, 70], [28, 69], [24, 69], [23, 68], [21, 68], [20, 73], [18, 73], [16, 74], [15, 75], [14, 77], [12, 78], [10, 78], [8, 77], [8, 79], [10, 80], [12, 80], [13, 80], [16, 81], [18, 83], [20, 86], [21, 87], [22, 89], [24, 89], [26, 90], [27, 89], [28, 88], [27, 85], [26, 83], [28, 78], [30, 77], [32, 76], [35, 75]] },
        { color: '#2196a8', coords: [[30, 35], [28, 36], [24, 38], [20, 42], [16, 43], [13, 45], [12, 51], [15, 52], [18, 54], [22, 55], [24, 56], [26, 56], [27, 50], [30, 48], [30, 40], [30, 35]] },
        { color: '#2196a8', coords: [[55, 130], [52, 132], [48, 135], [45, 138], [44, 142], [42, 140], [40, 130], [38, 122], [36, 118], [34, 116], [32, 120], [30, 122], [28, 118], [25, 115], [22, 110], [21, 108], [18, 108], [16, 108], [13, 109], [10, 106], [8, 105], [3, 103], [1, 103], [1, 99], [4, 98], [10, 98], [15, 100], [22, 100], [22, 97], [22, 93], [25, 90], [26, 90], [27, 89], [28, 88], [30, 88], [35, 80], [37, 72], [40, 60], [42, 52], [38, 45], [35, 42], [40, 42], [42, 50], [46, 53], [48, 55], [50, 58], [52, 60], [55, 70], [58, 70], [60, 75], [62, 80], [64, 90], [68, 100], [70, 110], [70, 130], [65, 140], [60, 145], [55, 142], [55, 130]] },
        { color: '#1a6b8a', coords: [[6, 95], [5, 98], [2, 99], [-1, 100], [-3, 104], [-6, 106], [-8, 110], [-8, 114], [-7, 112], [-5, 106], [-2, 104], [0, 101], [2, 99], [4, 96], [6, 95]] },
        { color: '#1a6b8a', coords: [[-11, 131], [-12, 136], [-14, 141], [-17, 145], [-19, 146], [-22, 149], [-25, 152], [-28, 153], [-30, 153], [-33, 151], [-35, 150], [-38, 146], [-39, 144], [-38, 141], [-37, 140], [-35, 137], [-34, 136], [-32, 133], [-31, 128], [-32, 121], [-33, 115], [-30, 114], [-26, 113], [-23, 114], [-21, 116], [-18, 122], [-16, 128], [-14, 130], [-11, 131]] },
        { color: '#2196a8', coords: [[45, 142], [43, 145], [40, 140], [36, 137], [34, 132], [33, 131], [34, 130], [35, 133], [37, 136], [40, 140], [43, 143], [45, 142]] },
        { color: '#2196a8', coords: [[58, -6], [57, -6], [55, -5], [53, -3], [51, 0], [51, 1], [52, 2], [54, 0], [56, -2], [58, -3], [58, -6]] },
        { color: '#2196a8', coords: [[84, -35], [83, -18], [80, -16], [77, -18], [74, -20], [70, -22], [68, -30], [66, -38], [65, -45], [68, -52], [72, -55], [76, -60], [80, -55], [82, -45], [84, -35]] }
    ];

    // Calculate path perimeter for dash animation
    function getPerimeter(coords) {
        let len = 0;
        for (let i = 1; i < coords.length; i++) {
            const [x1, y1] = toXY(coords[i - 1][0], coords[i - 1][1]);
            const [x2, y2] = toXY(coords[i][0], coords[i][1]);
            len += Math.hypot(x2 - x1, y2 - y1);
        }
        const [x1, y1] = toXY(coords[coords.length - 1][0], coords[coords.length - 1][1]);
        const [x2, y2] = toXY(coords[0][0], coords[0][1]);
        len += Math.hypot(x2 - x1, y2 - y1);
        return len;
    }

    // Draw earth with animation progress (0→1)
    const globeAnimState = { progress: 0 };

    function drawEarth(progress) {
        earthCtx.clearRect(0, 0, earthCanvas.width, earthCanvas.height);

        continents.forEach(function (c, idx) {
            var staggerDelay = idx * 0.04;
            var localProgress = Math.max(0, Math.min(1, (progress - staggerDelay) / (1 - staggerDelay * 0.5)));
            if (localProgress <= 0) return;

            var coords = c.coords;
            var perimeter = getPerimeter(coords);

            // Build path
            earthCtx.beginPath();
            var start = toXY(coords[0][0], coords[0][1]);
            earthCtx.moveTo(start[0], start[1]);
            for (var i = 1; i < coords.length; i++) {
                var pt = toXY(coords[i][0], coords[i][1]);
                earthCtx.lineTo(pt[0], pt[1]);
            }
            earthCtx.closePath();

            // Fill (fades in)
            earthCtx.globalAlpha = Math.min(1, localProgress * 1.5) * 0.7;
            earthCtx.fillStyle = c.color;
            earthCtx.fill();
            earthCtx.globalAlpha = 1;

            // Animated glowing stroke with dash
            var visibleLen = perimeter * Math.min(1, localProgress);
            earthCtx.setLineDash([visibleLen, perimeter]);
            earthCtx.lineDashOffset = 0;

            // Outer glow
            earthCtx.shadowColor = '#4dd2ff';
            earthCtx.shadowBlur = 4 + localProgress * 10;
            earthCtx.strokeStyle = '#4dd2ff';
            earthCtx.lineWidth = 2.5;
            earthCtx.stroke();

            // Inner bright core
            earthCtx.shadowBlur = 0;
            earthCtx.strokeStyle = 'rgba(180, 240, 255, ' + (0.6 * localProgress) + ')';
            earthCtx.lineWidth = 1;
            earthCtx.stroke();

            earthCtx.setLineDash([]);
            earthCtx.shadowBlur = 0;
        });
    }

    drawEarth(0);

    // Create texture sphere
    const earthTexture = new THREE.CanvasTexture(earthCanvas);
    const texGeo = new THREE.SphereGeometry(globeRadius, 64, 64);
    const texMat = new THREE.MeshBasicMaterial({
        map: earthTexture,
        transparent: true,
        depthWrite: false,
        side: THREE.FrontSide
    });
    const texSphere = new THREE.Mesh(texGeo, texMat);
    texSphere.renderOrder = 0;
    earthGroup.add(texSphere);

    // Layer 2: Wireframe overlay
    const wireMat = new THREE.MeshBasicMaterial({
        color: 0x003057,
        wireframe: true,
        transparent: true,
        opacity: 0.15,
        depthWrite: false
    });
    const wireGeo = new THREE.SphereGeometry(globeRadius * 1.002, 64, 64);
    const wireSphere = new THREE.Mesh(wireGeo, wireMat);
    wireSphere.renderOrder = 1;
    earthGroup.add(wireSphere);

    // 4. Mathematics: Convert Latitude / Longitude to 3D Vector
    function latLongToVector3(lat, lon, radius) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);

        const x = -(radius * Math.sin(phi) * Math.cos(theta));
        const z = (radius * Math.sin(phi) * Math.sin(theta));
        const y = (radius * Math.cos(phi));

        return new THREE.Vector3(x, y, z);
    }

    // Define Locations (Approximate Lat/Lon)
    const locations = {
        india: latLongToVector3(20, 78, globeRadius),
        europe: latLongToVector3(50, 10, globeRadius),
        middleEast: latLongToVector3(25, 45, globeRadius),
        africa: latLongToVector3(0, 20, globeRadius),
        americas: latLongToVector3(40, -100, globeRadius),
        seAsia: latLongToVector3(10, 105, globeRadius)
    };

    // 5. Draw Arcs from India to the World
    const arcMaterial = new THREE.LineBasicMaterial({ color: 0xF3911F, transparent: true, opacity: 0.6 });

    function createArc(startVector, endVector) {
        // Find distance to determine arc height
        const distance = startVector.distanceTo(endVector);

        // Find midpoint
        const midPoint = new THREE.Vector3().addVectors(startVector, endVector).multiplyScalar(0.5);
        // Push midpoint out to create an arc
        midPoint.normalize().multiplyScalar(globeRadius + distance * 0.3);

        // Create quadratic bezier curve
        const curve = new THREE.QuadraticBezierCurve3(startVector, midPoint, endVector);
        const points = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        const arcLine = new THREE.Line(geometry, arcMaterial);
        earthGroup.add(arcLine);
    }

    createArc(locations.india, locations.europe);
    createArc(locations.india, locations.middleEast);
    createArc(locations.india, locations.africa);
    createArc(locations.india, locations.americas);
    createArc(locations.india, locations.seAsia);

    // Add Glowing Dots at target locations
    const dotGeo = new THREE.SphereGeometry(2, 16, 16);
    const dotMat = new THREE.MeshBasicMaterial({ color: 0xF3911F });

    Object.values(locations).forEach(vec => {
        const dot = new THREE.Mesh(dotGeo, dotMat);
        dot.position.copy(vec);
        earthGroup.add(dot);
    });

    // 6. Sync HTML UI Labels with 3D Globe Coordinates
    const htmlLabels = [
        { id: 'label-india', pos: locations.india },
        { id: 'label-eu', pos: locations.europe },
        { id: 'label-me', pos: locations.middleEast },
        { id: 'label-af', pos: locations.africa },
        { id: 'label-am', pos: locations.americas },
        { id: 'label-sa', pos: locations.seAsia }
    ];

    function updateLabels() {
        const halfWidth = globeContainer.offsetWidth / 2;
        const halfHeight = globeContainer.offsetHeight / 2;

        htmlLabels.forEach(label => {
            const element = document.getElementById(label.id);
            if (!element) return;

            // Get the point's world position
            const worldPos = label.pos.clone();
            worldPos.applyMatrix4(earthGroup.matrixWorld);

            // Calculate surface normal in world space (for a sphere centered at origin, normal = normalized position)
            const normal = worldPos.clone().normalize();

            // Camera direction: from surface point toward camera
            const cameraDir = globeCamera.position.clone().sub(worldPos).normalize();

            // Dot product: positive = facing camera, negative = facing away
            const dotProduct = normal.dot(cameraDir);

            // Project to 2D screen space
            const projected = worldPos.clone().project(globeCamera);
            const x = (projected.x * halfWidth) + halfWidth;
            const y = -(projected.y * halfHeight) + halfHeight;

            // Smooth fade: fully visible when dot > 0.2, fully hidden when dot < 0
            if (dotProduct < 0.05) {
                element.style.opacity = 0;
                element.style.pointerEvents = 'none';
            } else {
                const fadeOpacity = Math.min(1, (dotProduct - 0.05) / 0.2);
                element.style.opacity = fadeOpacity;
                element.style.pointerEvents = 'auto';
                element.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
            }
        });
    }

    // Set initial rotation so India is visible
    earthGroup.rotation.y = -Math.PI / 1.5;
    earthGroup.rotation.x = Math.PI / 12;

    // 7. Animation Loop
    function animateGlobe() {
        requestAnimationFrame(animateGlobe);

        // Auto-rotate slowly
        earthGroup.rotation.y += 0.001;

        // Redraw canvas texture each frame for animation
        drawEarth(globeAnimState.progress);
        earthTexture.needsUpdate = true;

        controls.update(); // Required for damping
        updateLabels(); // Pin the HTML tags to the rotating 3D sphere

        globeRenderer.render(globeScene, globeCamera);
    }

    animateGlobe();

    // Scroll-triggered continent draw-in animation
    gsap.to(globeAnimState, {
        progress: 1,
        duration: 2.5,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".global-matrix-section",
            start: "top 70%",
            toggleActions: "play none none none"
        }
    });

    // Handle Resize
    window.addEventListener('resize', () => {
        if (!globeContainer) return;
        const width = globeContainer.offsetWidth;
        const height = globeContainer.offsetHeight;
        globeCamera.aspect = width / height;
        globeCamera.updateProjectionMatrix();
        globeRenderer.setSize(width, height);
    });

    // --- Final CTA Section Animations ---
    // (gs-scale-up entrance now handled by reusable animation system)

    // Globe Section Entrance
    gsap.from(".global-glass-container", {
        scrollTrigger: {
            trigger: ".global-matrix-section",
            start: "top 80%"
        },
        scale: 0.95,
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: "back.out(1.5)"
    });

    // 2. Subtle Pulse for the Energy Blob behind the CTA
    gsap.to(".cta-energy-blob", {
        scale: 1.1,
        opacity: 0.8,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

} // end globe guard

// --- LIVE 3D BLUEPRINT FOOTER (Three.js) ---
// Wait for dynamically loaded footer component
document.addEventListener('components-loaded', function () {

    const canvasContainer = document.getElementById('footer-canvas');
    if (!canvasContainer) return;

    // Scene Setup
    const scene = new THREE.Scene();
    // Add a soft fog to make the grid fade out beautifully into the background
    scene.fog = new THREE.FogExp2(0xf8f9fa, 0.0015);

    // Camera Setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 800, 0.1, 1000);
    camera.position.set(0, 30, 100);
    camera.lookAt(0, 0, 0);

    // Renderer Setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, canvasContainer.offsetHeight || 800);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    canvasContainer.appendChild(renderer.domElement);

    // Create the Wireframe Terrain (The "Live Grid")
    // Width, Height, WidthSegments, HeightSegments
    const geometry = new THREE.PlaneGeometry(400, 200, 60, 30);

    // Rotate flat to act as a floor
    geometry.rotateX(-Math.PI / 2);

    // The Material: Navy Blue wireframe with some opacity
    const material = new THREE.MeshBasicMaterial({
        color: 0x003057, // DGES Navy Blue
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });

    const terrain = new THREE.Mesh(geometry, material);
    scene.add(terrain);

    // Store original vertices for animation math
    const positions = geometry.attributes.position;
    const initialZ = []; // ThreeJS Plane geometry Y-up becomes Z when rotated
    for (let i = 0; i < positions.count; i++) {
        initialZ.push(positions.getY(i));
    }

    // Animation Loop Variables
    const clock = new THREE.Clock();
    let mouseX = 0;
    let mouseY = 0;

    // Track Mouse to distort the grid
    canvasContainer.addEventListener('mousemove', (e) => {
        // Normalize mouse coordinates from -1 to 1
        const rect = canvasContainer.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    });

    function animateTerrain() {
        requestAnimationFrame(animateTerrain);

        const time = clock.getElapsedTime();

        // Animate the vertices to create a flowing energy wave
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const z = positions.getZ(i);

            // Complex sine wave math for a technical fluid look
            const wave1 = Math.sin(x * 0.05 + time * 0.5) * 3;
            const wave2 = Math.cos(z * 0.05 + time * 0.3) * 3;

            // Add mouse interaction: gentle pull towards mouse X
            const mouseInfluence = Math.sin((x * 0.01) + (mouseX * 5)) * 2;

            // Apply to the Y axis (height)
            positions.setY(i, wave1 + wave2 + mouseInfluence);
        }

        // Tell ThreeJS the vertices have updated
        geometry.attributes.position.needsUpdate = true;

        // Slowly rotate the camera based on mouse for a premium 3D parallax feel
        camera.position.x += (mouseX * 20 - camera.position.x) * 0.05;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    }

    animateTerrain();

    // Handle Resize
    window.addEventListener('resize', () => {
        const height = canvasContainer.offsetHeight || 800;
        camera.aspect = window.innerWidth / height;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, height);
    });

    // Footer GSAP Reveals (re-scan for dynamically loaded elements)
    // These load async after the reusable system runs, so we need to manually init them
    gsap.utils.toArray('.dges-footer .gs-fade-up').forEach(elem => {
        if (elem._gsapInit) return; // Skip if already animated
        elem._gsapInit = true;
        gsap.from(elem, {
            scrollTrigger: {
                trigger: elem,
                start: "top 90%",
                once: true,
            },
            y: 50,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out"
        });
    });

}); // end components-loaded

// ---  Breadcrumb Entrance ---

// --- Edge-to-Edge Hero Entrance Animations ---
gsap.from(".gs-reveal", {
    x: -50, /* Slides in from the left */
    opacity: 0,
    duration: 1.2,
    stagger: 0.2,
    ease: "power3.out",
    delay: 0.2 // Wait for navbar
});

// Parallax fading on scroll
gsap.to(".hero-content-wrapper", {
    y: 50,
    opacity: 0,
    ease: "none",
    scrollTrigger: {
        trigger: ".edge-to-edge-hero",
        start: "top top",
        end: "bottom top",
        scrub: true
    }
});

// (gs-reveal-up / gs-fade-up entrances now handled by reusable animation system)

// --- Counter Animation ---
const statNumbers = document.querySelectorAll('.stat-number[data-target]');
if (statNumbers.length) {
    ScrollTrigger.create({
        trigger: '.wwd-stats-bar',
        start: 'top 85%',
        once: true,
        onEnter: () => {
            statNumbers.forEach(el => {
                const target = parseInt(el.getAttribute('data-target'));
                const suffix = el.getAttribute('data-suffix') || '';
                const duration = 2000;
                const start = performance.now();

                function step(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out cubic
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = Math.round(eased * target);
                    el.textContent = current + suffix;
                    if (progress < 1) requestAnimationFrame(step);
                }
                requestAnimationFrame(step);
            });
        }
    });
}

// --- 2. Enhanced 3D Globe Network (Three.js) ---
const plexusContainer = document.getElementById('plexus-canvas-container');

if (plexusContainer) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, plexusContainer.offsetWidth / plexusContainer.offsetHeight, 1, 1000);
    camera.position.z = 280;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(plexusContainer.offsetWidth, plexusContainer.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    plexusContainer.appendChild(renderer.domElement);

    const networkGroup = new THREE.Group();
    scene.add(networkGroup);

    const globeRadius = 90;

    // --- Wireframe Globe Rings (Latitude + Longitude) ---
    const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x003057,
        wireframe: true,
        transparent: true,
        opacity: 0.12
    });

    // Latitude rings (horizontal)
    [-30, 0, 30].forEach(lat => {
        const latRad = (lat * Math.PI) / 180;
        const r = globeRadius * Math.cos(latRad);
        const ringGeo = new THREE.RingGeometry(r - 0.3, r + 0.3, 64);
        const ring = new THREE.Mesh(ringGeo, ringMaterial);
        ring.position.y = globeRadius * Math.sin(latRad);
        ring.rotation.x = Math.PI / 2;
        networkGroup.add(ring);
    });

    // Longitude rings (vertical)
    [0, 60, 120].forEach(lon => {
        const lonRad = (lon * Math.PI) / 180;
        const ringGeo = new THREE.RingGeometry(globeRadius - 0.3, globeRadius + 0.3, 64);
        const ring = new THREE.Mesh(ringGeo, ringMaterial);
        ring.rotation.y = lonRad;
        networkGroup.add(ring);
    });

    // --- Earth Blueprint (Continent Outlines) ---
    function latLonToVec3(lat, lon, r) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        return new THREE.Vector3(
            -r * Math.sin(phi) * Math.cos(theta),
            r * Math.cos(phi),
            r * Math.sin(phi) * Math.sin(theta)
        );
    }

    const continents = {
        // Africa
        africa: [
            [37, -10], [36, 0], [33, 10], [30, 32], [25, 35], [20, 37], [15, 40], [10, 42],
            [5, 40], [0, 42], [-5, 40], [-10, 35], [-15, 30], [-20, 25], [-25, 28],
            [-30, 28], [-35, 20], [-34, 18], [-30, 17], [-25, 15], [-20, 12], [-15, 12],
            [-10, 14], [-5, 12], [0, 10], [5, 5], [5, 0], [10, -10], [15, -17], [20, -17],
            [25, -13], [30, -10], [35, -5], [37, -10]
        ],
        // Europe
        europe: [
            [36, -5], [38, 0], [40, 0], [42, 3], [43, 5], [45, 7], [44, 12], [46, 15],
            [48, 17], [50, 14], [52, 5], [53, 7], [54, 10], [56, 12], [58, 10], [60, 5],
            [62, 5], [64, 10], [68, 15], [70, 20], [70, 28], [68, 30], [65, 25], [60, 30],
            [56, 25], [55, 20], [52, 20], [50, 20], [48, 24], [46, 22], [44, 28], [42, 25],
            [40, 24], [38, 24], [36, 22], [38, 15], [36, 10], [38, 5], [36, -5]
        ],
        // Asia (simplified)
        asia: [
            [42, 30], [45, 40], [50, 45], [55, 50], [60, 55], [65, 60], [68, 70], [70, 80],
            [72, 100], [70, 120], [65, 130], [60, 135], [55, 140], [50, 140], [45, 135],
            [40, 130], [35, 120], [30, 120], [25, 110], [20, 100], [15, 100], [10, 105],
            [5, 100], [0, 105], [-5, 105], [-8, 110], [-5, 115], [0, 120], [5, 115],
            [10, 110], [5, 103], [10, 99], [15, 100], [20, 95], [25, 90], [30, 80],
            [25, 65], [30, 60], [25, 55], [30, 48], [35, 45], [40, 40], [42, 30]
        ],
        // North America (simplified)
        northAmerica: [
            [50, -130], [55, -130], [60, -140], [65, -165], [70, -165], [72, -160],
            [70, -155], [65, -140], [60, -135], [55, -125], [50, -125], [48, -122],
            [45, -125], [40, -124], [35, -120], [30, -117], [25, -110], [20, -105],
            [15, -92], [15, -87], [18, -88], [20, -87], [22, -80], [25, -80],
            [28, -82], [30, -85], [30, -88], [28, -90], [30, -90], [35, -90],
            [40, -85], [42, -82], [45, -75], [48, -68], [50, -65], [55, -60],
            [60, -65], [60, -75], [55, -80], [50, -90], [48, -95], [50, -100],
            [55, -110], [58, -120], [55, -130], [50, -130]
        ],
        // South America (simplified)
        southAmerica: [
            [10, -75], [5, -77], [0, -80], [-5, -80], [-10, -77], [-15, -75],
            [-20, -70], [-25, -65], [-30, -60], [-35, -57], [-40, -62], [-45, -65],
            [-50, -70], [-55, -68], [-55, -65], [-52, -70], [-48, -73], [-43, -65],
            [-38, -56], [-35, -53], [-30, -50], [-25, -47], [-20, -40], [-15, -38],
            [-10, -35], [-5, -35], [0, -50], [5, -60], [10, -70], [12, -72], [10, -75]
        ],
        // Australia
        australia: [
            [-12, 130], [-15, 125], [-20, 118], [-25, 114], [-30, 115], [-33, 118],
            [-35, 120], [-37, 140], [-38, 145], [-38, 148], [-35, 150], [-30, 153],
            [-25, 152], [-20, 148], [-15, 145], [-12, 142], [-12, 135], [-12, 130]
        ]
    };

    const continentMaterial = new THREE.LineBasicMaterial({
        color: 0x4a90d9,
        transparent: true,
        opacity: 0.45
    });

    // Filled continent material
    const continentFillMaterial = new THREE.MeshBasicMaterial({
        color: 0x4a90d9,
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide,
        depthWrite: false
    });

    Object.values(continents).forEach(coords => {
        // Outline
        const points = coords.map(([lat, lon]) => latLonToVec3(lat, lon, globeRadius - 1));
        const cGeo = new THREE.BufferGeometry().setFromPoints(points);
        const cLine = new THREE.Line(cGeo, continentMaterial);
        networkGroup.add(cLine);

        // Fill — create a Shape in 2D (lon, lat), then project vertices onto sphere
        const shape = new THREE.Shape();
        shape.moveTo(coords[0][1], coords[0][0]); // lon as x, lat as y
        for (let i = 1; i < coords.length; i++) {
            shape.lineTo(coords[i][1], coords[i][0]);
        }
        shape.closePath();

        const shapeGeo = new THREE.ShapeGeometry(shape, 4);
        const posArr = shapeGeo.attributes.position.array;
        for (let i = 0; i < posArr.length; i += 3) {
            const lon = posArr[i];
            const lat = posArr[i + 1];
            const v = latLonToVec3(lat, lon, globeRadius - 1.5);
            posArr[i] = v.x;
            posArr[i + 1] = v.y;
            posArr[i + 2] = v.z;
        }
        shapeGeo.attributes.position.needsUpdate = true;
        shapeGeo.computeVertexNormals();

        const fillMesh = new THREE.Mesh(shapeGeo, continentFillMaterial);
        networkGroup.add(fillMesh);
    });

    // --- Plexus Nodes on Sphere Surface ---
    const particleCount = 180;
    const positions = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3); // Store rest positions
    const vectors = [];

    for (let i = 0; i < particleCount; i++) {
        const phi = Math.acos(-1 + (2 * i) / particleCount);
        const theta = Math.sqrt(particleCount * Math.PI) * phi;

        const x = globeRadius * Math.cos(theta) * Math.sin(phi);
        const y = globeRadius * Math.sin(theta) * Math.sin(phi);
        const z = globeRadius * Math.cos(phi);

        const noise = (Math.random() - 0.5) * 8;
        positions[i * 3] = x + noise;
        positions[i * 3 + 1] = y + noise;
        positions[i * 3 + 2] = z + noise;
        originalPositions[i * 3] = positions[i * 3];
        originalPositions[i * 3 + 1] = positions[i * 3 + 1];
        originalPositions[i * 3 + 2] = positions[i * 3 + 2];
        vectors.push(new THREE.Vector3(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]));
    }

    // Nodes
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
        color: 0xF3911F,
        size: 3,
        transparent: true,
        opacity: 0.85
    });
    const particles = new THREE.Points(geometry, material);
    networkGroup.add(particles);

    // Dynamic Connecting Lines (rebuilt every frame)
    const maxLineSegments = particleCount * 10;
    const linePositions = new Float32Array(maxLineSegments * 6);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x003057,
        transparent: true,
        opacity: 0.15
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    networkGroup.add(lines);

    // Outer glow sphere
    const glowGeo = new THREE.SphereGeometry(globeRadius + 2, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
        color: 0x003057,
        transparent: true,
        opacity: 0.03,
        wireframe: true
    });
    networkGroup.add(new THREE.Mesh(glowGeo, glowMat));

    // Cursor highlight sphere (follows mouse on globe surface)
    const cursorGeo = new THREE.SphereGeometry(3, 16, 16);
    const cursorMat = new THREE.MeshBasicMaterial({
        color: 0xF3911F,
        transparent: true,
        opacity: 0
    });
    const cursorSphere = new THREE.Mesh(cursorGeo, cursorMat);
    networkGroup.add(cursorSphere);

    // Tilt for natural globe angle
    networkGroup.rotation.x = 0.3;
    networkGroup.rotation.z = -0.15;

    // Raycaster for mouse-particle interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(9999, 9999);
    let isHovering = false;
    const hitSphere = new THREE.Mesh(
        new THREE.SphereGeometry(globeRadius + 10, 32, 32),
        new THREE.MeshBasicMaterial({ visible: false })
    );
    networkGroup.add(hitSphere);

    plexusContainer.addEventListener('mousemove', (e) => {
        const rect = plexusContainer.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        isHovering = true;
    });

    plexusContainer.addEventListener('mouseleave', () => {
        isHovering = false;
        mouse.set(9999, 9999);
    });

    const repelRadius = 30;
    const repelStrength = 55;
    const springBack = 0.09;
    const maxDistance = 28;

    // Animation Loop
    function animateNetwork() {
        requestAnimationFrame(animateNetwork);

        // Slow auto-rotation
        networkGroup.rotation.y += 0.005;

        // Raycaster interaction
        let hitPoint = null;
        if (isHovering) {
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObject(hitSphere);
            if (intersects.length > 0) {
                // Convert hit to local group space
                hitPoint = networkGroup.worldToLocal(intersects[0].point.clone());
                cursorSphere.position.copy(hitPoint);
                cursorMat.opacity = 0.6;
            } else {
                cursorMat.opacity = 0;
            }
        } else {
            cursorMat.opacity = 0;
        }

        // Update particle positions with interaction
        const posAttr = geometry.attributes.position;
        for (let i = 0; i < particleCount; i++) {
            const ix = i * 3;
            let px = posAttr.array[ix];
            let py = posAttr.array[ix + 1];
            let pz = posAttr.array[ix + 2];

            // Original resting position
            const ox = originalPositions[ix];
            const oy = originalPositions[ix + 1];
            const oz = originalPositions[ix + 2];

            if (hitPoint) {
                // Distance from particle to mouse hit on globe
                const dx = px - hitPoint.x;
                const dy = py - hitPoint.y;
                const dz = pz - hitPoint.z;
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < repelRadius && dist > 0.1) {
                    // Push outward along radial direction from globe center
                    const force = (1 - dist / repelRadius) * repelStrength;
                    const len = Math.sqrt(px * px + py * py + pz * pz) || 1;
                    px += (px / len) * force * 0.1;
                    py += (py / len) * force * 0.1;
                    pz += (pz / len) * force * 0.1;
                }
            }

            // Spring back toward original position
            px += (ox - px) * springBack;
            py += (oy - py) * springBack;
            pz += (oz - pz) * springBack;

            posAttr.array[ix] = px;
            posAttr.array[ix + 1] = py;
            posAttr.array[ix + 2] = pz;

            // Update vectors for line calculations
            vectors[i].set(px, py, pz);
        }
        posAttr.needsUpdate = true;

        // Rebuild dynamic connection lines
        let lineIdx = 0;
        const lp = lineGeometry.attributes.position.array;
        for (let i = 0; i < particleCount && lineIdx < maxLineSegments; i++) {
            for (let j = i + 1; j < particleCount && lineIdx < maxLineSegments; j++) {
                if (vectors[i].distanceTo(vectors[j]) < maxDistance) {
                    lp[lineIdx * 6] = vectors[i].x;
                    lp[lineIdx * 6 + 1] = vectors[i].y;
                    lp[lineIdx * 6 + 2] = vectors[i].z;
                    lp[lineIdx * 6 + 3] = vectors[j].x;
                    lp[lineIdx * 6 + 4] = vectors[j].y;
                    lp[lineIdx * 6 + 5] = vectors[j].z;
                    lineIdx++;
                }
            }
        }
        lineGeometry.setDrawRange(0, lineIdx * 2);
        lineGeometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
    }
    animateNetwork();

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = plexusContainer.offsetWidth / plexusContainer.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(plexusContainer.offsetWidth, plexusContainer.offsetHeight);
    });
}



// --- Interactive Terminal Logic (Tab Switching) ---
const tabBtns = document.querySelectorAll('.cat-btn');
const panes = document.querySelectorAll('.display-pane');

// Initialize first pane opacity for GSAP
gsap.set(panes[0], { opacity: 1, y: 0 });

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Ignore if already active
        if (btn.classList.contains('active')) return;

        const targetId = btn.getAttribute('data-target');
        const targetPane = document.getElementById(targetId);
        const currentPane = document.querySelector('.display-pane.active');

        // 1. Update Button States
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // 2. Animate Out Current Pane
        gsap.to(currentPane, {
            opacity: 0,
            y: -20,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
                currentPane.classList.remove('active');

                // 3. Animate In New Pane
                targetPane.classList.add('active');
                gsap.fromTo(targetPane,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
                );
            }
        });
    });
});



// --- Sticky Sidebar ScrollSpy Logic ---
const sections = document.querySelectorAll('.product-glass-card');
const navLinks = document.querySelectorAll('.nav-link');

// Options for the Intersection Observer
const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', // Triggers when element is in the middle of screen
    threshold: 0
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Remove active from all links
            navLinks.forEach(link => link.classList.remove('active'));

            // Add active to the corresponding link
            const id = entry.target.getAttribute('id');
            const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}, observerOptions);

// Observe all product sections
sections.forEach(section => {
    observer.observe(section);
});

// Smooth scroll implementation for sidebar links
navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            // Use Lenis smooth scroll if active, otherwise fallback to native
            if (typeof lenis !== 'undefined') {
                lenis.scrollTo(targetElement, { offset: -120 });
            } else {
                window.scrollTo({
                    top: targetElement.offsetTop - 120,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// (gs-fade-up scroll reveals now handled by reusable animation system at top of file)
