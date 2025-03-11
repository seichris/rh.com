let scene, camera, renderer;
let stars;

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 0; // Set camera position to z=0

  // Create stars on a hemisphere
  const R = 100;
  const epsilon = 0.01;
  const phi_min = Math.PI / 2 + epsilon;
  const phi_max = Math.PI;
  const starPositions = [];
  for (let i = 0; i < 1000; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = phi_min + Math.random() * (phi_max - phi_min);
    const x = R * Math.cos(theta) * Math.sin(phi);
    const y = R * Math.sin(theta) * Math.sin(phi);
    const z = R * Math.cos(phi);
    starPositions.push(x, y, z);
  }
  const starsGeometry = new THREE.BufferGeometry();
  starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
  const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff });
  stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('threejs-container').appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

function animate() {
  requestAnimationFrame(animate);
  // Rotate the stars
  stars.rotation.x += 0.001;
  stars.rotation.y += 0.001;
  renderer.render(scene, camera); // Corrected function call
}

document.addEventListener('DOMContentLoaded', function() {
  init();
  animate();
});