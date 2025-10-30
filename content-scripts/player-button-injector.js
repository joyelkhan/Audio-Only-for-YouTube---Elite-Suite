// content-scripts/player-button-injector.js
// Injects a custom Audio Visualization button into YouTube's player control bar

class PlayerButtonInjector {
    constructor() {
        this.button = null;
        this.isInjected = false;
        this.retryCount = 0;
        this.maxRetries = 20;
        this.observer = null;
        
        this.init();
    }

    init() {
        console.log('[PlayerButton] Initializing button injector');
        
        // Wait for YouTube player to load
        this.waitForPlayer();
        
        // Listen for navigation changes (YouTube is a SPA)
        this.setupNavigationListener();
    }

    waitForPlayer() {
        const checkInterval = setInterval(() => {
            const controlsContainer = this.getControlsContainer();
            
            if (controlsContainer && !this.isInjected) {
                clearInterval(checkInterval);
                this.injectButton();
            } else if (this.retryCount >= this.maxRetries) {
                clearInterval(checkInterval);
                console.log('[PlayerButton] Max retries reached, stopping');
            }
            
            this.retryCount++;
        }, 500);
    }

    getControlsContainer() {
        // YouTube's left controls container (near play button)
        return document.querySelector('.ytp-left-controls');
    }

    async injectButton() {
        const controlsContainer = this.getControlsContainer();
        if (!controlsContainer) {
            console.log('[PlayerButton] Controls container not found');
            return;
        }

        // Check if button already exists
        if (document.getElementById('audio-viz-button')) {
            console.log('[PlayerButton] Button already exists');
            return;
        }

        console.log('[PlayerButton] Injecting button into player controls');

        // Create the button element
        this.button = document.createElement('button');
        this.button.id = 'audio-viz-button';
        this.button.className = 'ytp-button audio-viz-button';
        this.button.setAttribute('aria-label', 'Toggle Audio Visualization');
        this.button.setAttribute('title', 'Toggle Audio Visualization');
        
        // Add SVG icon
        this.button.innerHTML = this.getButtonIcon();
        
        // Add click handler
        this.button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.handleButtonClick();
        });

        // Insert button at the end of left controls (after volume)
        controlsContainer.appendChild(this.button);

        this.isInjected = true;
        
        // Update button state based on current audio mode
        this.updateButtonState();
        
        console.log('[PlayerButton] Button injected successfully');
    }

    getButtonIcon() {
        // Simple audio wave icon
        return `
            <svg class="audio-viz-icon" height="100%" version="1.1" viewBox="0 0 36 36" width="100%">
                <path class="audio-viz-path" d="M8,18 L10,14 L12,22 L14,10 L16,26 L18,12 L20,24 L22,14 L24,20 L26,16 L28,18" 
                      fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
    }

    async handleButtonClick() {
        console.log('[PlayerButton] Button clicked');
        
        // Toggle audio visualization mode
        const controller = window.audioOnlyController;
        if (!controller) {
            console.log('[PlayerButton] Controller not found');
            return;
        }

        // Toggle the audio mode
        if (controller.isActive) {
            await controller.deactivateAudioMode();
        } else {
            await controller.activateAudioMode();
        }

        // Update button appearance
        this.updateButtonState();
        
        // Show a brief notification
        this.showNotification(controller.isActive ? 'Audio Visualization ON' : 'Audio Visualization OFF');
    }

    updateButtonState() {
        if (!this.button) return;

        const controller = window.audioOnlyController;
        const isActive = controller && controller.isActive;

        if (isActive) {
            this.button.classList.add('active');
            this.button.setAttribute('aria-pressed', 'true');
        } else {
            this.button.classList.remove('active');
            this.button.setAttribute('aria-pressed', 'false');
        }
    }

    showNotification(message) {
        // Create a simple toast notification
        const toast = document.createElement('div');
        toast.className = 'audio-viz-toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);

        // Remove after 2 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    setupNavigationListener() {
        // YouTube is a SPA, so we need to detect navigation
        let lastUrl = location.href;
        
        this.observer = new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                this.handleNavigation();
            }
        });

        this.observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    handleNavigation() {
        console.log('[PlayerButton] Navigation detected');
        
        // Reset state
        this.isInjected = false;
        this.retryCount = 0;
        this.button = null;
        
        // Re-inject button after a short delay
        setTimeout(() => {
            this.waitForPlayer();
        }, 1000);
    }

    destroy() {
        if (this.button) {
            this.button.remove();
            this.button = null;
        }
        
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        
        this.isInjected = false;
    }
}

// Initialize the button injector
if (!window.playerButtonInjector) {
    // Wait for the controller to be ready
    const initButton = () => {
        if (window.audioOnlyController) {
            window.playerButtonInjector = new PlayerButtonInjector();
        } else {
            setTimeout(initButton, 500);
        }
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initButton);
    } else {
        initButton();
    }
} else {
    console.log('[PlayerButton] Button injector already initialized');
}
