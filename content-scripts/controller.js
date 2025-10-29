// content-scripts/controller.js
class AudioOnlyController {
    constructor() {
        this.isActive = false;
        this.observer = null;
        this.currentVideoId = null;
        this.settings = {
            enabled: true,
            preserveUI: true, // NEW: Always preserve YouTube UI
            customAudioPlayer: true,
            reduceBandwidth: false
        };
        this.init();
    }

    async init() {
        await this.loadSettings();
        this.setupMutationObserver();
        this.setupMessageListener();
        this.checkCurrentPage();
        
        console.log('[AudioOnly] Elite Controller initialized');
    }

    async loadSettings() {
        return new Promise((resolve) => {
            chrome.storage.sync.get({
                enabled: true,
                preserveUI: true,
                customAudioPlayer: true,
                reduceBandwidth: false
            }, (settings) => {
                this.settings = settings;
                resolve();
            });
        });
    }

    setupMutationObserver() {
        this.observer = new MutationObserver((mutations) => {
            this.handlePageChanges();
        });

        this.observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'src', 'href']
        });
    }

    setupMessageListener() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            switch (request.action) {
                case 'toggle':
                    this.toggleAudioMode(request.enabled);
                    sendResponse({ success: true });
                    break;
                    
                case 'getStatus':
                    sendResponse({ 
                        active: this.isActive,
                        videoId: this.currentVideoId,
                        settings: this.settings
                    });
                    break;
                    
                case 'updateSettings':
                    this.updateSettings(request.settings);
                    sendResponse({ success: true });
                    break;
            }
            return true;
        });
    }

    handlePageChanges() {
        const url = window.location.href;
        const videoId = this.extractVideoId(url);
        
        // Check if we navigated to a new video
        if (videoId && videoId !== this.currentVideoId) {
            this.currentVideoId = videoId;
            this.handleVideoPage();
        }
        
        // Check if we left a video page
        if (!videoId && this.currentVideoId) {
            this.currentVideoId = null;
            this.cleanup();
        }
    }

    extractVideoId(url) {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?#]+)/);
        return match ? match[1] : null;
    }

    handleVideoPage() {
        if (!this.settings.enabled) return;
        
        // Wait for YouTube to fully load the player
        setTimeout(() => {
            this.activateAudioMode();
        }, 1000);
    }

    async activateAudioMode() {
        if (this.isActive) return;
        
        console.log('[AudioOnly] Activating surgical audio mode with visualizations');
        this.isActive = true;
        
        // Add activation class for CSS targeting
        document.body.classList.add('audio-only-surgical-active');
        
        // SURGICAL APPROACH: Only hide video canvas
        this.hideVideoCanvasOnly();
        
        // Connect audio processor to video element
        const videoElement = document.querySelector('video');
        if (videoElement && window.audioProcessor) {
            await window.audioProcessor.connectToVideoElement(videoElement);
        }
        
        // Activate audio visualization with user's preferred skin
        if (this.settings.customAudioPlayer && window.skinManager) {
            const container = this.getPlayerContainer();
            const skinId = await window.skinManager.getCurrentSkin();
            await window.skinManager.setSkin(skinId, container);
        }
        
        // Enable bandwidth optimization if enabled
        if (this.settings.reduceBandwidth && window.audioOnlyStreamManager) {
            window.audioOnlyStreamManager.enableAudioMode();
        }
        
        // Save activation state
        await this.saveActivationState();
    }

    async deactivateAudioMode() {
        if (!this.isActive) return;
        
        console.log('[AudioOnly] Deactivating audio mode');
        this.isActive = false;
        
        // Remove activation class
        document.body.classList.remove('audio-only-surgical-active');
        
        // Restore video canvas
        this.restoreVideoCanvas();
        
        // Deactivate visualization engine
        if (window.visualizationEngine) {
            window.visualizationEngine.deactivate();
        }
        
        // Disconnect audio processor
        if (window.audioProcessor) {
            window.audioProcessor.disconnect();
        }
        
        // Disable bandwidth optimization
        if (window.audioOnlyStreamManager) {
            window.audioOnlyStreamManager.disableAudioMode();
        }
        
        // Save activation state
        await this.saveActivationState();
    }

    toggleAudioMode(enabled) {
        if (enabled) {
            this.activateAudioMode();
        } else {
            this.deactivateAudioMode();
        }
    }

    hideVideoCanvasOnly() {
        // SURGICAL APPROACH: Only hide video rendering, preserve ALL YouTube UI
        const videoElements = document.querySelectorAll('video');
        videoElements.forEach(video => {
            // Store original styles for restoration
            video._originalStyle = video.style.cssText;
            
            // Hide ONLY the video rendering
            video.style.opacity = '0';
            video.style.visibility = 'hidden';
            video.style.position = 'absolute';
            video.style.zIndex = '-1';
        });

        // Also hide canvas elements used for video rendering
        const canvases = document.querySelectorAll('canvas');
        canvases.forEach(canvas => {
            if (canvas.width > 100 || canvas.height > 100) {
                canvas._originalStyle = canvas.style.cssText;
                canvas.style.opacity = '0';
                canvas.style.visibility = 'hidden';
            }
        });

        console.log('[AudioOnly] Video canvas hidden, UI preserved');
    }

    restoreVideoCanvas() {
        // Restore video elements
        const videoElements = document.querySelectorAll('video');
        videoElements.forEach(video => {
            if (video._originalStyle !== undefined) {
                video.style.cssText = video._originalStyle;
                delete video._originalStyle;
            }
        });

        // Restore canvas elements
        const canvases = document.querySelectorAll('canvas');
        canvases.forEach(canvas => {
            if (canvas._originalStyle !== undefined) {
                canvas.style.cssText = canvas._originalStyle;
                delete canvas._originalStyle;
            }
        });

        console.log('[AudioOnly] Video canvas restored');
    }

    getPlayerContainer() {
        return document.getElementById('movie_player') || 
               document.querySelector('.html5-video-player') ||
               document.querySelector('#player-container');
    }

    checkCurrentPage() {
        this.handlePageChanges();
    }

    cleanup() {
        if (this.isActive) {
            this.deactivateAudioMode();
        }
    }

    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        
        // Re-apply optimizations if active
        if (this.isActive) {
            this.applyPageOptimizations();
        }
    }

    async saveActivationState() {
        await chrome.storage.sync.set({
            lastActivationState: this.isActive,
            lastVideoId: this.currentVideoId
        });
    }
}

// Initialize the controller when page loads (only once)
if (!window.audioOnlyController) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.audioOnlyController = new AudioOnlyController();
        });
    } else {
        window.audioOnlyController = new AudioOnlyController();
    }
} else {
    console.log('[AudioOnly] Controller already initialized');
}
