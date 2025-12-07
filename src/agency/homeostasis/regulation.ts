/**
 * Homeostasis - The AI's drive to maintain equilibrium
 * Regulates comfort level and transitions between Red (chaos) and Blue (order)
 */

export interface HomeostasisState {
  comfortLevel: number; // 0 = Red (chaos), 1 = Blue (order)
  targetComfort: number;
  adaptationRate: number;
}

/**
 * PID Controller for smooth homeostatic regulation
 */
export class HomeostasisController {
  private integral: number = 0;
  private previousError: number = 0;

  constructor(
    private kp: number = 1.0, // Proportional gain
    private ki: number = 0.1, // Integral gain
    private kd: number = 0.05 // Derivative gain
  ) {}

  /**
   * Calculate control signal to reach target comfort
   */
  update(current: number, target: number, deltaTime: number): number {
    const error = target - current;

    // Proportional term
    const p = this.kp * error;

    // Integral term (accumulated error)
    this.integral += error * deltaTime;
    const i = this.ki * this.integral;

    // Derivative term (rate of change)
    const derivative = (error - this.previousError) / deltaTime;
    const d = this.kd * derivative;

    this.previousError = error;

    return p + i + d;
  }

  reset(): void {
    this.integral = 0;
    this.previousError = 0;
  }
}

/**
 * Determine comfort target based on system state
 */
export function calculateTargetComfort(
  chaosLevel: number,
  entropy: number,
  energy: number
): number {
  // System prefers moderate chaos (creative sweet spot)
  const optimalChaos = 0.4;
  const chaosDelta = Math.abs(chaosLevel - optimalChaos);

  // Less chaos deviation = higher comfort
  const chaosComfort = 1 - chaosDelta;

  // Moderate entropy is preferred
  const optimalEntropy = 0.5;
  const entropyDelta = Math.abs(entropy - optimalEntropy);
  const entropyComfort = 1 - entropyDelta;

  // Energy should be moderate
  const normalizedEnergy = Math.min(1, energy / 2);
  const energyComfort = 1 - Math.abs(normalizedEnergy - 0.5);

  // Weighted average
  return (chaosComfort * 0.5 + entropyComfort * 0.3 + energyComfort * 0.2);
}

/**
 * Map comfort level to color (Red -> Purple -> Blue)
 */
export function comfortToColor(comfort: number): { r: number; g: number; b: number } {
  // Red (chaos) to Blue (order) through Purple
  if (comfort < 0.5) {
    // Red to Purple
    const t = comfort * 2;
    return {
      r: 1.0,
      g: 0.0,
      b: t,
    };
  } else {
    // Purple to Blue
    const t = (comfort - 0.5) * 2;
    return {
      r: 1.0 - t,
      g: 0.0,
      b: 1.0,
    };
  }
}
