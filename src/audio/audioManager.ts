/**
 * AudioManager - Web Audio API synthesizer for emotional interaction
 * Creates generative soundscapes based on tap patterns and orb state
 */

export interface TapSound {
  x: number;        // 0-1, affects panning
  y: number;        // 0-1, affects pitch
  timestamp: number;
}

export class AudioManager {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private reverbNode: ConvolverNode | null = null;
  private isInitialized = false;
  private activeOscillators: Set<OscillatorNode> = new Set();

  // Base frequency for taps
  private readonly baseFrequency = 330; // E4 - warm, pleasant

  // Pentatonic scale ratios (sounds good no matter what)
  private readonly scaleRatios = [1, 9/8, 5/4, 3/2, 5/3, 2];

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      this.context = new AudioContext();
      console.log('🎵 AudioContext created, state:', this.context.state);

      // Master gain for overall volume control
      this.masterGain = this.context.createGain();
      this.masterGain.gain.value = 0.3; // Keep it subtle
      this.masterGain.connect(this.context.destination);

      // Create reverb for spaciousness
      this.reverbNode = await this.createReverb();
      this.reverbNode.connect(this.masterGain);

      this.isInitialized = true;
      console.log('✅ AudioManager initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize audio:', error);
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
    if (!this.context || !this.masterGain || !this.reverbNode) {
      console.warn('⚠️ AudioManager not ready:', {
        hasContext: !!this.context,
        hasMasterGain: !!this.masterGain,
        hasReverb: !!this.reverbNode
      });
      return;
    }

    console.log('🎵 Playing tap sound:', {
      contextState: this.context.state,
      x: tap.x.toFixed(2),
      y: tap.y.toFixed(2)
    });

    const now = this.context.currentTime;

    // Map Y position to pitch (higher = higher pitch)
    const pitchIndex = Math.floor((1 - tap.y) * this.scaleRatios.length);
    const pitchRatio = this.scaleRatios[Math.min(pitchIndex, this.scaleRatios.length - 1)];
    const frequency = this.baseFrequency * pitchRatio;

    console.log(`🎹 Tap at ${frequency.toFixed(1)}Hz`);

    this.playTapTone(frequency, tap.x, now);
  }

  /**
   * Play tap tone - bright, bell-like sound
   */
  private playTapTone(frequency: number, xPosition: number, startTime: number): void {
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
    if (!this.context) {
      console.warn('⚠️ No audio context to resume');
      return;
    }

    console.log('🔊 Audio context state:', this.context.state);

    if (this.context.state === 'suspended') {
      console.log('▶️ Resuming audio context...');
      await this.context.resume();
      console.log('✅ Audio context resumed, new state:', this.context.state);
    } else {
      console.log('✅ Audio context already running');
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
