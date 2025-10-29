// content-scripts/skin-selector-ui.js
// Creates a button on YouTube player controls for quick skin switching

class SkinSelectorUI {
    constructor() {
        this.button = null;
        this.dropdown = null;
        this.isOpen = false;
        this.currentSkin = 'spectrum';
        this.skins = [
            { id: 'spectrum', name: '🌈 Spectrum', icon: '🌈' },
            { id: 'waveform', name: '📈 Waveform', icon: '📈' },
            { id: 'particles', name: '✨ Particles', icon: '✨' },
            { id: 'nebula', name: '🌌 Nebula', icon: '🌌' },
            { id: 'equalizer', name: '🎛️ Equalizer', icon: '🎛️' },
            { id: 'vintage', name: '📺 Vintage', icon: '📺' },
            { id: 'cyberpunk', name: '🔮 Cyberpunk', icon: '🔮' },
            { id: 'ambient', name: '🎨 Ambient', icon: '🎨' }
        ];
        this.init();
    }

    async init() {
        // Load current skin
        const result = await chrome.storage.sync.get(['currentAudioSkin']);
        this.currentSkin = result.currentAudioSkin || 'spectrum';
        
        // Wait for YouTube player to be ready
        this.waitForPlayer();
    }

    waitForPlayer() {
        const checkPlayer = setInterval(() => {
            const controls = document.querySelector('.ytp-right-controls');
            if (controls) {
                clearInterval(checkPlayer);
                this.createButton();
            }
        }, 500);

        // Stop checking after 10 seconds
        setTimeout(() => clearInterval(checkPlayer), 10000);
    }

    createButton() {
        // Check if button already exists
        if (document.getElementById('audio-skin-selector-btn')) return;

        const controls = document.querySelector('.ytp-right-controls');
        if (!controls) return;

        // Create button
        this.button = document.createElement('button');
        this.button.id = 'audio-skin-selector-btn';
        this.button.className = 'ytp-button audio-skin-btn';
        this.button.title = 'Change Audio Visualization';
        this.button.innerHTML = `
            <svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%">
                <path fill="#fff" d="M18 4c-7.73 0-14 6.27-14 14s6.27 14 14 14 14-6.27 14-14S25.73 4 18 4zm0 2c6.65 0 12 5.35 12 12s-5.35 12-12 12S6 24.65 6 18 11.35 6 18 6zm-8 10v4h4v-4h-4zm6 0v4h4v-4h-4zm6 0v4h4v-4h-4z"></path>
            </svg>
        `;

        // Add click handler
        this.button.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown();
        });

        // Insert button before settings button
        const settingsBtn = controls.querySelector('.ytp-settings-button');
        if (settingsBtn) {
            controls.insertBefore(this.button, settingsBtn);
        } else {
            controls.appendChild(this.button);
        }

        // Create dropdown
        this.createDropdown();

        console.log('[SkinSelector] Button added to player controls');
    }

    createDropdown() {
        // Create dropdown container
        this.dropdown = document.createElement('div');
        this.dropdown.id = 'audio-skin-dropdown';
        this.dropdown.className = 'audio-skin-dropdown';
        this.dropdown.style.display = 'none';

        // Create header
        const header = document.createElement('div');
        header.className = 'skin-dropdown-header';
        header.innerHTML = '<strong>🎨 Audio Visualizations</strong>';
        this.dropdown.appendChild(header);

        // Create skin list
        const skinList = document.createElement('div');
        skinList.className = 'skin-list';

        this.skins.forEach(skin => {
            const item = document.createElement('div');
            item.className = 'skin-item';
            if (skin.id === this.currentSkin) {
                item.classList.add('active');
            }

            item.innerHTML = `
                <span class="skin-icon">${skin.icon}</span>
                <span class="skin-name">${skin.name}</span>
                ${skin.id === this.currentSkin ? '<span class="skin-check">✓</span>' : ''}
            `;

            item.addEventListener('click', () => {
                this.selectSkin(skin.id);
            });

            skinList.appendChild(item);
        });

        this.dropdown.appendChild(skinList);

        // Add to player
        const player = document.querySelector('.html5-video-player');
        if (player) {
            player.appendChild(this.dropdown);
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.dropdown.contains(e.target) && e.target !== this.button) {
                this.closeDropdown();
            }
        });
    }

    toggleDropdown() {
        if (this.isOpen) {
            this.closeDropdown();
        } else {
            this.openDropdown();
        }
    }

    openDropdown() {
        if (!this.dropdown) return;

        // Position dropdown
        const buttonRect = this.button.getBoundingClientRect();
        const playerRect = document.querySelector('.html5-video-player').getBoundingClientRect();

        this.dropdown.style.display = 'block';
        this.dropdown.style.bottom = (playerRect.bottom - buttonRect.top + 10) + 'px';
        this.dropdown.style.right = (playerRect.right - buttonRect.right) + 'px';

        this.isOpen = true;
        this.button.classList.add('active');
    }

    closeDropdown() {
        if (!this.dropdown) return;

        this.dropdown.style.display = 'none';
        this.isOpen = false;
        this.button.classList.remove('active');
    }

    async selectSkin(skinId) {
        this.currentSkin = skinId;

        // Save to storage
        await chrome.storage.sync.set({ currentAudioSkin: skinId });

        // Update UI
        this.updateDropdownUI();

        // Apply skin via skin manager
        if (window.skinManager) {
            window.skinManager.setCurrentSkin(skinId);
        }

        // Close dropdown
        this.closeDropdown();

        console.log('[SkinSelector] Skin changed to:', skinId);
    }

    updateDropdownUI() {
        const items = this.dropdown.querySelectorAll('.skin-item');
        items.forEach(item => {
            item.classList.remove('active');
            const check = item.querySelector('.skin-check');
            if (check) check.remove();
        });

        // Find and update active item
        const skinIndex = this.skins.findIndex(s => s.id === this.currentSkin);
        if (skinIndex >= 0) {
            const activeItem = items[skinIndex];
            activeItem.classList.add('active');
            activeItem.innerHTML += '<span class="skin-check">✓</span>';
        }
    }
}

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.skinSelectorUI = new SkinSelectorUI();
    });
} else {
    window.skinSelectorUI = new SkinSelectorUI();
}

// Re-initialize on YouTube navigation
let lastUrl = location.href;
new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        setTimeout(() => {
            if (window.skinSelectorUI) {
                window.skinSelectorUI.waitForPlayer();
            }
        }, 1000);
    }
}).observe(document, { subtree: true, childList: true });
