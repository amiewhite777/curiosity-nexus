import * as THREE from 'three';

/**
 * Lagrangian Mechanics implementation
 * L = T - V (Kinetic Energy - Potential Energy)
 */

export interface LagrangianState {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  acceleration: THREE.Vector3;
}

/**
 * Calculate kinetic energy: T = (1/2) * m * v²
 */
export function kineticEnergy(velocity: THREE.Vector3, mass: number = 1): number {
  return 0.5 * mass * velocity.lengthSq();
}

/**
 * Calculate potential energy in a gravitational field: V = m * g * h
 */
export function potentialEnergy(
  position: THREE.Vector3,
  mass: number = 1,
  gravity: number = 9.81
): number {
  return mass * gravity * position.y;
}

/**
 * Calculate the Lagrangian
 */
export function lagrangian(state: LagrangianState, mass: number = 1): number {
  const T = kineticEnergy(state.velocity, mass);
  const V = potentialEnergy(state.position, mass);
  return T - V;
}

/**
 * Euler-Lagrange equation solver
 * d/dt(∂L/∂v) - ∂L/∂x = 0
 */
export function eulerLagrange(
  state: LagrangianState,
  force: THREE.Vector3,
  mass: number = 1
): LagrangianState {
  // F = ma -> a = F/m
  const acceleration = force.clone().divideScalar(mass);

  return {
    position: state.position.clone(),
    velocity: state.velocity.clone(),
    acceleration,
  };
}
