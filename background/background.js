// background/background.js

// Service worker for Audio Only Elite extension

class BackgroundManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupInstallHandler();
        this.setupMessageHandler();
        this.setupCommandHandler();
        this.initializeStorage();
        
        console.log('[AudioOnly] Elite Background service worker initialized');
    }

    setupInstallHandler() {
        chrome.runtime.onInstalled.addListener((details) => {
            console.log('[AudioOnly] Extension installed/updated:', details.reason);
            
            if (details.reason === 'install') {
                this.showInstallWelcome();
            }
            
            if (details.reason === 'update') {
                this.showUpdateNotification();
            }
        });
    }

    setupMessageHandler() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            switch (request.action) {
                case 'getSettings':
                    this.getSettings().then(sendResponse);
                    return true;
                    
                case 'saveSettings':
                    this.saveSettings(request.settings).then(sendResponse);
                    return true;
                    
                case 'bandwidthStats':
                    this.handleBandwidthStats(request.stats, sender.tab);
                    sendResponse({ success: true });
                    break;
                    
                case 'getTabStatus':
                    this.getTabStatus(sender.tab.id).then(sendResponse);
                    return true;
                    
                case 'getAvailableSkins':
                    this.getAvailableSkins().then(sendResponse);
                    return true;
                    
                case 'changeAudioSkin':
                    this.changeAudioSkin(request.skinId).then(sendResponse);
                    return true;
            }
        });
    }

    setupCommandHandler() {
        chrome.commands.onCommand.addListener((command) => {
            if (command === 'toggle_audio_mode') {
                this.toggleAudioMode();
            } else if (command === 'open_options') {
                chrome.runtime.openOptionsPage();
            }
        });
    }

    async initializeStorage() {
        const defaults = {
            enabled: true,
            hideSuggestions: true,
            autoTheaterMode: true,
            bandwidthSaver: true,
            showStats: false,
            version: '2.0.0'
        };

        const current = await chrome.storage.sync.get(defaults);
        await chrome.storage.sync.set({ ...defaults, ...current });
    }

    async getSettings() {
        return await chrome.storage.sync.get({
            enabled: true,
            hideSuggestions: true,
            autoTheaterMode: true,
            bandwidthSaver: true,
            showStats: false
        });
    }

    async saveSettings(settings) {
        await chrome.storage.sync.set(settings);
        return { success: true };
    }

    async getTabStatus(tabId) {
        try {
            const response = await chrome.tabs.sendMessage(tabId, { action: 'getStatus' });
            return response || { active: false, error: 'No response' };
        } catch (error) {
            return { active: false, error: error.message };
        }
    }

    async toggleAudioMode() {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (tab && tab.url.includes('youtube.com')) {
            const status = await this.getTabStatus(tab.id);
            const newState = !status.active;
            
            await chrome.tabs.sendMessage(tab.id, {
                action: 'toggle',
                enabled: newState
            });
            
            // Update badge
            this.updateBadge(tab.id, newState);
        }
    }

    updateBadge(tabId, isActive) {
        if (isActive) {
            chrome.action.setBadgeText({ tabId, text: 'ON' });
            chrome.action.setBadgeBackgroundColor({ tabId, color: '#00ff00' });
        } else {
            chrome.action.setBadgeText({ tabId, text: '' });
        }
    }

    handleBandwidthStats(stats, tab) {
        // Store stats for popup display
        chrome.storage.session.set({ [tab.id]: stats });
    }

    showInstallWelcome() {
        // Could open a welcome page
        console.log('[AudioOnly] Welcome to Audio Only Elite Edition!');
    }

    showUpdateNotification() {
        // Could show what's new in this version
        console.log('[AudioOnly] Extension updated to v2.0.0 - Elite Edition');
    }

    async getAvailableSkins() {
        // Return available audio visualization skins
        const skins = [
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

        // Check for custom skins
        const result = await chrome.storage.sync.get(['customSkins']);
        if (result.customSkins) {
            const customSkins = Object.entries(result.customSkins).map(([id, skin]) => ({
                id,
                ...skin
            }));
            skins.push(...customSkins);
        }

        return { skins };
    }

    async changeAudioSkin(skinId) {
        // Save the selected skin
        await chrome.storage.sync.set({ currentAudioSkin: skinId });
        
        // Notify all YouTube tabs
        const tabs = await chrome.tabs.query({ url: 'https://*.youtube.com/*' });
        for (const tab of tabs) {
            try {
                await chrome.tabs.sendMessage(tab.id, {
                    action: 'changeAudioSkin',
                    skinId: skinId
                });
            } catch (error) {
                // Tab might not have content script loaded yet
                console.log('[AudioOnly] Could not update tab:', tab.id);
            }
        }
        
        return { success: true };
    }
}

// Initialize when service worker starts
const backgroundManager = new BackgroundManager();

// Keep service worker alive
chrome.runtime.onStartup.addListener(() => {
    console.log('[AudioOnly] Service worker starting up');
});

chrome.runtime.onSuspend.addListener(() => {
    console.log('[AudioOnly] Service worker suspending');
});
