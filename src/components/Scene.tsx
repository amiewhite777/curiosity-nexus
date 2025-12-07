'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useSimulationStore } from '@/store/simulationStore';
import { EnergyParticles } from '@/visuals/particles/energyParticles';
import type { TapEvent } from './SimulationCanvas';

interface SceneProps {
  latestTap: TapEvent | null;
}

export default function Scene({ latestTap }: SceneProps) {
  const sphereRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<EnergyParticles | null>(null);
  const timeRef = useRef(0);
  const hueRef = useRef(0);
  const lastTapTimestampRef = useRef(0);

  const { camera } = useThree();
  const {
    chaosLevel,
    energy,
    tick,
    perturbSystem,
  } = useSimulationStore();

  // Initialize particles
  useEffect(() => {
    if (!particlesRef.current) {
      particlesRef.current = new EnergyParticles(1500, new THREE.Vector3(0, 0, 0));
    }
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
      // Color shift
      hueRef.current = (hueRef.current + 30) % 360;

      // Perturb system
      perturbSystem(0.3);

      // Quick tap vs hold
      if (latestTap.duration < 200) {
        // Quick tap = attract
        particlesRef.current.attractToPoint(worldPoint, 0.5);
      } else {
        // Hold = repel + burst
        particlesRef.current.repelFromPoint(worldPoint, 0.5);
        particlesRef.current.burst(worldPoint, 15);
      }
    }
  }, [latestTap, camera, perturbSystem]);

  // Main animation loop
  useFrame((state, delta) => {
    timeRef.current += delta;
    tick(delta);

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

      // Morphing based on energy
      const geometry = sphereRef.current.geometry as THREE.SphereGeometry;
      const positionAttribute = geometry.attributes.position;

      for (let i = 0; i < positionAttribute.count; i++) {
        const vertex = new THREE.Vector3(
          positionAttribute.getX(i),
          positionAttribute.getY(i),
          positionAttribute.getZ(i)
        );

        const distance = vertex.length();
        const noise = Math.sin(vertex.x * 2 + timeRef.current * 2) *
                     Math.cos(vertex.y * 2 + timeRef.current * 1.5) *
                     Math.sin(vertex.z * 2 + timeRef.current * 1.8);

        const distortion = 1 + noise * energy * 0.08;
        vertex.normalize().multiplyScalar(3.5 * distortion);

        positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }

      positionAttribute.needsUpdate = true;
      geometry.computeVertexNormals();

      // Rotation
      sphereRef.current.rotation.y += delta * 0.2;
      sphereRef.current.rotation.x += delta * 0.1;

      // Pulsation
      const scale = 1 + Math.sin(timeRef.current * 1.5) * energy * 0.03;
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
