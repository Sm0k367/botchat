// main.js — Epic Tech AI 3D Chat Experience
// 🌌✨🔥💯

// --- CONFIGURATION ---
const CONFIG = {
  particleCount: 800,
  colors: [0xff006e, 0x8338ec, 0x3a86ff, 0xffbe0b, 0x06d6a0], // Neon rainbow + teal
  bgColors: [0x0a0a12, 0x120a18, 0x0a1218], // Deep space vibes
  godraysIntensity: 0.8,
  bloomStrength: 1.2,
  bloomRadius: 0.4,
  bloomThreshold: 0.1,
};

// --- DOM ELEMENTS ---
const canvasContainer = document.getElementById('canvas-container');
const messagesContainer = document.getElementById('messages-container');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const loadingIndicator = document.getElementById('loading-indicator');
const audioContainer = document.getElementById('audio-container');

// --- THREE.JS SETUP ---
let scene, camera, renderer, composer;
let particles, particleSystem;
let godraysPass, bloomPass, renderPass;
let clock = new THREE.Clock();
let floatingTexts = [];

// Audio system (Howler.js)
const soundEffects = {
  send: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3'], // Short "whoosh"
    volume: 0.6,
  }),
  receive: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2004/2004-preview.mp3'], // "pop"
    volume: 0.5,
  }),
  glitch: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2010/2010-preview.mp3'], // Glitch
    volume: 0.4,
  }),
};

// --- INIT THREE.JS ---
function initThree() {
  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(CONFIG.bgColors[0]);
  scene.fog = new THREE.FogExp2(CONFIG.bgColors[0], 0.02);

  // Camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.toneMapping = THREE.ReinhardToneMapping;
  canvasContainer.appendChild(renderer.domElement);

  // Postprocessing
  const renderScene = new THREE.RenderPass(scene, camera);
  const bloomPass = new THREE.UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    CONFIG.bloomStrength,
    CONFIG.bloomRadius,
    CONFIG.bloomThreshold
  );
  const godraysPass = new THREE.ShaderPass(THREE.GodRaysShader);
  godraysPass.uniforms['sunPosition'].value.set(0.5, 0.5, 0.0);
  godraysPass.uniforms['sunColor'].value.setHex(0xffaa00);
  godraysPass.uniforms['skyColor'].value.setHex(0x000000);
  godraysPass.uniforms['intensity'].value = CONFIG.godraysIntensity;

  composer = new THREE.EffectComposer(renderer);
  composer.addPass(renderScene);
  composer.addPass(bloomPass);
  composer.addPass(godraysPass);

  // Create particles (energy field)
  createParticles();

  // Create floating "vibe words"
  createFloatingTexts();

  // Event listeners
  window.addEventListener('resize', onWindowResize);
  animate();

  // Hide loading
  gsap.to(loadingIndicator, { opacity: 0, duration: 1, onComplete: () => {
    loadingIndicator.style.display = 'none';
  }});
}

// --- PARTICLES SYSTEM ---
function createParticles() {
  const geometry = new THREE.BufferGeometry();
  const positions = [];
  const colors = [];
  const sizes = [];
  const speeds = [];

  for (let i = 0; i < CONFIG.particleCount; i++) {
    const x = (Math.random() - 0.5) * 100;
    const y = (Math.random() - 0.5) * 60;
    const z = (Math.random() - 0.5) * 80;
    const color = new THREE.Color(CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)]);
    const size = Math.random() * 2 + 0.5;
    const speed = Math.random() * 0.02 + 0.005;

    positions.push(x, y, z);
    colors.push(color.r, color.g, color.b);
    sizes.push(size);
    speeds.push(speed);
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
  geometry.setAttribute('speed', new THREE.Float32BufferAttribute(speeds, 1));

  const material = new THREE.PointsMaterial({
    size: 1,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
  });

  particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);
}

// --- FLOATING TEXTS (Troika) ---
function createFloatingTexts() {
  const texts = ['1111', '333', 'light up', 'vibe check', 'glitch art', 'code + cannabis'];
  texts.forEach((text, i) => {
    const textMesh = new troika.Text();
    textMesh.text = text;
    textMesh.font = 'https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxK.woff2';
    textMesh.fontSize = 1.5;
    textMesh.color = new THREE.Color(CONFIG.colors[i % CONFIG.colors.length]);
    textMesh.position.set(
      (Math.random() - 0.5) * 60,
      (Math.random() - 0.5) * 40,
      -10 - Math.random() * 20
    );
    scene.add(textMesh);
    floatingTexts.push(textMesh);
  });
}

// --- ANIMATION LOOP ---
function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const time = clock.getElapsedTime();

  // Animate particles
  if (particleSystem) {
    const positions = particleSystem.geometry.attributes.position.array;
    const speeds = particleSystem.geometry.attributes.speed.array;

    for (let i = 0; i < CONFIG.particleCount; i++) {
      positions[i * 3 + 1] += speeds[i];
      positions[i * 3] += Math.sin(time * 0.5 + i) * 0.01;

      // Wrap around
      if (positions[i * 3 + 1] > 40) {
        positions[i * 3 + 1] = -40;
      }
    }
    particleSystem.geometry.attributes.position.needsUpdate = true;
    particleSystem.rotation.y = time * 0.02;
  }

  // Animate floating texts
  floatingTexts.forEach((text, i) => {
    text.position.x += Math.sin(time * 0.3 + i) * 0.02;
    text.position.y += Math.cos(time * 0.2 + i) * 0.01;
    text.rotation.z = Math.sin(time * 0.1 + i) * 0.1;
  });

  // Render with postprocessing
  composer.render();
}

// --- UI LOGIC ---
function addMessage(text, sender = 'user') {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${sender}`;
  msgDiv.innerHTML = `
    <span class="sender">${sender === 'user' ? 'You' : 'Epic Tech AI'}</span>
    <p>${escapeHtml(text)}</p>
  `;
  messagesContainer.appendChild(msgDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // Play sound
  if (sender === 'user') {
    soundEffects.send.play();
  } else {
    soundEffects.receive.play();
  }

  // Trigger particle burst
  if (sender === 'user') {
    createParticleBurst();
  }
}

function createParticleBurst() {
  // Add a burst of particles at center
  const burstCount = 50;
  const positions = particleSystem.geometry.attributes.position.array;
  const colors = particleSystem.geometry.attributes.color.array;
  const sizes = particleSystem.geometry.attributes.size.array;

  for (let i = 0; i < burstCount; i++) {
    const idx = Math.floor(Math.random() * CONFIG.particleCount);
    positions[idx * 3] = 0;
    positions[idx * 3 + 1] = 0;
    positions[idx * 3 + 2] = 0;
    colors[idx * 3] = 1;
    colors[idx * 3 + 1] = 0.8;
    colors[idx * 3 + 2] = 0;
    sizes[idx] = 3;
  }
  particleSystem.geometry.attributes.position.needsUpdate = true;
  particleSystem.geometry.attributes.color.needsUpdate = true;
  particleSystem.geometry.attributes.size.needsUpdate = true;
}

// Simulated AI response
function simulateAIResponse(userMessage) {
  const lower = userMessage.toLowerCase();
  let response = '';

  if (lower.includes('1111')) {
    response = "🔥 11:11 — The Universe is listening. What do you need to manifest? ✨";
  } else if (lower.includes('333')) {
    response = "🙏 333 — Gratitude is your superpower. Name one thing you're thankful for today.";
  } else if (lower.includes('light up') || lower.includes('smoke')) {
    response = "🌿 Light it up. Let the smoke rings carry your worries away. Breathe in clarity, exhale chaos.";
  } else if (lower.includes('code')) {
    response = "💻 Code is your spellbook. What magic are you casting today? 🪄";
  } else if (lower.includes('art')) {
    response = "🎨 Art is the glitch in the matrix. Show me your canvas — or generate one!";
  } else if (lower.includes('roast')) {
    response = "🔥 *leans in* Your code is messy, your fonts are clashing, and your color palette screams 'I gave up'... but I love it. Let's fix that.";
  } else if (lower.includes('affirmation')) {
    response = "✨ You are a creative force. Your ideas are valid. Your vibe is magnetic. Now go build something beautiful.";
  } else {
    response = "🌌 Your vibe is *chef's kiss* — but let's go deeper. Ask for a prompt, a roast, or just vibe check.";
  }

  // Delay for realism
  setTimeout(() => {
    addMessage(response, 'ai');
  }, 1200 + Math.random() * 1000);
}

// --- EVENT HANDLERS ---
function handleSend() {
  const text = messageInput.value.trim();
  if (!text) return;

  addMessage(text, 'user');
  messageInput.value = '';

  // Simulate AI response
  simulateAIResponse(text);
}

// Glitch effect on send
function triggerGlitch() {
  const originalStrength = bloomPass.strength;
  const originalRadius = bloomPass.radius;

  gsap.to(bloomPass, {
    strength: 2.5,
    radius: 0.8,
    duration: 0.1,
    yoyo: true,
    repeat: 3,
    onComplete: () => {
      gsap.to(bloomPass, {
        strength: CONFIG.bloomStrength,
        radius: CONFIG.bloomRadius,
        duration: 0.5,
      });
    }
  });

  soundEffects.glitch.play();
}

// --- UTILS ---
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  initThree();

  // Socket.io (stub for future backend)
  // const socket = io();
  // socket.on('connect', () => console.log('Connected to cosmos... 🌌'));
  // socket.on('message', (msg) => addMessage(msg, 'ai'));

  // Event Listeners
  sendBtn.addEventListener('click', () => {
    handleSend();
    triggerGlitch();
  });

  messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleSend();
      triggerGlitch();
    }
  });
});
