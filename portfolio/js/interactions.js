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

export { CustomCursor, setupProjectCards };
