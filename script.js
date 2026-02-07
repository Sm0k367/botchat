// Import required libraries
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/js/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/js/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/js/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/js/postprocessing/ShaderPass.js';
import { CopyShader } from 'three/examples/js/shaders/CopyShader.js';
import { GodRaysShader } from 'three/examples/js/shaders/GodRaysShader.js';
import * as gsap from 'gsap';
import * as howler from 'howler';
import * as io from 'socket.io-client';

// Initialize variables
let canvas = document.getElementById('canvas-container');
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
});
let effectComposer = new EffectComposer(renderer);
let renderPass = new RenderPass(scene, camera);
let unrealBloomPass = new UnrealBloomPass(new THREE.Vector3(0, 0, 0), 1.5, 0.4, 0.85, 3, false, 0.04);
let shaderPass = new ShaderPass(new CopyShader());
let godRaysShader = new GodRaysShader();
let godRaysPass = new godRaysShader();

// Set up socket.io connection
const socket = io('http://localhost:3000');

// Set up audio
const audioContext = new AudioContext();
const audioBuffer = howler.loadSync('audio/sound effects.mp3');
const audioSource = audioContext.createBufferSource();
audioSource.buffer = audioBuffer;
audioSource.connect(audioContext.destination);
audioSource.start();

// Set up input and send button
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

// Send message function
function sendMessage() {
  const message = messageInput.value;
  socket.emit('message', message);
  messageInput.value = '';
}

// Render scene
function renderScene() {
  effectComposer.render(renderPass, camera);
  unrealBloomPass.render(target: effectComposer.renderTarget2);
  shaderPass.render(target: effectComposer.renderTarget2);
  godRaysPass.render(target: effectComposer.renderTarget3);
  requestAnimationFrame(renderScene);
}

// Initialize socket.io event listeners
socket.on('connect', () => {
  console.log('Connected to server');
});
socket.on('message', (message) => {
  console.log(`Received message: ${message}`);
  // Render message
});

// Start rendering
renderScene();
