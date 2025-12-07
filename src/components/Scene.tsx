'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useSimulationStore } from '@/store/simulationStore';
import { EnergyParticles } from '@/visuals/particles/energyParticles';

export default function Scene() {
  const sphereRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<EnergyParticles | null>(null);
  const timeRef = useRef(0);
  const hueRef = useRef(0);
  const interactionPointRef = useRef<THREE.Vector3 | null>(null);
  const interactionStrengthRef = useRef(0);
  const pressDurationRef = useRef(0);

  const { camera, raycaster, pointer } = useThree();
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

  // Handle pointer down
  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      pressDurationRef.current = 0;
      interactionStrengthRef.current = 0.3;
      perturbSystem(0.3);
      hueRef.current = (hueRef.current + 30) % 360;
    };

    const handlePointerUp = () => {
      interactionStrengthRef.current = 0;
      pressDurationRef.current = 0;
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [perturbSystem]);

  // Main animation loop
  useFrame((state, delta) => {
    timeRef.current += delta;
    tick(delta);

    // Update press duration
    if (interactionStrengthRef.current > 0) {
      pressDurationRef.current += delta;
    }

    // Smooth hue transition
    const targetHue = chaosLevel * 360;
    hueRef.current += (targetHue - hueRef.current) * 0.05;

    // Color
    const saturation = 0.9;
    const lightness = 0.5 + Math.sin(timeRef.current * 2) * 0.1;
    const color = new THREE.Color().setHSL(hueRef.current / 360, saturation, lightness);

    // Get world position from pointer
    raycaster.setFromCamera(pointer, camera);
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const worldPoint = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, worldPoint);

    if (interactionStrengthRef.current > 0 && worldPoint) {
      interactionPointRef.current = worldPoint;

      // Particle interaction based on press duration
      if (particlesRef.current) {
        if (pressDurationRef.current < 0.2) {
          // Quick tap = attract
          particlesRef.current.attractToPoint(worldPoint, interactionStrengthRef.current);
        } else {
          // Hold = repel + burst
          particlesRef.current.repelFromPoint(worldPoint, interactionStrengthRef.current);
          if (Math.random() > 0.95) {
            particlesRef.current.burst(worldPoint, 5);
          }
        }
      }
    }

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

    // Decay interaction
    interactionStrengthRef.current *= 0.95;
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
