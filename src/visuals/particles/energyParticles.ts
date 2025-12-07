import * as THREE from 'three';

/**
 * Energy Particles - Living particles that emanate from and respond to the orb
 * They fly, spark, and react to touch like a living organism
 */

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  size: number;
  targetPosition?: THREE.Vector3;
}

export class EnergyParticles {
  particles: Particle[] = [];
  geometry: THREE.BufferGeometry;
  material: THREE.PointsMaterial;
  points: THREE.Points;
  orbPosition: THREE.Vector3;

  private positions: Float32Array;
  private colors: Float32Array;
  private sizes: Float32Array;

  constructor(count: number = 1000, orbPosition: THREE.Vector3 = new THREE.Vector3(0, 0, 0)) {
    this.orbPosition = orbPosition;

    // Create buffer arrays
    this.positions = new Float32Array(count * 3);
    this.colors = new Float32Array(count * 3);
    this.sizes = new Float32Array(count);

    // Initialize particles
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle());
    }

    // Create geometry
    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));
    this.geometry.setAttribute('size', new THREE.BufferAttribute(this.sizes, 1));

    // Create material
    this.material = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    this.points = new THREE.Points(this.geometry, this.material);
  }

  private createParticle(): Particle {
    // Particles emanate from the orb
    const angle = Math.random() * Math.PI * 2;
    const radius = 3.5 + Math.random() * 0.5;
    const height = (Math.random() - 0.5) * 2;

    const position = new THREE.Vector3(
      Math.cos(angle) * radius,
      height,
      Math.sin(angle) * radius
    );

    const velocity = position.clone().normalize().multiplyScalar(0.5 + Math.random() * 1);

    return {
      position,
      velocity,
      life: Math.random(),
      maxLife: 1,
      size: 0.05 + Math.random() * 0.15,
    };
  }

  /**
   * Attract particles to a point (when user touches)
   */
  attractToPoint(worldPoint: THREE.Vector3, strength: number = 0.5): void {
    this.particles.forEach(particle => {
      const direction = worldPoint.clone().sub(particle.position).normalize();
      particle.velocity.add(direction.multiplyScalar(strength * 0.1));
    });
  }

  /**
   * Repel particles from a point (when user holds/presses hard)
   */
  repelFromPoint(worldPoint: THREE.Vector3, strength: number = 0.5): void {
    this.particles.forEach(particle => {
      const direction = particle.position.clone().sub(worldPoint).normalize();
      particle.velocity.add(direction.multiplyScalar(strength * 0.1));
    });
  }

  /**
   * Create burst of new particles from a point
   */
  burst(worldPoint: THREE.Vector3, count: number = 20): void {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 2 + Math.random() * 2;

      const particle: Particle = {
        position: worldPoint.clone(),
        velocity: new THREE.Vector3(
          Math.cos(angle) * speed,
          (Math.random() - 0.5) * speed,
          Math.sin(angle) * speed
        ),
        life: 0,
        maxLife: 1,
        size: 0.1 + Math.random() * 0.2,
      };

      // Replace oldest particle
      const oldest = this.particles.reduce((a, b) => a.life > b.life ? a : b);
      const index = this.particles.indexOf(oldest);
      this.particles[index] = particle;
    }
  }

  update(delta: number, currentHue: number, energy: number): void {
    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];

      // Update position
      particle.position.add(particle.velocity.clone().multiplyScalar(delta));

      // Apply drag
      particle.velocity.multiplyScalar(0.98);

      // Gentle pull back towards orb
      const toOrb = this.orbPosition.clone().sub(particle.position);
      const distanceFromOrb = toOrb.length();

      if (distanceFromOrb > 8) {
        particle.velocity.add(toOrb.normalize().multiplyScalar(0.02));
      }

      // Update life
      particle.life += delta * 0.2;

      // Respawn if dead
      if (particle.life > particle.maxLife) {
        Object.assign(particle, this.createParticle());
      }

      // Update buffer attributes
      const i3 = i * 3;
      this.positions[i3] = particle.position.x;
      this.positions[i3 + 1] = particle.position.y;
      this.positions[i3 + 2] = particle.position.z;

      // Color based on hue and life
      const lifeFactor = 1 - Math.abs(particle.life - 0.5) * 2; // Fade in and out
      const color = new THREE.Color().setHSL(currentHue / 360, 0.8, 0.6);
      this.colors[i3] = color.r * lifeFactor;
      this.colors[i3 + 1] = color.g * lifeFactor;
      this.colors[i3 + 2] = color.b * lifeFactor;

      // Size based on life and energy
      this.sizes[i] = particle.size * lifeFactor * (0.5 + energy * 0.5);
    }

    // Mark for update
    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.color.needsUpdate = true;
    this.geometry.attributes.size.needsUpdate = true;
  }

  getPoints(): THREE.Points {
    return this.points;
  }

  dispose(): void {
    this.geometry.dispose();
    this.material.dispose();
  }
}
