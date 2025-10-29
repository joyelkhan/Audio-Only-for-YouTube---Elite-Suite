// content-scripts/ui-manager.js
// SIMPLIFIED: Surgical approach - controller handles everything
class UIManager {
    constructor() {
        this.isActive = false;
        this.init();
    }

    init() {
        console.log('[UIManager] Initialized (surgical mode - minimal functionality)');
    }

    enableAudioMode() {
        if (this.isActive) return;
        console.log('[UIManager] Surgical mode - controller handles UI');
        this.isActive = true;
    }

    disableAudioMode() {
        if (!this.isActive) return;
        console.log('[UIManager] Surgical mode - controller handles UI');
        this.isActive = false;
    }
}

// Initialize UI manager (only once)
if (!window.audioOnlyUIManager) {
    window.audioOnlyUIManager = new UIManager();
} else {
    console.log('[UIManager] Already initialized');
}
