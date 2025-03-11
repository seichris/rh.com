// Three.js example - Realistic black hole (no shaders)
function initThreeJSExample() {
    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Black background
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 60;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Add renderer to DOM
    const container = document.getElementById('three-container');
    container.appendChild(renderer.domElement);
    
    // Create stars
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 0.8,
        sizeAttenuation: true
    });
    
    // Create random star positions
    const starsVertices = [];
    for (let i = 0; i < 20000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starsVertices.push(x, y, z);
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    
    // Create star system
    const starSystem = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starSystem);
    
    // Create Black Hole Components
    const blackHoleGroup = new THREE.Group();
    
    // 1. Event Horizon (black sphere)
    const blackHoleRadius = 15; // Core radius
    const blackHoleGeometry = new THREE.SphereGeometry(blackHoleRadius, 64, 64);
    const blackHoleMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x000000
    });
    const blackHole = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial);
    blackHoleGroup.add(blackHole);
    
    // 2. Gravitational Lensing Effect (approximated with translucent sphere)
    const lensRadius = blackHoleRadius * 1.8;
    const lensGeometry = new THREE.SphereGeometry(lensRadius, 64, 64);
    const lensMaterial = new THREE.MeshBasicMaterial({
        color: 0x0a1a4a,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide,
        depthWrite: false
    });
    const lensSphere = new THREE.Mesh(lensGeometry, lensMaterial);
    blackHoleGroup.add(lensSphere);
    
    // 3. Photon Sphere (thin bright ring)
    const photonRingGeometry = new THREE.TorusGeometry(blackHoleRadius * 1.5, 0.2, 32, 100);
    const photonRingMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x88CCFF,
        transparent: true,
        opacity: 0.9
    });
    const photonRing = new THREE.Mesh(photonRingGeometry, photonRingMaterial);
    photonRing.rotation.x = Math.PI / 2;
    blackHoleGroup.add(photonRing);
    
    // 4. Enhanced Accretion Disk
    const diskGroup = new THREE.Group();
    const ringCount = 30;  // More rings for smoother gradient
    
    // Create multiple rings with varied properties
    for (let i = 0; i < ringCount; i++) {
        // Positions from near the event horizon extending outward
        const pos = i / ringCount;
        
        // Inner rings are closer together than outer rings (logarithmic distribution)
        const logPos = Math.log(1 + 9 * pos) / Math.log(10);
        
        // Set inner and outer radius for this ring
        const innerRadius = blackHoleRadius * 2 + logPos * blackHoleRadius * 6;
        const outerRadius = blackHoleRadius * 2 + (logPos + 1/ringCount) * blackHoleRadius * 6;
        const ringWidth = (outerRadius - innerRadius) * (1 + Math.random() * 0.2);
        
        // Create ring geometry
        const ringGeometry = new THREE.RingGeometry(
            innerRadius, 
            innerRadius + ringWidth, 
            64, 
            1, 
            0, 
            Math.PI * 2
        );
        
        // Create color gradient from inner to outer rings
        // Inner rings hotter (white-blue), outer rings cooler (yellow-red)
        let r, g, b;
        
        if (pos < 0.3) {
            // Inner hot area (white-blue)
            r = 0.9 - pos * 1.5;
            g = 0.9 - pos * 0.7;
            b = 1.0;
        } else {
            // Outer cooler area (blue to yellow to red)
            r = 0.5 + pos * 0.5;
            g = 0.7 - pos * 0.7;
            b = 0.9 - pos * 0.9;
        }
        
        // Add some variation based on position
        const variation = (Math.sin(pos * 50) + 1) * 0.05;
        r = Math.min(1, r + variation);
        g = Math.min(1, g + variation);
        
        // Create material
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color(r, g, b),
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.7 - 0.3 * Math.random() // Varied opacity creates gaps
        });
        
        // Create mesh and position
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        
        // Add some variation to z position for thickness
        ring.position.z = (Math.random() - 0.5) * 0.5;
        
        // Add random rotation for non-uniform disk
        ring.rotation.z = Math.random() * Math.PI * 2;
        
        diskGroup.add(ring);
    }
    
    // Add some dust particles in the disk
    const dustGeometry = new THREE.BufferGeometry();
    const dustPositions = [];
    const dustSizes = [];
    const dustColors = [];
    
    // Create 2000 dust particles
    for (let i = 0; i < 2000; i++) {
        // Polar coordinates for position within disk
        const angle = Math.random() * Math.PI * 2;
        const radiusFactor = Math.random();
        const logRadius = Math.log(1 + 9 * radiusFactor) / Math.log(10); // Same distribution as rings
        
        const radius = blackHoleRadius * 2 + logRadius * blackHoleRadius * 6;
        
        // Convert to cartesian
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        const z = (Math.random() - 0.5) * 3; // Some thickness
        
        dustPositions.push(x, y, z);
        
        // Size varies with distance
        dustSizes.push(0.3 + Math.random() * 0.5);
        
        // Color based on distance from center
        let r, g, b;
        if (radiusFactor < 0.3) {
            // Inner hot area (white-blue)
            r = 0.9 - radiusFactor * 1.5;
            g = 0.9 - radiusFactor * 0.7;
            b = 1.0;
        } else {
            // Outer cooler area (blue to yellow to red)
            r = 0.5 + radiusFactor * 0.5;
            g = 0.7 - radiusFactor * 0.7;
            b = 0.9 - radiusFactor * 0.9;
        }
        
        dustColors.push(r, g, b);
    }
    
    dustGeometry.setAttribute('position', new THREE.Float32BufferAttribute(dustPositions, 3));
    dustGeometry.setAttribute('size', new THREE.Float32BufferAttribute(dustSizes, 1));
    dustGeometry.setAttribute('color', new THREE.Float32BufferAttribute(dustColors, 3));
    
    const dustMaterial = new THREE.PointsMaterial({
        size: 0.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.7
    });
    
    const dustParticles = new THREE.Points(dustGeometry, dustMaterial);
    diskGroup.add(dustParticles);
    
    // Add the disk group to main black hole group
    diskGroup.rotation.x = Math.PI / 6; // Tilt the disk
    blackHoleGroup.add(diskGroup);
    
    // 5. Add jets (optional)
    const jetHeight = blackHoleRadius * 15;
    const jetRadius = blackHoleRadius * 0.8;
    
    // North jet
    const jetNorthGroup = new THREE.Group();
    
    // Create multiple cones for the jet with decreasing opacity
    for (let i = 0; i < 5; i++) {
        const jetSegmentHeight = jetHeight * (0.4 + i * 0.15);
        const segmentRadius = jetRadius * (0.8 - i * 0.1);
        const jetGeometry = new THREE.ConeGeometry(segmentRadius, jetSegmentHeight, 32, 1, true);
        const jetMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color(0.2, 0.5, 1.0),
            transparent: true,
            opacity: 0.2 - i * 0.03,
            side: THREE.DoubleSide,
            depthWrite: false
        });
        
        const jetSegment = new THREE.Mesh(jetGeometry, jetMaterial);
        jetSegment.position.y = jetSegmentHeight / 2;
        jetNorthGroup.add(jetSegment);
    }
    
    // South jet (copy of north jet, rotated)
    const jetSouthGroup = jetNorthGroup.clone();
    jetSouthGroup.rotation.x = Math.PI;
    
    blackHoleGroup.add(jetNorthGroup);
    blackHoleGroup.add(jetSouthGroup);
    
    // Add black hole group to scene
    scene.add(blackHoleGroup);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Animation function
    function animate() {
        requestAnimationFrame(animate);
        
        const time = performance.now() * 0.001; // Current time in seconds
        
        // Rotate star field slowly
        starSystem.rotation.y += 0.0002;
        starSystem.rotation.x += 0.0001;
        
        // Rotate the accretion disk
        diskGroup.rotation.z += 0.003;
        
        // Pulsate the gravitational lensing effect
        lensSphere.scale.set(
            1 + Math.sin(time * 0.5) * 0.05,
            1 + Math.sin(time * 0.5) * 0.05,
            1 + Math.sin(time * 0.5) * 0.05
        );
        
        // Make the photon ring pulse slightly
        photonRing.scale.set(
            1 + Math.sin(time * 2) * 0.02,
            1 + Math.sin(time * 2) * 0.02,
            1
        );
        
        // Simulate slight wobble in the black hole system
        blackHoleGroup.rotation.z = Math.sin(time * 0.1) * 0.03;
        blackHoleGroup.rotation.x = Math.sin(time * 0.15) * 0.02;
        
        renderer.render(scene, camera);
    }
    
    // Start animation
    animate();
}