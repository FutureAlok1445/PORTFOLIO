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

export { CustomCursor };
