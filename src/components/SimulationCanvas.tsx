'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Suspense, useRef, useState, useCallback } from 'react';
import Scene from './Scene';
import EmotionalInterface from './EmotionalInterface';

export interface TapEvent {
  x: number;
  y: number;
  duration: number;
  timestamp: number;
}

export default function SimulationCanvas() {
  const [latestTap, setLatestTap] = useState<TapEvent | null>(null);

  // Handle tap from EmotionalInterface
  const handleTap = useCallback((x: number, y: number, duration: number) => {
    const tapEvent: TapEvent = {
      x,
      y,
      duration,
      timestamp: Date.now(),
    };
    setLatestTap(tapEvent);
  }, []);

  return (
    <>
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
          <Scene latestTap={latestTap} />
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

      {/* Emotional Interface Overlay */}
      <EmotionalInterface onTap={handleTap} />
    </>
  );
}
