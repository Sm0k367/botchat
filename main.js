// Main application for Epic Tech AI 3D Chat
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js';
import { GodRaysShader } from 'three/examples/jsm/shaders/GodRaysShader.js';
import TroikaText from 'troika-three-text';
import gsap from 'gsap';
import Howler from 'howler';
import io from 'socket.io-client';

// Global variables
let scene, camera, renderer, composer;
let bloomPass, godRaysPass;
let chatMessages = [];
let isLoading = true;
let socket;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  initThreeJS();
  initChat();
  initSocketIO();
  initAudio();
  hideLoadingIndicator();
});

// Initialize Three.js scene with post-processing
function initThreeJS() {
  const container = document.getElementById('canvas-container');
  
  // Scene setup
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 1, 100);
  
  // Camera setup
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;
  
  // Renderer setup
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);
  
  // Post-processing setup
  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  
  // Bloom pass for neon effect
  bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5,
    0.4,
    0.85
  );
  composer.addPass(bloomPass);
  
  // God rays pass
  godRaysPass = new ShaderPass(GodRaysShader);
  godRaysPass.uniforms.tDiffuse.value = composer.renderTarget2.texture;
  godRaysPass.uniforms.fogColor.value = new THREE.Color(0x000000);
  godRaysPass.uniforms.fogDensity.value = 0.00025;
  composer.addPass(godRaysPass);
  
  // Add lights
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);
  
  const pointLight1 = new THREE.PointLight(0x00ffff, 2, 100);
  pointLight1.position.set(10, 10, 10);
  scene.add(pointLight1);
  
  const pointLight2 = new THREE.PointLight(0xff00ff, 1, 100);
  pointLight2.position.set(-10, -10, -10);
  scene.add(pointLight2);
  
  // Create 3D text
  create3DText();
  
  // Create particles
  createParticles();
  
  // Animation loop
  animate();
  
  // Handle window resize
  window.addEventListener('resize', onWindowResize);
}

// Create 3D text with Troika
function create3DText() {
  const text = new TroikaText();
  text.text = 'EPIC TECH AI';
  text.fontSize = 2;
  text.color = '#00ffff';
  text.font = 'Orbitron';
  text.anchorX = 'center';
  text.anchorY = 'middle';
  text.position.set(0, 0, 0);
  text.sync();
  scene.add(text);
  
  // Animate the text
  gsap.to(text.position, {
    y: 2,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'power2.inOut'
  });
}

// Create particle system
function createParticles() {
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 1000;
  const posArray = new Float32Array(particlesCount * 3);
  
  for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 50;
  }
  
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.005,
    color: '#00ffff'
  });
  
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);
  
  // Animate particles
  gsap.to(particlesMesh.rotation, {
    y: Math.PI * 2,
    duration: 60,
    repeat: -1,
    ease: 'none'
  });
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  // Rotate scene slightly
  if (scene) {
    scene.rotation.y += 0.001;
  }
  
  composer.render();
}

// Handle window resize
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
}

// Initialize chat functionality
function initChat() {
  const messageInput = document.getElementById('message-input');
  const sendBtn = document.getElementById('send-btn');
  
  sendBtn.addEventListener('click', sendMessage);
  messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
}

// Send message function
function sendMessage() {
  const messageInput = document.getElementById('message-input');
  const message = messageInput.value.trim();
  
  if (message) {
    addMessage(message, 'user');
    messageInput.value = '';
    
    // Simulate AI response
    simulateAIResponse(message);
  }
}

// Add message to chat
function addMessage(text, type) {
  const messagesContainer = document.getElementById('messages-container');
  const messageElement = document.createElement('div');
  messageElement.className = `message message-${type}`;
  
  if (type === 'user') {
    messageElement.innerHTML = `<strong>YOU:</strong> ${text}`;
  } else {
    messageElement.innerHTML = `<strong>AI:</strong> ${text}`;
  }
  
  messagesContainer.appendChild(messageElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Simulate AI response
function simulateAIResponse(userMessage) {
  // Show typing indicator
  const typingIndicator = document.createElement('div');
  typingIndicator.className = 'message message-ai typing';
  typingIndicator.innerHTML = '<strong>AI:</strong> <span class="typing-dots">...</span>';
  document.getElementById('messages-container').appendChild(typingIndicator);
  
  // Simulate processing delay
  setTimeout(() => {
    // Remove typing indicator
    typingIndicator.remove();
    
    // Generate response based on user input
    let response;
    if (userMessage.toLowerCase().includes('1111')) {
      response = 'Awakening vibes activated! 🌅 The universe is expanding and your consciousness is rising. Feel the energy flowing through you like electric currents. 🌿✨';
    } else if (userMessage.toLowerCase().includes('333')) {
      response = 'Gratitude mode engaged! 🙏 Every breath is a gift, every moment is precious. Thank the universe for this beautiful chaos we call life. 🌟';
    } else if (userMessage.toLowerCase().includes('light up')) {
      response = 'Smoke rings activated! 🌫️ Watch as the digital smoke dances around you, creating patterns of light and shadow. The atmosphere is thick with creative energy. ✨';
    } else if (userMessage.toLowerCase().includes('code')) {
      response = 'Code mode activated! 🖥️ Let\'s dive into the digital realm. What kind of code are we creating today? A website, a game, or perhaps something more... mysterious? 🌿';
    } else if (userMessage.toLowerCase().includes('art')) {
      response = 'Art mode engaged! 🎨 The canvas is your playground. Let\'s create something that makes the soul sing and the eyes dance. What artistic vision do you have in mind? 🌟';
    } else if (userMessage.toLowerCase().includes('music')) {
      response = 'Music mode activated! 🎵 Let the rhythm take control. What kind of soundscape are we crafting? Electronic beats, acoustic melodies, or perhaps something that defies categorization? 🌿';
    } else {
      response = `Interesting query! 🔥 As your multimedia artist and code slinger, I appreciate the creative energy. Tell me more about what you\'re envisioning. The cosmos is ready to manifest your desires. 🌟`;
    }
    
    addMessage(response, 'ai');
  }, 1500);
}

// Initialize Socket.IO
function initSocketIO() {
  // For demo purposes, we'll use a mock socket
  // In production, you would connect to your actual Socket.IO server
  console.log('Socket.IO initialized (mock mode)');
  
  // Simulate socket events
  setTimeout(() => {
    addMessage('Connection established to the cosmic network! 🌌', 'system');
  }, 2000);
}

// Initialize audio system
function initAudio() {
  // Create Howler sound instance
  const sound = new Howler({
    src: ['https://example.com/notification-sound.mp3'],
    volume: 0.5,
    loop: false,
    preload: true
  });
  
  // Store sound reference
  window.chatSound = sound;
  
  console.log('Audio system initialized');
}

// Hide loading indicator
function hideLoadingIndicator() {
  const loadingIndicator = document.getElementById('loading-indicator');
  if (loadingIndicator) {
    loadingIndicator.style.display = 'none';
  }
  isLoading = false;
}

// Error handling
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  if (!isLoading) {
    addMessage('Oops! Something went wrong. Please try again. 🔥', 'ai');
  }
});
