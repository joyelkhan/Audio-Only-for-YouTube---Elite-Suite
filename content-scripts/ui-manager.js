// content-scripts/ui-manager.js
// SIMPLIFIED: No longer needed with surgical approach
// Controller handles minimal overlay directly
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

    createAudioInterface() {
        this.removeAudioInterface(); // Clean up any existing UI
        
        // Find the video container, not the entire player
        const videoContainer = document.querySelector('#player-container') ||
                              document.querySelector('#movie_player');
        
        if (!videoContainer) {
            console.warn('[UIManager] Could not find YouTube video container');
            return;
        }

        // Create elite audio interface
        this.customUI = document.createElement('div');
        this.customUI.id = 'audio-only-elite-ui';
        this.customUI.className = 'audio-only-player';
        
        this.customUI.innerHTML = `
            <div class="audio-player-container">
                <div class="audio-header">
                    <div class="audio-badge">
                        <span class="badge-icon">🎧</span>
                        <span class="badge-text">ELITE AUDIO MODE</span>
                    </div>
                    <div class="audio-stats">
                        <span class="stat" id="bandwidth-saved">Bandwidth Saved: 0MB</span>
                        <span class="stat" id="battery-impact">Battery: Optimal</span>
                    </div>
                </div>
                
                <div class="audio-content">
                    <div class="visualization">
                        <div class="sound-waves">
                            <div class="wave-bar"></div>
                            <div class="wave-bar"></div>
                            <div class="wave-bar"></div>
                            <div class="wave-bar"></div>
                            <div class="wave-bar"></div>
                        </div>
                    </div>
                    
                    <div class="track-info">
                        <h3 class="track-title" id="audio-track-title">Loading Audio Stream...</h3>
                        <p class="channel-name" id="audio-channel-name">YouTube Audio</p>
                    </div>
                    
                    <div class="audio-controls">
                        <button class="control-btn" id="audio-rewind-10" title="Rewind 10s">⏪</button>
                        <button class="control-btn play-pause" id="audio-play-pause" title="Play/Pause">⏸️</button>
                        <button class="control-btn" id="audio-forward-10" title="Forward 10s">⏩</button>
                    </div>
                    
                    <div class="progress-section">
                        <div class="time-display">
                            <span class="time current-time" id="current-time">0:00</span>
                            <input type="range" class="progress-slider" id="audio-progress" value="0" min="0" max="100" step="0.1">
                            <span class="time duration" id="duration">0:00</span>
                        </div>
                    </div>
                    
                    <div class="extra-controls">
                        <button class="extra-btn" id="audio-speed" title="Playback Speed">1.0x</button>
                        <button class="extra-btn" id="audio-quality" title="Audio Quality">Auto</button>
                        <button class="extra-btn" id="audio-download" title="Download Audio">💾</button>
                    </div>
                </div>
            </div>
        `;

        // Insert the audio UI into the player container
        const playerContainer = document.querySelector('#movie_player');
        if (playerContainer) {
            // Hide only the video element, not the entire player
            const video = playerContainer.querySelector('video');
            if (video) {
                video.style.opacity = '0';
                video.style.position = 'absolute';
                video.style.pointerEvents = 'none';
            }
            
            // Insert our custom UI at the top of the player
            playerContainer.insertBefore(this.customUI, playerContainer.firstChild);
        }
        
        // Initialize controls
        this.initializeControls();
        this.updateTrackInfo();
    }

    initializeControls() {
        const videoElement = document.querySelector('video');
        if (!videoElement) {
            console.warn('[UIManager] Video element not found');
            return;
        }

        // Play/Pause control
        const playPauseBtn = document.getElementById('audio-play-pause');
        if (!playPauseBtn) return;
        
        playPauseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (videoElement.paused) {
                videoElement.play().catch(err => console.error('Play failed:', err));
                playPauseBtn.innerHTML = '⏸️';
            } else {
                videoElement.pause();
                playPauseBtn.innerHTML = '▶️';
            }
        });

        // Progress control
        const progressBar = document.getElementById('audio-progress');
        videoElement.addEventListener('timeupdate', () => {
            const progress = (videoElement.currentTime / videoElement.duration) * 100;
            progressBar.value = progress || 0;
            
            document.getElementById('current-time').textContent = 
                this.formatTime(videoElement.currentTime);
            document.getElementById('duration').textContent = 
                this.formatTime(videoElement.duration);
        });

        progressBar.addEventListener('input', (e) => {
            const seekTime = (e.target.value / 100) * videoElement.duration;
            videoElement.currentTime = seekTime;
        });

        // Skip controls
        const rewindBtn = document.getElementById('audio-rewind-10');
        const forwardBtn = document.getElementById('audio-forward-10');
        
        if (rewindBtn) {
            rewindBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                videoElement.currentTime = Math.max(0, videoElement.currentTime - 10);
            });
        }

        if (forwardBtn) {
            forwardBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                videoElement.currentTime = Math.min(videoElement.duration, videoElement.currentTime + 10);
            });
        }

        // Speed control
        const speedBtn = document.getElementById('audio-speed');
        const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
        let speedIndex = 2;
        speedBtn.addEventListener('click', () => {
            speedIndex = (speedIndex + 1) % speeds.length;
            videoElement.playbackRate = speeds[speedIndex];
            speedBtn.textContent = `${speeds[speedIndex]}x`;
        });

        // Sync with video state
        videoElement.addEventListener('play', () => {
            playPauseBtn.innerHTML = '⏸️';
            this.animateVisualization(true);
        });

        videoElement.addEventListener('pause', () => {
            playPauseBtn.innerHTML = '▶️';
            this.animateVisualization(false);
        });

        videoElement.addEventListener('ended', () => {
            playPauseBtn.innerHTML = '▶️';
            this.animateVisualization(false);
        });
    }

    animateVisualization(playing) {
        const waves = document.querySelectorAll('.wave-bar');
        waves.forEach(wave => {
            if (playing) {
                wave.style.animation = 'soundWave 1s ease-in-out infinite';
            } else {
                wave.style.animation = 'none';
            }
        });
    }

    updateTrackInfo() {
        // Get video title
        const titleElement = document.querySelector('#container h1 yt-formatted-string') ||
                           document.querySelector('h1.title yt-formatted-string') ||
                           document.querySelector('h1');
        
        // Get channel name  
        const channelElement = document.querySelector('#owner-container #channel-name') ||
                             document.querySelector('#upload-info yt-formatted-string') ||
                             document.querySelector('.ytd-channel-name a');

        if (titleElement) {
            document.getElementById('audio-track-title').textContent = titleElement.textContent;
        }
        
        if (channelElement) {
            document.getElementById('audio-channel-name').textContent = channelElement.textContent;
        }
    }

    hideVideoElements() {
        // Only hide the video element itself, not the player controls
        const video = document.querySelector('video');
        if (video) {
            video.style.opacity = '0';
            video.style.position = 'absolute';
            video.style.pointerEvents = 'none';
            video.style.zIndex = '-1';
        }
    }

    restoreVideoElements() {
        // Restore the video element
        const video = document.querySelector('video');
        if (video) {
            video.style.opacity = '';
            video.style.position = '';
            video.style.pointerEvents = '';
            video.style.zIndex = '';
        }
    }

    optimizePageLayout() {
        // Make the page more audio-friendly
        document.documentElement.style.setProperty('--ytd-watch-flex-width', '100%');
        document.documentElement.style.setProperty('--ytd-watch-max-width', '100%');
    }

    restorePageLayout() {
        // Restore original layout
        document.documentElement.style.removeProperty('--ytd-watch-flex-width');
        document.documentElement.style.removeProperty('--ytd-watch-max-width');
    }

    removeAudioInterface() {
        if (this.customUI) {
            this.customUI.remove();
            this.customUI = null;
        }
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }
}

// Initialize UI manager (only once)
if (!window.audioOnlyUIManager) {
    window.audioOnlyUIManager = new UIManager();
} else {
    console.log('[UIManager] Already initialized');
}
