export default class AudioSystem {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.muted = false;
    }

    playJump() {
        this.playTone(400, 'square', 0.1);
    }

    playCollect() {
        this.playTone(800, 'sine', 0.1);
        setTimeout(() => this.playTone(1200, 'sine', 0.1), 100);
    }

    playWin() {
        // Fanfare
        this.playTone(523, 'square', 0.2);
        setTimeout(() => this.playTone(659, 'square', 0.2), 200);
        setTimeout(() => this.playTone(783, 'square', 0.4), 400);
        setTimeout(() => this.playTone(1046, 'square', 0.6), 800);
    }

    playTone(freq, type, duration) {
        if (this.muted) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.value = freq;

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();

        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        osc.stop(this.ctx.currentTime + duration);
    }

    toggleMute() {
        this.muted = !this.muted;
    }
}
