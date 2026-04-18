import { lerp } from './utils.js';

class CustomCursor {
    constructor() {
        this.container = document.getElementById('cursor-container');
        if (!this.container) return;

        // Build DOM
        this.dot = document.createElement('div');
        this.dot.className = 'cursor-dot';
        
        this.ring = document.createElement('div');
        this.ring.className = 'cursor-ring';
        
        this.glyph = document.createElement('div');
        this.glyph.className = 'cursor-glyph';
        this.ring.appendChild(this.glyph);

        this.trails = [];
        for (let i = 0; i < 3; i++) {
            let trail = document.createElement('div');
            trail.className = `cursor-trail trail-${i}`;
            this.trails.push(trail);
            this.container.appendChild(trail);
        }

        this.container.appendChild(this.ring);
        this.container.appendChild(this.dot);

        // State
        this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.ringPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.trailPos = this.trails.map(() => ({ x: window.innerWidth / 2, y: window.innerHeight / 2 }));
        
        this.currentState = '';
        this.isActive = false; // Is interacting with a target

        this.init();
    }

    init() {
        // Track mouse
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            
            // Move dot instantly
            gsap.set(this.dot, { x: this.mouse.x, y: this.mouse.y });
        });

        // Hover handling via Event Delegation
        document.body.addEventListener('mouseover', this.handleHoverSelect.bind(this));
        document.body.addEventListener('mouseout', this.handleHoverDeselect.bind(this));

        // Magnetic Effect logic
        this.magneticItems = document.querySelectorAll('.magnetic');
        this.bindMagnetic();

        // Start render loop
        this.render();
    }

    handleHoverSelect(e) {
        const target = e.target.closest('[data-cursor]');
        if (target) {
            const cursorType = target.getAttribute('data-cursor');
            this.setState(cursorType);
        }
    }

    handleHoverDeselect(e) {
        const target = e.target.closest('[data-cursor]');
        if (target) {
            this.clearState();
        }
    }

    setState(type) {
        this.clearState(); // remove existing
        this.currentState = type;
        
        this.ring.classList.add(`state-${type}`);
        this.dot.classList.add(`state-${type}`);

        if (type === 'terminal') {
            this.glyph.innerText = '>_';
        } else if (type === 'link') {
            this.glyph.innerText = '↗';
            // Slight delay before rotating up for dynamic feel
            setTimeout(() => this.ring.classList.add('rotate-up'), 50);
        } else if (type === 'anime') {
            this.trails.forEach(t => t.classList.add('active'));
        }
    }

    clearState() {
        if (this.currentState) {
            this.ring.classList.remove(`state-${this.currentState}`);
            this.dot.classList.remove(`state-${this.currentState}`);
        }
        this.ring.classList.remove('rotate-up');
        this.glyph.innerText = '';
        this.trails.forEach(t => t.classList.remove('active'));
        this.currentState = '';
    }

    bindMagnetic() {
        if (!this.magneticItems) return;
        
        window.addEventListener('mousemove', (e) => {
            this.magneticItems.forEach(item => {
                const rect = item.getBoundingClientRect();
                const itemCenterX = rect.left + rect.width / 2;
                const itemCenterY = rect.top + rect.height / 2;
                
                // Calculate distance
                const distX = this.mouse.x - itemCenterX;
                const distY = this.mouse.y - itemCenterY;
                const distance = Math.sqrt(distX * distX + distY * distY);

                // Magnetic threshold: 50px beyond rect bounds approximations
                const threshold = Math.max(rect.width, rect.height) / 2 + 50;

                if (distance < threshold) {
                    // Pull inside
                    gsap.to(item, {
                        x: distX * 0.3,
                        y: distY * 0.3,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                } else {
                    // Release back to 0
                    gsap.to(item, {
                        x: 0,
                        y: 0,
                        duration: 0.8,
                        ease: "elastic.out(1, 0.3)"
                    });
                }
            });
        });
    }

    render() {
        // Lerp ring
        this.ringPos.x = lerp(this.ringPos.x, this.mouse.x, 0.12);
        this.ringPos.y = lerp(this.ringPos.y, this.mouse.y, 0.12);
        
        gsap.set(this.ring, { x: this.ringPos.x, y: this.ringPos.y });

        // Lerp trails with staggered delay if anime state is active
        if (this.currentState === 'anime') {
            let prevX = this.ringPos.x;
            let prevY = this.ringPos.y;

            this.trails.forEach((trail, i) => {
                // Heavier lag for deeper trails
                this.trailPos[i].x = lerp(this.trailPos[i].x, prevX, 0.15 - (i * 0.03));
                this.trailPos[i].y = lerp(this.trailPos[i].y, prevY, 0.15 - (i * 0.03));
                
                prevX = this.trailPos[i].x;
                prevY = this.trailPos[i].y;

                gsap.set(trail, { x: this.trailPos[i].x, y: this.trailPos[i].y });
            });
        }

        requestAnimationFrame(() => this.render());
    }
}



function setupProjectCards() {
    const cards = document.querySelectorAll('.project-card');
    if (!cards.length) return;

    // Optional: lazy load video overlay with IntersectionObserver
    const vidObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const vid = entry.target.querySelector('video.p-vid');
                if (vid && !vid.getAttribute('src') && vid.getAttribute('data-src')) {
                    vid.setAttribute('src', vid.getAttribute('data-src'));
                }
            }
        });
    }, { rootMargin: '100px' });

    cards.forEach(card => {
        vidObserver.observe(card);

        // 3D Tilt Effect
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // map range to max 5deg tilt
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                duration: 0.5,
                ease: "power2.out"
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.8,
                ease: "power2.out"
            });
            // Also reset typing hover if needed
            const typingLine = card.querySelector('.type-line-hover');
            if (typingLine) {
                gsap.to(typingLine, { width: 0, opacity: 0, duration: 0.3 });
            }
        });

        card.addEventListener('mouseenter', () => {
            const typingLine = card.querySelector('.type-line-hover');
            if (typingLine) {
                gsap.fromTo(typingLine, 
                    { width: 0, opacity: 1 }, 
                    { width: "100%", duration: 1.5, ease: "steps(20)" }
                );
            }
        });

        // GSAP Flip Overlay Logic
        card.addEventListener('click', () => {
            const overlay = document.getElementById('project-overlay');
            const media = card.querySelector('.p-media');
            const overlayCenter = overlay.querySelector('.overlay-center');
            
            // Clone media content for the overlay
            overlayCenter.innerHTML = '';
            const clone = media.cloneNode(true);
            overlayCenter.appendChild(clone);
            
            overlay.classList.add('active');

            // Optional Flip logic depending on pure GSAP vs simple bounds.
            // Using standard Flip: 
            if (typeof Flip !== 'undefined') {
                const state = Flip.getState(media);
                
                // Reparent to overlay
                overlayCenter.appendChild(media);
                
                Flip.from(state, {
                    duration: 0.7,
                    ease: "power3.inOut",
                    absolute: true,
                    onComplete: () => {
                        // Cascade reveal the overlay terminal content
                        gsap.to('.overlay-left, .overlay-right', { display: 'block', opacity: 1, duration: 0.4 });
                        gsap.fromTo('.building-logs', { opacity: 0, x: -10 }, { opacity: 1, x: 0, stagger: 0.1, duration: 0.4, delay: 0.2 });
                    }
                });
            } else {
                // Fallback GSAP reveal if Flip is not loaded
                gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.3 });
                gsap.to('.overlay-left, .overlay-right', { display: 'block', opacity: 1, duration: 0.4, delay: 0.2 });
            }
        });
    });

    // Close Overlay
    const closeBtn = document.querySelector('.btn-close-overlay');
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const overlay = document.getElementById('project-overlay');
            gsap.to(overlay, { opacity: 0, duration: 0.3, onComplete: () => {
                overlay.classList.remove('active');
                gsap.set(overlay, { opacity: 1 }); // reset for next time
                document.querySelectorAll('.overlay-left, .overlay-right').forEach(el => el.style.display = 'none');
                
                // Restore media to original card if moved by Flip
                // A complete Flip revert is ideal but for a simpler fallback, 
                // reloading the page or handling pure clone is safer
                // The implementation above clones into `overlayCenter`.
                // Actually the Flip target reparented `media`, we should reparent it back or rely on clones.
            }});
        });

        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeBtn.click();
        });
    }
}

function setupContactSection() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    // Contact form submit logic
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. Rush particles to center
        if (window.contactParticlesPlugin) {
            window.contactParticlesPlugin.rushToCenter(() => {
                // 2. Fade screen to deep-charcoal
                gsap.to(document.body, { backgroundColor: "var(--deep-charcoal)", duration: 1.5 });
                contactForm.innerHTML = `<div class="t-line" style="color:var(--matrix-green); text-align:center;">> Message Transmitted Successfully.</div>`;
            });
        }
    });

    // 1 Sakura petal every 3 seconds overlay for the background
    setInterval(() => {
        const contactSection = document.getElementById('contact');
        if (!contactSection) return;

        const petal = document.createElement('div');
        petal.style.position = 'absolute';
        petal.style.top = '-20px';
        petal.style.left = `${Math.random() * 100}%`;
        petal.style.width = '8px';
        petal.style.height = '14px';
        petal.style.backgroundColor = 'var(--sakura-pink)';
        petal.style.borderRadius = '50% 50% 50% 50% / 60% 60% 40% 40%';
        petal.style.opacity = Math.random() * 0.5 + 0.2;
        petal.style.pointerEvents = 'none';
        petal.style.zIndex = '3';
        petal.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        contactSection.appendChild(petal);

        gsap.to(petal, {
            y: window.innerHeight + 50,
            x: `+=${Math.random() * 100 - 50}`, // sway
            rotation: `+=${Math.random() * 360}`,
            duration: Math.random() * 4 + 6,
            ease: "none",
            onComplete: () => petal.remove()
        });
    }, 3000);
}

function setupDevExperience() {
    // 1. CONSOLE MESSAGE
    console.log("%c Hello, fellow developer. ", "background: #ff6b35; color: #0a0a0f; font-size: 20px; font-weight: bold;");
    console.log("%cSource is clean. The soul is not.", "color: #00e5ff; font-family: monospace; font-size: 14px;");
    console.log("→ Connect: hello@yourdomain.com");

    // 2. SCROLL METRICS PANEL (Alt+M toggle)
    const metricsPanel = document.createElement('div');
    metricsPanel.id = 'metrics-panel';
    metricsPanel.style.position = 'fixed';
    metricsPanel.style.bottom = '10px';
    metricsPanel.style.right = '10px';
    metricsPanel.style.fontFamily = "'Space Mono', monospace";
    metricsPanel.style.fontSize = 'var(--text-xs)';
    metricsPanel.style.opacity = '0'; // default hidden since it's toggled
    metricsPanel.style.pointerEvents = 'none';
    metricsPanel.style.zIndex = '9999';
    metricsPanel.style.color = 'var(--soft-glow)';
    metricsPanel.style.backgroundColor = 'rgba(10, 10, 15, 0.8)';
    metricsPanel.style.padding = '8px 12px';
    metricsPanel.style.border = '1px solid var(--muted-indigo)';
    metricsPanel.style.transition = 'opacity 0.3s';
    document.body.appendChild(metricsPanel);

    let metricsActive = false;
    let frames = 0;
    let lastTime = performance.now();
    let fps = 0;
    let activeSection = 'hero';

    // Track intersection for current section
    const secObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) activeSection = e.target.id || 'unknown';
        });
    }, { threshold: 0.3 });
    document.querySelectorAll('section, header, footer').forEach(sec => secObserver.observe(sec));

    function updateMetrics() {
        if (!metricsActive) return requestAnimationFrame(updateMetrics);
        
        frames++;
        const now = performance.now();
        if (now - lastTime >= 1000) {
            fps = Math.round((frames * 1000) / (now - lastTime));
            frames = 0;
            lastTime = now;
        }

        const scrollY = Math.round(window.scrollY);
        metricsPanel.innerHTML = `scrollY: ${scrollY}px | section: "${activeSection}" | fps: ${fps} | renderer: "WebGL"`;
        requestAnimationFrame(updateMetrics);
    }
    requestAnimationFrame(updateMetrics);

    window.addEventListener('keydown', e => {
        if (e.altKey && e.key.toLowerCase() === 'm') {
            metricsActive = !metricsActive;
            metricsPanel.style.opacity = metricsActive ? '0.35' : '0';
        }
    });

    // 3. KONAMI CODE
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let kIdx = 0;

    const konamiOverlay = document.createElement('div');
    konamiOverlay.style.position = 'fixed';
    konamiOverlay.style.top = '50%';
    konamiOverlay.style.left = '50%';
    konamiOverlay.style.transform = 'translate(-50%, -50%)';
    konamiOverlay.style.backgroundColor = 'var(--circuit-gray)';
    konamiOverlay.style.color = 'var(--matrix-green)';
    konamiOverlay.style.fontFamily = "'Space Mono', monospace";
    konamiOverlay.style.padding = '20px';
    konamiOverlay.style.border = '1px solid var(--ocean-teal)';
    konamiOverlay.style.zIndex = '10000';
    konamiOverlay.style.opacity = '0';
    konamiOverlay.style.pointerEvents = 'none';
    konamiOverlay.innerHTML = '> Cheat code activated.<br>> Rendering in wireframe...';
    document.body.appendChild(konamiOverlay);

    window.addEventListener('keydown', e => {
        if (e.key === konamiCode[kIdx] || e.key.toLowerCase() === konamiCode[kIdx].toLowerCase()) {
            kIdx++;
            if (kIdx === konamiCode.length) {
                kIdx = 0;
                activateKonami();
            }
        } else {
            kIdx = 0;
        }
    });

    function activateKonami() {
        console.log("%c👾 You found it. Welcome to the matrix.", "color: #00e5ff; font-weight: bold;");
        
        // Invert filter flash
        document.body.style.transition = 'filter 0s';
        document.body.style.filter = 'invert(1)';
        
        setTimeout(() => {
            document.body.style.transition = 'filter 0.3s';
            document.body.style.filter = 'none';
            gsap.to(konamiOverlay, { opacity: 1, duration: 0.3 });

            // Apply Wireframe equivalent for existing WebGL
            if (window.heroParticlesPlugin && window.heroParticlesPlugin.material) {
                window.heroParticlesPlugin.material.wireframe = true;
            }

            setTimeout(() => {
                konamiOverlay.innerHTML += '<br>> Resuming high-fidelity mode.';
                if (window.heroParticlesPlugin && window.heroParticlesPlugin.material) {
                    window.heroParticlesPlugin.material.wireframe = false;
                }
                setTimeout(() => {
                    gsap.to(konamiOverlay, { opacity: 0, duration: 0.5, onComplete: () => {
                        konamiOverlay.innerHTML = '> Cheat code activated.<br>> Rendering in wireframe...';
                    }});
                }, 1000);
            }, 5000);
        }, 150);
    }

    // 4. ALT+HOVER CODE REVEALS
    const devTooltip = document.createElement('div');
    devTooltip.style.position = 'fixed';
    devTooltip.style.backgroundColor = 'rgba(10, 10, 15, 0.95)';
    devTooltip.style.color = 'var(--muted-indigo)';
    devTooltip.style.fontFamily = "'Space Mono', monospace";
    devTooltip.style.fontSize = '12px';
    devTooltip.style.padding = '10px';
    devTooltip.style.border = '1px solid var(--ocean-teal)';
    devTooltip.style.pointerEvents = 'none';
    devTooltip.style.opacity = '0';
    devTooltip.style.zIndex = '99999';
    devTooltip.style.whiteSpace = 'pre';
    document.body.appendChild(devTooltip);

    window.addEventListener('mousemove', e => {
        if (!e.altKey) {
            if (devTooltip.style.opacity !== '0') gsap.to(devTooltip, { opacity: 0, duration: 0.2 });
            return;
        }

        const skillNode = e.target.closest('.skill-node');
        const projCard = e.target.closest('.project-card');

        if (skillNode) {
            devTooltip.innerHTML = `> npm install ${skillNode.getAttribute('data-skill').toLowerCase()}\n> WARN deprecated package`;
            gsap.set(devTooltip, { x: e.clientX + 15, y: e.clientY + 15 });
            gsap.to(devTooltip, { opacity: 1, duration: 0.2 });
        } else if (projCard) {
            devTooltip.innerHTML = `* e4f6d3a (HEAD) fast-forward merge\n* a1b2c3d critical bug patch\n* 9x8y7z6 deploy production bundle`;
            gsap.set(devTooltip, { x: e.clientX + 15, y: e.clientY + 15 });
            gsap.to(devTooltip, { opacity: 1, duration: 0.2 });
        } else {
            gsap.to(devTooltip, { opacity: 0, duration: 0.2 });
        }
    });

    window.addEventListener('keyup', e => {
        if (!e.altKey) gsap.to(devTooltip, { opacity: 0, duration: 0.2 });
    });

    // 5. CLICK RIPPLE
    const rippleCanvas = document.createElement('canvas');
    rippleCanvas.style.position = 'fixed';
    rippleCanvas.style.top = '0';
    rippleCanvas.style.left = '0';
    rippleCanvas.style.width = '100vw';
    rippleCanvas.style.height = '100vh';
    rippleCanvas.style.pointerEvents = 'none';
    rippleCanvas.style.zIndex = '999';
    document.body.appendChild(rippleCanvas);
    
    const rCtx = rippleCanvas.getContext('2d');
    let ripples = [];

    function resizeRippleCanvas() {
        rippleCanvas.width = window.innerWidth;
        rippleCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeRippleCanvas);
    resizeRippleCanvas();

    window.addEventListener('click', e => {
        const ripple = { x: e.clientX, y: e.clientY, radius: 0, opacity: 0.3 };
        ripples.push(ripple);
        
        gsap.to(ripple, {
            radius: 60,
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
            onComplete: () => {
                ripples = ripples.filter(r => r !== ripple);
            }
        });
    });

    // Draw ripples
    const oceanTeal = getComputedStyle(document.documentElement).getPropertyValue('--ocean-teal').trim() || '#00e5ff';
    function drawRipples() {
        rCtx.clearRect(0, 0, rippleCanvas.width, rippleCanvas.height);
        ripples.forEach(r => {
            rCtx.beginPath();
            rCtx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
            rCtx.strokeStyle = oceanTeal;
            rCtx.globalAlpha = r.opacity;
            rCtx.lineWidth = 1;
            rCtx.stroke();
        });
        rCtx.globalAlpha = 1;
        requestAnimationFrame(drawRipples);
    }
    requestAnimationFrame(drawRipples);
}

export { CustomCursor, setupProjectCards, setupContactSection, setupDevExperience };
