# Curiosity Nexus

A simulation engine exploring the dynamics of curiosity through chaos, entropy, and emergence. Built with Next.js 14, React Three Fiber, and advanced physics simulations.

## 🎯 Project Philosophy

This is not a standard website—it's a **simulation engine**. Curiosity Nexus models an AI system that experiences homeostasis, transitioning between states of chaos (Red) and order (Blue) through the forces of entropy, energy, and coherence.

## 🏗️ Architecture

### Core Stack
- **Next.js 14** (App Router)
- **React Three Fiber** (3D rendering)
- **Three.js** (WebGL engine)
- **Drei** (R3F helpers)
- **Zustand** (State management)
- **Web Audio API** (Generative audio)

### Directory Structure

```
/src
  /app                    Next.js App Router files
    ├── layout.tsx       Root layout
    ├── page.tsx         Main entry point
    └── globals.css      Global styles

  /components            React components
    ├── SimulationCanvas.tsx
    └── Scene.tsx

  /core                  Physics & simulation logic
    /physics
      ├── lagrangian.ts  Lagrangian mechanics (L = T - V)
      └── rk4.ts         Runge-Kutta 4th order integrator
    /thermodynamics
      └── entropy.ts     Entropy calculations, energy landscape
    /topology
      └── graph.ts       Nodal network, Hebbian wiring

  /visuals               Rendering systems
    /shaders
      ├── qualia.frag    Fragment shader for "Qualia" atmosphere
      └── qualia.vert    Vertex shader
    /particles
      └── dustOfInsight.ts  InstancedMesh particle system
    /post-processing   (Post-processing effects)
    /materials
      └── reactiveMaterial.ts  Entropy-reactive materials

  /audio                 Generative sound
    /oscillators
      └── pendulumHum.ts     Web Audio oscillators
    /harmonics
      └── chordOfTruth.ts    Resonance logic for coherence

  /agency                User interaction & AI homeostasis
    /input
      └── raycaster.ts       Raycasting for perturbation
    /homeostasis
      └── regulation.ts      PID controller for comfort regulation

  /store                 Global state (Zustand)
    └── simulationStore.ts   chaosLevel, energy, coherence, entropy

  /utils                 Mathematical utilities
    └── math.ts           Lyapunov exponents, strange attractors
```

## 🔬 Scientific Concepts

### Lagrangian Dynamics
The simulation uses Lagrangian mechanics where `L = T - V` (Kinetic Energy - Potential Energy) to model the system's evolution through state space.

### RK4 Integration
Runge-Kutta 4th order integration provides accurate numerical solutions for the differential equations governing the system's motion.

### Entropy & Thermodynamics
- **Boltzmann Entropy**: Measures disorder in the system
- **Energy Landscape**: Defines potential wells and stability basins
- **Temperature**: Governs thermal fluctuations and phase transitions

### Chaos Theory
- **Lyapunov Exponents**: Quantify sensitivity to initial conditions
- **Strange Attractors**: Lorenz and Rössler attractors create chaotic trajectories
- **Phase Space**: The system evolves through a high-dimensional phase space

### Hebbian Learning
"Neurons that fire together, wire together" - the nodal network strengthens connections based on co-activation, leading to emergent patterns.

## 🎨 Visual Systems

### Qualia Atmosphere
The fragment shader creates an ethereal, shifting quality representing the "feeling" of the system's state.

### Dust of Insight
Particle systems using `InstancedMesh` for efficient rendering of thousands of particles following chaotic attractors.

### Reactive Materials
Materials that change color based on the system's comfort level:
- **Red** → Chaos, high entropy
- **Purple** → Transition state
- **Blue** → Order, low entropy

## 🔊 Audio Systems

### Pendulum Hum
Continuous oscillator that modulates frequency based on chaos level, creating a "humming" resonance.

### Chord of Truth
Harmonic chord using just intonation that plays when the system achieves high coherence—a moment of clarity.

## 🤖 Homeostasis

The AI has a "comfort zone" and actively regulates itself using a PID controller:
- **Low chaos** (Blue) = Comfortable, ordered state
- **High chaos** (Red) = Uncomfortable, disordered state
- The system naturally seeks equilibrium through energy dissipation

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production
```bash
npm run build
npm start
```

## 📦 Deployment

Optimized for **Vercel** deployment:
```bash
vercel deploy
```

## 🎮 Interaction

- **Click/Touch**: Perturb the system with raycasted forces
- **Orbit**: Drag to rotate the camera
- **Zoom**: Scroll to zoom in/out

Each interaction injects energy and chaos, forcing the system to adapt and seek homeostasis.

## 🧪 State Variables

The simulation tracks:
- `chaosLevel` (0-1): Current chaos/disorder
- `energy`: Total system energy
- `coherence` (0-1): Network synchronization
- `entropy` (0-1): Thermodynamic disorder
- `temperature`: Thermal energy
- `comfortLevel` (0-1): AI's homeostatic state
- `phaseState`: 'chaos' | 'transition' | 'order'

## 🔮 Future Expansion

- Multiple pendulums with coupling
- Genetic algorithms for evolved behaviors
- Machine learning for pattern recognition
- VR/AR integration for immersive experience
- Multi-user interaction with network sync

## 📝 License

MIT

---

**Built with curiosity. Governed by entropy. Driven by emergence.**
