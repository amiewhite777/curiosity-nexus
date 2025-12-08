/**
 * Chord of Truth - Harmonic resonance that emerges at coherence peaks
 * Plays consonant intervals when the system finds stability
 */

export class ChordOfTruth {
  private audioContext: AudioContext | null = null;
  private oscillators: OscillatorNode[] = [];
  private gainNodes: GainNode[] = [];
  private masterGain: GainNode | null = null;
  private isPlaying: boolean = false;

  // Just intonation ratios for pure consonance
  private harmonicRatios = [
    1.0, // Unison
    5 / 4, // Major third
    3 / 2, // Perfect fifth
    2.0, // Octave
  ];

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = 0;
    }
  }

  /**
   * Play the chord when coherence is high
   */
  play(baseFrequency: number = 261.63): void {
    // C4 = 261.63 Hz
    if (!this.audioContext || this.isPlaying) return;

    this.harmonicRatios.forEach((ratio, index) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.value = baseFrequency * ratio;

      gainNode.gain.value = 0;
      gainNode.connect(this.masterGain!);
      oscillator.connect(gainNode);

      oscillator.start();

      // Stagger the attack slightly for each voice
      const attackTime = this.audioContext!.currentTime + index * 0.05;
      gainNode.gain.linearRampToValueAtTime(0.15, attackTime + 0.3);

      this.oscillators.push(oscillator);
      this.gainNodes.push(gainNode);
    });

    if (this.masterGain) {
      this.masterGain.gain.linearRampToValueAtTime(
        1.0,
        this.audioContext.currentTime + 0.5
      );
    }

    this.isPlaying = true;
  }

  /**
   * Fade out the chord
   */
  fadeOut(duration: number = 1.0): void {
    if (!this.audioContext || !this.isPlaying) return;

    const currentTime = this.audioContext.currentTime;

    this.gainNodes.forEach((gainNode) => {
      gainNode.gain.linearRampToValueAtTime(0, currentTime + duration);
    });

    if (this.masterGain) {
      this.masterGain.gain.linearRampToValueAtTime(0, currentTime + duration);
    }

    setTimeout(() => {
      this.stop();
    }, duration * 1000);
  }

  stop(): void {
    this.oscillators.forEach((osc) => osc.stop());
    this.oscillators = [];
    this.gainNodes = [];
    this.isPlaying = false;
  }

  /**
   * Trigger chord based on coherence level
   */
  updateFromCoherence(coherence: number, threshold: number = 0.8): void {
    if (coherence > threshold && !this.isPlaying) {
      this.play();
    } else if (coherence < threshold - 0.1 && this.isPlaying) {
      this.fadeOut(0.5);
    }
  }

  dispose(): void {
    this.stop();
    this.audioContext?.close();
  }
}
