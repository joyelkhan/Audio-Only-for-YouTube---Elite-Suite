// injected/player-hijacker.js
(function() {
    'use strict';
    
    console.log('[PlayerHijacker] Injected script loaded');
    
    // This script runs in the page context and can access YouTube's internal objects
    // Be careful - this is powerful but can break if YouTube changes their code
    
    function enhancePlayer() {
        const player = document.getElementById('movie_player');
        if (player && typeof player.getPlayerState === 'function') {
            console.log('[PlayerHijacker] Enhancing YouTube player');
            
            // Store original methods
            const originalPlayVideo = player.playVideo;
            const originalPauseVideo = player.pauseVideo;
            
            // Enhance with audio-only features
            player.playVideo = function() {
                console.log('[PlayerHijacker] Video play intercepted');
                return originalPlayVideo.call(this);
            };
            
            player.pauseVideo = function() {
                console.log('[PlayerHijacker] Video pause intercepted'); 
                return originalPauseVideo.call(this);
            };
            
            // Add audio-specific methods
            player.getAudioTrackInfo = function() {
                // Try to get audio track information
                const video = document.querySelector('video');
                if (video) {
                    return {
                        audioTracks: video.audioTracks,
                        volume: video.volume,
                        muted: video.muted
                    };
                }
                return null;
            };
        }
    }
    
    // Wait for player to be available
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', enhancePlayer);
    } else {
        setTimeout(enhancePlayer, 1000);
    }
})();
