import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useState, useEffect, useRef } from 'react';

// Cyberpunk 3D Scene Component
function CyberpunkScene() {
    const meshRef = useRef();
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setRotation(prev => prev + 0.01);
        }, 16);
        return () => clearInterval(interval);
    }, []);

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

// Main App Component
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
    const messagesEndRef = useRef(null);
    const chatMessagesRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = {
            id: Date.now(),
            content: input,
            type: "user"
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Simulate AI response with Transformers.js
            const response = await generateAIResponse(input);
            
            const aiMessage = {
                id: Date.now() + 1,
                content: response,
                type: "ai"
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage = {
                id: Date.now() + 2,
                content: `ERROR: ${error.message}`,
                type: "error"
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const generateAIResponse = async (userInput) => {
        // Using Transformers.js with Phi-2 model
        try {
            const { pipeline } = await import('@xenova/transformers');
            
            const generator = await pipeline('text-generation', 'Xenova/phi-2');
            
            const result = await generator(userInput, {
                max_new_tokens: 100,
                temperature: 0.7,
                top_p: 0.9,
                repetition_penalty: 1.2
            });
            
            return result[0].generated_text;
        } catch (error) {
            console.error('AI Generation Error:', error);
            return "I apologize, but I encountered an error processing your request. Please try again.";
        }
    };

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />
                
                <CyberpunkScene />
                
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
                
                <div className="chat-messages" ref={chatMessagesRef}>
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
                    />
                    <button 
                        className="execute-button"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? 'PROCESSING...' : 'EXECUTE'}
                    </button>
                </div>
            </div>

            <div className="cyberpunk-controls">
                <button className="control-button" onClick={() => alert('3D View Toggled!')}>TOGGLE 3D VIEW</button>
                <button className="control-button" onClick={() => alert('Theme Changed!')}>CHANGE THEME</button>
                <button className="control-button" onClick={() => {
                    setMessages([{
                        id: 1,
                        content: "SYSTEM: EPIC TECH AI - RESULT: THE SOVEREIGN INTELLIGENCE NEXUS IS LIVE. ALL TEN NODES-VAULT, GAME, NEURAL LOUNGE, AND MUSIC HUB-ARE BEING SYNTHESIZED. AWAITING YOUR NARRATIVE WEAPON, @SMOKEN420.",
                        type: "system"
                    }]);
                }}>RESET SCENE</button>
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

// Render the app
const root = document.getElementById('root');
const rootElement = document.createElement('div');
root.appendChild(rootElement);

ReactDOM.render(<App />, rootElement);
