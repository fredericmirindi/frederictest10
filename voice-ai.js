// AI Voice Assistant
class VoiceAI {
    constructor() {
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.isListening = false;
        this.voiceBtn = document.getElementById('voiceBtn');
        
        this.responses = {
            greeting: [
                "Welcome to the quantum realm of research!",
                "Greetings, fellow explorer of AI frontiers!",
                "Hello! Ready to dive into quantum computing?"
            ],
            research: [
                "My research focuses on quantum machine learning and 6G neural networks.",
                "I'm pioneering AI systems optimized for next-generation connectivity.",
                "Quantum algorithms are revolutionizing economic modeling with exponential speed advantages."
            ],
            ai: [
                "Artificial Intelligence is the key to unlocking quantum computing's potential.",
                "AI-driven 6G networks will process data at terabit speeds with microsecond latency.",
                "Neural networks and quantum computing create unprecedented computational power."
            ],
            quantum: [
                "Quantum computing offers exponential speedup for complex economic problems.",
                "Quantum entanglement enables ultra-secure communication protocols.",
                "The quantum internet will revolutionize how we process information."
            ],
            contact: [
                "You can reach me at frederic.mirindi@umanitoba.ca for collaboration.",
                "My office is at 290 Vaughan Street in Winnipeg, Manitoba.",
                "Let's connect via quantum communication channels!"
            ],
            default: [
                "That's a fascinating question about the future of technology.",
                "Quantum AI is opening new possibilities we never imagined.",
                "The intersection of AI and quantum computing is where magic happens."
            ]
        };
        
        this.init();
    }
    
    init() {
        // Check for speech recognition support
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.setupRecognition();
        } else {
            console.warn('Speech recognition not supported in this browser');
            if (this.voiceBtn) {
                this.voiceBtn.textContent = 'Voice not supported';
                this.voiceBtn.disabled = true;
            }
            return;
        }
        
        this.setupEventListeners();
        this.setupVisualEffects();
    }
    
    setupRecognition() {
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';
        
        this.recognition.onstart = () => {
            this.isListening = true;
            this.updateUI(true);
        };
        
        this.recognition.onend = () => {
            this.isListening = false;
            this.updateUI(false);
        };
        
        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase();
            this.processVoiceInput(transcript);
        };
        
        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.isListening = false;
            this.updateUI(false);
        };
    }
    
    setupEventListeners() {
        if (this.voiceBtn) {
            this.voiceBtn.addEventListener('click', () => {
                if (this.isListening) {
                    this.stopListening();
                } else {
                    this.startListening();
                }
            });
        }
        
        // Keyboard shortcut (Space key)
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && e.ctrlKey) {
                e.preventDefault();
                if (this.isListening) {
                    this.stopListening();
                } else {
                    this.startListening();
                }
            }
        });
    }
    
    setupVisualEffects() {
        // Create voice visualization
        const assistant = document.getElementById('aiAssistant');
        if (assistant) {
            const visualizer = document.createElement('div');
            visualizer.id = 'voiceVisualizer';
            visualizer.style.cssText = `
                position: absolute;
                top: -20px;
                left: -20px;
                right: -20px;
                bottom: -20px;
                border-radius: 50px;
                background: radial-gradient(circle, rgba(0, 255, 136, 0.2), transparent);
                opacity: 0;
                animation: pulse 1.5s ease-in-out infinite;
                pointer-events: none;
            `;
            assistant.appendChild(visualizer);
        }
    }
    
    startListening() {
        if (this.recognition && !this.isListening) {
            try {
                this.recognition.start();
                this.createListeningEffect();
            } catch (error) {
                console.error('Error starting speech recognition:', error);
            }
        }
    }
    
    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
    }
    
    processVoiceInput(transcript) {
        console.log('Voice input:', transcript);
        
        // Determine response category
        let category = 'default';
        
        if (transcript.includes('hello') || transcript.includes('hi') || transcript.includes('hey')) {
            category = 'greeting';
        } else if (transcript.includes('research') || transcript.includes('work') || transcript.includes('study')) {
            category = 'research';
        } else if (transcript.includes('ai') || transcript.includes('artificial intelligence') || transcript.includes('machine learning')) {
            category = 'ai';
        } else if (transcript.includes('quantum') || transcript.includes('computing') || transcript.includes('qubit')) {
            category = 'quantum';
        } else if (transcript.includes('contact') || transcript.includes('email') || transcript.includes('reach')) {
            category = 'contact';
        }
        
        // Get random response from category
        const responses = this.responses[category];
        const response = responses[Math.floor(Math.random() * responses.length)];
        
        // Speak the response
        this.speak(response);
        
        // Show response visually
        this.showResponse(transcript, response);
    }
    
    speak(text) {
        if (this.synthesis) {
            // Stop any ongoing speech
            this.synthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.pitch = 1.1;
            utterance.volume = 0.8;
            
            // Try to use a more robotic/futuristic voice
            const voices = this.synthesis.getVoices();
            const preferredVoices = voices.filter(voice => 
                voice.name.includes('Google') || 
                voice.name.includes('Microsoft') ||
                voice.lang.startsWith('en')
            );
            
            if (preferredVoices.length > 0) {
                utterance.voice = preferredVoices[0];
            }
            
            utterance.onstart = () => {
                this.createSpeakingEffect();
            };
            
            utterance.onend = () => {
                this.stopSpeakingEffect();
            };
            
            this.synthesis.speak(utterance);
        }
    }
    
    showResponse(input, response) {
        // Create floating response dialog
        const dialog = document.createElement('div');
        dialog.className = 'voice-response-dialog';
        dialog.innerHTML = `
            <div class="voice-input">You: ${input}</div>
            <div class="voice-output">Quantum AI: ${response}</div>
        `;
        
        dialog.style.cssText = `
            position: fixed;
            bottom: 120px;
            right: 30px;
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid #00ff88;
            border-radius: 15px;
            padding: 15px;
            max-width: 300px;
            color: white;
            font-family: 'Rajdhani', sans-serif;
            z-index: 1001;
            animation: slideInUp 0.3s ease-out;
            backdrop-filter: blur(10px);
        `;
        
        // Add styles for dialog content
        const style = document.createElement('style');
        style.textContent = `
            .voice-input {
                color: #00ccff;
                font-size: 12px;
                margin-bottom: 8px;
                opacity: 0.8;
            }
            .voice-output {
                color: #00ff88;
                font-size: 14px;
                font-weight: 600;
            }
            @keyframes slideInUp {
                0% { transform: translateY(20px); opacity: 0; }
                100% { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(dialog);
        
        // Remove dialog after 5 seconds
        setTimeout(() => {
            dialog.style.animation = 'slideOutDown 0.3s ease-in';
            setTimeout(() => {
                if (dialog.parentNode) {
                    dialog.parentNode.removeChild(dialog);
                }
            }, 300);
        }, 5000);
    }
    
    updateUI(listening) {
        const voiceBtn = this.voiceBtn;
        const aiText = document.querySelector('.ai-text');
        const visualizer = document.getElementById('voiceVisualizer');
        
        if (listening) {
            if (voiceBtn) {
                voiceBtn.style.background = 'linear-gradient(45deg, #ff0066, #00ccff)';
                voiceBtn.style.transform = 'scale(1.1)';
            }
            if (aiText) {
                aiText.textContent = 'Listening...';
            }
            if (visualizer) {
                visualizer.style.opacity = '1';
            }
        } else {
            if (voiceBtn) {
                voiceBtn.style.background = '';
                voiceBtn.style.transform = '';
            }
            if (aiText) {
                aiText.textContent = 'Ask Quantum AI';
            }
            if (visualizer) {
                visualizer.style.opacity = '0';
            }
        }
    }
    
    createListeningEffect() {
        const voiceWaves = document.querySelector('.voice-waves');
        if (voiceWaves) {
            voiceWaves.style.animation = 'voiceWave 0.5s infinite';
        }
    }
    
    createSpeakingEffect() {
        const assistant = document.getElementById('aiAssistant');
        if (assistant) {
            assistant.classList.add('speaking');
        }
        
        // Add speaking animation style
        if (!document.getElementById('speaking-styles')) {
            const style = document.createElement('style');
            style.id = 'speaking-styles';
            style.textContent = `
                .ai-assistant.speaking {
                    animation: speakPulse 0.3s ease-in-out infinite;
                }
                @keyframes speakPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    stopSpeakingEffect() {
        const assistant = document.getElementById('aiAssistant');
        if (assistant) {
            assistant.classList.remove('speaking');
        }
    }
}

// Initialize Voice AI
document.addEventListener('DOMContentLoaded', () => {
    // Wait for voices to load
    if (window.speechSynthesis) {
        let voicesLoaded = false;
        
        const loadVoices = () => {
            if (!voicesLoaded) {
                voicesLoaded = true;
                new VoiceAI();
            }
        };
        
        // Chrome/Edge
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
        
        // Firefox/Safari - fallback
        setTimeout(loadVoices, 1000);
    } else {
        new VoiceAI();
    }
});