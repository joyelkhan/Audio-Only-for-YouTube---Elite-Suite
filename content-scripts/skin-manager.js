// content-scripts/skin-manager.js
class SkinManager {
    constructor() {
        this.availableSkins = new Map();
        this.currentSkin = 'spectrum';
        this.customSkins = new Map();
        this.init();
    }

    init() {
        this.loadBuiltInSkins();
        this.loadCustomSkins();
        this.setupSkinChangeListener();
    }

    loadBuiltInSkins() {
        this.availableSkins.set('spectrum', {
            name: '🌈 Spectrum Analyzer',
            description: 'Classic frequency spectrum with rainbow colors',
            category: 'analytical',
            intensity: 'high'
        });

        this.availableSkins.set('waveform', {
            name: '📈 Waveform Display',
            description: 'Real-time audio waveform visualization',
            category: 'analytical', 
            intensity: 'medium'
        });

        this.availableSkins.set('particles', {
            name: '✨ Audio Particles',
            description: 'Floating particles that dance to the music',
            category: 'organic',
            intensity: 'medium'
        });

        this.availableSkins.set('nebula', {
            name: '🌌 Cosmic Nebula',
            description: 'Space-inspired visualization with star fields',
            category: 'ambient',
            intensity: 'low'
        });

        this.availableSkins.set('equalizer', {
            name: '🎛️ Vintage Equalizer',
            description: 'Retro-style equalizer bars with reflections',
            category: 'vintage',
            intensity: 'high'
        });

        this.availableSkins.set('vintage', {
            name: '📺 Retro CRT',
            description: 'Vintage television display with analog meters',
            category: 'vintage',
            intensity: 'medium'
        });

        this.availableSkins.set('cyberpunk', {
            name: '🔮 Cyberpunk Grid',
            description: 'Futuristic grid with pulsing hexagons',
            category: 'futuristic',
            intensity: 'high'
        });

        this.availableSkins.set('ambient', {
            name: '🎨 Ambient Colors',
            description: 'Soothing color gradients and floating shapes',
            category: 'ambient',
            intensity: 'low'
        });
    }

    async loadCustomSkins() {
        try {
            const result = await chrome.storage.sync.get(['customSkins']);
            if (result.customSkins) {
                this.customSkins = new Map(Object.entries(result.customSkins));
            }
        } catch (error) {
            console.error('[SkinManager] Failed to load custom skins:', error);
        }
    }

    async saveCustomSkin(name, skinData) {
        this.customSkins.set(name, skinData);
        await chrome.storage.sync.set({
            customSkins: Object.fromEntries(this.customSkins)
        });
    }

    getAllSkins() {
        const allSkins = new Map([...this.availableSkins, ...this.customSkins]);
        return Array.from(allSkins.entries()).map(([id, skin]) => ({
            id,
            ...skin
        }));
    }

    getSkinsByCategory(category) {
        return this.getAllSkins().filter(skin => skin.category === category);
    }

    async setSkin(skinId, container) {
        if (this.availableSkins.has(skinId) || this.customSkins.has(skinId)) {
            this.currentSkin = skinId;
            
            if (window.visualizationEngine && container) {
                window.visualizationEngine.activate(skinId, container);
            }
            
            // Save preference
            await chrome.storage.sync.set({ currentAudioSkin: skinId });
            
            console.log(`[SkinManager] Skin changed to: ${skinId}`);
            return true;
        }
        return false;
    }

    setupSkinChangeListener() {
        // Listen for skin changes from options page
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'changeAudioSkin') {
                const container = this.getVideoContainer();
                this.setSkin(request.skinId, container).then(success => {
                    sendResponse({ success });
                });
                return true; // Keep channel open for async response
            }
            
            if (request.action === 'getAvailableSkins') {
                sendResponse({ skins: this.getAllSkins() });
                return true;
            }
        });
    }

    getVideoContainer() {
        return document.getElementById('movie_player') || 
               document.querySelector('.html5-video-player') ||
               document.querySelector('#player-container');
    }

    async getCurrentSkin() {
        try {
            const result = await chrome.storage.sync.get(['currentAudioSkin']);
            return result.currentAudioSkin || 'spectrum';
        } catch (error) {
            return 'spectrum';
        }
    }

    // Skin preview generator for options page
    generateSkinPreview(skinId, canvas) {
        const tempEngine = new VisualizationEngine();
        tempEngine.canvas = canvas;
        tempEngine.ctx = canvas.getContext('2d');
        
        // Generate fake audio data for preview
        const fakeData = new Uint8Array(256);
        for (let i = 0; i < fakeData.length; i++) {
            fakeData[i] = Math.sin(i * 0.1) * 128 + 128;
        }
        
        // Temporarily replace the audio processor
        const originalProcessor = window.audioProcessor;
        window.audioProcessor = {
            getFrequencyData: () => fakeData,
            getWaveformData: () => fakeData
        };
        
        const container = { 
            appendChild: () => {},
            contains: () => false,
            clientWidth: canvas.width,
            clientHeight: canvas.height
        };
        
        tempEngine.activate(skinId, container);
        
        // Restore original processor
        window.audioProcessor = originalProcessor;
        
        // Stop after a moment
        setTimeout(() => {
            tempEngine.deactivate();
        }, 2000);
    }
}

// Singleton instance
if (!window.skinManager) {
    window.skinManager = new SkinManager();
}
