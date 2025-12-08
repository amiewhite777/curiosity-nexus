/**
 * AudioManager - Web Audio API synthesizer for emotional interaction
 * Creates generative soundscapes based on tap patterns and orb state
 */

export interface TapSound {
  x: number;        // 0-1, affects panning
  y: number;        // 0-1, affects pitch
  timestamp: number;
  intensity?: number; // 0-1, affects volume and sound type
}

export class AudioManager {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private reverbNode: ConvolverNode | null = null;
  private isInitialized = false;
  private activeOscillators: Set<OscillatorNode> = new Set();
  private backgroundLoop: OscillatorNode[] | null = null;
  private backgroundGain: GainNode | null = null;

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
      this.masterGain.gain.value = 0.126; // Subtle but audible
      this.masterGain.connect(this.context.destination);

      // Create reverb for spaciousness
      this.reverbNode = await this.createReverb();
      this.reverbNode.connect(this.masterGain);

      // Start background ambient loop
      this.startBackgroundMusic();

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
   * Start atmospheric background music loop
   */
  private startBackgroundMusic(): void {
    if (!this.context || !this.masterGain) return;

    // Create background gain for independent volume control
    this.backgroundGain = this.context.createGain();
    this.backgroundGain.gain.value = 0.034; // Subtle background ambience
    this.backgroundGain.connect(this.masterGain);

    // Create a dreamy ambient pad using multiple oscillators
    // Using a minor chord progression: Am - F - C - G
    const chords = [
      [220, 264, 330],   // A minor (A3, C4, E4)
      [174.61, 220, 261.63], // F major (F3, A3, C4)
      [261.63, 329.63, 392], // C major (C4, E4, G4)
      [196, 246.94, 293.66]  // G major (G3, B3, D4)
    ];

    this.backgroundLoop = [];

    // Create oscillators for each note
    chords.forEach((chord, chordIndex) => {
      chord.forEach((freq, noteIndex) => {
        const osc = this.context!.createOscillator();
        osc.type = 'sine'; // Smooth, ethereal sound
        osc.frequency.value = freq;

        // Add slight detuning for warmth
        osc.detune.value = (Math.random() - 0.5) * 8;

        // Create individual gain for each note
        const noteGain = this.context!.createGain();
        noteGain.gain.value = 0.15 / chord.length; // Normalize by chord size

        osc.connect(noteGain);
        noteGain.connect(this.backgroundGain!);

        osc.start();
        this.backgroundLoop!.push(osc);
      });
    });

    console.log('🎶 Background music started');
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

    const intensity = tap.intensity ?? 0.5; // Default to medium if not provided

    console.log('🎵 Playing tap sound:', {
      contextState: this.context.state,
      x: tap.x.toFixed(2),
      y: tap.y.toFixed(2),
      intensity: intensity.toFixed(2)
    });

    const now = this.context.currentTime;

    // Map Y position to pitch (higher = higher pitch)
    const pitchIndex = Math.floor((1 - tap.y) * this.scaleRatios.length);
    const pitchRatio = this.scaleRatios[Math.min(pitchIndex, this.scaleRatios.length - 1)];
    const frequency = this.baseFrequency * pitchRatio;

    console.log(`🎹 Tap at ${frequency.toFixed(1)}Hz, intensity: ${intensity.toFixed(2)}`);

    // Choose sound type based on intensity
    if (intensity < 0.3) {
      // Slow/gentle taps - soft, whisper-like sounds
      this.playGentleTone(frequency, tap.x, intensity, now);
    } else if (intensity < 0.6) {
      // Medium taps - bell-like (original sound)
      this.playTapTone(frequency, tap.x, intensity, now);
    } else {
      // Fast/intense taps - bright, sharp percussion
      this.playIntenseTone(frequency, tap.x, intensity, now);
    }
  }

  /**
   * Play gentle tone - soft, whisper-like sound for slow taps
   */
  private playGentleTone(frequency: number, xPosition: number, intensity: number, startTime: number): void {
    if (!this.context || !this.reverbNode) return;

    // Soft sine wave with subtle overtone
    const osc = this.context.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, startTime);

    // Envelope for very soft, gradual attack and decay
    const envelope = this.context.createGain();
    const volume = intensity * 0.063; // Very quiet
    envelope.gain.setValueAtTime(0, startTime);
    envelope.gain.linearRampToValueAtTime(volume, startTime + 0.08); // Slow attack
    envelope.gain.exponentialRampToValueAtTime(0.001, startTime + 1.2); // Long decay

    // Stereo panning
    const panner = this.context.createStereoPanner();
    panner.pan.setValueAtTime((xPosition * 2) - 1, startTime);

    osc.connect(envelope);
    envelope.connect(panner);
    panner.connect(this.reverbNode);

    osc.start(startTime);
    const stopTime = startTime + 1.2;
    osc.stop(stopTime);

    this.activeOscillators.add(osc);
    setTimeout(() => this.activeOscillators.delete(osc), 1300);
  }

  /**
   * Play tap tone - bright, bell-like sound for medium taps
   */
  private playTapTone(frequency: number, xPosition: number, intensity: number, startTime: number): void {
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

    // Envelope for sharp attack, quick decay - scaled by intensity
    const envelope = this.context.createGain();
    const volume = intensity * 0.168; // Moderate volume
    envelope.gain.setValueAtTime(0, startTime);
    envelope.gain.linearRampToValueAtTime(volume, startTime + 0.005); // Sharp attack
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
   * Play intense tone - bright, sharp percussion for fast taps
   */
  private playIntenseTone(frequency: number, xPosition: number, intensity: number, startTime: number): void {
    if (!this.context || !this.reverbNode) return;

    // Sharp, percussive sound with more harmonics
    const osc = this.context.createOscillator();
    osc.type = 'triangle'; // Brighter timbre
    osc.frequency.setValueAtTime(frequency, startTime);

    // Add more inharmonic overtones for punch
    const osc2 = this.context.createOscillator();
    osc2.type = 'square'; // Even more harmonics
    osc2.frequency.setValueAtTime(frequency * 1.5, startTime);

    const osc3 = this.context.createOscillator();
    osc3.type = 'sawtooth'; // Richest harmonic content
    osc3.frequency.setValueAtTime(frequency * 0.5, startTime);

    // Very sharp attack, fast decay
    const envelope = this.context.createGain();
    const volume = intensity * 0.252; // Punchy but not harsh
    envelope.gain.setValueAtTime(0, startTime);
    envelope.gain.linearRampToValueAtTime(volume, startTime + 0.002); // Extremely sharp attack
    envelope.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3); // Quick decay

    // Stereo panning
    const panner = this.context.createStereoPanner();
    panner.pan.setValueAtTime((xPosition * 2) - 1, startTime);

    // Connect chain
    osc.connect(envelope);
    osc2.connect(envelope);
    osc3.connect(envelope);
    envelope.connect(panner);
    panner.connect(this.reverbNode);

    // Start and stop
    osc.start(startTime);
    osc2.start(startTime);
    osc3.start(startTime);

    const stopTime = startTime + 0.3;
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
    }, 400);
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

    // Stop background music
    if (this.backgroundLoop) {
      this.backgroundLoop.forEach(osc => {
        try {
          osc.stop();
        } catch (e) {
          // Already stopped
        }
      });
      this.backgroundLoop = null;
    }
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
