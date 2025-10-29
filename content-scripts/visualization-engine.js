// content-scripts/visualization-engine.js
class VisualizationEngine {
    constructor() {
        this.currentSkin = 'spectrum';
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        this.skins = new Map();
        this.particles = [];
        this.time = 0;
        this.init();
    }

    init() {
        this.loadBuiltInSkins();
        this.setupCanvas();
    }

    setupCanvas() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.className = 'audio-visualization-canvas';
        
        // Style the canvas to fill the video area
        this.canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9998;
            pointer-events: none;
            background: #000;
        `;
    }

    loadBuiltInSkins() {
        // Register built-in visualization skins
        this.skins.set('spectrum', this.spectrumVisualizer.bind(this));
        this.skins.set('waveform', this.waveformVisualizer.bind(this));
        this.skins.set('particles', this.particleVisualizer.bind(this));
        this.skins.set('nebula', this.nebulaVisualizer.bind(this));
        this.skins.set('equalizer', this.equalizerVisualizer.bind(this));
        this.skins.set('vintage', this.vintageVisualizer.bind(this));
        this.skins.set('cyberpunk', this.cyberpunkVisualizer.bind(this));
        this.skins.set('ambient', this.ambientVisualizer.bind(this));
    }

    activate(skinName, container) {
        this.currentSkin = skinName;
        
        if (!container.contains(this.canvas)) {
            container.appendChild(this.canvas);
        }
        
        this.resizeCanvas();
        this.startAnimation();
        
        console.log(`[VisualizationEngine] Activated skin: ${skinName}`);
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        if (container) {
            this.canvas.width = container.clientWidth;
            this.canvas.height = container.clientHeight;
        }
    }

    startAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        const render = () => {
            this.time += 0.016; // Approximate 60fps
            const visualizer = this.skins.get(this.currentSkin);
            if (visualizer) {
                visualizer();
            }
            this.animationId = requestAnimationFrame(render);
        };

        render();
    }

    deactivate() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        if (this.canvas && this.canvas.parentElement) {
            this.canvas.parentElement.removeChild(this.canvas);
        }
    }

    // Built-in Visualization Skins
    spectrumVisualizer() {
        const data = window.audioProcessor.getFrequencyData();
        if (!data) return;

        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, width, height);
        
        const barWidth = (width / data.length) * 2.5;
        let barHeight;
        let x = 0;
        
        for (let i = 0; i < data.length; i++) {
            barHeight = data[i] * (height / 256);
            
            const hue = i / data.length * 360;
            ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
            ctx.fillRect(x, height - barHeight, barWidth, barHeight);
            
            x += barWidth + 1;
        }
    }

    waveformVisualizer() {
        const data = window.audioProcessor.getWaveformData();
        if (!data) return;

        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        ctx.fillStyle = 'rgba(10, 10, 30, 0.8)';
        ctx.fillRect(0, 0, width, height);
        
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#00ffff';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00ffff';
        ctx.beginPath();
        
        const sliceWidth = width / data.length;
        let x = 0;

        for (let i = 0; i < data.length; i++) {
            const v = data[i] / 128.0;
            const y = v * height / 2;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        ctx.lineTo(width, height / 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
    }

    particleVisualizer() {
        const data = window.audioProcessor.getFrequencyData();
        if (!data) return;

        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Fade effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, width, height);
        
        const centerX = width / 2;
        const centerY = height / 2;
        
        for (let i = 0; i < data.length; i += 4) {
            const amplitude = data[i] / 256;
            const angle = (i / data.length) * Math.PI * 2 + this.time * 0.5;
            const radius = amplitude * Math.min(width, height) * 0.4;
            
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            const size = amplitude * 10 + 2;
            
            // Color based on frequency and amplitude
            const hue = (i / data.length) * 360 + this.time * 50;
            const alpha = amplitude * 0.8 + 0.2;
            
            ctx.fillStyle = `hsla(${hue}, 100%, 60%, ${alpha})`;
            ctx.shadowBlur = 15;
            ctx.shadowColor = `hsla(${hue}, 100%, 60%, ${alpha})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.shadowBlur = 0;
    }

    nebulaVisualizer() {
        const data = window.audioProcessor.getFrequencyData();
        if (!data) return;

        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Cosmic background
        ctx.fillStyle = 'rgba(5, 5, 20, 0.3)';
        ctx.fillRect(0, 0, width, height);
        
        // Add some stars
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        for (let i = 0; i < 50; i++) {
            const x = (i * 137 + this.time * 10) % width;
            const y = (i * 233) % height;
            const size = (Math.sin(this.time + i) * 0.5 + 0.5) * 2;
            ctx.fillRect(x, y, size, size);
        }
        
        // Nebula effect based on audio
        const centerX = width / 2;
        const centerY = height / 2;
        
        for (let i = 0; i < data.length; i += 2) {
            const amplitude = data[i] / 256;
            const radius = amplitude * Math.min(width, height) * 0.3;
            
            const gradient = ctx.createRadialGradient(
                centerX, centerY, 0,
                centerX, centerY, radius
            );
            
            const hue = 240 + (amplitude * 60) + this.time * 10;
            gradient.addColorStop(0, `hsla(${hue}, 100%, 70%, ${amplitude * 0.3})`);
            gradient.addColorStop(1, `hsla(${hue + 30}, 100%, 50%, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
        }
    }

    equalizerVisualizer() {
        const data = window.audioProcessor.getFrequencyData();
        if (!data) return;

        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        ctx.fillStyle = 'rgba(20, 20, 30, 0.9)';
        ctx.fillRect(0, 0, width, height);
        
        const barCount = 32;
        const barWidth = width / barCount;
        
        for (let i = 0; i < barCount; i++) {
            const dataIndex = Math.floor(i / barCount * data.length);
            const amplitude = data[dataIndex] / 256;
            const barHeight = amplitude * height * 0.8;
            
            // Vintage green color with gradient
            const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
            gradient.addColorStop(0, '#00ff00');
            gradient.addColorStop(0.7, '#ffff00');
            gradient.addColorStop(1, '#ff0000');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(i * barWidth, height - barHeight, barWidth - 2, barHeight);
            
            // Reflection
            ctx.fillStyle = `rgba(0, 255, 0, ${amplitude * 0.3})`;
            ctx.fillRect(i * barWidth, height, barWidth - 2, barHeight * 0.2);
        }
    }

    vintageVisualizer() {
        const data = window.audioProcessor.getFrequencyData();
        if (!data) return;

        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Vintage TV background
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(0, 0, width, height);
        
        // Scan lines
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        for (let y = 0; y < height; y += 4) {
            ctx.fillRect(0, y, width, 1);
        }
        
        // CRT curvature effect
        ctx.strokeStyle = 'rgba(100, 100, 100, 0.3)';
        ctx.lineWidth = 20;
        ctx.strokeRect(10, 10, width - 20, height - 20);
        
        // Analog meter style visualization
        const centerX = width / 2;
        const meterHeight = height * 0.6;
        
        for (let i = 0; i < data.length; i += 4) {
            const amplitude = data[i] / 256;
            const angle = (i / data.length) * Math.PI - Math.PI / 2;
            const needleLength = amplitude * meterHeight;
            
            ctx.strokeStyle = '#ff4444';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(centerX, height - 50);
            ctx.lineTo(
                centerX + Math.cos(angle) * needleLength,
                height - 50 + Math.sin(angle) * needleLength
            );
            ctx.stroke();
        }
        
        // Add some vintage text
        ctx.fillStyle = '#00ff00';
        ctx.font = 'bold 24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('A U D I O   M O D E', width / 2, 40);
    }

    cyberpunkVisualizer() {
        const data = window.audioProcessor.getFrequencyData();
        if (!data) return;

        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Cyberpunk background
        ctx.fillStyle = '#0a0a1a';
        ctx.fillRect(0, 0, width, height);
        
        // Grid pattern
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        
        for (let x = 0; x < width; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        
        for (let y = 0; y < height; y += 40) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        // Pulsing hexagons based on audio
        for (let i = 0; i < data.length; i += 8) {
            const amplitude = data[i] / 256;
            const size = amplitude * 50 + 10;
            const x = (i * 37 + this.time * 20) % width;
            const y = (i * 23) % height;
            
            ctx.strokeStyle = `hsl(${this.time * 50 + i * 10}, 100%, 60%)`;
            ctx.lineWidth = amplitude * 3 + 1;
            ctx.fillStyle = `rgba(0, 255, 255, ${amplitude * 0.3})`;
            
            this.drawHexagon(ctx, x, y, size);
        }
    }

    ambientVisualizer() {
        const data = window.audioProcessor.getFrequencyData();
        if (!data) return;

        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Soft gradient background
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#1a2a6c');
        gradient.addColorStop(0.5, '#b21f1f');
        gradient.addColorStop(1, '#fdbb2d');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Floating shapes based on audio
        for (let i = 0; i < data.length; i += 6) {
            const amplitude = data[i] / 256;
            const size = amplitude * 80 + 20;
            const x = (Math.sin(this.time + i * 0.1) * width * 0.3) + width / 2;
            const y = (Math.cos(this.time + i * 0.05) * height * 0.3) + height / 2;
            
            ctx.fillStyle = `rgba(255, 255, 255, ${amplitude * 0.4})`;
            ctx.globalCompositeOperation = 'overlay';
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.globalCompositeOperation = 'source-over';
    }

    drawHexagon(ctx, x, y, size) {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const hexX = x + size * Math.cos(angle);
            const hexY = y + size * Math.sin(angle);
            
            if (i === 0) {
                ctx.moveTo(hexX, hexY);
            } else {
                ctx.lineTo(hexX, hexY);
            }
        }
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    }
}

// Singleton instance
if (!window.visualizationEngine) {
    window.visualizationEngine = new VisualizationEngine();
}
