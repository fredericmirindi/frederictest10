// Main Application Controller
class QuantumApp {
    constructor() {
        this.currentSection = 'quantum-home';
        this.isLoading = true;
        this.components = {};
        
        this.init();
    }
    
    init() {
        this.setupNavigation();
        this.setupFormHandling();
        this.setupPreloader();
        this.setup6GNetworkViz();
        this.setupProjects3D();
        this.setupScrollEffects();
        this.setupPWA();
        
        // Initialize after all components are ready
        setTimeout(() => {
            this.isLoading = false;
            this.hidePreloader();
        }, 2000);
    }
    
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-holographic a');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    this.navigateToSection(targetId);
                    this.smoothScrollTo(targetSection);
                }
            });
        });
        
        // Update active nav item on scroll
        window.addEventListener('scroll', () => {
            this.updateActiveNavItem();
        });
    }
    
    navigateToSection(sectionId) {
        // Remove active class from all nav items
        document.querySelectorAll('.nav-holographic a').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current nav item
        const currentLink = document.querySelector(`[data-section="${sectionId.replace('quantum-', '').replace('neural-', '').replace('6g-', '')}"]`);
        if (currentLink) {
            currentLink.classList.add('active');
        }
        
        this.currentSection = sectionId;
        
        // Update browser history
        history.pushState({ section: sectionId }, '', `#${sectionId}`);
    }
    
    updateActiveNavItem() {
        const sections = document.querySelectorAll('section');
        let currentSection = '';
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                currentSection = section.id;
            }
        });
        
        if (currentSection && currentSection !== this.currentSection) {
            this.navigateToSection(currentSection);
        }
    }
    
    smoothScrollTo(element) {
        const headerHeight = 80;
        const targetPosition = element.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
    
    setupFormHandling() {
        const quantumForm = document.getElementById('quantumForm');
        
        if (quantumForm) {
            quantumForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = new FormData(quantumForm);
                const data = {
                    name: formData.get('name') || document.getElementById('name').value,
                    email: formData.get('email') || document.getElementById('email').value,
                    message: formData.get('message') || document.getElementById('message').value
                };
                
                await this.handleFormSubmission(data);
            });
        }
    }
    
    async handleFormSubmission(data) {
        const submitBtn = document.querySelector('.btn-quantum');
        const originalText = submitBtn.querySelector('.btn-text').textContent;
        
        // Show loading state
        submitBtn.querySelector('.btn-text').textContent = 'Transmitting...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        
        try {
            // Simulate form submission (replace with actual endpoint)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Success feedback
            this.showNotification('Message transmitted successfully via 6G quantum channels!', 'success');
            document.getElementById('quantumForm').reset();
            
        } catch (error) {
            // Error feedback
            this.showNotification('Quantum transmission failed. Please try again.', 'error');
            console.error('Form submission error:', error);
        } finally {
            // Reset button state
            submitBtn.querySelector('.btn-text').textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
        }
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 30px;
            background: ${type === 'success' ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 0, 102, 0.1)'};
            border: 1px solid ${type === 'success' ? '#00ff88' : '#ff0066'};
            color: ${type === 'success' ? '#00ff88' : '#ff0066'};
            padding: 15px 20px;
            border-radius: 15px;
            font-family: 'Rajdhani', sans-serif;
            font-weight: 600;
            z-index: 1002;
            animation: slideInRight 0.3s ease-out;
            backdrop-filter: blur(10px);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
    
    setupPreloader() {
        const preloader = document.createElement('div');
        preloader.id = 'quantumPreloader';
        preloader.innerHTML = `
            <div class="preloader-content">
                <div class="quantum-loader"></div>
                <div class="loading-text">Initializing Quantum Systems...</div>
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
            </div>
        `;
        
        preloader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: #0a0a0a;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            transition: opacity 0.5s ease;
        `;
        
        document.body.appendChild(preloader);
        
        // Add preloader styles
        const style = document.createElement('style');
        style.textContent = `
            .preloader-content {
                text-align: center;
                color: #00ff88;
            }
            .quantum-loader {
                width: 60px;
                height: 60px;
                border: 3px solid rgba(0, 255, 136, 0.2);
                border-top: 3px solid #00ff88;
                border-radius: 50%;
                animation: quantumSpin 1s linear infinite;
                margin: 0 auto 20px;
            }
            .loading-text {
                font-family: 'Orbitron', monospace;
                font-size: 18px;
                margin-bottom: 30px;
                animation: textGlow 2s ease-in-out infinite;
            }
            .progress-bar {
                width: 300px;
                height: 4px;
                background: rgba(0, 255, 136, 0.2);
                border-radius: 2px;
                overflow: hidden;
                margin: 0 auto;
            }
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #00ff88, #00ccff);
                border-radius: 2px;
                animation: progressFill 2s ease-in-out;
                transform: translateX(-100%);
            }
            @keyframes quantumSpin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            @keyframes textGlow {
                0%, 100% { text-shadow: 0 0 10px #00ff88; }
                50% { text-shadow: 0 0 20px #00ff88, 0 0 30px #00ff88; }
            }
            @keyframes progressFill {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(0); }
            }
        `;
        document.head.appendChild(style);
    }
    
    hidePreloader() {
        const preloader = document.getElementById('quantumPreloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                if (preloader.parentNode) {
                    preloader.parentNode.removeChild(preloader);
                }
            }, 500);
        }
    }
    
    setup6GNetworkViz() {
        const networkContainer = document.getElementById('network6g');
        if (!networkContainer) return;
        
        // Create 6G network visualization
        const network = document.createElement('div');
        network.className = '6g-network-grid';
        
        // Create network nodes
        for (let i = 0; i < 15; i++) {
            const node = document.createElement('div');
            node.className = '6g-node';
            node.style.cssText = `
                position: absolute;
                width: 8px;
                height: 8px;
                background: #00ccff;
                border-radius: 50%;
                left: ${Math.random() * 90 + 5}%;
                top: ${Math.random() * 90 + 5}%;
                animation: nodeGlow ${2 + Math.random() * 3}s ease-in-out infinite;
                box-shadow: 0 0 10px #00ccff;
            `;
            
            network.appendChild(node);
        }
        
        networkContainer.appendChild(network);
        
        // Add network animation styles
        const networkStyle = document.createElement('style');
        networkStyle.textContent = `
            @keyframes nodeGlow {
                0%, 100% { transform: scale(1); opacity: 0.6; }
                50% { transform: scale(1.5); opacity: 1; }
            }
        `;
        document.head.appendChild(networkStyle);
    }
    
    setupProjects3D() {
        const projectsContainer = document.getElementById('projects3d');
        if (!projectsContainer) return;
        
        const projects = [
            {
                title: "Quantum Economic Modeling",
                description: "Revolutionary quantum algorithms for real-time market analysis",
                tech: ["Quantum Computing", "ML", "Economics"]
            },
            {
                title: "6G Neural Interface",
                description: "Brain-computer interfaces optimized for 6G networks",
                tech: ["6G", "Neural Networks", "HCI"]
            },
            {
                title: "Holographic Data Visualization",
                description: "4D data representation for complex economic systems",
                tech: ["Holography", "4D UI", "Data Viz"]
            },
            {
                title: "AI-Powered Trading System",
                description: "Autonomous trading with quantum-enhanced AI",
                tech: ["AI", "Quantum", "Trading"]
            }
        ];
        
        projects.forEach((project, index) => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card-3d';
            projectCard.innerHTML = `
                <div class="project-hologram">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-tech">
                        ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                </div>
            `;
            
            projectCard.style.cssText = `
                background: rgba(139, 92, 246, 0.05);
                border: 1px solid rgba(139, 92, 246, 0.2);
                border-radius: 20px;
                padding: 2rem;
                backdrop-filter: blur(10px);
                transition: all 0.3s ease;
                transform-style: preserve-3d;
                animation: projectFloat ${4 + index * 0.5}s ease-in-out infinite;
            `;
            
            projectsContainer.appendChild(projectCard);
        });
        
        // Add project styles
        const projectStyle = document.createElement('style');
        projectStyle.textContent = `
            .project-hologram h3 {
                font-family: 'Orbitron', monospace;
                color: #8b5cf6;
                margin-bottom: 1rem;
            }
            .project-hologram p {
                color: rgba(255, 255, 255, 0.8);
                margin-bottom: 1.5rem;
                line-height: 1.6;
            }
            .project-tech {
                display: flex;
                gap: 0.5rem;
                flex-wrap: wrap;
            }
            .tech-tag {
                background: rgba(139, 92, 246, 0.2);
                color: #8b5cf6;
                padding: 4px 8px;
                border-radius: 10px;
                font-size: 0.8rem;
                font-weight: 600;
            }
            .project-card-3d:hover {
                transform: translateY(-10px) rotateX(5deg);
                box-shadow: 0 20px 40px rgba(139, 92, 246, 0.3);
            }
            @keyframes projectFloat {
                0%, 100% { transform: translateY(0) rotateY(0deg); }
                50% { transform: translateY(-10px) rotateY(5deg); }
            }
        `;
        document.head.appendChild(projectStyle);
    }
    
    setupScrollEffects() {
        let ticking = false;
        
        function updateScrollEffects() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            // Parallax effects
            const parallaxElements = document.querySelectorAll('.floating-data, .holo-grid');
            parallaxElements.forEach(element => {
                element.style.transform = `translate3d(0, ${rate}px, 0)`;
            });
            
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick);
    }
    
    setupPWA() {
        // Create manifest.json
        const manifest = {
            name: "Frédéric Mirindi - Quantum AI Research",
            short_name: "FM Quantum AI",
            description: "Cutting-edge research in Quantum Computing, AI, and 6G technologies",
            start_url: "/",
            display: "standalone",
            background_color: "#0a0a0a",
            theme_color: "#00ff88",
            icons: [
                {
                    src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%2300ff88'/%3E%3C/svg%3E",
                    sizes: "192x192",
                    type: "image/svg+xml"
                }
            ]
        };
        
        const manifestBlob = new Blob([JSON.stringify(manifest)], {type: 'application/json'});
        const manifestURL = URL.createObjectURL(manifestBlob);
        
        const link = document.createElement('link');
        link.rel = 'manifest';
        link.href = manifestURL;
        document.head.appendChild(link);
        
        // Service worker registration would go here in a production environment
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new QuantumApp();
    
    // Handle back/forward navigation
    window.addEventListener('popstate', (e) => {
        if (e.state && e.state.section) {
            const section = document.getElementById(e.state.section);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// Additional utility functions
class QuantumUtils {
    static randomColor() {
        const colors = ['#00ff88', '#00ccff', '#ff0066', '#8b5cf6'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    static createParticleExplosion(x, y, count = 20) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: 2px;
                height: 2px;
                background: ${this.randomColor()};
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
            `;
            
            document.body.appendChild(particle);
            
            const angle = (i / count) * Math.PI * 2;
            const velocity = 50 + Math.random() * 50;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${vx}px, ${vy}px) scale(0)`, opacity: 0 }
            ], {
                duration: 1000,
                easing: 'ease-out'
            }).onfinish = () => particle.remove();
        }
    }
    
    static formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
}

// Export for global use
window.QuantumUtils = QuantumUtils;