// Neural Network Visualization
class NeuralNetworkViz {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.canvas = null;
        this.ctx = null;
        this.nodes = [];
        this.connections = [];
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = 200;
        
        // Style canvas
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        
        this.container.appendChild(this.canvas);
        
        // Create neural network structure
        this.createNetwork();
        
        // Start animation
        this.animate();
        
        // Resize handler
        window.addEventListener('resize', () => {
            this.canvas.width = this.container.offsetWidth;
            this.createNetwork();
        });
    }
    
    createNetwork() {
        this.nodes = [];
        this.connections = [];
        
        const layers = [8, 12, 16, 12, 6]; // Neural network structure
        const layerSpacing = this.canvas.width / (layers.length + 1);
        
        // Create nodes for each layer
        layers.forEach((nodeCount, layerIndex) => {
            const layer = [];
            const nodeSpacing = this.canvas.height / (nodeCount + 1);
            
            for (let i = 0; i < nodeCount; i++) {
                const node = {
                    x: layerSpacing * (layerIndex + 1),
                    y: nodeSpacing * (i + 1),
                    activation: Math.random(),
                    targetActivation: Math.random(),
                    layer: layerIndex,
                    index: i
                };
                
                layer.push(node);
                this.nodes.push(node);
            }
            
            // Create connections to next layer
            if (layerIndex < layers.length - 1) {
                const nextLayerStart = this.nodes.length;
                const nextLayerSize = layers[layerIndex + 1];
                
                layer.forEach(node => {
                    for (let j = 0; j < nextLayerSize; j++) {
                        this.connections.push({
                            from: node,
                            to: null, // Will be set after next layer is created
                            weight: Math.random() * 2 - 1,
                            activity: 0
                        });
                    }
                });
            }
        });
        
        // Set connection targets
        let connectionIndex = 0;
        layers.forEach((nodeCount, layerIndex) => {
            if (layerIndex < layers.length - 1) {
                const currentLayer = this.nodes.filter(n => n.layer === layerIndex);
                const nextLayer = this.nodes.filter(n => n.layer === layerIndex + 1);
                
                currentLayer.forEach(node => {
                    nextLayer.forEach(nextNode => {
                        if (this.connections[connectionIndex]) {
                            this.connections[connectionIndex].to = nextNode;
                            connectionIndex++;
                        }
                    });
                });
            }
        });
    }
    
    updateNetwork() {
        // Update node activations
        this.nodes.forEach(node => {
            // Smooth transition to target activation
            node.activation += (node.targetActivation - node.activation) * 0.1;
            
            // Occasionally change target
            if (Math.random() < 0.01) {
                node.targetActivation = Math.random();
            }
        });
        
        // Update connection activities
        this.connections.forEach(connection => {
            if (connection.from && connection.to) {
                const activity = connection.from.activation * Math.abs(connection.weight);
                connection.activity += (activity - connection.activity) * 0.2;
            }
        });
    }
    
    drawNetwork() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections
        this.connections.forEach(connection => {
            if (connection.from && connection.to) {
                const opacity = Math.max(0.1, connection.activity);
                const hue = connection.weight > 0 ? 120 : 0; // Green for positive, red for negative
                
                this.ctx.strokeStyle = `hsla(${hue}, 70%, 60%, ${opacity})`;
                this.ctx.lineWidth = Math.abs(connection.weight) * 2;
                this.ctx.beginPath();
                this.ctx.moveTo(connection.from.x, connection.from.y);
                this.ctx.lineTo(connection.to.x, connection.to.y);
                this.ctx.stroke();
            }
        });
        
        // Draw nodes
        this.nodes.forEach(node => {
            const size = 4 + node.activation * 6;
            const intensity = 0.3 + node.activation * 0.7;
            
            // Node glow
            const gradient = this.ctx.createRadialGradient(
                node.x, node.y, 0,
                node.x, node.y, size * 2
            );
            gradient.addColorStop(0, `hsla(180, 70%, 60%, ${intensity})`);
            gradient.addColorStop(1, `hsla(180, 70%, 60%, 0)`);
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, size * 2, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Node core
            this.ctx.fillStyle = `hsla(180, 80%, 80%, ${intensity + 0.3})`;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    animate() {
        this.updateNetwork();
        this.drawNetwork();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Initialize neural network visualizations
document.addEventListener('DOMContentLoaded', () => {
    // Neural visualization in research section
    const neuralViz = new NeuralNetworkViz('neuralViz');
    
    // Neural network overlay
    const neuralOverlay = document.getElementById('neuralNet');
    if (neuralOverlay) {
        const overlayViz = new NeuralNetworkViz('neuralNet');
    }
});