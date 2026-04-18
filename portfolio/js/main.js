import { SakuraSystem } from './anime-effects.js';
import { CustomCursor, setupProjectCards, setupContactSection, setupDevExperience } from './interactions.js';
import { ContactParticles, HeroScene } from './three-scene.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Custom Cursor System
    const cursor = new CustomCursor();

    // 2. Initialize Sakura Effect (on the hero canvas)
    const sakuraCanvas = document.getElementById('sakura');
    if (sakuraCanvas) {
        // Hero configuration: 25 petals
        const sakuraSys = new SakuraSystem(sakuraCanvas, 25);
    }

    // 3. Setup Project Cards
    setupProjectCards();

    // 4. Setup Contact Section
    setupContactSection();

    // 4.5 Initialize Developer Experience Mechanics
    setupDevExperience();

    // 5. Initialize ThreeJS Particle Canvas (Contact)
    if (document.getElementById('contact-particles')) {
        window.contactParticlesPlugin = new ContactParticles('contact-particles');
    }

    // 6. Initialize Hero ThreeJS Particle System
    if (document.getElementById('three-canvas')) {
        window.heroParticlesPlugin = new HeroScene('three-canvas');
    }

    // 7. Lenis Smooth Scroll Initialization
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            lerp: 0.08, // cinematic feel
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });

        // Use requestAnimationFrame loop for Lenis
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Connect GSAP ScrollTrigger to Lenis using modern GSAP ticker
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        // GSAP to lag the ticker for smoother syncing
        gsap.ticker.lagSmoothing(0);
    }
});
