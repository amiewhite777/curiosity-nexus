import * as THREE from 'three';
import { comfortToColor } from '@/agency/homeostasis/regulation';

/**
 * Reactive Material - Changes appearance based on entropy and comfort level
 */

export class ReactiveMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uTime: { value: 0 },
        uChaosLevel: { value: 0.5 },
        uEntropy: { value: 0.5 },
        uComfortColor: { value: new THREE.Color(0.5, 0, 0.5) },
        uTemperature: { value: 1.0 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;

        void main() {
          vUv = uv;
          vPosition = position;
          vNormal = normalize(normalMatrix * normal);

          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uChaosLevel;
        uniform float uEntropy;
        uniform vec3 uComfortColor;
        uniform float uTemperature;

        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;

        float noise(vec3 p) {
          return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
        }

        void main() {
          vec3 animatedPos = vPosition + vec3(uTime * 0.1);
          float n = noise(animatedPos * 3.0 + uChaosLevel * 5.0);

          vec3 baseColor = uComfortColor;
          vec3 chaosColor = mix(baseColor, vec3(1.0, 0.3, 0.1), uChaosLevel);

          float fresnel = pow(1.0 - dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 2.0);
          vec3 finalColor = mix(chaosColor, vec3(1.0), fresnel * 0.3);

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      transparent: false,
    });
  }

  update(
    time: number,
    chaosLevel: number,
    entropy: number,
    comfortLevel: number,
    temperature: number
  ): void {
    this.uniforms.uTime.value = time;
    this.uniforms.uChaosLevel.value = chaosLevel;
    this.uniforms.uEntropy.value = entropy;
    this.uniforms.uTemperature.value = temperature;

    // Update color based on comfort level
    const color = comfortToColor(comfortLevel);
    this.uniforms.uComfortColor.value.setRGB(color.r, color.g, color.b);
  }
}
