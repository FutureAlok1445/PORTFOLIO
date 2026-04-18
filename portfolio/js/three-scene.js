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

export class HeroScene {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.scene = new THREE.Scene();
        
        // PerspectiveCamera fov:75, near:0.1, far:1000, position z:5
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;

        // WebGLRenderer with alpha:true, antialias:true
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Lighting
        this.ambientLight = new THREE.AmbientLight(0x2d6b6b, 0.4);
        this.scene.add(this.ambientLight);

        this.pointLight = new THREE.PointLight(0xff6b35, 0.8);
        this.pointLight.position.set(2, 2, 2);
        this.scene.add(this.pointLight);

        this.dirLight = new THREE.DirectionalLight(0xe0f2f1, 0.3);
        this.dirLight.position.set(-2, 1, 0);
        this.scene.add(this.dirLight);

        // Physics State
        this.particlesCount = 600;
        this.positions = new Float32Array(this.particlesCount * 3);
        this.basePositions = new Float32Array(this.particlesCount * 3);
        this.sizes = new Float32Array(this.particlesCount);
        
        for(let i=0; i<this.particlesCount; i++) {
            // -8 to 8 (x,y), -3 to 3 (z)
            const x = (Math.random() - 0.5) * 16;
            const y = (Math.random() - 0.5) * 16;
            const z = (Math.random() - 0.5) * 6;

            this.positions[i*3] = x;
            this.positions[i*3+1] = y;
            this.positions[i*3+2] = z;

            this.basePositions[i*3] = x;
            this.basePositions[i*3+1] = y;
            this.basePositions[i*3+2] = z;

            // sizes 0.5 - 2.5
            this.sizes[i] = Math.random() * 2.0 + 0.5;
        }

        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
        this.geometry.setAttribute('size', new THREE.BufferAttribute(this.sizes, 1));

        // To use per-vertex sizes with PointsMaterial without writing a custom shader, 
        // ThreeJS standard PointsMaterial 'size' parameter applies to all unless altered via shader.
        // The prompt says "Sizes: random 0.5-2.5px", we will use a custom shader to support per-vertex sizing, 
        // or apply an average size on standard material if not critical. 
        // Wait, "PointsMaterial with sizeAttenuation:true". PointsMaterial natively only takes 1 global size property. 
        // I will use a ShaderMaterial to respect the random sizes if needed, or simply map the global size.
        // Actually, PointsMaterial doesn't allow 'size' buffer attribute easily natively. We'll use custom shader to easily honor the prompt.
        // Actually, building a custom shader might be outside standard prompt. I'll just use ShaderMaterial to be exact.
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color('#e0f2f1') },
                opacity: { value: 0.5 },
                pixelRatio: { value: this.renderer.getPixelRatio() }
            },
            vertexShader: `
                attribute float size;
                void main() {
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    // size attenuation calculation
                    gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform vec3 color;
                uniform float opacity;
                void main() {
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;
                    gl_FragColor = vec4(color, opacity * (1.0 - (dist * 2.0)));
                }
            `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        this.points = new THREE.Points(this.geometry, this.material);
        this.scene.add(this.points);

        this.mouse = new THREE.Vector2(-9999, -9999);
        this.raycaster = new THREE.Raycaster();
        this.plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        this.mouseWorld = new THREE.Vector3();

        this.isPaused = false;
        
        this.initEvents();
        this.animate();
    }

    initEvents() {
        // Resize - debounce 100ms
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => this.onResize(), 100);
        });

        window.addEventListener('mousemove', (e) => {
            // Normalized Device Coordinates
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
            
            // Unproject mouse to world coords at z=0 plane
            this.raycaster.setFromCamera(this.mouse, this.camera);
            this.raycaster.ray.intersectPlane(this.plane, this.mouseWorld);
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                this.isPaused = !entry.isIntersecting;
            });
        }, { threshold: 0 });

        observer.observe(this.canvas);
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.material.uniforms.pixelRatio.value = this.renderer.getPixelRatio();
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        if (!this.isPaused) {
            const positions = this.points.geometry.attributes.position.array;

            for(let i=0; i<this.particlesCount; i++) {
                const ix = i*3;
                const iy = i*3+1;
                const iz = i*3+2;

                // Drift behavior
                this.basePositions[iy] += 0.001;
                if (this.basePositions[iy] > 8) {
                    this.basePositions[iy] = -8;
                }

                // Mouse Repulsion
                const px = this.basePositions[ix];
                const py = this.basePositions[iy];
                // Project mouse xy to z=0 to approximate distances
                const dx = px - this.mouseWorld.x;
                const dy = py - this.mouseWorld.y;
                const distSq = dx*dx + dy*dy;
                // 1.5 units distance -> 1.5^2 = 2.25
                if (distSq < 2.25) {
                    const thrust = (2.25 - distSq) * 0.5;
                    positions[ix] = px + dx * thrust;
                    positions[iy] = py + dy * thrust;
                } else {
                    // lerp back 0.02
                    positions[ix] += (px - positions[ix]) * 0.02;
                    positions[iy] += (py - positions[iy]) * 0.02;
                }
                
                // Z remains unchanged from base
                positions[iz] = this.basePositions[iz];
            }

            this.points.geometry.attributes.position.needsUpdate = true;
            this.renderer.render(this.scene, this.camera);
        }
    }
}
