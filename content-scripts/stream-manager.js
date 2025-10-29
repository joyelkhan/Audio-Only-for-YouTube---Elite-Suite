// content-scripts/stream-manager.js
class StreamManager {
    constructor() {
        this.isActive = false;
        this.interceptedRequests = new Set();
        this.init();
    }

    init() {
        // This will be activated by the controller
        console.log('[StreamManager] Initialized and ready');
    }

    enableAudioMode() {
        if (this.isActive) return;
        
        console.log('[StreamManager] Enabling bandwidth optimization');
        this.isActive = true;
        
        this.interceptVideoRequests();
        this.optimizeExistingStreams();
        this.monitorBandwidth();
    }

    disableAudioMode() {
        if (!this.isActive) return;
        
        console.log('[StreamManager] Disabling bandwidth optimization');
        this.isActive = false;
        
        this.restoreIntercepts();
    }

    interceptVideoRequests() {
        // Intercept fetch requests for video content
        const originalFetch = window.fetch;
        const self = this;
        window.fetch = function(...args) {
            const url = args[0];
            
            if (self.isActive && self.isVideoUrl(url)) {
                console.log('[StreamManager] Intercepted video fetch:', url);
                self.interceptedRequests.add(url);
                
                // For video requests, we might want to modify them or block them
                // For now, we just track them
                return originalFetch(...args);
            }
            
            return originalFetch(...args);
        };

        // Intercept XMLHttpRequest for video content
        const originalXHROpen = XMLHttpRequest.prototype.open;
        const originalXHRSend = XMLHttpRequest.prototype.send;
        
        XMLHttpRequest.prototype.open = function(method, url, ...args) {
            this._requestUrl = url;
            return originalXHROpen.call(this, method, url, ...args);
        };

        XMLHttpRequest.prototype.send = function(data) {
            if (self.isActive && this._requestUrl && self.isVideoUrl(this._requestUrl)) {
                console.log('[StreamManager] Intercepted video XHR:', this._requestUrl);
                self.interceptedRequests.add(this._requestUrl);
            }
            return originalXHRSend.call(this, data);
        };
    }

    isVideoUrl(url) {
        if (!url) return false;
        
        const videoPatterns = [
            'googlevideo.com/videoplayback',
            'mime=video/',
            'quality=',
            'videoplayback',
            '/vi/',
            '.mp4',
            '.webm',
            'video/'
        ];
        
        return videoPatterns.some(pattern => url.includes(pattern));
    }

    optimizeExistingStreams() {
        // Find all video elements and optimize them
        const videos = document.querySelectorAll('video');
        videos.forEach((video, index) => {
            this.optimizeVideoElement(video, index);
        });
    }

    optimizeVideoElement(video, index) {
        // Store original methods
        const originalPlay = video.play;
        const originalSrcSetter = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'src')?.set;
        
        // Track this video
        video._audioOnlyOptimized = true;
        
        console.log(`[StreamManager] Optimizing video element ${index}`);
        
        // We can't completely block video playback as it might break YouTube's player
        // But we can minimize its impact
        video.style.opacity = '0.01';
        video.style.pointerEvents = 'none';
        video.setAttribute('muted', 'true');
        video.volume = 0;
        
        const self = this;
        
        // Monitor for source changes
        if (originalSrcSetter) {
            Object.defineProperty(video, 'src', {
                set: function(value) {
                    if (self.isActive && self.isVideoUrl(value)) {
                        console.log('[StreamManager] Video src change intercepted:', value);
                        self.interceptedRequests.add(value);
                    }
                    return originalSrcSetter.call(this, value);
                },
                get: function() {
                    return video.getAttribute('src');
                }
            });
        }
    }

    monitorBandwidth() {
        // Periodically report bandwidth savings
        setInterval(() => {
            const stats = this.getBandwidthStats();
            this.reportStats(stats);
        }, 5000);
    }

    getBandwidthStats() {
        return {
            interceptedRequests: this.interceptedRequests.size,
            active: this.isActive,
            timestamp: Date.now()
        };
    }

    reportStats(stats) {
        // Send stats to popup and background script
        chrome.runtime.sendMessage({
            action: 'bandwidthStats',
            stats: stats
        });
    }

    restoreIntercepts() {
        // Restore original methods
        // Note: This is simplified - in production you'd need to track original methods better
        
        // Restore video elements
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            if (video._audioOnlyOptimized) {
                video.style.opacity = '';
                video.style.pointerEvents = '';
                video.removeAttribute('muted');
                video.volume = 1;
                delete video._audioOnlyOptimized;
            }
        });
    }
}

// Initialize stream manager (only once)
if (!window.audioOnlyStreamManager) {
    window.audioOnlyStreamManager = new StreamManager();
} else {
    console.log('[StreamManager] Already initialized');
}
