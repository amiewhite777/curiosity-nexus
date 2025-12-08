/**
 * Thermodynamics and Entropy calculations
 * Entropy measures disorder/randomness in the system
 */

/**
 * Calculate Boltzmann entropy: S = k * ln(W)
 * where W is the number of microstates
 */
export function boltzmannEntropy(microstates: number, k: number = 1): number {
  return k * Math.log(microstates);
}

/**
 * Calculate Shannon entropy from probability distribution
 * S = -Σ p_i * log(p_i)
 */
export function shannonEntropy(probabilities: number[]): number {
  return -probabilities.reduce((sum, p) => {
    if (p <= 0) return sum;
    return sum + p * Math.log2(p);
  }, 0);
}

/**
 * Energy landscape - determines system stability
 * Returns potential energy at a given state
 */
export function energyLandscape(
  x: number,
  y: number,
  wells: Array<{ x: number; y: number; depth: number }>
): number {
  let energy = 0;

  // Add contributions from all potential wells
  wells.forEach((well) => {
    const dx = x - well.x;
    const dy = y - well.y;
    const r2 = dx * dx + dy * dy;
    energy += -well.depth * Math.exp(-r2);
  });

  return energy;
}

/**
 * Calculate temperature from average kinetic energy
 * T = (2/3) * <KE> / k_B
 */
export function temperatureFromKineticEnergy(
  avgKineticEnergy: number,
  boltzmannConstant: number = 1
): number {
  return (2 / 3) * (avgKineticEnergy / boltzmannConstant);
}

/**
 * Heat capacity - how much energy is needed to change temperature
 */
export function heatCapacity(
  energyChange: number,
  temperatureChange: number
): number {
  if (Math.abs(temperatureChange) < 1e-10) return 0;
  return energyChange / temperatureChange;
}

/**
 * Maxwell-Boltzmann distribution for particle speeds
 */
export function maxwellBoltzmannDistribution(
  speed: number,
  temperature: number,
  mass: number = 1,
  k: number = 1
): number {
  const a = mass / (2 * k * temperature);
  return (
    4 *
    Math.PI *
    Math.pow(a / Math.PI, 1.5) *
    speed *
    speed *
    Math.exp(-a * speed * speed)
  );
}
