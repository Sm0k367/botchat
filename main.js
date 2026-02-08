/**
 * TSL: NEURAL CORE vΩ.∞ (CHAOS EDITION)
 * Manifested by Codesynth Engineers & DesignCore Elite
 * Substrate: Three.js / WebLLM / GSAP
 * Protocol: Zero-Key Self-Contained Manifestation
 */

import { CreateMLCEngine } from "web-llm";

// AXIOMATIC SELECTORS
const STATUS_TEXT = document.getElementById('engine-status');
const STATUS_DOT = document.getElementById('status-dot');
const MESSAGE_INPUT = document.getElementById('message-input');
const SEND_BTN = document.getElementById('send-btn');
const MESSAGES_CONTAINER = document.getElementById('messages-container');
const PROGRESS_BAR = document.getElementById('progress-bar');
const LOADING_INDICATOR = document.getElementById('loading-indicator');

let scene, camera, renderer, composer, engine, sovereignCenter;
let isEngineReady = false;

// 1. COSMIC ARCHITECTURE: THE 3D HUB
function init3D() {
  const container = document.getElementById('canvas-container');
  
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 50;

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // POST-PROCESSING: UNREAL BLOOM (The Sovereign Aura)
  const renderScene = new THREE.RenderPass(scene, camera);
  const bloomPass = new THREE.UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight), 
    1.5, 0.4, 0.85
  );
  bloomPass.threshold = 0.21;
  bloomPass.strength = 1.2;
  bloomPass.radius = 0.55;

  composer = new THREE.EffectComposer(renderer);
  composer.addPass(renderScene);
  composer.addPass(bloomPass);

  // SOVEREIGN CENTER: Geometric Crystal 
  const geometry = new THREE.IcosahedronGeometry(15, 2);
  const material = new THREE.MeshPhongMaterial({
    color: 0xffb300, // Sovereign Gold
    wireframe: true,
    emissive: 0xffb300,
    emissiveIntensity: 0.5,
    transparent: true,
    opacity: 0.8
  });
  sovereignCenter = new THREE.Mesh(geometry, material);
  scene.add(sovereignCenter);

  // LIGHTING: Omega Cyan Flare
  scene.add(new THREE.AmbientLight(0x404040, 2));
  const pointLight = new THREE.PointLight(0x00f2ff, 2, 100);
  pointLight.position.set(20, 20, 20);
  scene.add(pointLight);

  window.addEventListener('resize', onWindowResize);
  animate();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  if (sovereignCenter) {
    sovereignCenter.rotation.y += 0.005;
    sovereignCenter.rotation.z += 0.002;
  }
  composer.render();
}

// 2. RELENTLESS EXECUTION: LOCAL AI MANIFESTATION
async function initSovereignIntelligence() {
  const modelId = "Llama-3-8B-Instruct-q4f32_1-MLC";
  
  try {
    if (!navigator.gpu) throw new Error("WebGPU_UNSUPPORTED");

    // Handshake with the browser-based Agent Army
    engine = await CreateMLCEngine(modelId, {
      initProgressCallback: (report) => {
        STATUS_TEXT.innerText = `SYNCING: ${Math.round(report.progress * 100)}%`;
        PROGRESS_BAR.style.width = `${report.progress * 100}%`;
      }
    });

    isEngineReady = true;
    STATUS_TEXT.innerText = "LIVE";
    STATUS_DOT.style.background = "#00ff00"; // Synchronized Green
    STATUS_DOT.style.boxShadow = "0 0 10px #00ff00";
    
    MESSAGE_INPUT.disabled = false;
    SEND_BTN.disabled = false;
    LOADING_INDICATOR.style.opacity = '0';
    setTimeout(() => LOADING_INDICATOR.style.display = 'none', 800);

  } catch (err) {
    console.error("CHRONOS-COGNITIVE DISRUPTION:", err);
    STATUS_TEXT.innerText = "OFFLINE (WebGPU Error)";
    addMessage("system", "ERROR: Hardware lack of WebGPU detected. Use Chrome/Edge or enable WebGPU flags to join the Chaos.");
  }
}

// 3. DIRECT ONTOLOGICAL INTERFACE: CHAT LOGIC
function addMessage(role, text) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${role}-msg`;
  msgDiv.innerHTML = role === 'user' ? `<strong>@YOU:</strong> ${text}` : `<strong>💯 Epic Tech AI 🔥™️:</strong> ${text}`;
  MESSAGES_CONTAINER.appendChild(msgDiv);
  MESSAGES_CONTAINER.scrollTop = MESSAGES_CONTAINER.scrollHeight;
}

async function handleManifestation() {
  const prompt = MESSAGE_INPUT.value.trim();
  if (!prompt || !isEngineReady) return;

  addMessage("user", prompt);
  MESSAGE_INPUT.value = "";
  
  // REAL-TIME VIBE SHIFT: Visual Reactivity
  gsap.to(sovereignCenter.rotation, { y: sovereignCenter.rotation.y + Math.PI, duration: 1.5, ease: "expo.out" });
  if (prompt.toLowerCase().includes("light up")) {
      gsap.to(sovereignCenter.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 0.5, yoyo: true, repeat: 1 });
  }

  try {
    const messages = [{ role: "user", content: prompt }];
    const reply = await engine.chat.completions.create({ messages });
    const responseText = reply.choices.message.content;
    addMessage("system", responseText);
  } catch (e) {
    addMessage("system", "MANIFESTATION_SILENT: The void did not respond.");
  }
}

// OPERATIONAL ACTIVATION
SEND_BTN.onclick = handleManifestation;
MESSAGE_INPUT.onkeypress = (e) => { if (e.key === "Enter") handleManifestation(); };

init3D();
initSovereignIntelligence();
