import { initGSAPDefaults } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    initGSAPDefaults();

    // ==========================================================================
    // About Section
    // ==========================================================================
    
    // 1. Pin the "ABOUT //" Label
    ScrollTrigger.create({
        trigger: "#about",
        start: "top 20%",
        end: "bottom 80%",
        pin: ".about-label-wrapper",
        pinSpacing: false
    });

    // 2. Left Column Elements Fade In
    gsap.from("#about .about-headline, #about .js-obj-block, #about .note", {
        scrollTrigger: {
            trigger: "#about",
            start: "top 70%",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out"
    });

    // 3. Neural Roots SVG Reveal
    gsap.fromTo("#about .root-path", 
        { strokeDasharray: 200, strokeDashoffset: 200 },
        { 
            scrollTrigger: {
                trigger: "#about",
                start: "top 60%",
                end: "bottom 50%",
                scrub: 1
            },
            strokeDashoffset: 0,
            ease: "none"
        }
    );

    // 4. Terminal Typing synced with scroll progress
    const tLines = gsap.utils.toArray("#about-terminal-body .typed-line");
    // Initially hide the text by putting opacity 0
    tLines.forEach(line => {
        // Simple type effect via scrubbed width/opacity or text plugin.
        // We'll use a stagger scrub to reveal them line by line
        gsap.from(line, {
            scrollTrigger: {
                trigger: "#about",
                start: "top 50%",
                end: "center center",
                scrub: true
            },
            opacity: 0,
            x: -20,
            stagger: 1
        });
    });

    // Japanese Watermark slight parallax
    gsap.to(".watermark", {
        scrollTrigger: {
            trigger: "#about",
            start: "top bottom",
            end: "bottom top",
            scrub: true
        },
        y: -100,
        ease: "none"
    });


    // ==========================================================================
    // Lab Section
    // ==========================================================================

    // 1. Cards Entrance
    gsap.from(".lab-card", {
        scrollTrigger: {
            trigger: "#lab",
            start: "top 75%"
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.2)"
    });

    // 2. Card 1 - Neural Network Pulse
    gsap.fromTo(".synapse-path",
        { strokeDasharray: 100, strokeDashoffset: 100 },
        {
            scrollTrigger: {
                trigger: ".arch-card", // triggers around same area
                start: "top 80%"
            },
            strokeDashoffset: 0,
            duration: 1.5,
            ease: "power2.inOut",
            stagger: 0.05
        }
    );

    // Accuracy Glow Trigger
    ScrollTrigger.create({
        trigger: "#lab",
        start: "top 60%",
        onEnter: () => {
            gsap.to(".accuracy-val", {
                duration: 0.5,
                textShadow: "0 0 15px rgba(78, 255, 161, 1)",
                color: "var(--emerald-flare)",
                yoyo: true,
                repeat: 3
            });
        }
    });

    // 3. Card 2 - Component Hover Expansion
    const hoverTrigger = document.querySelector('.hover-trigger');
    const archSpeedLines = document.querySelector('.arch-card .speed-lines');
    
    if (hoverTrigger) {
        hoverTrigger.addEventListener('mouseenter', () => {
            gsap.to(hoverTrigger, { scale: 1.05, transformOrigin: 'left center', duration: 0.3, color: "var(--matrix-green)" });
            gsap.to(archSpeedLines, { opacity: 1, x: 20, duration: 0.3 });
        });
        hoverTrigger.addEventListener('mouseleave', () => {
            gsap.to(hoverTrigger, { scale: 1, duration: 0.3, color: "var(--ethereal-gold)" });
            gsap.to(archSpeedLines, { opacity: 0, x: 0, duration: 0.3 });
        });
    }

    // ==========================================================================
    // Journey Section
    // ==========================================================================

    // Total timeline line scrub drawing
    gsap.to(".timeline-draw-path", {
        scrollTrigger: {
            trigger: ".git-timeline",
            start: "top 60%",
            end: "bottom 80%",
            scrub: true
        },
        strokeDashoffset: 0,
        ease: "none"
    });

    const commitCards = gsap.utils.toArray('.commit-card');
    commitCards.forEach((card, i) => {
        gsap.to(card.querySelector('.commit-content'), {
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                onEnter: () => {
                    // Trigger impact frame pop
                    card.querySelector('.commit-content').classList.add('impact-pop');
                    // Clean up class after animation
                    setTimeout(() => card.querySelector('.commit-content').classList.remove('impact-pop'), 200);
                }
            },
            opacity: 1,
            rotateY: 0,
            duration: 0.8,
            ease: "power2.out"
        });
    });

    // ==========================================================================
    // Skills Section
    // ==========================================================================

    let skillsTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#skills",
            start: "top 60%"
        }
    });

    // Animate network edges
    const edges = gsap.utils.toArray('.network-edges .edge');
    skillsTl.fromTo(edges, 
        { strokeDasharray: 500, strokeDashoffset: 500 },
        { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut", stagger: 0.1 }
    );

    // Stagger nodes from center out based on DOM order or custom sorted array
    // Our center node is the last one in HTML, let's just use generic standard GSAP stagger with "center" setting
    const nodes = gsap.utils.toArray('.skill-node');
    skillsTl.to(nodes, {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.4)",
        stagger: {
            amount: 0.6,
            from: "center"
        },
        onComplete: () => {
            // Apply breathing after entrance
            nodes.forEach(n => n.classList.add('breathing'));
        }
    }, "-=1.0"); // Overlap with edges drawing

    // Tooltip Logic
    const tooltip = document.getElementById('skill-tooltip');
    
    nodes.forEach(node => {
        node.addEventListener('mouseenter', (e) => {
            // Update tooltip data
            const name = node.getAttribute('data-skill');
            const prof = parseInt(node.getAttribute('data-prof'));
            const proj = node.getAttribute('data-proj');
            const status = node.getAttribute('data-status');

            document.querySelector('.tt-name').innerText = name;
            document.querySelector('.tt-pct').innerText = `${prof}%`;
            document.querySelector('.tt-proj-num').innerText = proj;
            document.querySelector('.tt-status-val').innerText = status;

            // Generate progress bar string
            const blocks = Math.round(prof / 10);
            const emptyBlocks = 10 - blocks;
            document.querySelector('.tt-bar').innerText = '█'.repeat(blocks) + '░'.repeat(emptyBlocks);

            // Show tooltip
            gsap.to(tooltip, { opacity: 1, duration: 0.2 });
        });

        node.addEventListener('mousemove', (e) => {
            gsap.set(tooltip, { x: e.clientX, y: e.clientY });
        });

        node.addEventListener('mouseleave', () => {
            gsap.to(tooltip, { opacity: 0, duration: 0.2 });
        });
    });

    // ==========================================================================
    // Projects Section
    // ==========================================================================
    
    // Pin section label
    ScrollTrigger.create({
        trigger: "#projects",
        start: "top 20%",
        end: "bottom 80%",
        pin: ".projects-label-wrapper",
        pinSpacing: false
    });

    // Stagger card reveals
    const projectCards = gsap.utils.toArray('.project-card');
    
    gsap.to(projectCards, {
        scrollTrigger: {
            trigger: ".project-container",
            start: "top 75%"
        },
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        onStart: function() {
            projectCards.forEach((card, idx) => {
                // Time the flash array perfectly with the container stagger delay
                setTimeout(() => {
                    const flash = card.querySelector('.ethereal-flash');
                    if (flash) flash.classList.add('flash-trigger');
                }, idx * 200);
            });
        }
    });

    // ==========================================================================
    // Contact Section
    // ==========================================================================
    const words = gsap.utils.toArray('.closing-line .word');
    gsap.fromTo(words, 
        { y: 30, opacity: 0 },
        {
            scrollTrigger: {
                trigger: "#contact",
                start: "top 60%"
            },
            y: 0,
            opacity: 1,
            stagger: 0.12,
            duration: 1.2,
            ease: "power3.out"
        }
    );

    gsap.to('.outro-text', {
        scrollTrigger: {
            trigger: ".outro-wrapper",
            start: "top 95%"
        },
        opacity: 0.4,
        duration: 1.5,
        ease: "none"
    });

});
