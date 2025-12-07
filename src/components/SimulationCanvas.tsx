'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Suspense } from 'react';
import Scene from './Scene';

export default function SimulationCanvas() {
  return (
    <Canvas
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      }}
      dpr={[1, 2]}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={75} />
      <color attach="background" args={['#000000']} />

      <Suspense fallback={null}>
        <Scene />
      </Suspense>

      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
      />

      <EffectComposer>
        <Bloom
          intensity={0.5}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
        />
      </EffectComposer>
    </Canvas>
  );
}
