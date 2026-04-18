import { random } from './utils.js';

class SakuraPetal {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.reset(true);
    }

    reset(initial = false) {
        // x, y, size(3-8px), speedY(0.5-1.5), speedX(-1 to 1), rotation, rotationSpeed, opacity(0.1-0.4), sway(0.01-0.03), swayOffset
        this.x = random(0, this.canvasWidth);
        // If initial, scatter across height, else start above top
        this.y = initial ? random(0, this.canvasHeight) : random(-50, -10);
        this.size = random(3, 8);
        this.speedY = random(0.5, 1.5);
        this.speedX = random(-1, 1);
        this.rotation = random(0, Math.PI * 2);
        this.rotationSpeed = random(-0.05, 0.05);
        this.opacity = random(0.1, 0.4);
        this.sway = random(0.01, 0.03);
        this.swayOffset = random(0, Math.PI * 2);
    }

    update() {
        // Move petal down with sine-wave horizontal drift
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.swayOffset) * 0.5;
        this.swayOffset += this.sway;
        this.rotation += this.rotationSpeed;

        // Reset if it falls below canvas
        if (this.y > this.canvasHeight + 20 || this.x > this.canvasWidth + 20 || this.x < -20) {
            this.reset();
        }
    }

    draw(ctx, color) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        ctx.beginPath();
        // Ellipse ratio 1:0.6
        ctx.ellipse(0, 0, this.size, this.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        
        ctx.restore();
    }
}

export class SakuraSystem {
    constructor(canvasElement, count = 25) {
        this.canvas = canvasElement;
        this.ctx = this.canvas.getContext('2d');
        this.petals = [];
        this.count = count;
        this.isPaused = false;
        
        // Configs based on prompt
        this.configs = {
            hero: { count: 25, label: "slow+peaceful" },
            projectReveal: { count: 12, label: "burst" }, // burst logic could be implemented via a burst() method later
            contact: { count: 8, label: "slow+drifting" }
        };

        // Cache color from CSS variable map
        this.color = getComputedStyle(document.documentElement).getPropertyValue('--sakura-pink').trim() || '#ffb7d5';

        this.init();
        this.createObserver();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        for (let i = 0; i < this.count; i++) {
            this.petals.push(new SakuraPetal(this.width, this.height));
        }

        this.loop();
    }

    resize() {
        this.width = this.canvas.clientWidth || window.innerWidth;
        this.height = this.canvas.clientHeight || window.innerHeight;
        
        // Handle high DPI displays
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        
        this.ctx.scale(dpr, dpr);
        
        // Update all petal boundaries
        this.petals.forEach(p => {
            p.canvasWidth = this.width;
            p.canvasHeight = this.height;
        });
    }

    loop() {
        if (!this.isPaused) {
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.petals.forEach(petal => {
                petal.update();
                petal.draw(this.ctx, this.color);
            });
        }
        requestAnimationFrame(() => this.loop());
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
    }

    // Performance Intersection Observer
    createObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.resume();
                } else {
                    this.pause();
                }
            });
        }, { threshold: 0 });

        observer.observe(this.canvas);
    }
}
