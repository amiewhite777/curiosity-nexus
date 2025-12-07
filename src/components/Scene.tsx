'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { useSimulationStore } from '@/store/simulationStore';
import { DustOfInsight } from '@/visuals/particles/dustOfInsight';
import { ReactiveMaterial } from '@/visuals/materials/reactiveMaterial';
import { comfortToColor } from '@/agency/homeostasis/regulation';

export default function Scene() {
  const meshRef = useRef<THREE.Mesh>(null);
  const particleSystemRef = useRef<DustOfInsight | null>(null);
  const reactiveMaterialRef = useRef<ReactiveMaterial | null>(null);
  const timeRef = useRef(0);

  const { camera, size } = useThree();
  const {
    chaosLevel,
    energy,
    coherence,
    entropy,
    temperature,
    comfortLevel,
    tick,
    perturbSystem,
  } = useSimulationStore();

  // Initialize particle system
  useEffect(() => {
    if (!particleSystemRef.current) {
      particleSystemRef.current = new DustOfInsight(2000);
    }
  }, []);

  // Initialize reactive material
  const reactiveMaterial = useMemo(() => {
    const material = new ReactiveMaterial();
    reactiveMaterialRef.current = material;
    return material;
  }, []);

  // Handle click/touch interaction
  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      // Inject chaos on interaction
      const intensity = 0.3;
      perturbSystem(intensity);
    };

    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, [perturbSystem]);

  // Main animation loop
  useFrame((state, delta) => {
    timeRef.current += delta;

    // Update simulation state
    tick(delta);

    // Update particle system
    if (particleSystemRef.current) {
      const attractorCenter = new THREE.Vector3(0, 0, 0);
      particleSystemRef.current.update(delta, chaosLevel, attractorCenter);
    }

    // Update reactive material
    if (reactiveMaterialRef.current) {
      reactiveMaterialRef.current.update(
        timeRef.current,
        chaosLevel,
        entropy,
        comfortLevel,
        temperature
      );
    }

    // Rotate central geometry based on chaos
    if (meshRef.current) {
      const rotationSpeed = 0.2 + chaosLevel * 0.8;
      meshRef.current.rotation.x += delta * rotationSpeed;
      meshRef.current.rotation.y += delta * rotationSpeed * 1.5;

      // Pulsate based on energy
      const scale = 1 + Math.sin(timeRef.current * 2) * energy * 0.1;
      meshRef.current.scale.setScalar(scale);
    }
  });

  // Dynamic lighting color based on comfort
  const lightColor = useMemo(() => {
    const color = comfortToColor(comfortLevel);
    return new THREE.Color(color.r, color.g, color.b);
  }, [comfortLevel]);

  return (
    <>
      {/* Dynamic lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color={lightColor} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4444ff" />

      {/* Central geometry with reactive material */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 2]} />
        <primitive object={reactiveMaterial} attach="material" />
      </mesh>

      {/* Particle system - Dust of Insight */}
      {particleSystemRef.current && (
        <primitive object={particleSystemRef.current.getMesh()} />
      )}

      {/* Atmospheric fog */}
      <fog attach="fog" args={[lightColor, 5, 25]} />
    </>
  );
}
