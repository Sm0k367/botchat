import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Text } from '@react-three/drei';
import { useState, useEffect, useRef, useCallback } from 'react';

// Cyberpunk 3D Scene Component with optimized performance
function CyberpunkScene({ onSceneReady }) {
    const meshRef = useRef();
    const [rotation, setRotation] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading for 3D assets
        const loadTimer = setTimeout(() => {
            setIsLoading(false);
            if (onSceneReady) onSceneReady();
        }, 1000);

        return () => clearTimeout(loadTimer);
    }, [onSceneReady]);

    useEffect(() => {
        const interval = setInterval(() => {
            setRotation(prev => prev + 0.01);
        }, 16);
        return () => clearInterval(interval);
    }, []);

    if (isLoading) {
        return (
            <div className="scene-loader">
                <div className="loader-spinner"></div>
                <div>LOADING 3D SCENE...</div>
            </div>
        );
    }

    return (
        <mesh ref={meshRef} rotation={[0, rotation, 0]}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial 
                color="#00ffff" 
                emissive="#00ffff" 
                emissiveIntensity={0.5}
                wireframe
            />
        </mesh>
    );
}

// Main App Component with enhanced features
function App() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            content: "SYSTEM: EPIC TECH AI - RESULT: THE SOVEREIGN INTELLIGENCE NEXUS IS LIVE. ALL TEN NODES-VAULT, GAME, NEURAL LOUNGE, AND MUSIC HUB-ARE BEING SYNTHESIZED. AWAITING YOUR NARRATIVE WEAPON, @SMOKEN420.",
            type: "system"
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [theme, setTheme] = useState('dark');
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);
    const messagesEndRef = useRef(null);
    const chatMessagesRef = useRef(null);
    const aiModelRef = useRef(null);

    // Theme management
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('app-theme', theme);
    }, [theme]);

    // Load saved messages from localStorage
    useEffect(() => {
        const savedMessages = localStorage.getItem('chat-messages');
        if (savedMessages) {
            try {
                setMessages(JSON.parse(savedMessages));
            } catch (e) {
                console.error('Error loading saved messages:', e);
            }
        }
    }, []);

    // Save messages to localStorage
    useEffect(() => {
        localStorage.setItem('chat-messages', JSON.stringify(messages));
    }, [messages]);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // Enhanced AI response generation with error handling
    const generateAIResponse = async (userInput, retry = false) => {
        try {
            // Simulate AI processing with Transformers.js
            const { pipeline } = await import('@xenova/transformers');
            
            if (!aiModelRef.current) {
                aiModelRef.current = await pipeline('text-generation', 'Xenova/phi-2');
            }

            const result = await aiModelRef.current(userInput, {
                max_new_tokens: 100,
                temperature: 0.7,
                top_p: 0.9,
                repetition_penalty: 1.2
            });
            
            return result[0].generated_text;
        } catch (error) {
            console.error('AI Generation Error:', error);
            
            if (retry && retryCount < 3) {
                setRetryCount(prev => prev + 1);
                await new Promise(resolve => setTimeout(resolve, 1000));
                return generateAIResponse(userInput, true);
            }
            
            throw error;
        }
    };

    // Chat submission with enhanced error handling
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = {
            id: Date.now(),
            content: input,
            type: "user",
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setError(null);
        setRetryCount(0);

        try {
            const response = await generateAIResponse(input);
            
            const aiMessage = {
                id: Date.now() + 1,
                content: response,
                type: "ai",
                timestamp: new Date().toISOString()
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage = {
                id: Date.now() + 2,
                content: `ERROR: AI processing failed. Please try again. ${retryCount > 0 ? `Retry attempt ${retryCount + 1} of 3.` : ''}`,
                type: "error",
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, errorMessage]);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Theme switching
    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    // Reset scene
    const resetScene = () => {
        setMessages([{
            id: 1,
            content: "SYSTEM: EPIC TECH AI - RESULT: THE SOVEREIGN INTELLIGENCE NEXUS IS LIVE. ALL TEN NODES-VAULT, GAME, NEURAL LOUNGE, AND MUSIC HUB-ARE BEING SYNTHESIZED. AWAITING YOUR NARRATIVE WEAPON, @SMOKEN420.",
            type: "system"
        }]);
        setError(null);
        setRetryCount(0);
    };

    // Keyboard navigation support
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'Enter' && document.activeElement === document.getElementById('chatInput')) {
                handleSubmit(e);
            }
            if (e.key === 't' && e.ctrlKey) {
                toggleTheme();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [input, isLoading]);

    // Analytics tracking
    const trackEvent = (eventName, eventData = {}) => {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                'event_category': 'chat_interaction',
                'event_label': eventName,
                ...eventData
            });
        }
    };

    // User feedback collection
    const collectFeedback = (rating, comment) => {
        trackEvent('user_feedback', { rating, comment_length: comment.length });
        // Send feedback to server or store locally
        console.log('User feedback:', { rating, comment });
    };

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />
                
                <CyberpunkScene onSceneReady={() => trackEvent('3d_scene_loaded')} />
                
                <OrbitControls 
                    enableZoom={true}
                    enablePan={true}
                    enableRotate={true}
                    minDistance={3}
                    maxDistance={10}
                />
            </Canvas>

            <div className="chat-container">
                <div className="chat-header">
                    <div className="chat-title">AI TERMINAL</div>
                    <div className="chat-status">CONNECTED</div>
                </div>
                
                <div className="chat-messages" ref={chatMessagesRef} aria-live="polite">
                    {messages.map(message => (
                        <div key={message.id} className={`message ${message.type}-message`}>
                            <strong>{message.type.toUpperCase()}:</strong> {message.content}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="message ai-message">
                            <span>AI:</span>
                            <span className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </span>
                        </div>
                    )}
                    {error && (
                        <div className="message error-message">
                            <div className="error-state">
                                <strong>ERROR:</strong> {error}
                                <button 
                                    className="retry-button"
                                    onClick={() => handleSubmit({ preventDefault: () => {} })}
                                >
                                    Retry
                                </button>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                
                <div className="chat-input-container">
                    <input
                        type="text"
                        className="chat-input"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                        placeholder="MANIFEST YOUR REALITY..."
                        disabled={isLoading}
                        aria-label="Enter your message"
                    />
                    <button 
                        className="execute-button"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        aria-label="Send message"
                    >
                        {isLoading ? 'PROCESSING...' : 'EXECUTE'}
                    </button>
                </div>
            </div>

            <div className="cyberpunk-controls">
                <button 
                    className="control-button" 
                    onClick={() => {
                        trackEvent('toggle_3d_view');
                        alert('3D View Toggled!');
                    }}
                    aria-label="Toggle 3D view"
                >
                    TOGGLE 3D VIEW
                </button>
                <button 
                    className="control-button" 
                    onClick={toggleTheme}
                    aria-label="Change theme"
                >
                    CHANGE THEME
                </button>
                <button 
                    className="control-button" 
                    onClick={resetScene}
                    aria-label="Reset scene"
                >
                    RESET SCENE
                </button>
            </div>

            <div className="data-stream">
                <div className="data-line">INITIALIZING NEURAL NETWORK...</div>
                <div className="data-line">PROCESSING USER INPUT...</div>
                <div className="data-line">SYNCING MULTI_MODAL_NODES...</div>
                <div className="data-line">ANALYZING PATTERNS...</div>
                <div className="data-line">GENERATING RESPONSE...</div>
                <div className="data-line">OPTIMIZING PERFORMANCE...</div>
                <div className="data-line">UPLOADING TO CLOUD...</div>
                <div className="data-line">DOWNLOADING KNOWLEDGE BASE...</div>
                <div className="data-line">CALIBRATING SENSORS...</div>
                <div className="data-line">CONNECTING TO MAINFRAME...</div>
            </div>
        </div>
    );
}

// Initialize Three.js scene with optimized performance
function initThreeJS() {
    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x0a0a0a, 1);

    // Add lights with optimized performance
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00ffff, 1, 100);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff00ff, 0.5, 100);
    pointLight2.position.set(-10, -10, -10);
    scene.add(pointLight2);

    // Add optimized cyberpunk cube
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.5,
        wireframe: true
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    // Animation loop with optimized performance
    function animate() {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
    animate();

    // Handle window resize with debouncing
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }, 100);
    });
}

// Render the app with error boundary
function renderApp() {
    try {
        const root = document.getElementById('root');
        const rootElement = document.createElement('div');
        root.appendChild(rootElement);
        ReactDOM.render(<App />, rootElement);
        initThreeJS();
    } catch (error) {
        console.error('App rendering error:', error);
        const root = document.getElementById('root');
        root.innerHTML = `
            <div class="error-state" style="padding: 20px; text-align: center;">
                <h2>Application Error</h2>
                <p>Sorry, an error occurred while loading the application.</p>
                <button onclick="location.reload()">Reload Page</button>
            </div>
        `;
    }
}

// Start the application
renderApp();

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    trackEvent('global_error', { error: event.error?.message });
});
