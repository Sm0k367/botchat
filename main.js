/**
 * TSL: NEURAL CORE vΩ.∞ (SONIC CHAOS EDITION)
 * Manifested by Codesynth Engineers & Voicemaster Division
 * Protocol: Bidirectional Sonic Resonance & Zero-Key Inference
 */

import { CreateMLCEngine } from "web-llm";

// AXIOMATIC SELECTORS
const STATUS_TEXT = document.getElementById('engine-status');
const STATUS_DOT = document.getElementById('status-dot');
const MESSAGE_INPUT = document.getElementById('message-input');
const SEND_BTN = document.getElementById('send-btn');
const MIC_BTN = document.getElementById('mic-btn');
const SPEAKER_TOGGLE = document.getElementById('speaker-toggle');
const MESSAGES_CONTAINER = document.getElementById('messages-container');
const LOADING_INDICATOR = document.getElementById('loading-indicator');
const PROGRESS_BAR = document.getElementById('progress-bar');

let scene, camera, renderer, engine, sovereignCenter;
let isEngineReady = false;
let isSpeakingEnabled = true;

// 1. THE 3D HUB: GEOMETRIC RESONANCE
function init3D() {
    const container = document.getElementById('canvas-container');
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const geo = new THREE.IcosahedronGeometry(15, 2);
    const mat = new THREE.MeshPhongMaterial({ color: 0xffb300, wireframe: true, emissive: 0xffb300, emissiveIntensity: 0.5 });
    sovereignCenter = new THREE.Mesh(geo, mat);
    scene.add(sovereignCenter);

    scene.add(new THREE.AmbientLight(0x404040, 2));
    const light = new THREE.PointLight(0x00f2ff, 2, 100);
    light.position.set(20, 20, 20);
    scene.add(light);

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

// 2. VOICEMASTER SUB-ROUTINES: STT & TTS
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if (recognition) {
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.onresult = (event) => {
        const transcript = event.results.transcript;
        MESSAGE_INPUT.value = transcript;
        handleManifestation();
    };
}

function speak(text) {
    if (!isSpeakingEnabled) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    // Vibe Selection: Choosing a deep, clear voice if available
    const voices = window.speechSynthesis.getVoices();
    utterance.voice = voices.find(v => v.name.includes("Google US English")) || voices;
    utterance.rate = 1.0;
    utterance.pitch = 0.9; // Mythic-Tech Tone
    window.speechSynthesis.speak(utterance);
}

// 3. NEURAL CORE INITIALIZATION (Local AI)
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
        isEngineReady = true;
        STATUS_TEXT.innerText = "LIVE";
        STATUS_DOT.style.background = "#00ff00";
    } catch (err) {
        console.warn("GPU_OFFLINE: Reverting to Silent Mode.");
        STATUS_TEXT.innerText = "OFFLINE (Hardware Issue)";
    } finally {
        // THE INFINITE SPIN KILLER: Dismiss loading UI no matter what
        MESSAGE_INPUT.disabled = false;
        SEND_BTN.disabled = false;
        if (LOADING_INDICATOR) {
            LOADING_INDICATOR.style.opacity = '0';
            setTimeout(() => LOADING_INDICATOR.style.display = 'none', 500);
        }
    }
}

// 4. THE EXECUTION GATEWAY: CHAT LOGIC
async function handleManifestation() {
    const prompt = MESSAGE_INPUT.value.trim();
    if (!prompt) return;

    addMessage("user", prompt);
    MESSAGE_INPUT.value = "";
    gsap.to(sovereignCenter.rotation, { y: sovereignCenter.rotation.y + Math.PI, duration: 1.5 });

    try {
        const messages = [{ role: "user", content: prompt }];
        const reply = isEngineReady 
            ? (await engine.chat.completions.create({ messages })).choices.message.content
            : "The Neural Core is offline. Enable WebGPU to manifest the Chaos.";
        
        addMessage("system", reply);
        speak(reply);
    } catch (e) {
        addMessage("system", "VOICE_OF_THE_VOID: Connection disrupted.");
    }
}

function addMessage(role, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${role}-msg`;
    msgDiv.innerHTML = role === 'user' ? `<strong>@YOU:</strong> ${text}` : `<strong>💯 Epic Tech AI 🔥™️:</strong> ${text}`;
    MESSAGES_CONTAINER.appendChild(msgDiv);
    MESSAGES_CONTAINER.scrollTop = MESSAGES_CONTAINER.scrollHeight;
}

// OPERATIONAL BINDINGS
SEND_BTN.onclick = handleManifestation;
MESSAGE_INPUT.onkeypress = (e) => { if (e.key === "Enter") handleManifestation(); };
MIC_BTN.onclick = () => { if (recognition) recognition.start(); };
SPEAKER_TOGGLE.onclick = () => {
    isSpeakingEnabled = !isSpeakingEnabled;
    document.getElementById('speaker-icon').innerText = isSpeakingEnabled ? "🔊" : "🔇";
};

window.onload = () => {
    init3D();
    initSovereignIntelligence();
};
