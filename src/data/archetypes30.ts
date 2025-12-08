/**
 * 30 Deep Psychological Archetypes
 * Revealed through spatial patterns, temporal rhythms, and energetic signatures
 */

export interface Archetype {
  id: string;
  name: string;
  description: string;
  essence: string;
  strengths: string[];
  shadowSide: string;
  color: { r: number; g: number; b: number };

  // Pattern signatures
  spatialPattern: 'centered' | 'scattered' | 'edge-seeking' | 'rhythmic' | 'chaotic' | 'clustered';
  temporalPattern: 'fast' | 'slow' | 'irregular' | 'rhythmic' | 'accelerating' | 'decelerating';
  energyPattern: 'sustained' | 'bursting' | 'gentle' | 'forceful' | 'varying';
  consistencyPattern: 'consistent' | 'varied' | 'evolving';
}

export const archetypes30: Archetype[] = [
  // FIRE ARCHETYPES (Red spectrum)
  {
    id: 'inferno',
    name: 'The Inferno',
    description: 'You are raw, unfiltered intensity. Every action is a declaration. You do not whisper - you roar. Your passion burns so hot that others feel it from across the room.',
    essence: 'Wildfire incarnate. You consume everything in your path and leave transformation in your wake.',
    strengths: ['Unstoppable drive', 'Infectious enthusiasm', 'Fearless action', 'Natural catalyst for change'],
    shadowSide: 'Your fire can burn those who love you. Learn to bank the flames.',
    color: { r: 1.0, g: 0.1, b: 0.0 },
    spatialPattern: 'chaotic',
    temporalPattern: 'fast',
    energyPattern: 'forceful',
    consistencyPattern: 'consistent',
  },
  {
    id: 'ember',
    name: 'The Ember',
    description: 'You simmer. Controlled fire, banked but never extinguished. You wait, patient and warm, until the moment demands your heat.',
    essence: 'Coals that refuse to die. Your warmth sustains in the coldest nights.',
    strengths: ['Patient intensity', 'Sustainable passion', 'Reliable warmth', 'Strategic timing'],
    shadowSide: 'Constant restraint can suffocate your fire. Sometimes you must blaze.',
    color: { r: 0.9, g: 0.3, b: 0.1 },
    spatialPattern: 'centered',
    temporalPattern: 'slow',
    energyPattern: 'sustained',
    consistencyPattern: 'consistent',
  },
  {
    id: 'spark',
    name: 'The Spark',
    description: 'Brief, brilliant, essential. You ignite ideas in others, then disappear. Your gift is not the flame but the lighting of it.',
    essence: 'The first crack of lightning that starts the forest fire.',
    strengths: ['Initiator', 'Inspiring presence', 'Quick wit', 'Catalytic energy'],
    shadowSide: 'You start but rarely finish. Your ideas need tending.',
    color: { r: 1.0, g: 0.6, b: 0.0 },
    spatialPattern: 'scattered',
    temporalPattern: 'irregular',
    energyPattern: 'bursting',
    consistencyPattern: 'varied',
  },

  // WATER ARCHETYPES (Blue/Cyan spectrum)
  {
    id: 'ocean',
    name: 'The Ocean',
    description: 'Vast, deep, containing multitudes. Your surface is calm but beneath are currents that could pull ships under. You are mystery itself.',
    essence: 'Fathomless depth. Even you do not know what lies in your trenches.',
    strengths: ['Emotional depth', 'Mysterious allure', 'Adaptive resilience', 'Hidden strength'],
    shadowSide: 'Your depths isolate you. Sometimes you must surface.',
    color: { r: 0.1, g: 0.3, b: 0.8 },
    spatialPattern: 'scattered',
    temporalPattern: 'slow',
    energyPattern: 'sustained',
    consistencyPattern: 'evolving',
  },
  {
    id: 'river',
    name: 'The River',
    description: 'You flow around obstacles, carve canyons over time, and always reach the sea. Persistent, patient, unstoppable.',
    essence: 'The long game incarnate. Erosion is your superpower.',
    strengths: ['Persistent', 'Adaptive', 'Patient power', 'Natural problem-solver'],
    shadowSide: 'You avoid confrontation when sometimes you should crash through.',
    color: { r: 0.2, g: 0.5, b: 0.9 },
    spatialPattern: 'rhythmic',
    temporalPattern: 'rhythmic',
    energyPattern: 'sustained',
    consistencyPattern: 'consistent',
  },
  {
    id: 'storm',
    name: 'The Storm',
    description: 'Chaos and power combined. You arrive with thunder, drench everything, then disappear. People remember when you were here.',
    essence: 'The tempest. You are both destruction and renewal.',
    strengths: ['Transformative presence', 'Emotional honesty', 'Cleansing force', 'Memorable impact'],
    shadowSide: 'Your intensity overwhelms. Not every moment needs a deluge.',
    color: { r: 0.3, g: 0.3, b: 0.6 },
    spatialPattern: 'chaotic',
    temporalPattern: 'irregular',
    energyPattern: 'bursting',
    consistencyPattern: 'varied',
  },

  // EARTH ARCHETYPES (Green/Brown spectrum)
  {
    id: 'mountain',
    name: 'The Mountain',
    description: 'Immovable. Ancient. You have witnessed ages pass and remain unchanged. Your presence is gravitational.',
    essence: 'Permanence in a temporary world.',
    strengths: ['Unshakeable', 'Wise through observation', 'Grounding presence', 'Long-term thinking'],
    shadowSide: 'Rigidity can become prison. Sometimes mountains must move.',
    color: { r: 0.4, g: 0.3, b: 0.2 },
    spatialPattern: 'centered',
    temporalPattern: 'slow',
    energyPattern: 'sustained',
    consistencyPattern: 'consistent',
  },
  {
    id: 'forest',
    name: 'The Forest',
    description: 'Complex ecosystem. You are not one thing but many, all interconnected. Your strength is in your diversity.',
    essence: 'Biodiversity incarnate. You contain worlds.',
    strengths: ['Multifaceted', 'Nurturing', 'Complex thinker', 'Natural collaborator'],
    shadowSide: 'Too many selves can fragment. Find your roots.',
    color: { r: 0.2, g: 0.5, b: 0.2 },
    spatialPattern: 'clustered',
    temporalPattern: 'slow',
    energyPattern: 'varying',
    consistencyPattern: 'varied',
  },
  {
    id: 'seed',
    name: 'The Seed',
    description: 'Pure potential waiting for the right moment. You are small now, but you know what you will become.',
    essence: 'The oak in the acorn. Patience is your power.',
    strengths: ['Potential energy', 'Strategic waiting', 'Self-knowledge', 'Future-oriented'],
    shadowSide: 'Waiting can become excuse. Sometimes you must crack and grow.',
    color: { r: 0.5, g: 0.4, b: 0.3 },
    spatialPattern: 'centered',
    temporalPattern: 'slow',
    energyPattern: 'gentle',
    consistencyPattern: 'consistent',
  },

  // AIR ARCHETYPES (White/Grey spectrum)
  {
    id: 'wind',
    name: 'The Wind',
    description: 'Invisible but undeniable. You touch everything but can be grasped by nothing. Freedom is your nature.',
    essence: 'Uncontainable. You belong to no one, including yourself.',
    strengths: ['Freedom-loving', 'Versatile', 'Carries ideas far', 'Impossible to trap'],
    shadowSide: 'Your freedom isolates. Connection requires staying sometimes.',
    color: { r: 0.8, g: 0.9, b: 1.0 },
    spatialPattern: 'scattered',
    temporalPattern: 'fast',
    energyPattern: 'varying',
    consistencyPattern: 'varied',
  },
  {
    id: 'breath',
    name: 'The Breath',
    description: 'Essential, quiet, life-giving. You are the thing people need but never notice until you are gone.',
    essence: 'Invisible necessity. You are the pause between heartbeats.',
    strengths: ['Essential presence', 'Calm consistency', 'Life-sustaining', 'Humble service'],
    shadowSide: 'Being overlooked hurts even when you pretend it does not.',
    color: { r: 0.9, g: 0.95, b: 1.0 },
    spatialPattern: 'rhythmic',
    temporalPattern: 'rhythmic',
    energyPattern: 'gentle',
    consistencyPattern: 'consistent',
  },
  {
    id: 'tornado',
    name: 'The Tornado',
    description: 'Focused chaos. You spiral inward while destroying outward. Your clarity comes from the eye of your own storm.',
    essence: 'Controlled destruction. You find peace in the center of violence.',
    strengths: ['Intense focus', 'Breakthrough energy', 'Transforms landscapes', 'Finds calm in chaos'],
    shadowSide: 'Your path leaves devastation. Not everything needs demolishing.',
    color: { r: 0.5, g: 0.5, b: 0.5 },
    spatialPattern: 'clustered',
    temporalPattern: 'accelerating',
    energyPattern: 'forceful',
    consistencyPattern: 'consistent',
  },

  // LIGHT ARCHETYPES (Yellow/White spectrum)
  {
    id: 'sun',
    name: 'The Sun',
    description: 'You do not try to shine - it is your nature. People orbit you not because you demand it, but because you are warm.',
    essence: 'Natural radiance. You give without asking return.',
    strengths: ['Natural leadership', 'Warmth', 'Generosity', 'Gravitational presence'],
    shadowSide: 'Being the center is exhausting. You are allowed to set.',
    color: { r: 1.0, g: 0.9, b: 0.2 },
    spatialPattern: 'centered',
    temporalPattern: 'rhythmic',
    energyPattern: 'sustained',
    consistencyPattern: 'consistent',
  },
  {
    id: 'star',
    name: 'The Star',
    description: 'Distant but brilliant. You guide travelers through darkness. Your light comes from burning yourself.',
    essence: 'Self-consuming brilliance. Navigation point for the lost.',
    strengths: ['Inspiring from afar', 'Consistent guidance', 'Beautiful sacrifice', 'Hope-bringer'],
    shadowSide: 'You burn alone in the void. Closeness is possible.',
    color: { r: 1.0, g: 1.0, b: 0.8 },
    spatialPattern: 'centered',
    temporalPattern: 'slow',
    energyPattern: 'sustained',
    consistencyPattern: 'consistent',
  },
  {
    id: 'lightning',
    name: 'The Lightning',
    description: 'Sudden revelation. Impossible to predict, impossible to forget. You illuminate truth in a flash.',
    essence: 'Instant clarity. You show what was always there.',
    strengths: ['Insight', 'Truth-teller', 'Dramatic impact', 'Cuts through fog'],
    shadowSide: 'Your truth can blind. Sometimes people need to adjust to light.',
    color: { r: 1.0, g: 1.0, b: 0.4 },
    spatialPattern: 'scattered',
    temporalPattern: 'fast',
    energyPattern: 'bursting',
    consistencyPattern: 'varied',
  },

  // SHADOW ARCHETYPES (Purple/Black spectrum)
  {
    id: 'void',
    name: 'The Void',
    description: 'You are the space between. Not empty, but full of potential. You contain all possibilities by being none.',
    essence: 'Pregnant nothingness. The canvas before the painting.',
    strengths: ['Ultimate openness', 'Non-judgment', 'Pure potential', 'Accepts all'],
    shadowSide: 'Being everything means being nothing. Choose something.',
    color: { r: 0.1, g: 0.0, b: 0.2 },
    spatialPattern: 'scattered',
    temporalPattern: 'slow',
    energyPattern: 'gentle',
    consistencyPattern: 'consistent',
  },
  {
    id: 'shadow',
    name: 'The Shadow',
    description: 'You move in darkness not because you hide, but because that is where you see clearly. Others fear the dark. You befriend it.',
    essence: 'Comfortable in what others flee. The dark is not your enemy.',
    strengths: ['Sees hidden truths', 'Comfortable with darkness', 'Depth perception', 'Unafraid'],
    shadowSide: 'Too much darkness forgets the sun. Emerge sometimes.',
    color: { r: 0.2, g: 0.1, b: 0.3 },
    spatialPattern: 'edge-seeking',
    temporalPattern: 'slow',
    energyPattern: 'gentle',
    consistencyPattern: 'consistent',
  },
  {
    id: 'mirror',
    name: 'The Mirror',
    description: 'You reflect what stands before you. Your gift is showing people themselves. Your curse is having no face of your own.',
    essence: 'Perfect reflection. Everyone sees themselves in you.',
    strengths: ['Empathic accuracy', 'Adaptive', 'Shows truth', 'Universal connector'],
    shadowSide: 'Reflection is not identity. Who are you when alone?',
    color: { r: 0.7, g: 0.7, b: 0.8 },
    spatialPattern: 'rhythmic',
    temporalPattern: 'rhythmic',
    energyPattern: 'varying',
    consistencyPattern: 'varied',
  },

  // METAL ARCHETYPES (Silver/Grey spectrum)
  {
    id: 'blade',
    name: 'The Blade',
    description: 'Forged through fire, tempered by time. You cut through what others avoid. Precision is your nature.',
    essence: 'Sharpness incarnate. You separate truth from comfort.',
    strengths: ['Precise', 'Direct', 'Cuts to truth', 'Disciplined'],
    shadowSide: 'Your edge cuts all, including allies. Sheath sometimes.',
    color: { r: 0.7, g: 0.75, b: 0.8 },
    spatialPattern: 'edge-seeking',
    temporalPattern: 'fast',
    energyPattern: 'forceful',
    consistencyPattern: 'consistent',
  },
  {
    id: 'shield',
    name: 'The Shield',
    description: 'You stand between harm and the innocent. Your strength is not in attack but in unbreakable defense.',
    essence: 'The immovable defender. You absorb blows meant for others.',
    strengths: ['Protective', 'Enduring', 'Loyal', 'Absorbs damage'],
    shadowSide: 'Constant defense makes you believe attack is always coming.',
    color: { r: 0.6, g: 0.65, b: 0.7 },
    spatialPattern: 'centered',
    temporalPattern: 'slow',
    energyPattern: 'sustained',
    consistencyPattern: 'consistent',
  },
  {
    id: 'bell',
    name: 'The Bell',
    description: 'You ring with truth. Your sound carries far, announces arrivals and departures, marks sacred moments.',
    essence: 'Resonant clarity. When you speak, the world listens.',
    strengths: ['Clear communication', 'Timing', 'Announces change', 'Memorable voice'],
    shadowSide: 'Constant ringing numbs ears. Silence has power too.',
    color: { r: 0.8, g: 0.7, b: 0.5 },
    spatialPattern: 'centered',
    temporalPattern: 'rhythmic',
    energyPattern: 'bursting',
    consistencyPattern: 'consistent',
  },

  // HYBRID ARCHETYPES (Mixed spectrum)
  {
    id: 'phoenix',
    name: 'The Phoenix',
    description: 'Death does not end you - it renews you. You have burned and risen so many times you no longer fear the flame.',
    essence: 'Eternal transformation. Your superpower is rebirth.',
    strengths: ['Resilient beyond measure', 'Embraces change', 'Alchemical', 'Wise through cycles'],
    shadowSide: 'Constant rebirth means never building. Sometimes stay still.',
    color: { r: 1.0, g: 0.4, b: 0.0 },
    spatialPattern: 'chaotic',
    temporalPattern: 'irregular',
    energyPattern: 'bursting',
    consistencyPattern: 'evolving',
  },
  {
    id: 'lotus',
    name: 'The Lotus',
    description: 'Rooted in mud, you bloom in sunlight. Your beauty comes from transcending your origins, not denying them.',
    essence: 'Purity through acceptance. Mud and light both make you.',
    strengths: ['Transcendent', 'Grounded wisdom', 'Beauty from struggle', 'Integrated'],
    shadowSide: 'Your beauty sometimes forgets its muddy roots. Stay humble.',
    color: { r: 1.0, g: 0.7, b: 0.8 },
    spatialPattern: 'centered',
    temporalPattern: 'slow',
    energyPattern: 'gentle',
    consistencyPattern: 'evolving',
  },
  {
    id: 'maze',
    name: 'The Maze',
    description: 'Complex by nature, you confuse those who try to know you. But at your center is a gift worth finding.',
    essence: 'Intentional complexity. The journey through you is the point.',
    strengths: ['Depth', 'Mystery', 'Rewards persistence', 'Multi-layered'],
    shadowSide: 'People give up before reaching your center. Clear some paths.',
    color: { r: 0.5, g: 0.4, b: 0.6 },
    spatialPattern: 'clustered',
    temporalPattern: 'irregular',
    energyPattern: 'varying',
    consistencyPattern: 'varied',
  },
  {
    id: 'bridge',
    name: 'The Bridge',
    description: 'You connect what seems separate. Your purpose is not your own journey but enabling others.',
    essence: 'Living connection. You span the impossible gap.',
    strengths: ['Connector', 'Enables others', 'Structural', 'Facilitates crossing'],
    shadowSide: 'Everyone crosses but few ask if you need crossing too.',
    color: { r: 0.6, g: 0.5, b: 0.4 },
    spatialPattern: 'edge-seeking',
    temporalPattern: 'slow',
    energyPattern: 'sustained',
    consistencyPattern: 'consistent',
  },
  {
    id: 'spiral',
    name: 'The Spiral',
    description: 'You circle the same themes but at different altitudes. Not stuck - ascending. Return is not regression.',
    essence: 'Cyclical ascension. You come back wiser.',
    strengths: ['Growth through repetition', 'Pattern recognition', 'Depth over breadth', 'Integrative'],
    shadowSide: 'Circles can trap if you forget to ascend. Keep climbing.',
    color: { r: 0.7, g: 0.6, b: 0.9 },
    spatialPattern: 'clustered',
    temporalPattern: 'rhythmic',
    energyPattern: 'sustained',
    consistencyPattern: 'evolving',
  },
  {
    id: 'prism',
    name: 'The Prism',
    description: 'White light enters you, rainbow emerges. You reveal the spectrum hidden in the ordinary.',
    essence: 'Revelation machine. You show what was always there.',
    strengths: ['Reveals hidden complexity', 'Transforms perception', 'Shows all sides', 'Illuminator'],
    shadowSide: 'Too much refraction fragments. Sometimes unified is enough.',
    color: { r: 0.8, g: 0.8, b: 1.0 },
    spatialPattern: 'scattered',
    temporalPattern: 'fast',
    energyPattern: 'varying',
    consistencyPattern: 'varied',
  },
  {
    id: 'tide',
    name: 'The Tide',
    description: 'You ebb and flow with lunar precision. Your rhythms are not yours - they belong to something vast.',
    essence: 'Bound to greater cycles. Your changes are cosmic.',
    strengths: ['Rhythmic wisdom', 'Connected to vastness', 'Reliable cycles', 'Natural timing'],
    shadowSide: 'Being ruled by external rhythms means losing agency. You can resist the moon.',
    color: { r: 0.3, g: 0.6, b: 0.7 },
    spatialPattern: 'rhythmic',
    temporalPattern: 'rhythmic',
    energyPattern: 'varying',
    consistencyPattern: 'consistent',
  },
  {
    id: 'catalyst',
    name: 'The Catalyst',
    description: 'You enable transformation but remain unchanged. Your presence alone alters everything around you.',
    essence: 'Change-maker who stays constant. Paradox incarnate.',
    strengths: ['Enables change', 'Stable core', 'Powerful presence', 'Transformative influence'],
    shadowSide: 'Watching others change while you stay fixed can hollow you.',
    color: { r: 0.9, g: 0.7, b: 0.3 },
    spatialPattern: 'centered',
    temporalPattern: 'slow',
    energyPattern: 'sustained',
    consistencyPattern: 'consistent',
  },
  {
    id: 'weaver',
    name: 'The Weaver',
    description: 'You take separate threads and create tapestry. Your genius is seeing how disparate things connect.',
    essence: 'Pattern-maker. You create meaning through connection.',
    strengths: ['Systems thinker', 'Integrative', 'Creates coherence', 'Sees connections'],
    shadowSide: 'You weave everything together, leaving nothing wild. Some threads want freedom.',
    color: { r: 0.6, g: 0.4, b: 0.7 },
    spatialPattern: 'clustered',
    temporalPattern: 'slow',
    energyPattern: 'gentle',
    consistencyPattern: 'evolving',
  },
  {
    id: 'horizon',
    name: 'The Horizon',
    description: 'Always ahead, never reached. You are the promise of what comes next, the eternal tomorrow.',
    essence: 'Future itself. You are the question, not the answer.',
    strengths: ['Forward-looking', 'Hope incarnate', 'Endless possibility', 'Inspiring vision'],
    shadowSide: 'Always ahead means never here. Land sometimes.',
    color: { r: 1.0, g: 0.5, b: 0.7 },
    spatialPattern: 'edge-seeking',
    temporalPattern: 'accelerating',
    energyPattern: 'varying',
    consistencyPattern: 'varied',
  },
];

/**
 * Analyze complete tap data and determine archetype
 * Uses deep qualia signals: spatial patterns, reaction latency, emotional taps, intervals
 */
export function analyzeArchetype(tapData: Array<{
  x: number;
  y: number;
  timestamp: number;
  intervalSincePrevious?: number;
  emotionalState?: string;
  questionIndex?: number;
  reactionLatency?: number;
}>): Archetype {
  // Analyze spatial patterns
  const spatialPattern = analyzeSpatialPattern(tapData);

  // Analyze temporal patterns from intervals
  const temporalPattern = analyzeTemporalPattern(tapData);

  // Analyze rhythm/energy from intervals (not duration!)
  const energyPattern = analyzeEnergyFromIntervals(tapData);

  // Analyze consistency over time
  const consistencyPattern = analyzeConsistencyPattern(tapData);

  // NEW: Analyze qualia-specific metrics
  const qualiaMetrics = analyzeQualiaMetrics(tapData);

  console.log('📊 Deep Qualia Analysis:', {
    spatialPattern,
    temporalPattern,
    energyPattern,
    consistencyPattern,
    ...qualiaMetrics
  });

  // Score each archetype based on ALL available data
  const scores = archetypes30.map(archetype => {
    let score = 0;

    // Core pattern matching (30 points possible)
    if (archetype.spatialPattern === spatialPattern) score += 8;
    if (archetype.temporalPattern === temporalPattern) score += 8;
    if (archetype.energyPattern === energyPattern) score += 7;
    if (archetype.consistencyPattern === consistencyPattern) score += 7;

    // Qualia-based scoring (20 points possible)
    score += calculateQualiaScore(archetype, qualiaMetrics);

    return { archetype, score };
  });

  // Return highest scoring
  scores.sort((a, b) => b.score - a.score);

  console.log('🎯 Top 5 Archetypes:', scores.slice(0, 5).map(s => ({
    name: s.archetype.name,
    score: s.score
  })));

  return scores[0].archetype;
}

function analyzeSpatialPattern(tapData: Array<{ x: number; y: number }>): Archetype['spatialPattern'] {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  const distances = tapData.map(tap =>
    Math.sqrt(Math.pow(tap.x - centerX, 2) + Math.pow(tap.y - centerY, 2))
  );

  const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length;
  const variance = distances.reduce((sum, d) => sum + Math.pow(d - avgDistance, 2), 0) / distances.length;
  const stdDev = Math.sqrt(variance);

  const edgeTaps = tapData.filter(tap =>
    tap.x < 100 || tap.x > window.innerWidth - 100 ||
    tap.y < 100 || tap.y > window.innerHeight - 100
  ).length;

  const edgeRatio = edgeTaps / tapData.length;

  if (edgeRatio > 0.4) return 'edge-seeking';
  if (avgDistance < 200) return 'centered';
  if (stdDev < 100) return 'clustered';
  if (stdDev > 300) return 'scattered';
  return 'rhythmic';
}

function analyzeTemporalPattern(tapData: Array<{ timestamp: number }>): Archetype['temporalPattern'] {
  const intervals: number[] = [];
  for (let i = 1; i < tapData.length; i++) {
    intervals.push(tapData[i].timestamp - tapData[i - 1].timestamp);
  }

  const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const variance = intervals.reduce((sum, interval) => sum + Math.pow(interval - avgInterval, 2), 0) / intervals.length;
  const coefficientOfVariation = Math.sqrt(variance) / avgInterval;

  const isAccelerating = intervals.slice(-10).reduce((a, b) => a + b, 0) < intervals.slice(0, 10).reduce((a, b) => a + b, 0);
  const isDecelerating = intervals.slice(-10).reduce((a, b) => a + b, 0) > intervals.slice(0, 10).reduce((a, b) => a + b, 0);

  if (isAccelerating && Math.abs(intervals[0] - intervals[intervals.length - 1]) > 200) return 'accelerating';
  if (isDecelerating && Math.abs(intervals[0] - intervals[intervals.length - 1]) > 200) return 'decelerating';
  if (coefficientOfVariation > 0.5) return 'irregular';
  if (coefficientOfVariation < 0.2) return 'rhythmic';
  if (avgInterval < 300) return 'fast';
  return 'slow';
}

function analyzeEnergyFromIntervals(tapData: Array<{ intervalSincePrevious?: number }>): Archetype['energyPattern'] {
  const intervals = tapData.filter(t => t.intervalSincePrevious !== undefined).map(t => t.intervalSincePrevious!);
  if (intervals.length === 0) return 'gentle';

  const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const variance = intervals.reduce((sum, interval) => sum + Math.pow(interval - avgInterval, 2), 0) / intervals.length;
  const coefficientOfVariation = Math.sqrt(variance) / avgInterval;

  // Varying = highly irregular rhythm
  if (coefficientOfVariation > 0.7) return 'varying';

  // Gentle = slow, steady tapping
  if (avgInterval > 800) return 'gentle';

  // Bursting = some very fast taps
  const hasBursts = intervals.some(interval => interval < avgInterval * 0.3);
  if (hasBursts) return 'bursting';

  // Sustained = consistent medium rhythm
  if (coefficientOfVariation < 0.3) return 'sustained';

  // Forceful = fast consistent tapping
  if (avgInterval < 400) return 'forceful';

  return 'sustained';
}

function analyzeConsistencyPattern(tapData: Array<{ intervalSincePrevious?: number }>): Archetype['consistencyPattern'] {
  const intervals = tapData.filter(t => t.intervalSincePrevious !== undefined).map(t => t.intervalSincePrevious!);
  if (intervals.length < 3) return 'consistent';

  const third = Math.floor(intervals.length / 3);
  const first = intervals.slice(0, third);
  const third_data = intervals.slice(third * 2);

  const avgFirst = first.reduce((sum, i) => sum + i, 0) / first.length;
  const avgThird = third_data.reduce((sum, i) => sum + i, 0) / third_data.length;

  const change = Math.abs(avgFirst - avgThird) / avgFirst;

  // Evolving = significant change in rhythm over time
  if (change > 0.5) return 'evolving';

  // Consistent = stable rhythm throughout
  if (change < 0.2) return 'consistent';

  return 'varied';
}

/**
 * Analyze qualia-specific metrics from deep consciousness signals
 */
function analyzeQualiaMetrics(tapData: Array<{
  x: number;
  y: number;
  timestamp: number;
  intervalSincePrevious?: number;
  emotionalState?: string;
  questionIndex?: number;
  reactionLatency?: number;
}>) {
  // 1. REACTION SPEED - Average latency to first tap
  const latencies = tapData.filter(t => t.reactionLatency !== undefined).map(t => t.reactionLatency!);
  const avgReactionLatency = latencies.length > 0
    ? latencies.reduce((a, b) => a + b, 0) / latencies.length
    : 1000;
  const reactionSpeed = avgReactionLatency < 500 ? 'fast' : avgReactionLatency < 1500 ? 'medium' : 'slow';

  // 2. EMOTIONAL RESPONSIVENESS - Which emotional states triggered taps
  const emotionalTaps = tapData.filter(t => t.emotionalState !== undefined);
  const emotionalStateCount = new Set(emotionalTaps.map(t => t.emotionalState)).size;
  const emotionalResponsiveness = emotionalTaps.length / Math.max(tapData.length, 1);

  // 3. RHYTHM CONSISTENCY - Variance in inter-tap intervals
  const intervals = tapData.filter(t => t.intervalSincePrevious !== undefined).map(t => t.intervalSincePrevious!);
  let rhythmConsistency = 0;
  if (intervals.length > 1) {
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((sum, i) => sum + Math.pow(i - avgInterval, 2), 0) / intervals.length;
    rhythmConsistency = 1 / (1 + Math.sqrt(variance) / avgInterval); // 0-1, higher = more consistent
  }

  // 4. TAP INTENSITY - Total number of taps (engagement level)
  const tapIntensity = tapData.length;

  // 5. SPATIAL EXPLORATION - How much of the screen was explored
  const gridSize = 0.2; // 20% of screen
  const gridCells = new Set(
    tapData.map(tap =>
      `${Math.floor(tap.x / gridSize)},${Math.floor(tap.y / gridSize)}`
    )
  );
  const spatialExploration = gridCells.size / Math.max(tapData.length, 1);

  // 6. QUESTION VARIATION - Did tap behavior change across questions?
  const questionTapCounts = [0, 0, 0, 0, 0];
  tapData.forEach(tap => {
    if (tap.questionIndex !== undefined && tap.questionIndex >= 0 && tap.questionIndex < 5) {
      questionTapCounts[tap.questionIndex]++;
    }
  });
  const avgQuestionTaps = questionTapCounts.reduce((a, b) => a + b, 0) / 5;
  const questionVariance = questionTapCounts.reduce((sum, count) =>
    sum + Math.pow(count - avgQuestionTaps, 2), 0) / 5;
  const questionVariation = Math.sqrt(questionVariance) / (avgQuestionTaps + 1);

  return {
    avgReactionLatency,
    reactionSpeed,
    emotionalResponsiveness,
    emotionalStateCount,
    rhythmConsistency,
    tapIntensity,
    spatialExploration,
    questionVariation,
  };
}

/**
 * Calculate qualia-based archetype scoring
 */
function calculateQualiaScore(
  archetype: Archetype,
  metrics: ReturnType<typeof analyzeQualiaMetrics>
): number {
  let score = 0;

  // FIRE ARCHETYPES (inferno, ember, spark): Fast reactions, high intensity, bursting
  if (['inferno', 'ember', 'spark'].includes(archetype.id)) {
    if (metrics.reactionSpeed === 'fast') score += 3;
    if (metrics.tapIntensity > 30) score += 2;
    if (metrics.rhythmConsistency < 0.4) score += 2; // Chaotic
  }

  // WATER ARCHETYPES (ocean, river, storm): Flowing, adaptive, evolving
  if (['ocean', 'river', 'storm'].includes(archetype.id)) {
    if (metrics.rhythmConsistency > 0.6) score += 3;
    if (metrics.questionVariation > 0.5) score += 2; // Adaptive
    if (metrics.spatialExploration > 0.5) score += 2;
  }

  // EARTH ARCHETYPES (mountain, forest, seed): Stable, consistent, grounded
  if (['mountain', 'forest', 'seed'].includes(archetype.id)) {
    if (metrics.rhythmConsistency > 0.7) score += 3;
    if (metrics.reactionSpeed === 'slow') score += 2;
    if (metrics.spatialExploration < 0.4) score += 2; // Centered
  }

  // AIR ARCHETYPES (wind, breath, tornado): Fast, varied, exploring
  if (['wind', 'breath', 'tornado'].includes(archetype.id)) {
    if (metrics.spatialExploration > 0.6) score += 3;
    if (metrics.reactionSpeed === 'fast') score += 2;
    if (metrics.questionVariation > 0.6) score += 2;
  }

  // LIGHT ARCHETYPES (sun, star, lightning): Bright, consistent, radiating
  if (['sun', 'star', 'lightning'].includes(archetype.id)) {
    if (metrics.tapIntensity > 25) score += 3;
    if (metrics.emotionalResponsiveness > 0.3) score += 2;
    if (metrics.reactionSpeed === 'fast') score += 2;
  }

  // SHADOW ARCHETYPES (void, shadow, mirror): Subtle, edge-seeking, deep
  if (['void', 'shadow', 'mirror'].includes(archetype.id)) {
    if (metrics.tapIntensity < 20) score += 3;
    if (metrics.reactionSpeed === 'slow') score += 2;
    if (metrics.spatialExploration > 0.5) score += 2;
  }

  // METAL ARCHETYPES (blade, shield, bell): Precise, consistent, focused
  if (['blade', 'shield', 'bell'].includes(archetype.id)) {
    if (metrics.rhythmConsistency > 0.7) score += 3;
    if (metrics.questionVariation < 0.3) score += 2; // Consistent across questions
    if (metrics.tapIntensity > 20 && metrics.tapIntensity < 35) score += 2;
  }

  // HYBRID ARCHETYPES (phoenix, lotus, maze, etc): Balanced, evolving, complex
  if (['phoenix', 'lotus', 'maze', 'bridge', 'spiral', 'prism', 'tide', 'catalyst', 'weaver', 'horizon'].includes(archetype.id)) {
    // Reward balance and complexity
    if (metrics.emotionalResponsiveness > 0.2 && metrics.emotionalResponsiveness < 0.6) score += 2;
    if (metrics.questionVariation > 0.4) score += 2;
    if (metrics.spatialExploration > 0.4 && metrics.spatialExploration < 0.7) score += 2;

    // Specific hybrids
    if (archetype.id === 'phoenix' && metrics.questionVariation > 0.7) score += 2;
    if (archetype.id === 'maze' && metrics.spatialExploration > 0.6) score += 2;
    if (archetype.id === 'spiral' && metrics.rhythmConsistency > 0.5) score += 2;
  }

  return score;
}

