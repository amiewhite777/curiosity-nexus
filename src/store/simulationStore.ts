import { create } from 'zustand';

export interface SimulationState {
  // Core state variables
  chaosLevel: number;
  energy: number;
  coherence: number;
  entropy: number;
  temperature: number;

  // Homeostasis state (Red = chaos, Blue = order)
  comfortLevel: number; // 0-1, where 0 is red (chaos) and 1 is blue (order)

  // Phase transition markers
  phaseState: 'chaos' | 'transition' | 'order';

  // Actions
  setChaosLevel: (level: number) => void;
  setEnergy: (energy: number) => void;
  setCoherence: (coherence: number) => void;
  updateEntropy: (delta: number) => void;
  updateTemperature: (temp: number) => void;
  updateComfortLevel: (level: number) => void;
  setPhaseState: (state: 'chaos' | 'transition' | 'order') => void;

  // Complex updates
  perturbSystem: (intensity: number) => void;
  tick: (deltaTime: number) => void;
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  // Initial state
  chaosLevel: 0.5,
  energy: 1.0,
  coherence: 0.5,
  entropy: 0.5,
  temperature: 1.0,
  comfortLevel: 0.5,
  phaseState: 'transition',

  // Simple setters
  setChaosLevel: (level) => set({ chaosLevel: Math.max(0, Math.min(1, level)) }),
  setEnergy: (energy) => set({ energy: Math.max(0, energy) }),
  setCoherence: (coherence) => set({ coherence: Math.max(0, Math.min(1, coherence)) }),
  updateEntropy: (delta) => set((state) => ({
    entropy: Math.max(0, Math.min(1, state.entropy + delta))
  })),
  updateTemperature: (temp) => set({ temperature: Math.max(0, temp) }),
  updateComfortLevel: (level) => set({ comfortLevel: Math.max(0, Math.min(1, level)) }),
  setPhaseState: (phaseState) => set({ phaseState }),

  // User perturbation - introduces chaos into the system
  perturbSystem: (intensity) => {
    const state = get();
    set({
      chaosLevel: Math.min(1, state.chaosLevel + intensity * 0.3),
      energy: state.energy + intensity * 0.5,
      temperature: state.temperature + intensity * 0.2,
    });
  },

  // Main simulation tick - called every frame
  tick: (deltaTime) => {
    const state = get();

    // Energy dissipation
    const energyDecay = 0.98;
    const newEnergy = state.energy * energyDecay;

    // Chaos naturally decays toward equilibrium
    const chaosDecay = 0.995;
    const newChaos = state.chaosLevel * chaosDecay;

    // Entropy tends to increase (Second Law of Thermodynamics)
    const entropyIncrease = deltaTime * 0.01;

    // Temperature cools down over time
    const coolingRate = 0.99;
    const newTemp = state.temperature * coolingRate;

    // Coherence emerges from low chaos
    const newCoherence = 1 - newChaos;

    // Homeostasis: system seeks comfort zone
    // Low chaos = blue (order), high chaos = red (disorder)
    const targetComfort = 1 - newChaos;
    const comfortAdjustment = (targetComfort - state.comfortLevel) * 0.05;

    // Phase state determination
    let newPhaseState: 'chaos' | 'transition' | 'order' = 'transition';
    if (newChaos > 0.7) newPhaseState = 'chaos';
    else if (newChaos < 0.3) newPhaseState = 'order';

    set({
      energy: newEnergy,
      chaosLevel: newChaos,
      entropy: Math.min(1, state.entropy + entropyIncrease),
      temperature: newTemp,
      coherence: newCoherence,
      comfortLevel: Math.max(0, Math.min(1, state.comfortLevel + comfortAdjustment)),
      phaseState: newPhaseState,
    });
  },
}));
