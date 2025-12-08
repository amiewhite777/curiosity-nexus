/**
 * Emotional Archetypes
 * Who you are, revealed through the rhythm of your touch
 */

export interface Archetype {
  id: string;
  name: string;
  description: string;
  essence: string; // Poetic summary
  strengths: string[];
  shadowSide: string;
  color: { r: number; g: number; b: number };
  emotionalSignature: string[];
}

export const archetypes: Archetype[] = [
  {
    id: 'storm',
    name: 'The Storm',
    description: 'You move through the world with intensity and urgency. Your emotions are powerful forces - anxiety and excitement intertwined. You feel everything deeply, sometimes too deeply.',
    essence: 'A tempest of feeling, you are electricity seeking ground.',
    strengths: [
      'Passionate and deeply alive',
      'High energy and drive',
      'Not afraid to feel intensely',
      'Capable of rapid transformation',
    ],
    shadowSide: 'Your intensity can overwhelm. Learn to find stillness in the chaos.',
    color: { r: 1.0, g: 0.2, b: 0.2 },
    emotionalSignature: ['anxious', 'excited', 'angry'],
  },
  {
    id: 'anchor',
    name: 'The Anchor',
    description: 'You are steady. While others spiral, you remain grounded. Your presence is calm water - others find peace in you because you have found it in yourself.',
    essence: 'In a world of storms, you are the harbor.',
    strengths: [
      'Emotionally stable and reliable',
      'Brings calm to chaos',
      'Thoughtful and measured',
      'Grounded in the present moment',
    ],
    shadowSide: 'Your steadiness can become stagnation. Remember to let yourself drift sometimes.',
    color: { r: 0.2, g: 0.5, b: 1.0 },
    emotionalSignature: ['calm', 'peaceful', 'contemplative'],
  },
  {
    id: 'seeker',
    name: 'The Seeker',
    description: 'You are always questioning, always wondering. Uncertainty is not your enemy - it is your compass. You live in the space between knowing and not-knowing, and you are comfortable there.',
    essence: 'You are the question that has no answer, and that is your gift.',
    strengths: [
      'Curious and open-minded',
      'Comfortable with ambiguity',
      'Deep thinker and philosopher',
      'Always growing and evolving',
    ],
    shadowSide: 'Analysis can become paralysis. Trust yourself to move forward without all the answers.',
    color: { r: 0.7, g: 0.5, b: 0.9 },
    emotionalSignature: ['uncertain', 'contemplative'],
  },
  {
    id: 'catalyst',
    name: 'The Catalyst',
    description: 'You are the spark that ignites change. Excitement and determination flow through you. You do not wait for life to happen - you make it happen. Your energy is contagious.',
    essence: 'You are becoming, always becoming, and you pull others along.',
    strengths: [
      'Initiator and action-taker',
      'Inspiring and energizing',
      'Courage to try new things',
      'Natural leader and motivator',
    ],
    shadowSide: 'Constant motion can burn you out. Learn when to rest.',
    color: { r: 1.0, g: 0.8, b: 0.1 },
    emotionalSignature: ['excited', 'contemplative', 'calm'],
  },
  {
    id: 'wanderer',
    name: 'The Wanderer',
    description: 'You contain multitudes. Your emotional landscape shifts like desert sands - today calm, tomorrow stormy, always changing. You resist definition because you are infinite.',
    essence: 'You are every season at once, and no cage can hold you.',
    strengths: [
      'Emotionally flexible and adaptive',
      'Rich inner life',
      'Unpredictable and surprising',
      'Comfortable with change',
    ],
    shadowSide: 'Inconsistency can become instability. Find your center even as you wander.',
    color: { r: 0.5, g: 0.8, b: 0.7 },
    emotionalSignature: ['uncertain', 'peaceful', 'excited', 'anxious'],
  },
  {
    id: 'guardian',
    name: 'The Guardian',
    description: 'You carry weight. Not your own - everyone else\'s. You feel deeply responsible, deeply protective. Your intensity comes from care, from love, from the desire to keep safe what matters.',
    essence: 'You stand at the gate between what is and what threatens. Eternal vigilance.',
    strengths: [
      'Loyal and protective',
      'Strong sense of responsibility',
      'Deeply caring',
      'Will fight for what matters',
    ],
    shadowSide: 'You cannot save everyone. Your care must include yourself.',
    color: { r: 0.8, g: 0.3, b: 0.1 },
    emotionalSignature: ['anxious', 'calm', 'contemplative'],
  },
  {
    id: 'dreamer',
    name: 'The Dreamer',
    description: 'You live slightly outside of time. While others rush, you float. You see beauty others miss, feel peace others cannot find. You are not quite of this world, and that is your magic.',
    essence: 'You are the space between thoughts, the breath between heartbeats.',
    strengths: [
      'Creative and imaginative',
      'Sees possibility everywhere',
      'Brings beauty into the world',
      'Peaceful presence',
    ],
    shadowSide: 'Dreams are not enough. Sometimes you must act.',
    color: { r: 0.3, g: 0.8, b: 0.95 },
    emotionalSignature: ['peaceful', 'calm'],
  },
  {
    id: 'warrior',
    name: 'The Warrior',
    description: 'You do not run from difficulty - you run toward it. Anger is your fuel, determination your path. You fight - for yourself, for others, for what is right. You are unafraid of conflict.',
    essence: 'You are the fist that will not unclench until justice is done.',
    strengths: [
      'Courageous and determined',
      'Stands up for beliefs',
      'Powerful and impactful',
      'Refuses to be defeated',
    ],
    shadowSide: 'Not everything requires a battle. Learn when to lay down arms.',
    color: { r: 1.0, g: 0.1, b: 0.0 },
    emotionalSignature: ['angry', 'excited'],
  },
];

/**
 * Analyze emotional pattern and determine archetype
 */
export function determineArchetype(emotionHistory: string[]): Archetype {
  // Count emotion frequencies
  const emotionCounts: Record<string, number> = {};
  emotionHistory.forEach((emotion) => {
    emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
  });

  // Calculate match score for each archetype
  const scores = archetypes.map((archetype) => {
    let score = 0;
    archetype.emotionalSignature.forEach((emotion) => {
      score += emotionCounts[emotion] || 0;
    });

    // Bonus for variety (wanderer)
    const uniqueEmotions = new Set(emotionHistory).size;
    if (archetype.id === 'wanderer' && uniqueEmotions >= 4) {
      score += 3;
    }

    // Bonus for consistency (anchor, dreamer)
    const dominantEmotion = Object.keys(emotionCounts).reduce((a, b) =>
      emotionCounts[a] > emotionCounts[b] ? a : b
    );
    const dominantCount = emotionCounts[dominantEmotion];
    if (
      (archetype.id === 'anchor' || archetype.id === 'dreamer') &&
      dominantCount >= 3
    ) {
      score += 2;
    }

    return { archetype, score };
  });

  // Sort by score and return highest
  scores.sort((a, b) => b.score - a.score);
  return scores[0].archetype;
}
