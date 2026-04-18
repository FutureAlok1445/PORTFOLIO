import { SakuraSystem } from './anime-effects.js';
import { CustomCursor, setupProjectCards, setupContactSection } from './interactions.js';
import { ContactParticles } from './three-scene.js';

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

    // 5. Initialize ThreeJS Particle Canvas (Contact)
    if (document.getElementById('contact-particles')) {
        window.contactParticlesPlugin = new ContactParticles('contact-particles');
    }
});
