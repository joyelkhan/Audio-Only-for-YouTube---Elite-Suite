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
        // YouTube's right controls container (where CC, settings, fullscreen buttons are)
        return document.querySelector('.ytp-right-controls');
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

        // Insert button before the settings button (or at the beginning of right controls)
        const settingsButton = controlsContainer.querySelector('.ytp-settings-button');
        if (settingsButton) {
            controlsContainer.insertBefore(this.button, settingsButton);
        } else {
            controlsContainer.insertBefore(this.button, controlsContainer.firstChild);
        }

        this.isInjected = true;
        
        // Update button state based on current audio mode
        this.updateButtonState();
        
        console.log('[PlayerButton] Button injected successfully');
    }

    getButtonIcon() {
        // Custom SVG icon for audio visualization
        // Using a waveform/equalizer style icon
        return `
            <svg class="audio-viz-icon" height="100%" version="1.1" viewBox="0 0 36 36" width="100%">
                <g class="audio-viz-icon-bars">
                    <rect x="6" y="14" width="3" height="8" rx="1.5" class="bar bar-1">
                        <animate attributeName="height" values="8;16;8" dur="1.2s" repeatCount="indefinite" />
                        <animate attributeName="y" values="14;10;14" dur="1.2s" repeatCount="indefinite" />
                    </rect>
                    <rect x="11" y="10" width="3" height="16" rx="1.5" class="bar bar-2">
                        <animate attributeName="height" values="16;22;16" dur="1s" repeatCount="indefinite" />
                        <animate attributeName="y" values="10;7;10" dur="1s" repeatCount="indefinite" />
                    </rect>
                    <rect x="16" y="8" width="3" height="20" rx="1.5" class="bar bar-3">
                        <animate attributeName="height" values="20;24;20" dur="0.8s" repeatCount="indefinite" />
                        <animate attributeName="y" values="8;6;8" dur="0.8s" repeatCount="indefinite" />
                    </rect>
                    <rect x="21" y="12" width="3" height="12" rx="1.5" class="bar bar-4">
                        <animate attributeName="height" values="12;18;12" dur="1.1s" repeatCount="indefinite" />
                        <animate attributeName="y" values="12;9;12" dur="1.1s" repeatCount="indefinite" />
                    </rect>
                    <rect x="26" y="15" width="3" height="6" rx="1.5" class="bar bar-5">
                        <animate attributeName="height" values="6;14;6" dur="1.3s" repeatCount="indefinite" />
                        <animate attributeName="y" values="15;11;15" dur="1.3s" repeatCount="indefinite" />
                    </rect>
                </g>
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
            // Pause animations when active to show static state
            const bars = this.button.querySelectorAll('.bar animate');
            bars.forEach(anim => anim.beginElement());
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
