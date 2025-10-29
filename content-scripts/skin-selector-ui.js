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
                <path fill="#fff" d="M8 10h2v16H8V10zm4 3h2v10h-2V13zm4-1h2v12h-2V12zm4 2h2v8h-2v-8zm4-3h2v14h-2V11zm4 4h2v6h-2v-6z"></path>
            </svg>
        `;

        // Add click handler
        this.button.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown();
        });

        // Insert button at the beginning of right controls (before all other buttons)
        const firstButton = controls.firstElementChild;
        if (firstButton) {
            controls.insertBefore(this.button, firstButton);
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
        const controlsRect = document.querySelector('.ytp-right-controls').getBoundingClientRect();

        this.dropdown.style.display = 'block';
        
        // Position above the button with proper spacing
        const bottomOffset = playerRect.bottom - buttonRect.top + 10;
        this.dropdown.style.bottom = bottomOffset + 'px';
        
        // Align with the left edge of the button
        const rightOffset = playerRect.right - buttonRect.left - this.dropdown.offsetWidth;
        this.dropdown.style.right = Math.max(10, rightOffset) + 'px';

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
        items.forEach((item, index) => {
            item.classList.remove('active');
            const check = item.querySelector('.skin-check');
            if (check) check.remove();
            
            // Add check mark to current skin
            if (this.skins[index].id === this.currentSkin) {
                item.classList.add('active');
                const checkMark = document.createElement('span');
                checkMark.className = 'skin-check';
                checkMark.textContent = '✓';
                item.appendChild(checkMark);
            }
        });
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
