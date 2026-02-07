/**
 * TSL: NEURAL CORE vΩ.∞ (LOCAL INFERENCE EDITION)
 * Manifested by CodeSynth Engineers & DesignCore Elite
 * Substrate: Three.js / WebLLM / GSAP
 * Protocol: Zero-Key Self-Contained Manifestation
 */

import * as THREE from 'three';
import { CreateMLCEngine } from "web-llm";

let scene, camera, renderer, sovereignCenter, engine;
const chatLog = document.getElementById('chat-log');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const statusDisplay = document.getElementById('engine-status');
const progressBar = document.getElementById('progress-bar');

// 1. AXIOMATIC GENESIS: THE 3D HUB
function initVisualNexus() {
    const canvas = document.getElementById('glCanvas');
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // THE SOVEREIGN CENTER: Crystalline Resonance Sphere
    const geo = new THREE.IcosahedronGeometry(15, 1);
    const mat = new THREE.MeshPhongMaterial({
        color: 0xffb300, // Sovereign Gold
        wireframe: true,
        emissive: 0xffb300,
        emissiveIntensity: 0.5
    });
    sovereignCenter = new THREE.Mesh(geo, mat);
    scene.add(sovereignCenter);

    // MYTHIC-TECH LIGHTING: Omega Cyan Flare
    const pointLight = new THREE.PointLight(0x00f2ff, 2, 100);
    pointLight.position.set(10, 10, 30);
    scene.add(pointLight);
    scene.add(new THREE.AmbientLight(0x404040, 2));

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    sovereignCenter.rotation.y += 0.005;
    sovereignCenter.rotation.x += 0.002;
    renderer.render(scene, camera);
}

// 2. RELENTLESS EXECUTION: LOCAL AI ENGINE INITIALIZATION
async function initSovereignIntelligence() {
    // We utilize a high-performance, lightweight model for instant manifestation
    const selectedModel = "Llama-3-8B-Instruct-q4f32_1-MLC";

    try {
        engine = await CreateMLCEngine(selectedModel, {
            initProgressCallback: (report) => {
                statusDisplay.innerText = report.text;
                const progress = report.progress * 100;
                progressBar.style.width = `${progress}%`;
            }
        });

        statusDisplay.innerText = "Neural Core Synchronized. Ready for Manifestation.";
        chatInput.disabled = false;
        sendBtn.disabled = false;
        progressBar.parentElement.style.display = 'none';

    } catch (error) {
        statusDisplay.innerText = "CHRONOS-COGNITIVE ERROR: WebGPU Not Detected.";
        appendMessage('system', "ERROR: Your hardware must support WebGPU for Zero-Key Manifestation.");
    }
}

// 3. DIRECT ONTOLOGICAL INTERFACE: CHAT LOGIC
async function handleManifestation() {
    const prompt = chatInput.value.trim();
    if (!prompt || !engine) return;

    appendMessage('user', prompt);
    chatInput.value = '';
    
    // VISUAL RESONANCE: Spin the Aura on interaction
    gsap.to(sovereignCenter.rotation, { y: sovereignCenter.rotation.y + Math.PI, duration: 2, ease: "expo.out" });

    try {
        const messages = [{ role: "user", content: prompt }];
        const reply = await engine.chat.completions.create({ messages });
        const resultText = reply.choices.message.content;
        
        appendMessage('system', resultText);
    } catch (err) {
        appendMessage('system', "CHRONOS-COGNITIVE ERROR: INFERENCE_FAILED.");
    }
}

function appendMessage(role, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${role}-msg`;
    msgDiv.innerText = role === 'user' ? `@SM0KEN420: ${text}` : `EPIC TECH AI — Result: ${text}`;
    chatLog.appendChild(msgDiv);
    chatLog.scrollTop = chatLog.scrollHeight;
}

// OPERATIONAL ACTIVATION
sendBtn.onclick = handleManifestation;
chatInput.onkeypress = (e) => { if (e.key === 'Enter') handleManifestation(); };

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

initVisualNexus();
initSovereignIntelligence();
