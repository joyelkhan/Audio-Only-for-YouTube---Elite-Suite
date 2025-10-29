// options/options.js
class OptionsManager {
    constructor() {
        this.settings = {
            enabled: true,
            preserveUI: true,
            customAudioPlayer: true,
            reduceBandwidth: false
        };
        this.init();
    }

    async init() {
        await this.loadSettings();
        this.setupUI();
        this.setupEventListeners();
    }

    async loadSettings() {
        try {
            const result = await chrome.storage.sync.get(this.settings);
            this.settings = result;
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    }

    setupUI() {
        // Set checkbox states
        document.getElementById('enabled').checked = this.settings.enabled;
        document.getElementById('preserveUI').checked = this.settings.preserveUI;
        document.getElementById('customAudioPlayer').checked = this.settings.customAudioPlayer;
        document.getElementById('reduceBandwidth').checked = this.settings.reduceBandwidth;
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchTab(btn.dataset.tab);
            });
        });

        // Save button
        document.getElementById('save-btn').addEventListener('click', () => {
            this.saveSettings();
        });

        // Auto-save on checkbox change
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.saveSettings();
            });
        });
    }

    switchTab(tabId) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

        // Update sections
        document.querySelectorAll('.settings-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(tabId).classList.add('active');
    }

    async saveSettings() {
        // Get current values
        this.settings.enabled = document.getElementById('enabled').checked;
        this.settings.preserveUI = document.getElementById('preserveUI').checked;
        this.settings.customAudioPlayer = document.getElementById('customAudioPlayer').checked;
        this.settings.reduceBandwidth = document.getElementById('reduceBandwidth').checked;

        try {
            // Save to storage
            await chrome.storage.sync.set(this.settings);
            
            // Update all YouTube tabs
            const tabs = await chrome.tabs.query({ url: 'https://*.youtube.com/*' });
            for (const tab of tabs) {
                chrome.tabs.sendMessage(tab.id, {
                    action: 'updateSettings',
                    settings: this.settings
                }).catch(() => {
                    // Tab might not have content script loaded yet
                });
            }
            
            this.showMessage('Settings saved successfully!', 'success');
        } catch (error) {
            console.error('Failed to save settings:', error);
            this.showMessage('Failed to save settings', 'error');
        }
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
        window.optionsManager = new OptionsManager();
    });
} else {
    window.optionsManager = new OptionsManager();
}
