'use client';

import { useState, useEffect } from 'react';
import { TapAnalyzer, EmotionalState } from '@/agency/input/tapAnalyzer';
import { getRandomQuestion, EmotionalQuestion } from '@/data/emotionalQuestions';
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
  const { setChaosLevel, setCoherence, updateTemperature } = useSimulationStore();

  // Start with first question
  const startSession = () => {
    setSessionStarted(true);
    setCurrentQuestion(getRandomQuestion());
    tapAnalyzer.reset();
    setTapCount(0);
    setShowAnalysis(false);
  };

  // Next question
  const nextQuestion = () => {
    setCurrentQuestion(getRandomQuestion());
    tapAnalyzer.reset();
    setTapCount(0);
    setShowAnalysis(false);
    setEmotionalState(null);
  };

  // Analyze current tapping pattern
  const analyze = () => {
    const state = tapAnalyzer.analyzeEmotion();
    if (state) {
      setEmotionalState(state);
      setShowAnalysis(true);

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
    }
  };

  // Update tap count
  useEffect(() => {
    const interval = setInterval(() => {
      setTapCount(tapAnalyzer.getTapCount());
    }, 100);
    return () => clearInterval(interval);
  }, [tapAnalyzer]);

  if (!sessionStarted) {
    return (
      <div style={styles.overlay}>
        <div style={styles.welcomeCard}>
          <h1 style={styles.title}>Emotional Mirror</h1>
          <p style={styles.subtitle}>
            I will ask you questions.
            <br />
            Respond by tapping.
            <br />
            <br />
            Not <em>what</em> you tap, but <em>how</em> you tap reveals your truth.
          </p>
          <button onClick={startSession} style={styles.button}>
            Begin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.interface}>
      {/* Question Card */}
      {currentQuestion && !showAnalysis && (
        <div style={styles.questionCard}>
          <p style={styles.question}>{currentQuestion.text}</p>
          <p style={styles.instruction}>
            Tap to respond...
          </p>
          <div style={styles.tapCounter}>
            {tapCount > 0 && (
              <>
                <span style={styles.tapCountText}>{tapCount} taps</span>
                {tapCount >= 3 && (
                  <button onClick={analyze} style={styles.analyzeButton}>
                    Analyze My Response
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Analysis Display */}
      {showAnalysis && emotionalState && (
        <div style={{
          ...styles.analysisCard,
          borderColor: `rgb(${emotionalState.color.r * 255}, ${emotionalState.color.g * 255}, ${emotionalState.color.b * 255})`,
        }}>
          <div style={styles.emotionLabel}>
            <span style={{
              ...styles.emotionName,
              color: `rgb(${emotionalState.color.r * 255}, ${emotionalState.color.g * 255}, ${emotionalState.color.b * 255})`,
            }}>
              {emotionalState.emotion.toUpperCase()}
            </span>
            <span style={styles.intensity}>
              Intensity: {Math.round(emotionalState.intensity * 100)}%
            </span>
          </div>
          <p style={styles.description}>{emotionalState.description}</p>
          <p style={styles.tapPattern}>
            Your tapping pattern: {tapCount} taps
          </p>
          <div style={styles.buttonRow}>
            <button onClick={nextQuestion} style={styles.nextButton}>
              Next Question
            </button>
            <button onClick={() => setSessionStarted(false)} style={styles.resetButton}>
              End Session
            </button>
          </div>
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
    background: 'rgba(0, 0, 0, 0.85)',
    zIndex: 1000,
    backdropFilter: 'blur(10px)',
  },
  welcomeCard: {
    background: 'rgba(20, 20, 40, 0.9)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    padding: '40px',
    maxWidth: '500px',
    textAlign: 'center' as const,
    boxShadow: '0 10px 50px rgba(0, 0, 0, 0.5)',
  },
  title: {
    fontSize: '36px',
    fontWeight: '300',
    marginBottom: '20px',
    color: '#fff',
    letterSpacing: '2px',
  },
  subtitle: {
    fontSize: '18px',
    lineHeight: '1.6',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: '30px',
  },
  button: {
    background: 'rgba(100, 100, 255, 0.3)',
    border: '1px solid rgba(100, 100, 255, 0.5)',
    color: '#fff',
    padding: '15px 40px',
    fontSize: '18px',
    borderRadius: '50px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  interface: {
    position: 'fixed' as const,
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 100,
    pointerEvents: 'none' as const,
  },
  questionCard: {
    background: 'rgba(20, 20, 40, 0.85)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    padding: '30px',
    minWidth: '300px',
    maxWidth: '500px',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    pointerEvents: 'auto' as const,
  },
  question: {
    fontSize: '24px',
    fontWeight: '300',
    color: '#fff',
    marginBottom: '15px',
    lineHeight: '1.4',
  },
  instruction: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontStyle: 'italic',
  },
  tapCounter: {
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '10px',
  },
  tapCountText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '14px',
  },
  analyzeButton: {
    background: 'rgba(100, 255, 100, 0.2)',
    border: '1px solid rgba(100, 255, 100, 0.4)',
    color: '#fff',
    padding: '10px 25px',
    fontSize: '14px',
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  analysisCard: {
    background: 'rgba(20, 20, 40, 0.9)',
    border: '2px solid',
    borderRadius: '20px',
    padding: '30px',
    minWidth: '300px',
    maxWidth: '500px',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
    pointerEvents: 'auto' as const,
  },
  emotionLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  emotionName: {
    fontSize: '28px',
    fontWeight: '600',
    letterSpacing: '2px',
  },
  intensity: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  description: {
    fontSize: '16px',
    lineHeight: '1.5',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: '15px',
  },
  tapPattern: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: '20px',
  },
  buttonRow: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
  },
  nextButton: {
    background: 'rgba(100, 100, 255, 0.3)',
    border: '1px solid rgba(100, 100, 255, 0.5)',
    color: '#fff',
    padding: '10px 25px',
    fontSize: '14px',
    borderRadius: '20px',
    cursor: 'pointer',
    flex: 1,
  },
  resetButton: {
    background: 'rgba(255, 100, 100, 0.2)',
    border: '1px solid rgba(255, 100, 100, 0.4)',
    color: '#fff',
    padding: '10px 25px',
    fontSize: '14px',
    borderRadius: '20px',
    cursor: 'pointer',
  },
};
