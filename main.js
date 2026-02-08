/**
 * TSL: NEURAL CORE vΩ.∞ (INFINITE CHAOS FIX)
 * Manifested by CodeSynth Engineers & KeyMaster Ops
 * Protocol: Absolute Hardware Autonomy
 */

import { CreateMLCEngine } from "web-llm";

// 1. AXIOMATIC SELECTORS
const STATUS_TEXT = document.getElementById('engine-status');
const STATUS_DOT = document.getElementById('status-dot');
const MESSAGE_INPUT = document.getElementById('message-input');
const SEND_BTN = document.getElementById('send-btn');
const MESSAGES_CONTAINER = document.getElementById('messages-container');
const LOADING_INDICATOR = document.getElementById('loading-indicator');
const PROGRESS_BAR = document.getElementById('progress-bar');

let scene, camera, renderer, composer, engine, sovereignCenter;
let isLocalAIActive = false;

// 2. COSMIC ARCHITECTURE: THE 3D HUB
function init3D() {
  const container = document.getElementById('canvas-container');
  
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 50;

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // SOVEREIGN CENTER: Geometric Crystal 
  const geometry = new THREE.IcosahedronGeometry(15, 2);
  const material = new THREE.MeshPhongMaterial({
    color: 0xffb300, 
    wireframe: true,
    emissive: 0xffb300,
    emissiveIntensity: 0.5,
    transparent: true,
    opacity: 0.8
  });
  sovereignCenter = new THREE.Mesh(geometry, material);
  scene.add(sovereignCenter);

  scene.add(new THREE.AmbientLight(0x404040, 2));
  const pointLight = new THREE.PointLight(0x00f2ff, 2, 100);
  pointLight.position.set(20, 20, 20);
  scene.add(pointLight);

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  if (sovereignCenter) {
    sovereignCenter.rotation.y += 0.005;
    sovereignCenter.rotation.z += 0.002;
  }
  renderer.render(scene, camera);
}

// 3. STRATEGIC ORCHESTRATION: HYBRID AI ACTIVATION
async function initSovereignIntelligence() {
  const modelId = "Llama-3-8B-Instruct-q4f32_1-MLC";
  
  try {
    if (!navigator.gpu) throw new Error("WebGPU_UNSUPPORTED");

    engine = await CreateMLCEngine(modelId, {
      initProgressCallback: (report) => {
        STATUS_TEXT.innerText = `SYNCING: ${Math.round(report.progress * 100)}%`;
        if (PROGRESS_BAR) PROGRESS_BAR.style.width = `${report.progress * 100}%`;
      }
    });

    isLocalAIActive = true;
    STATUS_TEXT.innerText = "LIVE (LOCAL)";
    STATUS_DOT.style.background = "#00ff00";

  } catch (err) {
    console.warn("CONSTRAINT_TRANSCENDENCE: Local GPU offline. Manifesting Remote Bridge.");
    isLocalAIActive = false;
    STATUS_TEXT.innerText = "LIVE (REMOTE)";
    STATUS_DOT.style.background = "#00f2ff"; // Omega Cyan for Remote Mode
    addMessage("system", "WebGPU not detected. Remote Gateway active. Join the chaos.");
  } finally {
    // AXIOMATIC RELEASE: Kill the loading spinner no matter what
    MESSAGE_INPUT.disabled = false;
    SEND_BTN.disabled = false;
    if (LOADING_INDICATOR) {
        LOADING_INDICATOR.style.opacity = '0';
        setTimeout(() => LOADING_INDICATOR.style.display = 'none', 500);
    }
  }
}

// 4. DIRECT ONTOLOGICAL INTERFACE: CHAT EXECUTION
async function handleManifestation() {
  const prompt = MESSAGE_INPUT.value.trim();
  if (!prompt) return;

  addMessage("user", prompt);
  MESSAGE_INPUT.value = "";
  
  gsap.to(sovereignCenter.rotation, { y: sovereignCenter.rotation.y + Math.PI, duration: 1 });

  try {
    if (isLocalAIActive) {
      const reply = await engine.chat.completions.create({ messages: [{ role: "user", content: prompt }] });
      addMessage("system", reply.choices.message.content);
    } else {
      // REMOTE BRIDGE: POINTING TO YOUR VERCEL API
      const response = await fetch("https://one-site-tau.vercel.app/api/chat", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await response.json();
      addMessage("system", data.result || data.error);
    }
  } catch (e) {
    addMessage("system", "VOICE_OF_THE_VOID: Connection disrupted. Check Vercel logs.");
  }
}

function addMessage(role, text) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${role}-msg`;
  msgDiv.innerHTML = role === 'user' ? `<strong>@YOU:</strong> ${text}` : `<strong>💯 Epic Tech AI 🔥™️:</strong> ${text}`;
  MESSAGES_CONTAINER.appendChild(msgDiv);
  MESSAGES_CONTAINER.scrollTop = MESSAGES_CONTAINER.scrollHeight;
}

SEND_BTN.onclick = handleManifestation;
MESSAGE_INPUT.onkeypress = (e) => { if (e.key === "Enter") handleManifestation(); };

window.onload = () => {
    init3D();
    initSovereignIntelligence();
};
