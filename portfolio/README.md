# Neural Engineer — Portfolio

> Systems that think. Interfaces that breathe.

## Stack

- **Core**: Vanilla HTML/CSS/JS (no frameworks)
- **3D**: Three.js r128 (particle avatar, grid floor, debris field)
- **Animation**: GSAP 3.12 + ScrollTrigger (scroll-driven reveals, horizontal scroll)
- **Scroll**: Lenis (smooth momentum scrolling)

## Architecture

```
portfolio/
├── index.html                 ← Entry point
├── css/
│   ├── reset.css              ← Reset, design tokens, keyframes
│   ├── layout.css             ← Grid system, responsive breakpoints
│   ├── components.css         ← Terminal panels, buttons, skill slots
│   ├── sections.css           ← Section-specific layouts
│   └── effects.css            ← Glitch, scanlines, HUD, hover states
├── js/
│   ├── config.js              ← ✏️ EDIT THIS — name, email, socials
│   ├── utils.js               ← Math helpers, easing, DOM utilities
│   ├── three-scene.js         ← "The Signal" avatar + grid floor
│   ├── matrix-rain.js         ← Canvas 2D code fall system
│   ├── hero.js                ← Boot sequence + text scramble
│   ├── scroll-triggers.js     ← GSAP ScrollTrigger + Lenis setup
│   ├── hud.js                 ← Viewport HUD corners + FPS counter
│   ├── interactions.js        ← Cursor, magnetic buttons, tilt
│   └── main.js                ← Init orchestration
└── assets/
    ├── images/
    └── svg/
```

## Customization

Edit `js/config.js` to change your name, tagline, email, social links, and mission log entries.

## Quick Start

Open `index.html` in a browser. No build step required.

## Performance

- 30fps-throttled matrix rain
- IntersectionObserver-based pausing for off-screen systems
- prefers-reduced-motion full support
- Debounced resize handlers
- BufferGeometry for all Three.js particles
