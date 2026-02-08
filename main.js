/**
 * TSL: HYBRID NEURAL CORE vΩ.∞
 * Manifested by CodeSynth Engineers & KeyMaster Ops
 * Protocol: Automatic Fallback & Constraint Transcendence
 */

import * as THREE from 'three';
import { CreateMLCEngine } from "web-llm";

let scene, camera, renderer, sovereignCenter, engine;
let isLocalAIActive = false;

const chatLog = document.getElementById('chat-log');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const statusDisplay = document.getElementById('engine-status');
const progressBar = document.getElementById('progress-bar');

// 1. AXIOMATIC GENESIS: 3D HUB
function initVisualNexus() {
    const canvas = document.getElementById('glCanvas');
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const geo = new THREE.IcosahedronGeometry(15, 1);
    const mat = new THREE.MeshPhongMaterial({ color: 0xffb300, wireframe: true, emissive: 0xffb300, emissiveIntensity: 0.5 });
    sovereignCenter = new THREE.Mesh(geo, mat);
    scene.add(sovereignCenter);

    const pointLight = new THREE.PointLight(0x00f2ff, 2, 100);
    pointLight.position.set(10, 10, 30);
    scene.add(pointLight);
    scene.add(new THREE.AmbientLight(0x404040, 2));

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    sovereignCenter.rotation.y += 0.005;
    renderer.render(scene, camera);
}

// 2. STRATEGIC ORCHESTRATION: AI INITIALIZATION
async function initSovereignIntelligence() {
    const selectedModel = "Llama-3-8B-Instruct-q4f32_1-MLC";

    try {
        // Attempting WebGPU Local Manifestation
        if (!navigator.gpu) throw new Error("WebGPU_UNSUPPORTED");

        engine = await CreateMLCEngine(selectedModel, {
            initProgressCallback: (report) => {
                statusDisplay.innerText = report.text;
                progressBar.style.width = `${report.progress * 100}%`;
            }
        });

        isLocalAIActive = true;
        statusDisplay.innerText = "LOCAL NEURAL CORE ACTIVE.";
        chatInput.disabled = false;
        sendBtn.disabled = false;
        progressBar.parentElement.style.display = 'none';

    } catch (error) {
        // CONSTRAINT TRANSCENDENCE: Fallback to Remote Vercel API
        console.warn("WEBGPU_NOT_FOUND: Switching to Remote Gateway...");
        statusDisplay.innerText = "MODE: REMOTE GATEWAY (Vercel Bridge)";
        isLocalAIActive = false;
        chatInput.disabled = false;
        sendBtn.disabled = false;
        progressBar.parentElement.style.display = 'none';
        
        appendMessage('system', "LOCAL WEBGPU NOT DETECTED. Remote fallback enabled. Connection: SECURE.");
    }
}

// 3. DIRECT ONTOLOGICAL INTERFACE: CHAT EXECUTION
async function handleManifestation() {
    const prompt = chatInput.value.trim();
    if (!prompt) return;

    appendMessage('user', prompt);
    chatInput.value = '';
    gsap.to(sovereignCenter.rotation, { y: sovereignCenter.rotation.y + Math.PI, duration: 1.5, ease: "power2.out" });

    try {
        if (isLocalAIActive) {
            // Local Inference
            const reply = await engine.chat.completions.create({ messages: [{ role: "user", content: prompt }] });
            appendMessage('system', reply.choices.message.content);
        } else {
            // REMOTE FALLBACK: Calling your Vercel URL
            // REPLACE the URL below with your actual Vercel deployment URL
            const REMOTE_API = "https://one-site-tau.vercel.app/api/chat";
            const response = await fetch(REMOTE_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });
            const data = await response.json();
            appendMessage('system', data.result || data.error);
        }
    } catch (err) {
        appendMessage('system', "CHRONOS-COGNITIVE DISRUPTION: Connection lost.");
    }
}

function appendMessage(role, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${role}-msg`;
    msgDiv.innerText = role === 'user' ? `@SM0KEN420: ${text}` : `EPIC TECH AI — Result: ${text}`;
    chatLog.appendChild(msgDiv);
    chatLog.scrollTop = chatLog.scrollHeight;
}

sendBtn.onclick = handleManifestation;
chatInput.onkeypress = (e) => { if (e.key === 'Enter') handleManifestation(); };
initVisualNexus();
initSovereignIntelligence();
