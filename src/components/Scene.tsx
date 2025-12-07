'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useSimulationStore } from '@/store/simulationStore';

export default function Scene() {
  const sphereRef = useRef<THREE.Mesh>(null);
  const outlineRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);
  const hueRef = useRef(0); // Current hue (0-360)

  const {
    chaosLevel,
    energy,
    tick,
    perturbSystem,
  } = useSimulationStore();

  // Handle click/touch interaction
  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      // Inject chaos on interaction
      const intensity = 0.3;
      perturbSystem(intensity);

      // Shift hue on tap
      hueRef.current = (hueRef.current + 30) % 360;
    };

    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, [perturbSystem]);

  // Main animation loop
  useFrame((state, delta) => {
    timeRef.current += delta;

    // Update simulation state
    tick(delta);

    // Smoothly transition hue based on chaos level
    // Map chaos (0-1) to hue (0-360) for full spectrum
    const targetHue = chaosLevel * 360;
    hueRef.current += (targetHue - hueRef.current) * 0.05;

    // Convert HSL to RGB for the sphere color
    const saturation = 0.8; // Rich, vibrant colors
    const lightness = 0.5 + Math.sin(timeRef.current * 2) * 0.1; // Gentle pulsing
    const color = new THREE.Color().setHSL(hueRef.current / 360, saturation, lightness);

    if (sphereRef.current) {
      // Update sphere color
      if (sphereRef.current.material instanceof THREE.MeshStandardMaterial) {
        sphereRef.current.material.color = color;
        sphereRef.current.material.emissive = color.clone().multiplyScalar(0.3);
      }

      // Gentle rotation
      sphereRef.current.rotation.y += delta * 0.3;

      // Subtle scale pulsation based on energy
      const scale = 1 + Math.sin(timeRef.current * 1.5) * energy * 0.05;
      sphereRef.current.scale.setScalar(scale);
    }

    // Update outline ring
    if (outlineRef.current) {
      outlineRef.current.rotation.y += delta * 0.3;
      outlineRef.current.rotation.x = Math.sin(timeRef.current * 0.5) * 0.2;

      if (outlineRef.current.material instanceof THREE.MeshBasicMaterial) {
        outlineRef.current.material.color = color;
      }
    }
  });

  return (
    <>
      {/* Soft ambient light */}
      <ambientLight intensity={0.4} />

      {/* Key light */}
      <directionalLight position={[5, 5, 5]} intensity={1} />

      {/* Fill light */}
      <directionalLight position={[-5, -3, -5]} intensity={0.3} />

      {/* Main sphere - clean and beautiful */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.2}
          roughness={0.3}
          emissive="#000000"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Outline ring for definition */}
      <mesh ref={outlineRef}>
        <torusGeometry args={[2.1, 0.02, 16, 100]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
      </mesh>

      {/* Secondary rings for depth */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.15, 0.01, 16, 100]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>

      <mesh rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[2.12, 0.015, 16, 100]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
      </mesh>
    </>
  );
}
