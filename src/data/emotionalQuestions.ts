/**
 * Emotional Question Database
 * Deep, introspective prompts designed to evoke genuine emotional responses
 */

export interface EmotionalQuestion {
  id: string;
  text: string;
  category: 'future' | 'past' | 'self' | 'fear' | 'desire' | 'meaning' | 'connection';
  expectedEmotions: string[];
}

export const emotionalQuestions: EmotionalQuestion[] = [
  // FUTURE
  {
    id: 'future_1',
    text: 'How do you feel about tomorrow?',
    category: 'future',
    expectedEmotions: ['anxious', 'excited', 'calm', 'uncertain'],
  },
  {
    id: 'future_2',
    text: 'What version of yourself are you becoming?',
    category: 'future',
    expectedEmotions: ['contemplative', 'uncertain', 'excited'],
  },
  {
    id: 'future_3',
    text: 'If you could see 10 years ahead, would you look?',
    category: 'future',
    expectedEmotions: ['uncertain', 'anxious', 'excited'],
  },

  // PAST
  {
    id: 'past_1',
    text: 'What did you leave behind that still calls to you?',
    category: 'past',
    expectedEmotions: ['contemplative', 'peaceful', 'uncertain'],
  },
  {
    id: 'past_2',
    text: 'Who were you before the world told you who to be?',
    category: 'past',
    expectedEmotions: ['contemplative', 'calm', 'uncertain'],
  },

  // SELF
  {
    id: 'self_1',
    text: 'What do you pretend not to know about yourself?',
    category: 'self',
    expectedEmotions: ['uncertain', 'contemplative', 'anxious'],
  },
  {
    id: 'self_2',
    text: 'When are you most truly yourself?',
    category: 'self',
    expectedEmotions: ['peaceful', 'calm', 'contemplative'],
  },
  {
    id: 'self_3',
    text: 'What truth about yourself scares you?',
    category: 'self',
    expectedEmotions: ['anxious', 'uncertain', 'contemplative'],
  },

  // FEAR
  {
    id: 'fear_1',
    text: 'What scares you most?',
    category: 'fear',
    expectedEmotions: ['anxious', 'uncertain'],
  },
  {
    id: 'fear_2',
    text: 'What would you do if you weren\'t afraid?',
    category: 'fear',
    expectedEmotions: ['contemplative', 'excited', 'uncertain'],
  },
  {
    id: 'fear_3',
    text: 'What are you running from?',
    category: 'fear',
    expectedEmotions: ['anxious', 'uncertain', 'contemplative'],
  },

  // DESIRE
  {
    id: 'desire_1',
    text: 'What do you ache for?',
    category: 'desire',
    expectedEmotions: ['contemplative', 'uncertain', 'excited'],
  },
  {
    id: 'desire_2',
    text: 'What would you risk everything for?',
    category: 'desire',
    expectedEmotions: ['excited', 'contemplative', 'anxious'],
  },
  {
    id: 'desire_3',
    text: 'If no one was watching, what would you choose?',
    category: 'desire',
    expectedEmotions: ['contemplative', 'peaceful', 'uncertain'],
  },

  // MEANING
  {
    id: 'meaning_1',
    text: 'What gives your life meaning?',
    category: 'meaning',
    expectedEmotions: ['contemplative', 'peaceful', 'calm'],
  },
  {
    id: 'meaning_2',
    text: 'What will you leave behind?',
    category: 'meaning',
    expectedEmotions: ['contemplative', 'uncertain', 'calm'],
  },
  {
    id: 'meaning_3',
    text: 'Does anything really matter?',
    category: 'meaning',
    expectedEmotions: ['contemplative', 'uncertain', 'calm'],
  },

  // CONNECTION
  {
    id: 'connection_1',
    text: 'Who do you miss right now?',
    category: 'connection',
    expectedEmotions: ['contemplative', 'calm', 'uncertain'],
  },
  {
    id: 'connection_2',
    text: 'What have you never said out loud?',
    category: 'connection',
    expectedEmotions: ['uncertain', 'anxious', 'contemplative'],
  },
  {
    id: 'connection_3',
    text: 'Who knows the real you?',
    category: 'connection',
    expectedEmotions: ['contemplative', 'uncertain', 'calm'],
  },
  {
    id: 'connection_4',
    text: 'What would you tell your younger self?',
    category: 'connection',
    expectedEmotions: ['contemplative', 'peaceful', 'calm'],
  },
];

/**
 * Get a random question
 */
export function getRandomQuestion(): EmotionalQuestion {
  return emotionalQuestions[Math.floor(Math.random() * emotionalQuestions.length)];
}

/**
 * Get a question by category
 */
export function getQuestionByCategory(category: EmotionalQuestion['category']): EmotionalQuestion {
  const filtered = emotionalQuestions.filter(q => q.category === category);
  return filtered[Math.floor(Math.random() * filtered.length)];
}
