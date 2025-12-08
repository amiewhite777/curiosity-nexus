# Curiosity Nexus 🌟

An interactive consciousness exploration that reveals your inner archetype through the subtle language of touch. Built with Next.js 14, React Three Fiber, and Web Audio API.

## 🎯 What Is This?

Curiosity Nexus is an emotional consciousness analyzer. Through a series of emotional prompts and timed questions, it analyzes **how you tap** (not what you answer) to reveal one of 30 unique personality archetypes.

It doesn't track your words—it tracks your **qualia**: the rhythm, speed, intensity, and spatial patterns of your touch.

## ✨ Features

### Deep Qualia Analysis
- **Reaction Latency** - Fast/medium/slow responders
- **Emotional Responsiveness** - Which emotional states trigger taps
- **Rhythm Consistency** - Pattern regularity over time
- **Tap Intensity** - Engagement and energy levels
- **Spatial Exploration** - Screen coverage and movement patterns
- **Question Variation** - Behavioral changes across questions

### 30 Unique Archetypes
From "The Wanderer" to "The Oracle", each archetype represents a distinct consciousness signature based on your tap behavior patterns.

### Dynamic Audio System
- **3 Sound Types**: Gentle whispers, bell tones, or sharp percussion based on tap speed
- **Background Ambience**: Dreamy chord progression (Am-F-C-G)
- **Spatial Audio**: Stereo panning and pitch based on tap position
- **Intensity-Scaled**: Slow taps are faint, fast taps are pronounced

### Beautiful Visuals
- Particle field with energy waves
- Shooting stars across the cosmos
- Fluid 3D orb that responds to touch
- Smooth transitions and animations

### Built-In Analytics
Track archetype distribution to see if results are balanced across all 30 archetypes or bottlenecking into just a few.

## 🏗️ Tech Stack

- **Next.js 14** - App Router, TypeScript
- **React Three Fiber** - 3D rendering with Three.js
- **Web Audio API** - Generative soundscapes
- **Zustand** - State management
- **LocalStorage** - Analytics tracking (privacy-focused)

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

## 📊 Analytics

Open the browser console and use:

```javascript
// View archetype distribution
window.curiosityAnalytics.log()

// Export all data as JSON
window.curiosityAnalytics.export()

// Clear tracked data
window.curiosityAnalytics.clear()
```

See [ANALYTICS.md](./ANALYTICS.md) for full documentation.

## 🎮 How It Works

### Phase 1: Emotional States (8 states)
Words like "joy", "fear", "curiosity" appear briefly. Tap when you feel moved to.

### Phase 2: Timed Questions (5 questions)
Questions flash for 3 seconds, then you have 5 seconds to tap as many times as you feel called to.

### Phase 3: Analysis
The system analyzes your tap patterns across 6 qualia dimensions and matches you to one of 30 archetypes.

### Phase 4: Reveal
Your archetype is revealed with a description of your consciousness signature.

## 🎨 Key Files

```
/src
  /components
    ├── EmotionalInterface.tsx    # Main interaction flow
    ├── Scene.tsx                  # 3D particle system
    └── SimulationCanvas.tsx       # Three.js setup

  /data
    ├── archetypes30.ts           # 30 archetypes & analysis
    ├── questions.ts              # Question prompts
    └── emotionalStates.ts        # Emotional word list

  /audio
    └── audioManager.ts           # Web Audio synthesis

  /utils
    └── analytics.ts              # Distribution tracking

  /store
    └── simulationStore.ts        # Physics simulation state
```

## 🔊 Audio Details

### Tap Sounds
- **Gentle** (<0.3 intensity): Soft sine waves, quiet, long decay
- **Medium** (0.3-0.6): Bell-like tones with harmonics
- **Intense** (>0.6): Sharp percussion with rich overtones

### Background Music
Continuous Am-F-C-G chord progression using layered sine wave oscillators with subtle detuning for warmth.

## 🧬 Archetype Analysis

The algorithm analyzes:
1. **Reaction speed** - First tap latency after each question
2. **Emotional engagement** - Which emotional states triggered responses
3. **Rhythm patterns** - Inter-tap interval variance
4. **Intensity levels** - Average tap engagement
5. **Spatial behavior** - Screen coverage and exploration
6. **Adaptability** - Behavior changes across questions

Each archetype has custom scoring weights across these dimensions.

## 📱 Deployment

Optimized for **Vercel**:
```bash
vercel deploy
```

Works on desktop and mobile. Audio requires user interaction to start (browser security requirement).

## 🔮 Architecture Patterns

### State Management
- **Zustand** for simulation physics
- **React useState** for UI flow
- **localStorage** for analytics persistence

### Audio Architecture
- Singleton `AudioManager` class
- Web Audio API oscillators
- Stereo panning and reverb processing
- Background music loop (Am-F-C-G)

### 3D Rendering
- React Three Fiber for declarative 3D
- Custom particle system with wave propagation
- Shooting stars with Line geometry
- Dynamic color shifting

## 🎯 Design Philosophy

**No right answers.** The system doesn't judge your responses—it observes how you express yourself through touch. Tap fast, slow, gently, forcefully, or not at all. Every pattern tells a story.

## 📝 License

MIT

---

**An exploration of consciousness through touch. Each tap is a signature.**
