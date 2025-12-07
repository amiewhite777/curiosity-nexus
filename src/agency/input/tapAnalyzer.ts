/**
 * Tap Pattern Analyzer - Reads emotional state from interaction patterns
 *
 * Analyzes:
 * - Tap rhythm (fast/slow, regular/irregular)
 * - Tap intensity (brief/sustained presses)
 * - Pattern variance (chaotic vs steady)
 * - Burst detection (clusters of rapid taps)
 */

export interface TapEvent {
  timestamp: number;
  duration: number; // How long they held down
  x: number;
  y: number;
}

export interface EmotionalState {
  emotion: 'anxious' | 'calm' | 'excited' | 'uncertain' | 'contemplative' | 'angry' | 'peaceful';
  intensity: number; // 0-1
  confidence: number; // How sure we are
  description: string;
  color: { r: number; g: number; b: number };
}

export class TapAnalyzer {
  private tapHistory: TapEvent[] = [];
  private maxHistoryLength = 20;
  private currentPressStart: number | null = null;

  /**
   * Record the start of a tap
   */
  startTap(x: number, y: number): void {
    this.currentPressStart = performance.now();
  }

  /**
   * Record the end of a tap
   */
  endTap(x: number, y: number): void {
    if (this.currentPressStart === null) return;

    const now = performance.now();
    const duration = now - this.currentPressStart;

    this.tapHistory.push({
      timestamp: now,
      duration,
      x,
      y,
    });

    // Keep history bounded
    if (this.tapHistory.length > this.maxHistoryLength) {
      this.tapHistory.shift();
    }

    this.currentPressStart = null;
  }

  /**
   * Analyze tap pattern and detect emotional state
   */
  analyzeEmotion(): EmotionalState | null {
    if (this.tapHistory.length < 3) {
      return null; // Need at least 3 taps to analyze
    }

    const intervals = this.calculateIntervals();
    const avgInterval = this.average(intervals);
    const variance = this.calculateVariance(intervals);
    const avgDuration = this.average(this.tapHistory.map(t => t.duration));
    const hasBursts = this.detectBursts(intervals);
    const spatialSpread = this.calculateSpatialSpread();

    // Emotional classification logic

    // ANXIOUS: Fast, irregular taps
    if (avgInterval < 300 && variance > 0.4) {
      return {
        emotion: 'anxious',
        intensity: Math.min(1, variance * 2),
        confidence: 0.8,
        description: 'Rapid, erratic tapping suggests anxiety or restlessness',
        color: { r: 1.0, g: 0.2, b: 0.2 }, // Red
      };
    }

    // ANGRY: Fast, hard, sustained presses
    if (avgInterval < 400 && avgDuration > 200) {
      return {
        emotion: 'angry',
        intensity: Math.min(1, avgDuration / 400),
        confidence: 0.75,
        description: 'Forceful, sustained tapping indicates frustration or anger',
        color: { r: 1.0, g: 0.1, b: 0.0 }, // Deep red
      };
    }

    // EXCITED: Bursts of rapid taps
    if (hasBursts && avgInterval < 500) {
      return {
        emotion: 'excited',
        intensity: 0.8,
        confidence: 0.85,
        description: 'Bursts of quick tapping reveal excitement or enthusiasm',
        color: { r: 1.0, g: 0.8, b: 0.0 }, // Yellow/orange
      };
    }

    // CALM: Slow, steady, regular rhythm
    if (avgInterval > 800 && variance < 0.3 && avgDuration < 150) {
      return {
        emotion: 'calm',
        intensity: Math.max(0.3, 1 - variance * 2),
        confidence: 0.9,
        description: 'Slow, rhythmic tapping shows calmness and presence',
        color: { r: 0.2, g: 0.5, b: 1.0 }, // Blue
      };
    }

    // PEACEFUL: Very slow, gentle, with spatial variation
    if (avgInterval > 1200 && avgDuration < 120 && spatialSpread > 0.3) {
      return {
        emotion: 'peaceful',
        intensity: 0.7,
        confidence: 0.8,
        description: 'Gentle, wandering taps suggest peaceful contemplation',
        color: { r: 0.3, g: 0.8, b: 0.9 }, // Cyan
      };
    }

    // CONTEMPLATIVE: Slow with pauses, moderate duration
    if (avgInterval > 600 && avgInterval < 1200 && avgDuration > 150) {
      return {
        emotion: 'contemplative',
        intensity: 0.6,
        confidence: 0.75,
        description: 'Deliberate, measured tapping indicates deep thought',
        color: { r: 0.6, g: 0.4, b: 0.9 }, // Purple
      };
    }

    // UNCERTAIN: Irregular rhythm, varied duration
    if (variance > 0.5) {
      return {
        emotion: 'uncertain',
        intensity: variance,
        confidence: 0.7,
        description: 'Irregular pattern suggests uncertainty or indecision',
        color: { r: 0.8, g: 0.6, b: 0.9 }, // Light purple
      };
    }

    // Default: Neutral contemplative state
    return {
      emotion: 'contemplative',
      intensity: 0.5,
      confidence: 0.5,
      description: 'Exploring...',
      color: { r: 0.5, g: 0.5, b: 0.8 },
    };
  }

  /**
   * Calculate time intervals between taps
   */
  private calculateIntervals(): number[] {
    const intervals: number[] = [];
    for (let i = 1; i < this.tapHistory.length; i++) {
      intervals.push(this.tapHistory[i].timestamp - this.tapHistory[i - 1].timestamp);
    }
    return intervals;
  }

  /**
   * Detect bursts (clusters of rapid taps)
   */
  private detectBursts(intervals: number[]): boolean {
    let burstCount = 0;
    for (let i = 0; i < intervals.length - 1; i++) {
      if (intervals[i] < 200 && intervals[i + 1] < 200) {
        burstCount++;
      }
    }
    return burstCount >= 2;
  }

  /**
   * Calculate spatial spread of taps
   */
  private calculateSpatialSpread(): number {
    if (this.tapHistory.length < 2) return 0;

    const positions = this.tapHistory.map(t => ({ x: t.x, y: t.y }));
    const avgX = this.average(positions.map(p => p.x));
    const avgY = this.average(positions.map(p => p.y));

    const distances = positions.map(p =>
      Math.sqrt(Math.pow(p.x - avgX, 2) + Math.pow(p.y - avgY, 2))
    );

    return this.average(distances) / Math.max(window.innerWidth, window.innerHeight);
  }

  /**
   * Calculate variance of an array
   */
  private calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;
    const avg = this.average(values);
    const squaredDiffs = values.map(v => Math.pow(v - avg, 2));
    const variance = this.average(squaredDiffs);
    const stdDev = Math.sqrt(variance);
    return stdDev / (avg || 1); // Coefficient of variation
  }

  /**
   * Calculate average of an array
   */
  private average(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, v) => sum + v, 0) / values.length;
  }

  /**
   * Reset the analyzer
   */
  reset(): void {
    this.tapHistory = [];
    this.currentPressStart = null;
  }

  /**
   * Get current tap count
   */
  getTapCount(): number {
    return this.tapHistory.length;
  }
}
