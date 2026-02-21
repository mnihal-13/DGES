(function () {
    // Check if Lenis is loaded
    if (typeof Lenis === 'undefined') {
        console.warn('Lenis script not loaded.');
        return;
    }

    // Initialize Lenis
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard ease
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    // Expose functionality to window for other scripts
    window.lenis = lenis;

    // Integrate with GSAP ScrollTrigger
    // Update ScrollTrigger on Lenis scroll event
    lenis.on('scroll', ScrollTrigger.update);

    // Add Lenis's requestAnimationFrame to GSAP's ticker
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    // Disable lag smoothing in GSAP to prevent jumps during heavy loads
    gsap.ticker.lagSmoothing(0);

    // Anchor link handling is left to specific handlers or default behavior 
    // to avoid conflicts with existing complex logic.
    console.log('Lenis initialized and integrated with GSAP.');

})();

// 1. UI Entrance Animation
gsap.from(".ui-anim > *", {
    y: 40,
    opacity: 0,
    duration: 1.2,
    stagger: 0.2,
    ease: "power3.out",
    delay: 0.2
});
gsap.to(".cloud-1", {
    x: 150,
    duration: 25,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
});

gsap.to(".cloud-2", {
    x: -100,
    duration: 30,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
});
// 2. Mouse Tracking Parallax for Sky Elements ONLY
const heroSection = document.querySelector('.hero-section');
const sun = document.querySelector('.sun');
const cloud1 = document.querySelector('.cloud-1');
const cloud2 = document.querySelector('.cloud-2');

heroSection.addEventListener('mousemove', (e) => {
    // Calculate mouse position relative to the center of the screen
    const xPos = (window.innerWidth / 2 - e.clientX) / 30;
    const yPos = (window.innerHeight / 2 - e.clientY) / 30;

    // Apply different tracking speeds to create depth in the sky
    gsap.to(sun, { x: xPos * 0.5, y: yPos * 0.5, duration: 0.6, ease: "power2.out" });
    gsap.to(cloud1, { x: xPos * 1.5, y: yPos * 1.5, duration: 0.8, ease: "power2.out" });
    gsap.to(cloud2, { x: xPos * 1.1, y: yPos * 1.1, duration: 0.7, ease: "power2.out" });
});

// Smooth reset when the mouse leaves the hero area
heroSection.addEventListener('mouseleave', () => {
    gsap.to([sun, cloud1, cloud2], { x: 0, y: 0, duration: 1, ease: "power2.out" });
});

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// 1. Text Entrance Animation (Triggers when scrolling into view)
gsap.from(".about-anim", {
    scrollTrigger: {
        trigger: ".about-section",
        start: "top 80%", // Animation starts when the top of the section hits 80% down the viewport
        toggleActions: "play none none reverse" // Plays on scroll down, reverses on scroll up
    },
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: "power3.out"
});

// 2. The Main Image Parallax (Scrubbing)
// The image moves in the opposite direction of the scroll inside its wrapper
gsap.fromTo(".img-parallax",
    { yPercent: -15 }, // Start slightly shifted up
    {
        yPercent: 15,  // Move downwards as you scroll
        ease: "none",
        scrollTrigger: {
            trigger: ".image-wrapper",
            start: "top bottom", // Start tracking when wrapper enters bottom of screen
            end: "bottom top",   // Stop tracking when wrapper leaves top of screen
            scrub: true          // 'scrub' ties the animation directly to the scrollbar
        }
    }
);

// 3. Floating Accent Box Parallax (Moves slightly faster than the page)
gsap.to(".box-parallax", {
    y: -80, // Moves up 80px while scrolling
    ease: "none",
    scrollTrigger: {
        trigger: ".about-visual",
        start: "top bottom",
        end: "bottom top",
        scrub: 1 // Adding a number adds a slight "lag" or smoothing to the scrub
    }
});

// 4. Background Watermark Parallax (Moves very slowly)
gsap.to(".bg-parallax", {
    y: 150,
    ease: "none",
    scrollTrigger: {
        trigger: ".about-section",
        start: "top bottom",
        end: "bottom top",
        scrub: true
    }
});