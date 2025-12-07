/**
 * AudioManager - Web Audio API synthesizer for emotional interaction
 * Creates generative soundscapes based on tap patterns and orb state
 */

export interface TapSound {
  x: number;        // 0-1, affects panning
  y: number;        // 0-1, affects pitch
  duration: number; // milliseconds
  timestamp: number;
}

export class AudioManager {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private reverbNode: ConvolverNode | null = null;
  private isInitialized = false;
  private activeOscillators: Set<OscillatorNode> = new Set();

  // Base frequencies for different tap types
  private readonly baseFrequencies = {
    quick: 440,  // A4 - bright, alert
    hold: 110,   // A2 - deep, resonant
  };

  // Pentatonic scale ratios (sounds good no matter what)
  private readonly scaleRatios = [1, 9/8, 5/4, 3/2, 5/3, 2];

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      this.context = new AudioContext();

      // Master gain for overall volume control
      this.masterGain = this.context.createGain();
      this.masterGain.gain.value = 0.3; // Keep it subtle
      this.masterGain.connect(this.context.destination);

      // Create reverb for spaciousness
      this.reverbNode = await this.createReverb();
      this.reverbNode.connect(this.masterGain);

      this.isInitialized = true;
      console.log('AudioManager initialized');
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }

  private async createReverb(): Promise<ConvolverNode> {
    if (!this.context) throw new Error('Audio context not initialized');

    const convolver = this.context.createConvolver();

    // Create impulse response for reverb
    const sampleRate = this.context.sampleRate;
    const length = sampleRate * 2; // 2 second reverb
    const impulse = this.context.createBuffer(2, length, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
      }
    }

    convolver.buffer = impulse;
    return convolver;
  }

  /**
   * Play a tap sound based on interaction properties
   */
  playTapSound(tap: TapSound): void {
    if (!this.context || !this.masterGain || !this.reverbNode) return;

    const now = this.context.currentTime;
    const isQuickTap = tap.duration < 200;

    // Map Y position to pitch (higher = higher pitch)
    const pitchIndex = Math.floor((1 - tap.y) * this.scaleRatios.length);
    const pitchRatio = this.scaleRatios[Math.min(pitchIndex, this.scaleRatios.length - 1)];
    const baseFreq = isQuickTap ? this.baseFrequencies.quick : this.baseFrequencies.hold;
    const frequency = baseFreq * pitchRatio;

    if (isQuickTap) {
      this.playQuickTap(frequency, tap.x, now);
    } else {
      this.playHoldTone(frequency, tap.x, tap.duration, now);
    }
  }

  /**
   * Quick tap = bright, bell-like tone
   */
  private playQuickTap(frequency: number, xPosition: number, startTime: number): void {
    if (!this.context || !this.reverbNode) return;

    // Create oscillator for fundamental
    const osc = this.context.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, startTime);

    // Create overtones for bell-like quality
    const osc2 = this.context.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(frequency * 2.4, startTime); // Inharmonic overtone

    const osc3 = this.context.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(frequency * 3.8, startTime); // Another inharmonic

    // Envelope for sharp attack, quick decay
    const envelope = this.context.createGain();
    envelope.gain.setValueAtTime(0, startTime);
    envelope.gain.linearRampToValueAtTime(0.3, startTime + 0.005); // Sharp attack
    envelope.gain.exponentialRampToValueAtTime(0.001, startTime + 0.8); // Decay

    // Stereo panning based on X position
    const panner = this.context.createStereoPanner();
    panner.pan.setValueAtTime((xPosition * 2) - 1, startTime); // -1 to 1

    // Connect the chain
    osc.connect(envelope);
    osc2.connect(envelope);
    osc3.connect(envelope);
    envelope.connect(panner);
    panner.connect(this.reverbNode);

    // Start and stop
    osc.start(startTime);
    osc2.start(startTime);
    osc3.start(startTime);

    const stopTime = startTime + 0.8;
    osc.stop(stopTime);
    osc2.stop(stopTime);
    osc3.stop(stopTime);

    // Track for cleanup
    this.activeOscillators.add(osc);
    this.activeOscillators.add(osc2);
    this.activeOscillators.add(osc3);

    // Cleanup
    setTimeout(() => {
      this.activeOscillators.delete(osc);
      this.activeOscillators.delete(osc2);
      this.activeOscillators.delete(osc3);
    }, 1000);
  }

  /**
   * Hold = deep, resonant drone with evolving harmonics
   */
  private playHoldTone(frequency: number, xPosition: number, duration: number, startTime: number): void {
    if (!this.context || !this.reverbNode) return;

    const sustainTime = Math.min(duration / 1000, 2.0); // Max 2 seconds

    // Fundamental oscillator
    const osc = this.context.createOscillator();
    osc.type = 'triangle'; // Warmer than sine
    osc.frequency.setValueAtTime(frequency, startTime);

    // Add harmonic richness
    const osc2 = this.context.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(frequency * 1.5, startTime); // Perfect fifth

    const osc3 = this.context.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(frequency * 2, startTime); // Octave

    // Slow attack, sustained, slow release
    const envelope = this.context.createGain();
    envelope.gain.setValueAtTime(0, startTime);
    envelope.gain.linearRampToValueAtTime(0.2, startTime + 0.3); // Slow swell
    envelope.gain.setValueAtTime(0.2, startTime + 0.3 + sustainTime); // Hold
    envelope.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3 + sustainTime + 1.0); // Fade out

    // Add subtle vibrato
    const vibrato = this.context.createOscillator();
    vibrato.frequency.setValueAtTime(4, startTime); // 4 Hz vibrato
    const vibratoGain = this.context.createGain();
    vibratoGain.gain.setValueAtTime(3, startTime); // ±3 Hz variation
    vibrato.connect(vibratoGain);
    vibratoGain.connect(osc.frequency);

    // Stereo panning
    const panner = this.context.createStereoPanner();
    panner.pan.setValueAtTime((xPosition * 2) - 1, startTime);

    // Connect chain
    osc.connect(envelope);
    osc2.connect(envelope);
    osc3.connect(envelope);
    envelope.connect(panner);
    panner.connect(this.reverbNode);

    // Start oscillators
    vibrato.start(startTime);
    osc.start(startTime);
    osc2.start(startTime);
    osc3.start(startTime);

    // Stop oscillators
    const stopTime = startTime + 0.3 + sustainTime + 1.0;
    vibrato.stop(stopTime);
    osc.stop(stopTime);
    osc2.stop(stopTime);
    osc3.stop(stopTime);

    // Track for cleanup
    this.activeOscillators.add(osc);
    this.activeOscillators.add(osc2);
    this.activeOscillators.add(osc3);

    setTimeout(() => {
      this.activeOscillators.delete(osc);
      this.activeOscillators.delete(osc2);
      this.activeOscillators.delete(osc3);
    }, (stopTime - startTime) * 1000 + 100);
  }

  /**
   * Play ambient wave sound when waves propagate
   */
  playWaveSound(frequency: number, intensity: number): void {
    if (!this.context || !this.reverbNode) return;

    const now = this.context.currentTime;

    // Soft, whooshing sound
    const osc = this.context.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, now);

    const envelope = this.context.createGain();
    envelope.gain.setValueAtTime(0, now);
    envelope.gain.linearRampToValueAtTime(intensity * 0.05, now + 0.1);
    envelope.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(envelope);
    envelope.connect(this.reverbNode);

    osc.start(now);
    osc.stop(now + 0.4);

    this.activeOscillators.add(osc);
    setTimeout(() => this.activeOscillators.delete(osc), 500);
  }

  /**
   * Create evolving ambient drone based on overall state
   */
  playAmbientDrone(chaosLevel: number): void {
    if (!this.context || !this.masterGain) return;

    const now = this.context.currentTime;

    // Map chaos to dissonance
    const baseFreq = 55; // A1
    const interval = chaosLevel < 0.5
      ? 1.5  // Perfect fifth (harmonious)
      : 1.414; // Tritone (dissonant)

    const osc1 = this.context.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(baseFreq, now);

    const osc2 = this.context.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(baseFreq * interval, now);

    const envelope = this.context.createGain();
    envelope.gain.setValueAtTime(0, now);
    envelope.gain.linearRampToValueAtTime(0.03, now + 2.0);
    envelope.gain.setValueAtTime(0.03, now + 5.0);
    envelope.gain.exponentialRampToValueAtTime(0.001, now + 8.0);

    osc1.connect(envelope);
    osc2.connect(envelope);
    envelope.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 8.0);
    osc2.stop(now + 8.0);
  }

  /**
   * Stop all sounds (cleanup)
   */
  stopAll(): void {
    this.activeOscillators.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {
        // Already stopped
      }
    });
    this.activeOscillators.clear();
  }

  /**
   * Resume audio context (required for user interaction)
   */
  async resume(): Promise<void> {
    if (this.context && this.context.state === 'suspended') {
      await this.context.resume();
    }
  }

  /**
   * Cleanup
   */
  dispose(): void {
    this.stopAll();
    if (this.context) {
      this.context.close();
      this.context = null;
    }
    this.isInitialized = false;
  }
}

// Singleton instance
let audioManagerInstance: AudioManager | null = null;

export function getAudioManager(): AudioManager {
  if (!audioManagerInstance) {
    audioManagerInstance = new AudioManager();
  }
  return audioManagerInstance;
}
