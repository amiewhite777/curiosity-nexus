import * as THREE from 'three';

/**
 * Runge-Kutta 4th order integration
 * More accurate than Euler integration for dynamic systems
 */

export interface RK4State {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
}

export type DerivativeFunction = (state: RK4State, t: number) => {
  velocity: THREE.Vector3;
  acceleration: THREE.Vector3;
};

/**
 * RK4 Integration step
 */
export function rk4Step(
  state: RK4State,
  derivative: DerivativeFunction,
  t: number,
  dt: number
): RK4State {
  // k1 = f(t, y)
  const k1 = derivative(state, t);

  // k2 = f(t + dt/2, y + k1*dt/2)
  const state2: RK4State = {
    position: state.position.clone().add(k1.velocity.clone().multiplyScalar(dt / 2)),
    velocity: state.velocity.clone().add(k1.acceleration.clone().multiplyScalar(dt / 2)),
  };
  const k2 = derivative(state2, t + dt / 2);

  // k3 = f(t + dt/2, y + k2*dt/2)
  const state3: RK4State = {
    position: state.position.clone().add(k2.velocity.clone().multiplyScalar(dt / 2)),
    velocity: state.velocity.clone().add(k2.acceleration.clone().multiplyScalar(dt / 2)),
  };
  const k3 = derivative(state3, t + dt / 2);

  // k4 = f(t + dt, y + k3*dt)
  const state4: RK4State = {
    position: state.position.clone().add(k3.velocity.clone().multiplyScalar(dt)),
    velocity: state.velocity.clone().add(k3.acceleration.clone().multiplyScalar(dt)),
  };
  const k4 = derivative(state4, t + dt);

  // y_{n+1} = y_n + (dt/6) * (k1 + 2*k2 + 2*k3 + k4)
  const newPosition = state.position
    .clone()
    .add(
      k1.velocity
        .clone()
        .add(k2.velocity.clone().multiplyScalar(2))
        .add(k3.velocity.clone().multiplyScalar(2))
        .add(k4.velocity)
        .multiplyScalar(dt / 6)
    );

  const newVelocity = state.velocity
    .clone()
    .add(
      k1.acceleration
        .clone()
        .add(k2.acceleration.clone().multiplyScalar(2))
        .add(k3.acceleration.clone().multiplyScalar(2))
        .add(k4.acceleration)
        .multiplyScalar(dt / 6)
    );

  return {
    position: newPosition,
    velocity: newVelocity,
  };
}

/**
 * Simple pendulum derivative function
 * For use with RK4 integrator
 */
export function pendulumDerivative(
  length: number = 1,
  gravity: number = 9.81
): DerivativeFunction {
  return (state: RK4State) => {
    // For a pendulum: θ'' = -(g/L) * sin(θ)
    // Using position.x as angle θ for simplicity
    const theta = state.position.x;
    const omega = state.velocity.x;
    const alpha = -(gravity / length) * Math.sin(theta);

    return {
      velocity: new THREE.Vector3(omega, 0, 0),
      acceleration: new THREE.Vector3(alpha, 0, 0),
    };
  };
}
