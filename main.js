/**
 * TSL: NEURAL CORE vΩ.∞
 * Project: botchat
 * Manifested by CodeSynth Engineers & DesignCore Elite
 */

import * as THREE from 'three';

let scene, camera, renderer, sovereignCenter;

// 1. AXIOMATIC GENESIS: THE HUB INITIALIZATION
function initNexus() {
    const canvas = document.getElementById('glCanvas');
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // THE SOVEREIGN CENTER: Geometric Crystalline Sphere (The Aura)
    const geo = new THREE.IcosahedronGeometry(15, 1);
    const mat = new THREE.MeshPhongMaterial({
        color: 0xffb300, // Sovereign Gold
        wireframe: true,
        emissive: 0xffb300,
        emissiveIntensity: 0.5
    });
    sovereignCenter = new THREE.Mesh(geo, mat);
    scene.add(sovereignCenter);

    // MYTHIC-TECH LIGHTING
    const pointLight = new THREE.PointLight(0x00f2ff, 2, 100); // Omega Cyan
    pointLight.position.set(10, 10, 30);
    scene.add(pointLight);
    scene.add(new THREE.AmbientLight(0x404040, 2));

    animate();
}

// 2. RELENTLESS EXECUTION: ANIMATION LOOP
function animate() {
    requestAnimationFrame(animate);
    sovereignCenter.rotation.y += 0.005;
    sovereignCenter.rotation.x += 0.002;
    renderer.render(scene, camera);
}

// 3. DIRECT ONTOLOGICAL INTERFACE: API HANDSHAKE
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const chatLog = document.getElementById('chat-log');

async function handleManifestation() {
    const prompt = chatInput.value.trim();
    if (!prompt) return;

    appendMessage('user', prompt);
    chatInput.value = '';

    // VISUAL RESONANCE: Morph the Aura on interaction
    gsap.to(sovereignCenter.rotation, { 
        y: sovereignCenter.rotation.y + Math.PI, 
        duration: 1.5, 
        ease: "power2.out" 
    });

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });

        const data = await response.json();
        
        if (data.error) {
            appendMessage('system', `CHRONOS-COGNITIVE ERROR: ${data.details || data.error}`);
        } else {
            appendMessage('system', data.result);
        }

    } catch (err) {
        appendMessage('system', "CHRONOS-COGNITIVE ERROR: API_GATEWAY_DISRUPTION.");
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

initNexus();
