class CameraManager {
    constructor() {
        this.videoElement = document.getElementById('webcam');
        this.canvasElement = document.getElementById('canvas');
        this.previewElement = document.getElementById('preview');
        this.captureBtn = document.getElementById('captureBtn');
        this.retakeBtn = document.getElementById('retakeBtn');
        this.stream = null;
        this.setupEventListeners();
    }

    async initialize() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: 'user',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                } 
            });
            this.videoElement.srcObject = this.stream;
            this.captureBtn.disabled = false;
        } catch (error) {
            console.error('Camera initialization failed:', error);
        }
    }

    setupEventListeners() {
        this.captureBtn.addEventListener('click', () => this.captureImage());
        this.retakeBtn.addEventListener('click', () => this.retakeImage());
    }

    captureImage() {
        const context = this.canvasElement.getContext('2d');
        this.canvasElement.width = this.videoElement.videoWidth;
        this.canvasElement.height = this.videoElement.videoHeight;
        context.drawImage(this.videoElement, 0, 0);
        
        const imageDataUrl = this.canvasElement.toDataURL('image/jpeg', 0.8);
        this.previewElement.innerHTML = `<img src="${imageDataUrl}" alt="Captured image">`;
        
        this.videoElement.style.display = 'none';
        this.previewElement.style.display = 'block';
        this.captureBtn.style.display = 'none';
        this.retakeBtn.style.display = 'block';
        
        return imageDataUrl;
    }

    retakeImage() {
        this.videoElement.style.display = 'block';
        this.previewElement.style.display = 'none';
        this.captureBtn.style.display = 'block';
        this.retakeBtn.style.display = 'none';
    }

    cleanup() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.cameraManager = new CameraManager();
    window.cameraManager.initialize();
});
