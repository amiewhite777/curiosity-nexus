import * as THREE from 'three';
import { lorenzAttractor } from '@/utils/math';

/**
 * Dust of Insight - Particle system representing emergent thoughts
 * Uses InstancedMesh for efficient rendering of many particles
 */

export class DustOfInsight {
  instancedMesh: THREE.InstancedMesh;
  particles: Array<{
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    life: number;
    maxLife: number;
  }>;
  dummy: THREE.Object3D;
  count: number;

  constructor(count: number = 1000) {
    this.count = count;
    this.dummy = new THREE.Object3D();
    this.particles = [];

    // Create geometry
    const geometry = new THREE.SphereGeometry(0.02, 8, 8);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.6,
    });

    this.instancedMesh = new THREE.InstancedMesh(geometry, material, count);
    this.instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    // Initialize particles
    for (let i = 0; i < count; i++) {
      this.particles.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1
        ),
        life: Math.random(),
        maxLife: 1.0,
      });
    }
  }

  update(deltaTime: number, chaosLevel: number, attractorCenter: THREE.Vector3): void {
    for (let i = 0; i < this.count; i++) {
      const particle = this.particles[i];

      // Apply Lorenz attractor dynamics for chaotic motion
      if (chaosLevel > 0.3) {
        particle.position = lorenzAttractor(
          particle.position.clone().add(attractorCenter),
          10,
          28,
          8 / 3,
          deltaTime * 0.5
        ).sub(attractorCenter);
      } else {
        // Gentle drift when chaos is low
        particle.position.add(particle.velocity.clone().multiplyScalar(deltaTime));
      }

      // Boundary conditions - wrap around
      ['x', 'y', 'z'].forEach((axis) => {
        if (Math.abs(particle.position[axis as 'x' | 'y' | 'z']) > 5) {
          particle.position[axis as 'x' | 'y' | 'z'] *= -0.9;
        }
      });

      // Update life
      particle.life += deltaTime * 0.1;
      if (particle.life > particle.maxLife) {
        particle.life = 0;
        particle.position.set(
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        );
      }

      // Update instance matrix
      this.dummy.position.copy(particle.position);
      const scale = 0.5 + Math.sin(particle.life * Math.PI) * 0.5;
      this.dummy.scale.setScalar(scale);
      this.dummy.updateMatrix();
      this.instancedMesh.setMatrixAt(i, this.dummy.matrix);
    }

    this.instancedMesh.instanceMatrix.needsUpdate = true;
  }

  getMesh(): THREE.InstancedMesh {
    return this.instancedMesh;
  }
}
