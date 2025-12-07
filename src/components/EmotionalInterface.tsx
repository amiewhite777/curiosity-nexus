'use client';

import { useState, useEffect } from 'react';
import { TapAnalyzer, EmotionalState } from '@/agency/input/tapAnalyzer';
import { getRandomQuestion, EmotionalQuestion } from '@/data/emotionalQuestions';
import { determineArchetype, Archetype } from '@/data/archetypes';
import { useSimulationStore } from '@/store/simulationStore';

interface Props {
  tapAnalyzer: TapAnalyzer;
}

export default function EmotionalInterface({ tapAnalyzer }: Props) {
  const [currentQuestion, setCurrentQuestion] = useState<EmotionalQuestion | null>(null);
  const [emotionalState, setEmotionalState] = useState<EmotionalState | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [emotionHistory, setEmotionHistory] = useState<string[]>([]);
  const [finalArchetype, setFinalArchetype] = useState<Archetype | null>(null);
  const [showArchetypeReveal, setShowArchetypeReveal] = useState(false);

  const { setChaosLevel, setCoherence, updateTemperature } = useSimulationStore();

  const TOTAL_QUESTIONS = 5;

  // Start session with first question
  const startSession = () => {
    setSessionStarted(true);
    setQuestionNumber(1);
    setCurrentQuestion(getRandomQuestion());
    setEmotionHistory([]);
    setFinalArchetype(null);
    setShowArchetypeReveal(false);
    tapAnalyzer.reset();
    setTapCount(0);
    setShowAnalysis(false);
  };

  // Analyze current tapping pattern
  const analyze = () => {
    const state = tapAnalyzer.analyzeEmotion();
    if (state) {
      setEmotionalState(state);
      setShowAnalysis(true);

      // Add to emotion history
      const newHistory = [...emotionHistory, state.emotion];
      setEmotionHistory(newHistory);

      // Update simulation based on detected emotion
      const chaosMap: Record<string, number> = {
        anxious: 0.85,
        angry: 0.95,
        excited: 0.7,
        uncertain: 0.6,
        contemplative: 0.4,
        calm: 0.2,
        peaceful: 0.1,
      };

      setChaosLevel(chaosMap[state.emotion] || 0.5);
      setCoherence(1 - (chaosMap[state.emotion] || 0.5));
      updateTemperature(state.intensity * 2);

      // If this was the 5th question, prepare archetype reveal
      if (questionNumber === TOTAL_QUESTIONS) {
        const archetype = determineArchetype(newHistory);
        setFinalArchetype(archetype);

        // Apply archetype color to simulation
        setChaosLevel(0.3); // Calm down for reveal
        setTimeout(() => {
          setShowArchetypeReveal(true);
        }, 2000);
      }
    }
  };

  // Next question
  const nextQuestion = () => {
    if (questionNumber < TOTAL_QUESTIONS) {
      setQuestionNumber(questionNumber + 1);
      setCurrentQuestion(getRandomQuestion());
      tapAnalyzer.reset();
      setTapCount(0);
      setShowAnalysis(false);
      setEmotionalState(null);
    }
  };

  // Update tap count
  useEffect(() => {
    const interval = setInterval(() => {
      setTapCount(tapAnalyzer.getTapCount());
    }, 100);
    return () => clearInterval(interval);
  }, [tapAnalyzer]);

  // Welcome screen
  if (!sessionStarted) {
    return (
      <div style={styles.overlay}>
        <div style={styles.welcomeCard}>
          <h1 style={styles.title}>Emotional Mirror</h1>
          <p style={styles.subtitle}>
            Five questions.
            <br />
            Five emotional signatures.
            <br />
            One truth revealed.
            <br />
            <br />
            I will not analyze <em>what</em> you think.
            <br />
            I will analyze <em>how</em> you feel.
            <br />
            <br />
            Your archetype awaits.
          </p>
          <button onClick={startSession} style={styles.button}>
            Discover Who You Are
          </button>
        </div>
      </div>
    );
  }

  // Archetype reveal screen
  if (showArchetypeReveal && finalArchetype) {
    const archetypeColor = `rgb(${finalArchetype.color.r * 255}, ${finalArchetype.color.g * 255}, ${finalArchetype.color.b * 255})`;

    return (
      <div style={styles.overlay}>
        <div
          style={{
            ...styles.archetypeCard,
            borderColor: archetypeColor,
            boxShadow: `0 0 60px ${archetypeColor}40`,
          }}
        >
          <div style={styles.archetypeHeader}>
            <h1 style={{ ...styles.archetypeName, color: archetypeColor }}>
              {finalArchetype.name}
            </h1>
            <p style={styles.archetypeEssence}>{finalArchetype.essence}</p>
          </div>

          <p style={styles.archetypeDescription}>{finalArchetype.description}</p>

          <div style={styles.strengthsSection}>
            <h3 style={styles.sectionTitle}>Your Strengths</h3>
            <ul style={styles.strengthsList}>
              {finalArchetype.strengths.map((strength, idx) => (
                <li key={idx} style={styles.strengthItem}>
                  {strength}
                </li>
              ))}
            </ul>
          </div>

          <div style={styles.shadowSection}>
            <h3 style={styles.sectionTitle}>Your Shadow</h3>
            <p style={styles.shadowText}>{finalArchetype.shadowSide}</p>
          </div>

          <div style={styles.emotionHistorySection}>
            <h3 style={styles.sectionTitle}>Your Emotional Journey</h3>
            <div style={styles.emotionTags}>
              {emotionHistory.map((emotion, idx) => (
                <span key={idx} style={styles.emotionTag}>
                  Q{idx + 1}: {emotion}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              setSessionStarted(false);
              setShowArchetypeReveal(false);
            }}
            style={{ ...styles.button, marginTop: '30px' }}
          >
            Begin Again
          </button>
        </div>
      </div>
    );
  }

  // Question and analysis screens
  return (
    <div style={styles.interface}>
      {/* Progress indicator */}
      <div style={styles.progressBar}>
        {Array.from({ length: TOTAL_QUESTIONS }).map((_, idx) => (
          <div
            key={idx}
            style={{
              ...styles.progressDot,
              background:
                idx < questionNumber
                  ? 'rgba(100, 150, 255, 0.8)'
                  : 'rgba(255, 255, 255, 0.2)',
            }}
          />
        ))}
      </div>

      {/* Question Card */}
      {currentQuestion && !showAnalysis && (
        <div style={styles.questionCard}>
          <div style={styles.questionHeader}>
            <span style={styles.questionNumber}>
              Question {questionNumber} of {TOTAL_QUESTIONS}
            </span>
          </div>
          <p style={styles.question}>{currentQuestion.text}</p>
          <p style={styles.instruction}>Tap anywhere to respond...</p>
          <div style={styles.tapCounter}>
            {tapCount > 0 && (
              <>
                <span style={styles.tapCountText}>{tapCount} taps</span>
                {tapCount >= 3 && (
                  <button onClick={analyze} style={styles.analyzeButton}>
                    Analyze Response
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Emotion Analysis */}
      {showAnalysis && emotionalState && !showArchetypeReveal && (
        <div
          style={{
            ...styles.analysisCard,
            borderColor: `rgb(${emotionalState.color.r * 255}, ${emotionalState.color.g * 255}, ${emotionalState.color.b * 255})`,
          }}
        >
          <div style={styles.emotionLabel}>
            <span
              style={{
                ...styles.emotionName,
                color: `rgb(${emotionalState.color.r * 255}, ${emotionalState.color.g * 255}, ${emotionalState.color.b * 255})`,
              }}
            >
              {emotionalState.emotion.toUpperCase()}
            </span>
            <span style={styles.intensity}>
              {Math.round(emotionalState.intensity * 100)}%
            </span>
          </div>
          <p style={styles.description}>{emotionalState.description}</p>

          {questionNumber < TOTAL_QUESTIONS ? (
            <button onClick={nextQuestion} style={styles.nextButton}>
              Next Question →
            </button>
          ) : (
            <p style={styles.finalMessage}>Calculating your archetype...</p>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0, 0, 0, 0.9)',
    zIndex: 1000,
    backdropFilter: 'blur(15px)',
    padding: '20px',
  },
  welcomeCard: {
    background: 'rgba(20, 20, 40, 0.95)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    padding: '40px',
    maxWidth: '600px',
    textAlign: 'center' as const,
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7)',
  },
  title: {
    fontSize: '48px',
    fontWeight: '200',
    marginBottom: '20px',
    color: '#fff',
    letterSpacing: '3px',
  },
  subtitle: {
    fontSize: '18px',
    lineHeight: '1.8',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: '40px',
  },
  button: {
    background: 'rgba(100, 100, 255, 0.3)',
    border: '1px solid rgba(100, 100, 255, 0.6)',
    color: '#fff',
    padding: '18px 45px',
    fontSize: '18px',
    borderRadius: '50px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: '300',
    letterSpacing: '1px',
  },
  interface: {
    position: 'fixed' as const,
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 100,
    pointerEvents: 'none' as const,
    width: '90%',
    maxWidth: '600px',
  },
  progressBar: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '20px',
    pointerEvents: 'none' as const,
  },
  progressDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    transition: 'all 0.3s ease',
  },
  questionCard: {
    background: 'rgba(20, 20, 40, 0.9)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    padding: '35px',
    backdropFilter: 'blur(15px)',
    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.5)',
    pointerEvents: 'auto' as const,
  },
  questionHeader: {
    marginBottom: '20px',
  },
  questionNumber: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.4)',
    textTransform: 'uppercase' as const,
    letterSpacing: '2px',
  },
  question: {
    fontSize: '28px',
    fontWeight: '300',
    color: '#fff',
    marginBottom: '20px',
    lineHeight: '1.4',
  },
  instruction: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontStyle: 'italic',
  },
  tapCounter: {
    marginTop: '25px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '12px',
  },
  tapCountText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '14px',
  },
  analyzeButton: {
    background: 'rgba(100, 255, 100, 0.25)',
    border: '1px solid rgba(100, 255, 100, 0.5)',
    color: '#fff',
    padding: '12px 30px',
    fontSize: '14px',
    borderRadius: '25px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: '300',
  },
  analysisCard: {
    background: 'rgba(20, 20, 40, 0.9)',
    border: '2px solid',
    borderRadius: '20px',
    padding: '35px',
    backdropFilter: 'blur(15px)',
    boxShadow: '0 15px 50px rgba(0, 0, 0, 0.6)',
    pointerEvents: 'auto' as const,
  },
  emotionLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  emotionName: {
    fontSize: '32px',
    fontWeight: '600',
    letterSpacing: '3px',
  },
  intensity: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  description: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: '25px',
  },
  nextButton: {
    background: 'rgba(100, 100, 255, 0.3)',
    border: '1px solid rgba(100, 100, 255, 0.5)',
    color: '#fff',
    padding: '15px 35px',
    fontSize: '16px',
    borderRadius: '25px',
    cursor: 'pointer',
    width: '100%',
    fontWeight: '300',
  },
  finalMessage: {
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center' as const,
    fontStyle: 'italic',
    padding: '15px',
  },
  archetypeCard: {
    background: 'rgba(15, 15, 30, 0.95)',
    border: '3px solid',
    borderRadius: '25px',
    padding: '50px',
    maxWidth: '700px',
    backdropFilter: 'blur(20px)',
    maxHeight: '90vh',
    overflowY: 'auto' as const,
  },
  archetypeHeader: {
    textAlign: 'center' as const,
    marginBottom: '35px',
    paddingBottom: '25px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  archetypeName: {
    fontSize: '56px',
    fontWeight: '200',
    letterSpacing: '4px',
    marginBottom: '15px',
    textTransform: 'uppercase' as const,
  },
  archetypeEssence: {
    fontSize: '20px',
    fontStyle: 'italic',
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: '1.6',
  },
  archetypeDescription: {
    fontSize: '18px',
    lineHeight: '1.8',
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: '30px',
  },
  strengthsSection: {
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase' as const,
    letterSpacing: '2px',
    marginBottom: '15px',
    fontWeight: '400',
  },
  strengthsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  strengthItem: {
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: '10px',
    paddingLeft: '20px',
    position: 'relative' as const,
    lineHeight: '1.5',
    '::before': {
      content: '"→"',
      position: 'absolute' as const,
      left: 0,
    },
  },
  shadowSection: {
    marginBottom: '30px',
    padding: '20px',
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '15px',
    border: '1px solid rgba(255, 100, 100, 0.2)',
  },
  shadowText: {
    fontSize: '16px',
    color: 'rgba(255, 150, 150, 0.9)',
    lineHeight: '1.6',
    fontStyle: 'italic',
  },
  emotionHistorySection: {
    marginBottom: '20px',
  },
  emotionTags: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '10px',
  },
  emotionTag: {
    background: 'rgba(100, 100, 255, 0.2)',
    border: '1px solid rgba(100, 100, 255, 0.3)',
    padding: '8px 15px',
    borderRadius: '20px',
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.8)',
  },
};
