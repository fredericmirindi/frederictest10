// Holographic UI Effects
class HolographicUI {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setup4DMode();
        this.setupMatrixRain();
        this.setupFloatingData();
        this.setupStatCounters();
    }
    
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                } else {
                    entry.target.classList.remove('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe all sections
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
        
        // Parallax scrolling for background elements
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.floating-data, .holo-grid');
            
            parallaxElements.forEach(element => {
                const speed = 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }
    
    setupHoverEffects() {
        // Research cards
        const researchCards = document.querySelectorAll('.research-card');
        researchCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.createParticleEffect(card);
            });
            
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                
                card.style.transform = `
                    perspective(1000px) 
                    rotateX(${(y - 0.5) * 10}deg) 
                    rotateY(${(x - 0.5) * 10}deg) 
                    translateZ(10px)
                `;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
        
        // Navigation items
        const navItems = document.querySelectorAll('.nav-holographic a');
        navItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.createGlowEffect(item);
            });
        });
    }
    
    setup4DMode() {
        const dimensionBtn = document.getElementById('dimensionBtn');
        let is4DMode = false;
        
        if (dimensionBtn) {
            dimensionBtn.addEventListener('click', () => {
                is4DMode = !is4DMode;
                document.body.classList.toggle('mode-4d', is4DMode);
                dimensionBtn.textContent = is4DMode ? '3D Mode' : '4D Mode';
                
                if (is4DMode) {
                    this.activate4DEffects();
                } else {
                    this.deactivate4DEffects();
                }
            });
        }
    }
    
    activate4DEffects() {
        // Add 4D transformations to elements
        const elements = document.querySelectorAll('.research-card, .blog-card, .stat-cube');
        elements.forEach((element, index) => {
            element.style.animation = `float4D ${3 + index * 0.5}s ease-in-out infinite`;
            element.style.transformStyle = 'preserve-3d';
        });
        
        // Create dynamic 4D CSS animation
        if (!document.getElementById('dynamic-4d-styles')) {
            const style = document.createElement('style');
            style.id = 'dynamic-4d-styles';
            style.textContent = `
                @keyframes float4D {
                    0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateZ(0px); }
                    25% { transform: rotateX(10deg) rotateY(15deg) rotateZ(5deg) translateZ(20px); }
                    50% { transform: rotateX(0deg) rotateY(30deg) rotateZ(0deg) translateZ(0px); }
                    75% { transform: rotateX(-10deg) rotateY(15deg) rotateZ(-5deg) translateZ(20px); }
                    100% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateZ(0px); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    deactivate4DEffects() {
        const elements = document.querySelectorAll('.research-card, .blog-card, .stat-cube');
        elements.forEach(element => {
            element.style.animation = '';
            element.style.transform = '';
        });
    }
    
    setupMatrixRain() {
        const matrixContainer = document.getElementById('matrixRain');
        if (!matrixContainer) return;
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = matrixContainer.offsetWidth;
        canvas.height = 100;
        matrixContainer.appendChild(canvas);
        
        const chars = '01';
        const charArray = chars.split('');
        const columns = canvas.width / 10;
        const drops = [];
        
        for (let i = 0; i < columns; i++) {
            drops[i] = 1;
        }
        
        function drawMatrix() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#00ff88';
            ctx.font = '12px monospace';
            
            for (let i = 0; i < drops.length; i++) {
                const text = charArray[Math.floor(Math.random() * charArray.length)];
                ctx.fillText(text, i * 10, drops[i] * 10);
                
                if (drops[i] * 10 > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }
        
        setInterval(drawMatrix, 50);
    }
    
    setupFloatingData() {
        const floatingData = document.getElementById('floatingData');
        if (!floatingData) return;
        
        // Create floating data points
        for (let i = 0; i < 20; i++) {
            const dataPoint = document.createElement('div');
            dataPoint.className = 'data-point';
            dataPoint.textContent = Math.random().toString(2).substr(2, 8);
            
            dataPoint.style.position = 'absolute';
            dataPoint.style.color = 'rgba(0, 255, 136, 0.7)';
            dataPoint.style.fontSize = '10px';
            dataPoint.style.fontFamily = 'monospace';
            dataPoint.style.left = Math.random() * 100 + '%';
            dataPoint.style.top = Math.random() * 100 + '%';
            dataPoint.style.animation = `floatUp ${5 + Math.random() * 5}s linear infinite`;
            dataPoint.style.animationDelay = Math.random() * 5 + 's';
            
            floatingData.appendChild(dataPoint);
        }
        
        // Add floating animation
        if (!document.getElementById('floating-styles')) {
            const style = document.createElement('style');
            style.id = 'floating-styles';
            style.textContent = `
                @keyframes floatUp {
                    0% { transform: translateY(100px) rotate(0deg); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    setupStatCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        const observerOptions = {
            threshold: 0.5
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                }
            });
        }, observerOptions);
        
        statNumbers.forEach(stat => {
            observer.observe(stat);
        });
    }
    
    animateCounter(element) {
        const target = parseInt(element.dataset.target);
        const duration = 2000;
        const start = Date.now();
        const startValue = 0;
        
        const animate = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(startValue + (target - startValue) * easeOut);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
    
    createParticleEffect(element) {
        const rect = element.getBoundingClientRect();
        
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.className = 'hover-particle';
            
            particle.style.position = 'fixed';
            particle.style.left = rect.left + rect.width / 2 + 'px';
            particle.style.top = rect.top + rect.height / 2 + 'px';
            particle.style.width = '2px';
            particle.style.height = '2px';
            particle.style.background = '#00ff88';
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1000';
            
            document.body.appendChild(particle);
            
            const angle = (i / 10) * Math.PI * 2;
            const velocity = 50;
            const x = Math.cos(angle) * velocity;
            const y = Math.sin(angle) * velocity;
            
            particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${x}px, ${y}px) scale(0)`, opacity: 0 }
            ], {
                duration: 1000,
                easing: 'ease-out'
            }).onfinish = () => {
                particle.remove();
            };
        }
    }
    
    createGlowEffect(element) {
        element.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.5)';
        
        setTimeout(() => {
            element.style.boxShadow = '';
        }, 300);
    }
}

// Initialize holographic UI
document.addEventListener('DOMContentLoaded', () => {
    new HolographicUI();
});