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