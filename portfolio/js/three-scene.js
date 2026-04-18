import * as THREE from 'https://cdn.skypack.dev/three@0.128.0';

export class ContactParticles {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.scene = new THREE.Scene();
        
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 500;

        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        this.particlesCount = 400; // fewer particles as requested
        this.positions = new Float32Array(this.particlesCount * 3);
        this.velocities = [];

        for (let i = 0; i < this.particlesCount * 3; i+=3) {
            this.positions[i] = (Math.random() - 0.5) * 2000;
            this.positions[i+1] = (Math.random() - 0.5) * 2000;
            this.positions[i+2] = (Math.random() - 0.5) * 2000;
            
            this.velocities.push({
                x: (Math.random() - 0.5) * 0.5,
                y: (Math.random() - 0.5) * 0.5,
                z: (Math.random() - 0.5) * 0.5
            });
        }

        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));

        // Create glowing material
        this.material = new THREE.PointsMaterial({
            size: 3,
            color: 0x4effa1, // emerald flare
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        this.particlesMesh = new THREE.Points(this.geometry, this.material);
        this.scene.add(this.particlesMesh);

        this.isRushing = false;

        window.addEventListener('resize', this.onResize.bind(this));
        
        this.animate();
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        if (!this.isRushing) {
            // standard float
            const positions = this.particlesMesh.geometry.attributes.position.array;
            for(let i=0; i < this.particlesCount; i++) {
                positions[i*3] += this.velocities[i].x;
                positions[i*3+1] += this.velocities[i].y;
                positions[i*3+2] += this.velocities[i].z;

                // slow rotation bounds logic isn't strictly necessary if camera is far, but let's rotate mesh
            }
            this.particlesMesh.geometry.attributes.position.needsUpdate = true;
            this.particlesMesh.rotation.y += 0.001;
            this.particlesMesh.rotation.x += 0.0005;
        }

        this.renderer.render(this.scene, this.camera);
    }

    rushToCenter(onComplete) {
        this.isRushing = true;
        const positions = this.particlesMesh.geometry.attributes.position.array;
        
        // We'll use GSAP to animate the Float32Array directly
        // GSAP can animate arrays if we use an object proxy or individual tweens
        // Wait, GSAP iterating over 400 properties might be heavy, but 400 is fine.
        
        let targetProxy = {};
        for(let i=0; i < this.particlesCount; i++) {
            targetProxy[`x${i}`] = positions[i*3];
            targetProxy[`y${i}`] = positions[i*3+1];
            targetProxy[`z${i}`] = positions[i*3+2];
            
            gsap.to(targetProxy, {
                [`x${i}`]: 0,
                [`y${i}`]: 0,
                [`z${i}`]: 0,
                duration: 1.5,
                delay: i * 0.002, // GSAP stagger logic analogue
                ease: "expo.in",
                onUpdate: () => {
                    positions[i*3] = targetProxy[`x${i}`];
                    positions[i*3+1] = targetProxy[`y${i}`];
                    positions[i*3+2] = targetProxy[`z${i}`];
                    this.particlesMesh.geometry.attributes.position.needsUpdate = true;
                }
            });
        }
        
        // Also fade out material
        gsap.to(this.material, { opacity: 0, duration: 2, delay: 0.5, onComplete: onComplete });
    }
}
