'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Suspense, useRef, useEffect, useState } from 'react';
import Scene from './Scene';
import EmotionalInterface from './EmotionalInterface';
import { TapAnalyzer } from '@/agency/input/tapAnalyzer';

export default function SimulationCanvas() {
  const tapAnalyzerRef = useRef<TapAnalyzer | null>(null);
  const [tapAnalyzer, setTapAnalyzer] = useState<TapAnalyzer | null>(null);

  // Initialize tap analyzer
  useEffect(() => {
    if (!tapAnalyzerRef.current) {
      tapAnalyzerRef.current = new TapAnalyzer();
      setTapAnalyzer(tapAnalyzerRef.current);
    }
  }, []);

  // Handle pointer events globally
  useEffect(() => {
    if (!tapAnalyzer) return;

    const handlePointerDown = (event: PointerEvent) => {
      tapAnalyzer.startTap(event.clientX, event.clientY);
    };

    const handlePointerUp = (event: PointerEvent) => {
      tapAnalyzer.endTap(event.clientX, event.clientY);
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [tapAnalyzer]);

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

      {/* Emotional Interface Overlay */}
      {tapAnalyzer && <EmotionalInterface tapAnalyzer={tapAnalyzer} />}
    </>
  );
}
