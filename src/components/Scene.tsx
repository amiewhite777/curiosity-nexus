'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { useSimulationStore } from '@/store/simulationStore';

export default function Scene() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { chaosLevel, energy } = useSimulationStore();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      {/* Placeholder geometry - will be replaced with the actual simulation */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color={new THREE.Color().setHSL(chaosLevel * 0.3, 0.8, 0.5)}
          wireframe
        />
      </mesh>
    </>
  );
}
