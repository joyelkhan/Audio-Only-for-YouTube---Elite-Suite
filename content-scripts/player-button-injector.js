// content-scripts/player-button-injector.js
// Injects a custom Audio Visualization button into YouTube's player control bar

class PlayerButtonInjector {
    constructor() {
        this.buttonAdded = false;
        this.button = null;
        this.init();
    }

    init() {
        console.log('[PlayerButton] Initializing button injector');
        this.injectButton();
        this.setupNavigationObserver();
    }

    injectButton() {
        // Check if we're on a watch page and button doesn't exist
        if (!this.isWatchPage() || this.buttonAdded) return;
        
        const controls = document.querySelector('.ytp-right-controls');
        if (!controls) {
            setTimeout(() => this.injectButton(), 500);
            return;
        }
        
        // Remove existing button if any
        const existingBtn = controls.querySelector('.audio-viz-button');
        if (existingBtn) existingBtn.remove();
        
        // Create and insert button
        this.button = this.createButton();
        const fullscreenBtn = controls.querySelector('.ytp-fullscreen-button');
        
        if (fullscreenBtn) {
            controls.insertBefore(this.button, fullscreenBtn);
        } else {
            controls.appendChild(this.button);
        }
        
        this.buttonAdded = true;
        this.updateButtonState();
        console.log('[PlayerButton] Button injected successfully');
    }

    isWatchPage() {
        return window.location.href.includes('/watch');
    }

    createButton() {
        const button = document.createElement('button');
        button.className = 'ytp-button audio-viz-button';
        button.setAttribute('aria-label', 'Toggle Audio Visualization');
        button.setAttribute('title', 'Toggle Audio Visualization');
        button.innerHTML = this.getButtonSVG();
        
        // Add click handler
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.handleButtonClick();
        });
        
        return button;
    }

    getButtonSVG() {
        // Audio visualization icon - waveform style
        return `
            <svg width="100%" height="100%" viewBox="0 0 36 36" style="pointer-events: none;">
                <path class="audio-viz-path" 
                      d="M8,18 L10,14 L12,22 L14,10 L16,26 L18,12 L20,24 L22,14 L24,20 L26,16 L28,18" 
                      fill="none" 
                      stroke="currentColor" 
                      stroke-width="2.5" 
                      stroke-linecap="round" 
                      stroke-linejoin="round"/>
            </svg>
        `;
    }

    async handleButtonClick() {
        console.log('[PlayerButton] Button clicked');
        
        // Toggle audio visualization mode
        const controller = window.audioOnlyController;
        if (!controller) {
            console.log('[PlayerButton] Controller not found');
            this.showNotification('Please wait, loading...');
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

    setupNavigationObserver() {
        // Handle YouTube's SPA navigation
        let currentUrl = window.location.href;
        
        const observer = new MutationObserver(() => {
            if (window.location.href !== currentUrl) {
                currentUrl = window.location.href;
                this.buttonAdded = false;
                this.button = null;
                setTimeout(() => this.injectButton(), 1000);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

}

// Initialize when page loads
if (!window.playerButtonInjector) {
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
}
