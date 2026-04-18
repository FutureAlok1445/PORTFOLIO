import { EASE, lerp, initGSAPDefaults } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize GSAP & Plugins
    initGSAPDefaults();
    if (typeof gsap !== 'undefined') {
        if (typeof TextPlugin !== 'undefined') gsap.registerPlugin(TextPlugin);
    }

    // Elements
    const bootScreen = document.getElementById('boot-screen');
    const bootContent = document.querySelector('.boot-content');
    const bootLines = document.querySelectorAll('.boot-line');

    const heroName = document.getElementById('hero-name');
    const heroTagline = document.getElementById('hero-tagline');
    const heroTerminal = document.getElementById('hero-terminal');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    // Parallax elements
    const heroBg = document.querySelector('.hero-bg');
    const splineContainer = document.getElementById('spline-container');
    const mathSymbols = document.querySelectorAll('.symbol');

    // 1. Boot Sequence
    // Hide text initially for typing effect
    const bootTexts = Array.from(bootLines).map(line => {
        const text = line.textContent;
        line.textContent = '';
        line.style.opacity = 1; // Unhide container, text is empty
        return text;
    });

    let bootTl = gsap.timeline({
        onComplete: () => {
            // Glitch effect triggers via CSS class on bootContent container
            bootContent.classList.add('glitch-effect');
            
            // Wait 0.2s for glitch to finish, then fade & slide up
            setTimeout(() => {
                gsap.to(bootScreen, {
                    y: "-100%",
                    opacity: 0,
                    duration: 0.8,
                    ease: EASE.expo,
                    onComplete: () => {
                        bootScreen.style.display = 'none';
                        initHero(); // Execute Hero Sequence
                    }
                });
            }, 200);
        }
    });

    // 5 lines, 200ms stagger, total duration 2s. 
    // timeline: start times 0, 0.2, 0.4, 0.6, 0.8 
    // last animation finishes at 2.0s so duration is 1.2s
    bootTexts.forEach((text, i) => {
        bootTl.to(bootLines[i], {
            duration: 1.2,
            text: { value: text, delimiter: "" },
            ease: "none"
        }, i * 0.2);
    });

    // 2. Hero Sequence
    function initHero() {
        // Starts 300ms after boot ends
        let heroTl = gsap.timeline({ delay: 0.3 });

        heroName.style.opacity = 1;
        heroName.textContent = "";

        // Determine if ScrambleTextPlugin is available
        const hasScramble = typeof ScrambleTextPlugin !== 'undefined' || (gsap.plugins && gsap.plugins.ScrambleTextPlugin);

        if (hasScramble) {
            heroTl.to(heroName, {
                duration: 2.5,
                scrambleText: { text: "YOUR NAME", chars: "upperAndLowerCase", speed: 0.3 },
                ease: "back.out(1.2)"
            });
        } else {
            // Fallback typing effect
            heroTl.to(heroName, {
                duration: 2.5,
                text: "YOUR NAME",
                ease: "back.out(1.2)"
            });
        }

        // Tagline typeout after name
        heroTl.to(heroTagline, {
            duration: 1.5,
            text: 'Full-stack · Machine Learning · Frontend Architecture',
            ease: "none"
        });

        // Terminal line typeout directly after or slightly overlapped
        heroTl.to(heroTerminal, {
            duration: 1.5,
            text: '> location: "Earth" | stack: ["React","Three.js","PyTorch"] | status: "Available"',
            ease: "none"
        }, "-=0.5"); // Start bit earlier

        initParallax();
        initScrollIndicator();
    }

    // 3. Mouse Parallax
    function initParallax() {
        let mouseX = 0, mouseY = 0;
        let targetX = 0, targetY = 0;

        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;

        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX - windowHalfX);
            mouseY = (e.clientY - windowHalfY);
        });

        const tick = () => {
            targetX = lerp(targetX, mouseX, 0.15);
            targetY = lerp(targetY, mouseY, 0.15);

            // Max movement of roughly 15px at screen edges
            const moveX = (targetX / windowHalfX) * 15;
            const moveY = (targetY / windowHalfY) * 15;

            // 3D Placeholder
            gsap.set(splineContainer, { x: moveX, y: moveY });

            // Floating Symbols (opposite direction)
            gsap.set(mathSymbols, { x: -moveX * 0.8, y: -moveY * 0.8 });

            // Background shift
            gsap.set(heroBg, { x: -moveX * 0.2, y: -moveY * 0.2 });

            requestAnimationFrame(tick);
        };
        tick();
    }

    // 4. Scroll Indicator Logic
    function initScrollIndicator() {
        // Fade out on first scroll
        ScrollTrigger.create({
            trigger: "#hero",
            start: "top top",
            end: "10% top",
            onLeave: () => gsap.to(scrollIndicator, { opacity: 0, duration: 0.3 }),
            onEnterBack: () => gsap.to(scrollIndicator, { opacity: 0.7, duration: 0.3 })
        });
    }
});
