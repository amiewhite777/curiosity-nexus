/**
 * Pendulum Hum - Web Audio API oscillators for the system's resonance
 * The pendulum's motion creates harmonic frequencies
 */

export class PendulumHum {
  private audioContext: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.value = 0; // Start silent
    }
  }

  start(baseFrequency: number = 220): void {
    if (!this.audioContext || this.isPlaying) return;

    this.oscillator = this.audioContext.createOscillator();
    this.oscillator.type = 'sine';
    this.oscillator.frequency.value = baseFrequency;

    if (this.gainNode) {
      this.oscillator.connect(this.gainNode);
      this.oscillator.start();
      this.isPlaying = true;

      // Fade in
      this.gainNode.gain.linearRampToValueAtTime(
        0.1,
        this.audioContext.currentTime + 0.5
      );
    }
  }

  stop(): void {
    if (!this.oscillator || !this.gainNode || !this.audioContext) return;

    // Fade out
    this.gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.5);

    setTimeout(() => {
      this.oscillator?.stop();
      this.isPlaying = false;
    }, 500);
  }

  updateFromChaos(
    chaosLevel: number,
    energy: number,
    baseFrequency: number = 220
  ): void {
    if (!this.oscillator || !this.gainNode || !this.audioContext) return;

    // Map chaos to frequency modulation
    const frequencyModulation = 1 + chaosLevel * 2; // 1x to 3x base frequency
    const targetFrequency = baseFrequency * frequencyModulation;

    // Smooth frequency transition
    this.oscillator.frequency.linearRampToValueAtTime(
      targetFrequency,
      this.audioContext.currentTime + 0.1
    );

    // Volume based on energy (but keep it subtle)
    const targetVolume = Math.min(0.2, energy * 0.1);
    this.gainNode.gain.linearRampToValueAtTime(
      targetVolume,
      this.audioContext.currentTime + 0.1
    );
  }

  setVolume(volume: number): void {
    if (!this.gainNode || !this.audioContext) return;
    this.gainNode.gain.linearRampToValueAtTime(
      Math.max(0, Math.min(1, volume)),
      this.audioContext.currentTime + 0.1
    );
  }

  dispose(): void {
    this.stop();
    this.audioContext?.close();
  }
}
