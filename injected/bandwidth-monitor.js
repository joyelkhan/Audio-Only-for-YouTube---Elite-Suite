// injected/bandwidth-monitor.js
(function() {
    'use strict';
    
    class BandwidthMonitor {
        constructor() {
            this.videoBytes = 0;
            this.audioBytes = 0;
            this.startTime = Date.now();
            this.init();
        }
        
        init() {
            this.interceptNetworkActivity();
            this.startReporting();
        }
        
        interceptNetworkActivity() {
            // Monitor resource loading
            const originalImage = Image;
            window.Image = function() {
                const img = new originalImage();
                // Track image loads if needed
                return img;
            };
            
            // Performance monitoring
            if (window.performance && performance.getEntriesByType) {
                this.analyzePerformanceEntries();
            }
        }
        
        analyzePerformanceEntries() {
            const resources = performance.getEntriesByType('resource');
            resources.forEach(resource => {
                if (resource.name.includes('googlevideo.com')) {
                    if (resource.name.includes('mime=video')) {
                        this.videoBytes += resource.transferSize || 0;
                    } else if (resource.name.includes('mime=audio')) {
                        this.audioBytes += resource.transferSize || 0;
                    }
                }
            });
        }
        
        getStats() {
            const now = Date.now();
            const duration = (now - this.startTime) / 1000; // seconds
            
            return {
                videoBytes: this.videoBytes,
                audioBytes: this.audioBytes,
                videoMB: (this.videoBytes / (1024 * 1024)).toFixed(2),
                audioMB: (this.audioBytes / (1024 * 1024)).toFixed(2),
                duration: duration,
                bandwidthSaved: this.videoBytes // In audio mode, this represents saved bandwidth
            };
        }
        
        startReporting() {
            setInterval(() => {
                const stats = this.getStats();
                
                // Send to content script
                window.postMessage({
                    type: 'AUDIO_ONLY_BANDWIDTH_STATS',
                    stats: stats
                }, '*');
                
            }, 5000);
        }
    }
    
    // Initialize
    window.audioOnlyBandwidthMonitor = new BandwidthMonitor();
    
})();
