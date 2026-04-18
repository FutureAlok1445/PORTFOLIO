import { SakuraSystem } from './anime-effects.js';
import { CustomCursor, setupProjectCards } from './interactions.js';

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
});
