document.addEventListener('DOMContentLoaded', (event) => {
  const form = document.getElementById('country-form');
  form.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent form submission
  const countryInput = document.getElementById('country').value;
  const countryDetailsDiv = document.getElementById('countryDetails');
  fetchData(countryInput, countryDetailsDiv)
});
// Fetch country data
const fetchData = async (countryInput, countryDetailsDiv) => {
  try {
    const response = await fetch(`https://restcountries.com/v3.1/name/${countryInput}`)
    if (!response.ok) throw new Error("Data Not Found")
    const data = await response.json()
    displayData(data, countryDetailsDiv)
  }
  catch (error) {
    console.error('Error fetching country data:', error);
    countryDetailsDiv.innerHTML = '<p>Country not found.</p>';
  }
}

const displayData = (data, countryDetailsDiv) => {
  const country = data[0];




  //display data
  countryDetailsDiv.innerHTML = `
       <div class="card" style="width: 18rem;">
        <canvas id="flagCanvas" width="1000px" height="600px" class="p-2 card-img-top"></canvas>
          <div class="card-body">
              <h5 class="display-6 card-title text-center fw-bold">${country.name.common.toUpperCase()}</h5>
              <p><strong>Capital:</strong> ${country.capital}</p>
              <p class="fst-italic"><strong>Population:</strong> ${country.population.toLocaleString('en-US')}</p>
              <p><strong>Region:</strong> ${country.region}</p>
          </div>
        </div>`

  //flag effect 
  const canvas = document.getElementById('flagCanvas');
  const ctx = canvas.getContext('2d');
  const image = new Image();
  image.src = `${country.flags.svg}`; // Replace with the path to your image

  image.onload = function () {
    const width = canvas.width;
    const height = canvas.height;
    const frequency = 0.02;
    const amplitude = 20;
    let time = 0;

    function draw() {
      ctx.clearRect(0, 0, width, height);
      for (let y = 0; y < height; y++) {
        let offset = Math.sin((y + time) * frequency) * amplitude; 
        ctx.drawImage(image, offset, y, width, 1, 0, y, width, 1);
      
      }
      time += 1;
      requestAnimationFrame(draw);
    }

    draw();
  };
};

});

//Globe

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
const container = document.getElementById('globeArea');
const size = container.clientWidth;
renderer.setSize(size, size);
container.appendChild(renderer.domElement);
renderer.domElement.classList.add('threejs-canvas');

// Create a sphere geometry for the globe
const geometry = new THREE.SphereGeometry(5, 32, 32);
const texture = new THREE.TextureLoader().load('Images/world_map.jpg'); // replace with the actual texture URL
const material = new THREE.MeshBasicMaterial({
  map: texture,
  transparent: true,
  // opacity: 1 // Adjust the opacity value (0.0 is fully transparent, 1.0 is fully opaque)
});
const globe = new THREE.Mesh(geometry, material);
scene.add(globe);

// Add ambient lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Add directional lighting
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10).normalize();
scene.add(directionalLight);

// Position the camera
camera.position.z = 15;

// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = false; // Disable zooming
controls.enablePan = false; // Disable panning

// Variables to control animation state
let isAnimating = true;

// Render the scene and animate the globe
function animate() {
  if (isAnimating) {
    globe.rotation.y += 0.005; // Rotate the globe
  }
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

// Event listeners to handle mouse events within the container
container.addEventListener('mousedown', () => {
  isAnimating = false; // Stop animation
});

container.addEventListener('mouseup', () => {
  isAnimating = true; // Resume animation
});

// Update mouse coordinates on move within the container
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove(event) {
  const rect = container.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  // Update the raycaster with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // Calculate objects intersecting the raycaster
  const intersects = raycaster.intersectObject(globe);

  // Enable or disable zoom based on whether the mouse is over the globe
  controls.enableZoom = intersects.length > 0;
}

container.addEventListener('mousemove', onMouseMove, false);

// Handle window resize
window.addEventListener('resize', () => {
  const size = container.clientWidth;
  camera.aspect = 1;
  camera.updateProjectionMatrix();
  renderer.setSize(size, size);
});





