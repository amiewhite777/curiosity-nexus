'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useSimulationStore } from '@/store/simulationStore';
import { EnergyParticles } from '@/visuals/particles/energyParticles';
import { getAudioManager } from '@/audio/audioManager';
import type { TapEvent } from './SimulationCanvas';

interface SceneProps {
  latestTap: TapEvent | null;
}

interface WaveSource {
  worldPoint: THREE.Vector3;
  amplitude: number;
  frequency: number;
  speed: number;
  timestamp: number;
  isQuickTap: boolean;
}

export default function Scene({ latestTap }: SceneProps) {
  const sphereRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<EnergyParticles | null>(null);
  const timeRef = useRef(0);
  const hueRef = useRef(0);
  const lastTapTimestampRef = useRef(0);
  const waveSourcesRef = useRef<WaveSource[]>([]);
  const audioManager = useRef(getAudioManager());

  const { camera } = useThree();
  const {
    chaosLevel,
    energy,
    tick,
    perturbSystem,
  } = useSimulationStore();

  // Initialize particles and audio
  useEffect(() => {
    if (!particlesRef.current) {
      particlesRef.current = new EnergyParticles(1500, new THREE.Vector3(0, 0, 0));
    }

    // Initialize audio (will be resumed on first user interaction)
    audioManager.current.initialize();

    return () => {
      audioManager.current.stopAll();
    };
  }, []);

  // Handle taps from EmotionalInterface
  useEffect(() => {
    if (!latestTap || latestTap.timestamp === lastTapTimestampRef.current) return;

    lastTapTimestampRef.current = latestTap.timestamp;

    // Convert normalized screen coords (0-1) to world space
    const ndcX = (latestTap.x * 2) - 1;
    const ndcY = -(latestTap.y * 2) + 1;

    // Create raycaster from screen position
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);

    // Intersect with plane at z=0
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const worldPoint = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, worldPoint);

    if (worldPoint && particlesRef.current) {
      // Color shift - full spectrum cycle with each tap
      hueRef.current = (hueRef.current + 45) % 360;

      // Perturb system
      perturbSystem(0.3);

      // Create wave source based on tap type
      const isQuickTap = latestTap.duration < 200;

      waveSourcesRef.current.push({
        worldPoint: worldPoint.clone(),
        amplitude: isQuickTap ? 0.35 : 0.15,  // Quick taps = bigger waves
        frequency: isQuickTap ? 2.5 : 1.5,     // Quick taps = higher frequency
        speed: isQuickTap ? 8 : 5,             // Quick taps = faster propagation
        timestamp: Date.now(),
        isQuickTap,
      });

      // Keep only recent wave sources (last 15)
      if (waveSourcesRef.current.length > 15) {
        waveSourcesRef.current.shift();
      }

      // Play tap sound
      audioManager.current.resume(); // Resume context if suspended
      audioManager.current.playTapSound({
        x: latestTap.x,
        y: latestTap.y,
        duration: latestTap.duration,
        timestamp: latestTap.timestamp,
      });

      // Particle behavior - ALWAYS burst on tap, plus attract/repel
      if (isQuickTap) {
        // Quick tap = attract + sharp burst
        particlesRef.current.attractToPoint(worldPoint, 0.6);
        particlesRef.current.burst(worldPoint, 25); // More particles!
      } else {
        // Hold = repel + sustained burst
        particlesRef.current.repelFromPoint(worldPoint, 0.6);
        particlesRef.current.burst(worldPoint, 40); // Even more particles!
      }
    }
  }, [latestTap, camera, perturbSystem]);

  // Main animation loop
  useFrame((state, delta) => {
    timeRef.current += delta;
    tick(delta);

    // Remove old wave sources (waves last 2 seconds)
    const now = Date.now();
    waveSourcesRef.current = waveSourcesRef.current.filter(
      wave => (now - wave.timestamp) / 1000 < 2.0
    );

    // Smooth hue transition based on chaos
    const targetHue = chaosLevel * 360;
    hueRef.current += (targetHue - hueRef.current) * 0.05;

    // Color
    const saturation = 0.9;
    const lightness = 0.5 + Math.sin(timeRef.current * 2) * 0.1;
    const color = new THREE.Color().setHSL(hueRef.current / 360, saturation, lightness);

    // Update sphere
    if (sphereRef.current) {
      const material = sphereRef.current.material as THREE.MeshStandardMaterial;
      material.color = color;
      material.emissive = color.clone().multiplyScalar(0.4);

      // Morphing based on energy AND propagating waves
      const geometry = sphereRef.current.geometry as THREE.SphereGeometry;
      const positionAttribute = geometry.attributes.position;

      for (let i = 0; i < positionAttribute.count; i++) {
        const vertex = new THREE.Vector3(
          positionAttribute.getX(i),
          positionAttribute.getY(i),
          positionAttribute.getZ(i)
        );

        // Base noise animation
        const noise = Math.sin(vertex.x * 2 + timeRef.current * 2) *
                     Math.cos(vertex.y * 2 + timeRef.current * 1.5) *
                     Math.sin(vertex.z * 2 + timeRef.current * 1.8);

        let distortion = 1 + noise * energy * 0.08;

        // Add wave-based deformations
        waveSourcesRef.current.forEach(wave => {
          const distance = vertex.distanceTo(wave.worldPoint);
          const timeElapsed = (now - wave.timestamp) / 1000; // in seconds

          // Calculate wave front position
          const waveFront = wave.speed * timeElapsed;

          // Wave exists in a band around the wave front
          const distanceFromFront = Math.abs(distance - waveFront);
          const waveWidth = 2.0; // Width of the wave band

          if (distanceFromFront < waveWidth) {
            // Wave amplitude decays over time
            const timeDecay = Math.max(0, 1 - timeElapsed / 2.0);

            // Wave shape - strongest at center of band
            const bandPosition = 1 - (distanceFromFront / waveWidth);

            // Create sine wave oscillation
            const phase = distance * wave.frequency - timeElapsed * 5;
            const waveOscillation = Math.sin(phase) * bandPosition;

            // Apply wave deformation
            const waveEffect = wave.amplitude * waveOscillation * timeDecay;
            distortion += waveEffect;
          }
        });

        vertex.normalize().multiplyScalar(3.5 * distortion);
        positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }

      positionAttribute.needsUpdate = true;
      geometry.computeVertexNormals();

      // Rotation - influenced by wave activity
      const rotationSpeed = 0.2 + (waveSourcesRef.current.length * 0.05);
      sphereRef.current.rotation.y += delta * rotationSpeed;
      sphereRef.current.rotation.x += delta * (rotationSpeed * 0.5);

      // Pulsation - more dramatic with wave activity
      const waveActivity = Math.min(waveSourcesRef.current.length / 15, 1);
      const pulseIntensity = energy * 0.03 + waveActivity * 0.05;
      const scale = 1 + Math.sin(timeRef.current * 1.5) * pulseIntensity;
      sphereRef.current.scale.setScalar(scale);
    }

    // Update particles
    if (particlesRef.current) {
      particlesRef.current.update(delta, hueRef.current, energy);
    }
  });

  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={0.3} />

      {/* Dynamic lights */}
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      <pointLight position={[0, 0, 15]} intensity={0.8} />

      {/* Living energy orb */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[3.5, 64, 64]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.3}
          roughness={0.2}
          emissive="#000000"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Energy particles */}
      {particlesRef.current && (
        <primitive object={particlesRef.current.getPoints()} />
      )}

      {/* Glow effect */}
      <mesh>
        <sphereGeometry args={[4.2, 32, 32]} />
        <meshBasicMaterial
          color={new THREE.Color().setHSL(hueRef.current / 360, 0.9, 0.5)}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </>
  );
}
