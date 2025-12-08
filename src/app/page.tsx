'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const SimulationCanvas = dynamic(() => import('@/components/SimulationCanvas'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#000',
      color: '#fff'
    }}>
      Initializing Simulation Engine...
    </div>
  ),
});

export default function Home() {
  return (
    <main style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Suspense fallback={null}>
        <SimulationCanvas />
      </Suspense>
    </main>
  );
}
