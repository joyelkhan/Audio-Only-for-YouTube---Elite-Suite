// options/skin-gallery.js
class SkinGallery {
    constructor() {
        this.currentCategory = 'all';
        this.selectedSkin = null;
        this.previewAnimation = null;
        this.availableSkins = [];
        this.init();
    }

    async init() {
        await this.loadSkins();
        this.renderSkinGrid();
        this.setupEventListeners();
    }

    async loadSkins() {
        // Get skins from background script
        try {
            const response = await chrome.runtime.sendMessage({ action: 'getAvailableSkins' });
            if (response && response.skins) {
                this.availableSkins = response.skins;
            } else {
                // Fallback to hardcoded skins
                this.availableSkins = this.getDefaultSkins();
            }
            
            // Load current skin
            const result = await chrome.storage.sync.get(['currentAudioSkin']);
            this.selectedSkin = result.currentAudioSkin || 'spectrum';
        } catch (error) {
            console.error('Failed to load skins:', error);
            this.availableSkins = this.getDefaultSkins();
            this.selectedSkin = 'spectrum';
        }
    }

    getDefaultSkins() {
        return [
            {
                id: 'spectrum',
                name: '🌈 Spectrum Analyzer',
                description: 'Classic frequency spectrum with rainbow colors',
                category: 'analytical',
                intensity: 'high'
            },
            {
                id: 'waveform',
                name: '📈 Waveform Display',
                description: 'Real-time audio waveform visualization',
                category: 'analytical',
                intensity: 'medium'
            },
            {
                id: 'particles',
                name: '✨ Audio Particles',
                description: 'Floating particles that dance to the music',
                category: 'organic',
                intensity: 'medium'
            },
            {
                id: 'nebula',
                name: '🌌 Cosmic Nebula',
                description: 'Space-inspired visualization with star fields',
                category: 'ambient',
                intensity: 'low'
            },
            {
                id: 'equalizer',
                name: '🎛️ Vintage Equalizer',
                description: 'Retro-style equalizer bars with reflections',
                category: 'vintage',
                intensity: 'high'
            },
            {
                id: 'vintage',
                name: '📺 Retro CRT',
                description: 'Vintage television display with analog meters',
                category: 'vintage',
                intensity: 'medium'
            },
            {
                id: 'cyberpunk',
                name: '🔮 Cyberpunk Grid',
                description: 'Futuristic grid with pulsing hexagons',
                category: 'futuristic',
                intensity: 'high'
            },
            {
                id: 'ambient',
                name: '🎨 Ambient Colors',
                description: 'Soothing color gradients and floating shapes',
                category: 'ambient',
                intensity: 'low'
            }
        ];
    }

    renderSkinGrid() {
        const container = document.getElementById('skins-container');
        if (!container) return;

        const filteredSkins = this.currentCategory === 'all' 
            ? this.availableSkins 
            : this.availableSkins.filter(skin => skin.category === this.currentCategory);

        container.innerHTML = filteredSkins.map(skin => `
            <div class="skin-card ${skin.id === this.selectedSkin ? 'active' : ''}" 
                 data-skin-id="${skin.id}">
                <div class="skin-preview">
                    <canvas id="preview-${skin.id}" width="280" height="120"></canvas>
                </div>
                <div class="skin-info">
                    <h4>${skin.name}</h4>
                    <p>${skin.description}</p>
                    <div class="skin-meta">
                        <span class="skin-category">${skin.category}</span>
                        <div class="skin-intensity">
                            ${this.renderIntensityDots(skin.intensity)}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        // Generate previews after a short delay to ensure canvases are in DOM
        setTimeout(() => {
            filteredSkins.forEach(skin => {
                this.generateSkinPreview(skin.id);
            });
        }, 100);

        // Update live preview if a skin is selected
        if (this.selectedSkin) {
            this.updateLivePreview(this.selectedSkin);
        }
    }

    renderIntensityDots(intensity) {
        const levels = { low: 1, medium: 2, high: 3 };
        const level = levels[intensity] || 1;
        
        return Array.from({ length: 3 }, (_, i) => 
            `<div class="intensity-dot ${i < level ? 'active' : ''}"></div>` 
        ).join('');
    }

    generateSkinPreview(skinId) {
        const canvas = document.getElementById(`preview-${skinId}`);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let frame = 0;
        let animationId = null;

        const render = () => {
            frame++;
            
            // Generate fake audio data
            const fakeData = new Uint8Array(128);
            for (let i = 0; i < fakeData.length; i++) {
                fakeData[i] = Math.sin(i * 0.1 + frame * 0.05) * 100 + 128;
            }

            // Render based on skin type
            this.renderPreviewSkin(ctx, skinId, fakeData, frame, canvas.width, canvas.height);
            
            if (frame < 120) { // Run for 2 seconds at 60fps
                animationId = requestAnimationFrame(render);
            }
        };

        render();
    }

    renderPreviewSkin(ctx, skinId, data, frame, width, height) {
        switch(skinId) {
            case 'spectrum':
                this.renderSpectrumPreview(ctx, data, width, height);
                break;
            case 'waveform':
                this.renderWaveformPreview(ctx, data, width, height);
                break;
            case 'particles':
                this.renderParticlesPreview(ctx, data, frame, width, height);
                break;
            case 'nebula':
                this.renderNebulaPreview(ctx, data, frame, width, height);
                break;
            case 'equalizer':
                this.renderEqualizerPreview(ctx, data, width, height);
                break;
            case 'vintage':
                this.renderVintagePreview(ctx, data, width, height);
                break;
            case 'cyberpunk':
                this.renderCyberpunkPreview(ctx, data, frame, width, height);
                break;
            case 'ambient':
                this.renderAmbientPreview(ctx, data, frame, width, height);
                break;
            default:
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, width, height);
        }
    }

    renderSpectrumPreview(ctx, data, width, height) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, width, height);
        
        const barWidth = (width / data.length) * 2.5;
        let x = 0;
        
        for (let i = 0; i < data.length; i++) {
            const barHeight = data[i] * (height / 256);
            const hue = i / data.length * 360;
            
            ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
            ctx.fillRect(x, height - barHeight, barWidth, barHeight);
            x += barWidth + 1;
        }
    }

    renderWaveformPreview(ctx, data, width, height) {
        ctx.fillStyle = 'rgba(10, 10, 30, 0.8)';
        ctx.fillRect(0, 0, width, height);
        
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        const sliceWidth = width / data.length;
        let x = 0;

        for (let i = 0; i < data.length; i++) {
            const v = data[i] / 128.0;
            const y = v * height / 2;
            
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            x += sliceWidth;
        }
        
        ctx.stroke();
    }

    renderParticlesPreview(ctx, data, frame, width, height) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, width, height);
        
        const centerX = width / 2;
        const centerY = height / 2;
        
        for (let i = 0; i < data.length; i += 4) {
            const amplitude = data[i] / 256;
            const angle = (i / data.length) * Math.PI * 2 + frame * 0.02;
            const radius = amplitude * Math.min(width, height) * 0.3;
            
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            const size = amplitude * 5 + 2;
            const hue = (frame * 2 + i * 10) % 360;
            
            ctx.fillStyle = `hsl(${hue}, 100%, 60%)`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    renderNebulaPreview(ctx, data, frame, width, height) {
        ctx.fillStyle = 'rgba(5, 5, 20, 0.3)';
        ctx.fillRect(0, 0, width, height);
        
        // Stars
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        for (let i = 0; i < 20; i++) {
            const x = (i * 137 + frame) % width;
            const y = (i * 233) % height;
            const size = (Math.sin(frame * 0.05 + i) * 0.5 + 0.5) * 2;
            ctx.fillRect(x, y, size, size);
        }
        
        // Nebula
        const centerX = width / 2;
        const centerY = height / 2;
        const avgAmplitude = data.reduce((a, b) => a + b, 0) / data.length / 256;
        const radius = avgAmplitude * Math.min(width, height) * 0.4;
        
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        const hue = 240 + (avgAmplitude * 60) + frame * 0.5;
        gradient.addColorStop(0, `hsla(${hue}, 100%, 70%, ${avgAmplitude * 0.3})`);
        gradient.addColorStop(1, `hsla(${hue + 30}, 100%, 50%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    }

    renderEqualizerPreview(ctx, data, width, height) {
        ctx.fillStyle = 'rgba(20, 20, 30, 0.9)';
        ctx.fillRect(0, 0, width, height);
        
        const barCount = 16;
        const barWidth = width / barCount;
        
        for (let i = 0; i < barCount; i++) {
            const dataIndex = Math.floor(i / barCount * data.length);
            const amplitude = data[dataIndex] / 256;
            const barHeight = amplitude * height * 0.8;
            
            const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
            gradient.addColorStop(0, '#00ff00');
            gradient.addColorStop(0.7, '#ffff00');
            gradient.addColorStop(1, '#ff0000');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(i * barWidth, height - barHeight, barWidth - 2, barHeight);
        }
    }

    renderVintagePreview(ctx, data, width, height) {
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(0, 0, width, height);
        
        // Scan lines
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        for (let y = 0; y < height; y += 4) {
            ctx.fillRect(0, y, width, 1);
        }
        
        // Text
        ctx.fillStyle = '#00ff00';
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('AUDIO MODE', width / 2, height / 2);
    }

    renderCyberpunkPreview(ctx, data, frame, width, height) {
        ctx.fillStyle = '#0a0a1a';
        ctx.fillRect(0, 0, width, height);
        
        // Grid
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
        
        // Pulsing elements
        for (let i = 0; i < data.length; i += 16) {
            const amplitude = data[i] / 256;
            const size = amplitude * 20 + 5;
            const x = (i * 20 + frame) % width;
            const y = (i * 15) % height;
            
            ctx.strokeStyle = `hsl(${frame + i * 10}, 100%, 60%)`;
            ctx.lineWidth = amplitude * 2 + 1;
            ctx.strokeRect(x - size/2, y - size/2, size, size);
        }
    }

    renderAmbientPreview(ctx, data, frame, width, height) {
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#1a2a6c');
        gradient.addColorStop(0.5, '#b21f1f');
        gradient.addColorStop(1, '#fdbb2d');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Floating shapes
        const time = frame * 0.02;
        for (let i = 0; i < data.length; i += 12) {
            const amplitude = data[i] / 256;
            const size = amplitude * 40 + 10;
            const x = (Math.sin(time + i * 0.1) * width * 0.3) + width / 2;
            const y = (Math.cos(time + i * 0.05) * height * 0.3) + height / 2;
            
            ctx.fillStyle = `rgba(255, 255, 255, ${amplitude * 0.4})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    setupEventListeners() {
        // Category filters
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentCategory = btn.dataset.category;
                this.renderSkinGrid();
            });
        });

        // Skin selection
        const skinsContainer = document.getElementById('skins-container');
        if (skinsContainer) {
            skinsContainer.addEventListener('click', (e) => {
                const skinCard = e.target.closest('.skin-card');
                if (skinCard) {
                    this.selectSkin(skinCard.dataset.skinId);
                }
            });
        }

        // Apply skin button
        const applyBtn = document.getElementById('apply-skin-btn');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                if (this.selectedSkin) {
                    this.applySkin(this.selectedSkin);
                }
            });
        }

        // Test animation button
        const testBtn = document.getElementById('test-skin-btn');
        if (testBtn) {
            testBtn.addEventListener('click', () => {
                this.startLivePreview(this.selectedSkin);
            });
        }
    }

    selectSkin(skinId) {
        this.selectedSkin = skinId;
        
        // Update UI
        document.querySelectorAll('.skin-card').forEach(card => {
            card.classList.remove('active');
        });
        const selectedCard = document.querySelector(`[data-skin-id="${skinId}"]`);
        if (selectedCard) {
            selectedCard.classList.add('active');
        }
        
        this.updateLivePreview(skinId);
    }

    updateLivePreview(skinId) {
        this.startLivePreview(skinId);
    }

    startLivePreview(skinId) {
        if (this.previewAnimation) {
            cancelAnimationFrame(this.previewAnimation);
        }

        const canvas = document.getElementById('skin-preview-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let frame = 0;

        const render = () => {
            frame++;
            
            // Generate more complex fake data for live preview
            const fakeData = new Uint8Array(128);
            for (let i = 0; i < fakeData.length; i++) {
                fakeData[i] = Math.sin(i * 0.05 + frame * 0.05) * 
                             Math.cos(i * 0.03 + frame * 0.02) * 100 + 128;
            }

            this.renderPreviewSkin(ctx, skinId, fakeData, frame, canvas.width, canvas.height);
            this.previewAnimation = requestAnimationFrame(render);
        };

        render();
    }

    async applySkin(skinId) {
        try {
            // Save to storage
            await chrome.storage.sync.set({ currentAudioSkin: skinId });
            
            // Send message to content scripts
            const tabs = await chrome.tabs.query({ url: 'https://*.youtube.com/*' });
            for (const tab of tabs) {
                chrome.tabs.sendMessage(tab.id, {
                    action: 'changeAudioSkin',
                    skinId: skinId
                }).catch(() => {
                    // Tab might not have content script loaded yet
                });
            }
            
            this.showMessage(`Applied ${this.getSkinName(skinId)} skin!`, 'success');
        } catch (error) {
            console.error('Failed to apply skin:', error);
            this.showMessage('Failed to apply skin', 'error');
        }
    }

    getSkinName(skinId) {
        const skin = this.availableSkins.find(s => s.id === skinId);
        return skin ? skin.name : skinId;
    }

    showMessage(message, type) {
        const statusEl = document.getElementById('status-message');
        if (statusEl) {
            statusEl.textContent = message;
            statusEl.className = `status-message ${type}`;
            
            setTimeout(() => {
                statusEl.textContent = '';
                statusEl.className = 'status-message';
            }, 3000);
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.skinGallery = new SkinGallery();
    });
} else {
    window.skinGallery = new SkinGallery();
}
