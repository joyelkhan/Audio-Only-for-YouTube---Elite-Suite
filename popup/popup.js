// popup/popup.js

class PopupManager {
    constructor() {
        this.settings = {};
        this.currentTab = null;
        this.init();
    }

    async init() {
        await this.loadCurrentTab();
        await this.loadSettings();
        this.setupEventListeners();
        this.updatePopupState();
        
        console.log('[Popup] Elite popup initialized');
    }

    async loadCurrentTab() {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        this.currentTab = tab;
        return tab;
    }

    async loadSettings() {
        this.settings = await new Promise((resolve) => {
            chrome.storage.sync.get({
                enabled: true,
                hideSuggestions: true,
                autoTheaterMode: true,
                bandwidthSaver: true,
                showStats: true
            }, resolve);
        });
        
        this.updateSettingsUI();
    }

    async saveSettings() {
        await chrome.storage.sync.set(this.settings);
        
        // Notify content script about settings change
        if (this.currentTab && this.currentTab.url.includes('youtube.com')) {
            chrome.tabs.sendMessage(this.currentTab.id, {
                action: 'updateSettings',
                settings: this.settings
            });
        }
    }

    setupEventListeners() {
        // Main toggle
        document.getElementById('main-toggle').addEventListener('change', (e) => {
            this.toggleAudioMode(e.target.checked);
        });

        // Settings checkboxes
        document.getElementById('hide-suggestions').addEventListener('change', (e) => {
            this.settings.hideSuggestions = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('auto-theater').addEventListener('change', (e) => {
            this.settings.autoTheaterMode = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('bandwidth-saver').addEventListener('change', (e) => {
            this.settings.bandwidthSaver = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('show-stats').addEventListener('change', (e) => {
            this.settings.showStats = e.target.checked;
            this.saveSettings();
            this.toggleStatsVisibility();
        });

        // Feedback link
        document.getElementById('feedback-link').addEventListener('click', (e) => {
            e.preventDefault();
            this.openFeedback();
        });
    }

    updateSettingsUI() {
        document.getElementById('hide-suggestions').checked = this.settings.hideSuggestions;
        document.getElementById('auto-theater').checked = this.settings.autoTheaterMode;
        document.getElementById('bandwidth-saver').checked = this.settings.bandwidthSaver;
        document.getElementById('show-stats').checked = this.settings.showStats;
        
        this.toggleStatsVisibility();
    }

    toggleStatsVisibility() {
        const statsSection = document.getElementById('stats-section');
        statsSection.style.display = this.settings.showStats ? 'block' : 'none';
    }

    async updatePopupState() {
        if (!this.currentTab) return;

        const isYouTube = this.currentTab.url.includes('youtube.com/watch');
        const statusElement = document.getElementById('page-status');
        const toggle = document.getElementById('main-toggle');

        if (!isYouTube) {
            statusElement.textContent = 'Not a YouTube video';
            statusElement.className = 'status-value inactive';
            toggle.disabled = true;
            return;
        }

        // Enable toggle immediately for YouTube videos
        toggle.disabled = false;
        statusElement.textContent = 'Ready';
        statusElement.className = 'status-value';

        try {
            const status = await chrome.tabs.sendMessage(this.currentTab.id, { 
                action: 'getStatus' 
            });
            
            if (status && status.active) {
                statusElement.textContent = 'Audio Mode ACTIVE';
                statusElement.className = 'status-value active';
                toggle.checked = true;
                
                // Update stats if available
                this.updateStatsDisplay(status);
            } else {
                statusElement.textContent = 'Audio Mode INACTIVE';
                statusElement.className = 'status-value inactive';
                toggle.checked = false;
            }
            
        } catch (error) {
            // Content script not ready yet, but allow toggling
            statusElement.textContent = 'Click to activate';
            statusElement.className = 'status-value';
            toggle.checked = false;
            console.log('[Popup] Content script loading, will activate on toggle');
        }
    }

    async toggleAudioMode(enabled) {
        if (!this.currentTab) return;

        const statusElement = document.getElementById('page-status');
        const toggle = document.getElementById('main-toggle');

        try {
            // Show loading state
            statusElement.textContent = enabled ? 'Activating...' : 'Deactivating...';
            
            await chrome.tabs.sendMessage(this.currentTab.id, {
                action: 'toggle',
                enabled: enabled
            });
            
            // Wait a bit for activation
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Update UI
            await this.updatePopupState();
            
        } catch (error) {
            console.error('[Popup] Failed to toggle audio mode:', error);
            
            // Try to inject content scripts if they're not loaded
            if (error.message && error.message.includes('Could not establish connection')) {
                statusElement.textContent = 'Injecting scripts...';
                
                try {
                    await chrome.scripting.executeScript({
                        target: { tabId: this.currentTab.id },
                        files: [
                            'content-scripts/controller.js',
                            'content-scripts/stream-manager.js',
                            'content-scripts/ui-manager.js'
                        ]
                    });
                    
                    await chrome.scripting.insertCSS({
                        target: { tabId: this.currentTab.id },
                        files: ['content-scripts/overrides.css']
                    });
                    
                    // Wait for scripts to initialize
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    // Try toggle again
                    await chrome.tabs.sendMessage(this.currentTab.id, {
                        action: 'toggle',
                        enabled: enabled
                    });
                    
                    await this.updatePopupState();
                    
                } catch (injectError) {
                    console.error('[Popup] Failed to inject scripts:', injectError);
                    statusElement.textContent = 'Please refresh the page';
                    toggle.checked = !enabled;
                }
            } else {
                statusElement.textContent = 'Error - try refreshing page';
                toggle.checked = !enabled;
            }
        }
    }

    updateStatsDisplay(status) {
        // Update bandwidth stats
        if (status.stats) {
            document.getElementById('bandwidth-saved').textContent = 
                status.stats.savedMB + ' MB';
        }
        
        // Update other stats
        document.getElementById('battery-impact').textContent = 'Low';
        document.getElementById('cpu-usage').textContent = 'Reduced';
    }

    openFeedback() {
        const subject = encodeURIComponent('Audio Only Elite - Feedback');
        const body = encodeURIComponent(
            `I'm using Audio Only Elite v1.0.0\n\n` +
            `My feedback:\n\n` +
            `System Info: ${navigator.userAgent}\n` +
            `YouTube URL: ${this.currentTab?.url || 'N/A'}` 
        );
        
        const mailtoUrl = `mailto:feedback@audioonlyelite.com?subject=${subject}&body=${body}`;
        
        chrome.tabs.create({ url: mailtoUrl });
    }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PopupManager();
});

// Update when popup is opened
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Popup became visible, refresh state
        setTimeout(() => window.location.reload(), 100);
    }
});
