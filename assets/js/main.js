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