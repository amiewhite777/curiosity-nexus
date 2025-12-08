import * as THREE from 'three';

/**
 * Raycasting for user interaction and perturbation
 */

export class InteractionRaycaster {
  raycaster: THREE.Raycaster;
  pointer: THREE.Vector2;

  constructor() {
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
  }

  /**
   * Update pointer position from mouse/touch event
   */
  updatePointer(x: number, y: number, width: number, height: number): void {
    this.pointer.x = (x / width) * 2 - 1;
    this.pointer.y = -(y / height) * 2 + 1;
  }

  /**
   * Cast ray and find intersections
   */
  cast(camera: THREE.Camera, objects: THREE.Object3D[]): THREE.Intersection[] {
    this.raycaster.setFromCamera(this.pointer, camera);
    return this.raycaster.intersectObjects(objects, true);
  }

  /**
   * Get 3D position in world space from pointer
   */
  getWorldPosition(camera: THREE.Camera, distance: number = 10): THREE.Vector3 {
    this.raycaster.setFromCamera(this.pointer, camera);
    return this.raycaster.ray.origin
      .clone()
      .add(this.raycaster.ray.direction.clone().multiplyScalar(distance));
  }

  /**
   * Apply perturbation force at intersection point
   */
  applyPerturbation(
    intersections: THREE.Intersection[],
    intensity: number = 1
  ): THREE.Vector3 | null {
    if (intersections.length === 0) return null;

    const hit = intersections[0];
    const direction = this.raycaster.ray.direction.clone();
    return direction.multiplyScalar(intensity);
  }
}
