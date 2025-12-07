import * as THREE from 'three';

/**
 * Calculate Lyapunov exponent to measure chaos sensitivity
 * Positive = chaotic, Negative = stable, Zero = neutral
 */
export function calculateLyapunovExponent(
  trajectory: THREE.Vector3[],
  epsilon: number = 1e-8
): number {
  if (trajectory.length < 2) return 0;

  let sumLog = 0;
  for (let i = 1; i < trajectory.length; i++) {
    const distance = trajectory[i].distanceTo(trajectory[i - 1]);
    if (distance > epsilon) {
      sumLog += Math.log(distance / epsilon);
    }
  }

  return sumLog / (trajectory.length - 1);
}

/**
 * Lorenz attractor equations for strange attractor generation
 */
export function lorenzAttractor(
  position: THREE.Vector3,
  sigma: number = 10,
  rho: number = 28,
  beta: number = 8 / 3,
  dt: number = 0.01
): THREE.Vector3 {
  const dx = sigma * (position.y - position.x);
  const dy = position.x * (rho - position.z) - position.y;
  const dz = position.x * position.y - beta * position.z;

  return new THREE.Vector3(
    position.x + dx * dt,
    position.y + dy * dt,
    position.z + dz * dt
  );
}

/**
 * Rössler attractor - another chaotic system
 */
export function rosslerAttractor(
  position: THREE.Vector3,
  a: number = 0.2,
  b: number = 0.2,
  c: number = 5.7,
  dt: number = 0.01
): THREE.Vector3 {
  const dx = -position.y - position.z;
  const dy = position.x + a * position.y;
  const dz = b + position.z * (position.x - c);

  return new THREE.Vector3(
    position.x + dx * dt,
    position.y + dy * dt,
    position.z + dz * dt
  );
}

/**
 * Map value from one range to another
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * Smooth step interpolation
 */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * Perlin-like noise (simplified)
 */
export function noise(x: number, y: number = 0, z: number = 0): number {
  const p = new THREE.Vector3(x, y, z);
  return (Math.sin(p.x * 12.9898 + p.y * 78.233 + p.z * 37.719) * 43758.5453) % 1;
}
