// content-scripts/audio-processor.js
class AudioProcessor {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.source = null;
        this.dataArray = null;
        this.bufferLength = null;
        this.isProcessing = false;
        this.init();
    }

    init() {
        this.setupAudioContext();
    }

    setupAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('[AudioProcessor] Audio context initialized');
        } catch (error) {
            console.error('[AudioProcessor] Audio context not supported:', error);
        }
    }

    async connectToVideoElement(videoElement) {
        if (!this.audioContext || !videoElement) return;

        try {
            // Resume audio context if suspended
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }

            // Disconnect existing source if any
            if (this.source) {
                this.disconnect();
            }

            this.source = this.audioContext.createMediaElementSource(videoElement);
            this.analyser = this.audioContext.createAnalyser();
            
            this.analyser.fftSize = 256;
            this.analyser.smoothingTimeConstant = 0.8;
            this.bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(this.bufferLength);
            
            this.source.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
            
            this.isProcessing = true;
            console.log('[AudioProcessor] Connected to video element');
            
        } catch (error) {
            // If already connected, just update the analyser
            if (error.name === 'InvalidStateError') {
                console.log('[AudioProcessor] Already connected, updating analyser');
                this.analyser = this.audioContext.createAnalyser();
                this.analyser.fftSize = 256;
                this.analyser.smoothingTimeConstant = 0.8;
                this.bufferLength = this.analyser.frequencyBinCount;
                this.dataArray = new Uint8Array(this.bufferLength);
                this.isProcessing = true;
            } else {
                console.error('[AudioProcessor] Connection failed:', error);
            }
        }
    }

    getFrequencyData() {
        if (!this.analyser || !this.isProcessing) return null;
        
        this.analyser.getByteFrequencyData(this.dataArray);
        return this.dataArray;
    }

    getWaveformData() {
        if (!this.analyser || !this.isProcessing) return null;
        
        const waveformArray = new Uint8Array(this.bufferLength);
        this.analyser.getByteTimeDomainData(waveformArray);
        return waveformArray;
    }

    getAverageFrequency() {
        const data = this.getFrequencyData();
        if (!data) return 0;
        
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
            sum += data[i];
        }
        return sum / data.length;
    }

    disconnect() {
        if (this.source) {
            try {
                this.source.disconnect();
            } catch (e) {
                // Already disconnected
            }
        }
        this.isProcessing = false;
    }

    destroy() {
        this.disconnect();
        if (this.audioContext) {
            this.audioContext.close();
        }
    }
}

// Singleton instance
if (!window.audioProcessor) {
    window.audioProcessor = new AudioProcessor();
}
