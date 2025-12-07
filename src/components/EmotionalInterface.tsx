'use client';

import { useState, useEffect, useRef } from 'react';
import { analyzeArchetype, Archetype } from '@/data/archetypes30';
import { getAudioManager } from '@/audio/audioManager';

interface TapData {
  x: number;
  y: number;
  duration: number;
  timestamp: number;
}

interface Props {
  onTap: (x: number, y: number, duration: number) => void;
}

const QUESTIONS = [
  "What scares you most about tomorrow?",
  "When was the last time you felt truly alive?",
  "What part of yourself do you hide from others?",
  "If no one was watching, who would you become?",
  "What truth are you avoiding right now?",
];

const INTRO_SLIDES = [
  {
    title: "Curiosity Nexus",
    text: "An exploration of who you are through touch.",
  },
  {
    title: "How it works",
    text: "A question will flash for 3 seconds.",
  },
  {
    title: "Your response",
    text: "When it disappears, tap anywhere on the screen.",
  },
  {
    title: "Express yourself",
    text: "Tap up to 100 times - fast, slow, hold, or quick taps.",
  },
  {
    title: "Feel, don't think",
    text: "Let your emotions guide WHERE and HOW you tap.",
  },
  {
    title: "Repeat",
    text: "You'll respond to 5 questions total.",
  },
  {
    title: "What I analyze",
    text: "Not your answers - but how you touch.\nThe rhythm, pressure, and position.",
  },
  {
    title: "Ready?",
    text: "Your archetype awaits in the pattern of your interaction.",
  },
];

export default function EmotionalInterface({ onTap }: Props) {
  const [introSlideIndex, setIntroSlideIndex] = useState(0);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [collectingTaps, setCollectingTaps] = useState(false);
  const [tapData, setTapData] = useState<TapData[][]>([[], [], [], [], []]);
  const [currentQuestionTaps, setCurrentQuestionTaps] = useState<TapData[]>([]);
  const [finalArchetype, setFinalArchetype] = useState<Archetype | null>(null);
  const [showArchetypeReveal, setShowArchetypeReveal] = useState(false);

  const tapStartTimeRef = useRef<number>(0);
  const questionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioManager = useRef(getAudioManager());

  const FLASH_DURATION = 3500; // 3.5 seconds
  const MAX_TAPS_PER_QUESTION = 100;
  const TOTAL_QUESTIONS = 5;

  // Start session
  const startSession = () => {
    setSessionStarted(true);
    setCurrentQuestionIndex(0);
    setTapData([[], [], [], [], []]);
    setCurrentQuestionTaps([]);
    setFinalArchetype(null);
    setShowArchetypeReveal(false);
    showNextQuestion();
  };

  // Show question for 3.5 seconds then hide
  const showNextQuestion = () => {
    setShowQuestion(true);
    setCollectingTaps(false);
    setCurrentQuestionTaps([]);

    questionTimerRef.current = setTimeout(() => {
      setShowQuestion(false);
      setCollectingTaps(true);
    }, FLASH_DURATION);
  };

  // Handle tap down
  const handleTapStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!collectingTaps) return;
    tapStartTimeRef.current = Date.now();
  };

  // Handle tap release
  const handleTapEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!collectingTaps || currentQuestionTaps.length >= MAX_TAPS_PER_QUESTION) return;

    const duration = Date.now() - tapStartTimeRef.current;
    let x: number, y: number;

    if ('touches' in e) {
      const touch = e.changedTouches[0];
      x = touch.clientX / window.innerWidth;
      y = touch.clientY / window.innerHeight;
    } else {
      x = e.clientX / window.innerWidth;
      y = e.clientY / window.innerHeight;
    }

    const newTap: TapData = {
      x,
      y,
      duration,
      timestamp: Date.now(),
    };

    const updatedTaps = [...currentQuestionTaps, newTap];
    setCurrentQuestionTaps(updatedTaps);

    // Call parent's onTap for visual feedback
    onTap(x, y, duration);

    // If we've reached 100 taps, move to next question
    if (updatedTaps.length >= MAX_TAPS_PER_QUESTION) {
      advanceToNextQuestion(updatedTaps);
    }
  };

  // Advance to next question or finish
  const advanceToNextQuestion = (taps: TapData[]) => {
    // Save current question's taps
    const newTapData = [...tapData];
    newTapData[currentQuestionIndex] = taps;
    setTapData(newTapData);

    if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCollectingTaps(false);
      setTimeout(() => {
        showNextQuestion();
      }, 500);
    } else {
      // All questions complete - analyze
      analyzeAllData(newTapData);
    }
  };

  // Analyze all tap data
  const analyzeAllData = (allTaps: TapData[][]) => {
    setCollectingTaps(false);

    // Flatten all taps into one array
    const flatTaps = allTaps.flat();

    // Run analysis
    const archetype = analyzeArchetype(flatTaps);
    setFinalArchetype(archetype);

    // Show reveal after 2 seconds
    setTimeout(() => {
      setShowArchetypeReveal(true);
    }, 2000);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (questionTimerRef.current) {
        clearTimeout(questionTimerRef.current);
      }
    };
  }, []);

  // Calculate total taps across all questions
  const totalTaps = tapData.reduce((sum, taps) => sum + taps.length, 0) + currentQuestionTaps.length;

  // Welcome screen with slides
  if (!sessionStarted) {
    const currentSlide = INTRO_SLIDES[introSlideIndex];
    const isLastSlide = introSlideIndex === INTRO_SLIDES.length - 1;

    const handleNext = async () => {
      // Enable audio on first user interaction (required for desktop browsers)
      await audioManager.current.resume();

      if (isLastSlide) {
        startSession();
      } else {
        setIntroSlideIndex(introSlideIndex + 1);
      }
    };

    return (
      <div style={styles.overlay}>
        <div style={styles.welcomeCard}>
          <h1 style={styles.title}>{currentSlide.title}</h1>
          <p style={styles.slideText}>
            {currentSlide.text.split('\n').map((line, idx) => (
              <span key={idx}>
                {line}
                {idx < currentSlide.text.split('\n').length - 1 && <br />}
              </span>
            ))}
          </p>

          {/* Progress dots */}
          <div style={styles.slideProgress}>
            {INTRO_SLIDES.map((_, idx) => (
              <div
                key={idx}
                style={{
                  ...styles.slideDot,
                  background: idx === introSlideIndex
                    ? 'rgba(255, 255, 255, 0.9)'
                    : 'rgba(255, 255, 255, 0.2)',
                }}
              />
            ))}
          </div>

          <button onClick={handleNext} style={styles.button}>
            {isLastSlide ? 'Begin Discovery' : 'Next'}
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

          <div style={styles.patternSection}>
            <h3 style={styles.sectionTitle}>Your Patterns</h3>
            <div style={styles.patternGrid}>
              <div style={styles.patternItem}>
                <span style={styles.patternLabel}>Spatial</span>
                <span style={styles.patternValue}>{finalArchetype.spatialPattern}</span>
              </div>
              <div style={styles.patternItem}>
                <span style={styles.patternLabel}>Temporal</span>
                <span style={styles.patternValue}>{finalArchetype.temporalPattern}</span>
              </div>
              <div style={styles.patternItem}>
                <span style={styles.patternLabel}>Energy</span>
                <span style={styles.patternValue}>{finalArchetype.energyPattern}</span>
              </div>
              <div style={styles.patternItem}>
                <span style={styles.patternLabel}>Consistency</span>
                <span style={styles.patternValue}>{finalArchetype.consistencyPattern}</span>
              </div>
            </div>
          </div>

          <div style={styles.statsSection}>
            <p style={styles.statsText}>Analyzed {totalTaps} touch interactions</p>
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

  // Question flash or tap collection screen
  return (
    <div
      style={styles.fullScreenInteraction}
      onMouseDown={handleTapStart}
      onMouseUp={handleTapEnd}
      onTouchStart={handleTapStart}
      onTouchEnd={handleTapEnd}
    >
      {/* Flash question (visible for 3.5 seconds) */}
      {showQuestion && (
        <div style={styles.questionFlash}>
          <div style={styles.questionFlashCard}>
            <span style={styles.questionNumber}>
              Question {currentQuestionIndex + 1} of {TOTAL_QUESTIONS}
            </span>
            <p style={styles.flashQuestionText}>{QUESTIONS[currentQuestionIndex]}</p>
          </div>
        </div>
      )}

      {/* Tap collection UI (minimal, non-intrusive) */}
      {collectingTaps && (
        <div style={styles.tapCollectionUI}>
          {/* Progress indicators - top of screen */}
          <div style={styles.progressBar}>
            {Array.from({ length: TOTAL_QUESTIONS }).map((_, idx) => (
              <div
                key={idx}
                style={{
                  ...styles.progressDot,
                  background:
                    idx < currentQuestionIndex
                      ? 'rgba(100, 200, 255, 0.8)'
                      : idx === currentQuestionIndex
                      ? 'rgba(100, 200, 255, 0.4)'
                      : 'rgba(255, 255, 255, 0.15)',
                }}
              />
            ))}
          </div>

          {/* Tap counter - bottom right corner */}
          <div style={styles.tapCounter}>
            <div style={styles.tapCountCircle}>
              <span style={styles.tapCountNumber}>{currentQuestionTaps.length}</span>
              <span style={styles.tapCountMax}>/ {MAX_TAPS_PER_QUESTION}</span>
            </div>
          </div>
        </div>
      )}

      {/* Analyzing state */}
      {!showQuestion && !collectingTaps && !showArchetypeReveal && (
        <div style={styles.analyzingOverlay}>
          <p style={styles.analyzingText}>Analyzing your patterns...</p>
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
    backdropFilter: 'blur(20px)',
    padding: '20px',
  },
  welcomeCard: {
    background: 'rgba(10, 10, 10, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '24px',
    padding: '60px 50px',
    maxWidth: '500px',
    textAlign: 'center' as const,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
  },
  title: {
    fontSize: '42px',
    fontWeight: '300',
    marginBottom: '24px',
    color: '#fff',
    letterSpacing: '-0.5px',
  },
  slideText: {
    fontSize: '18px',
    lineHeight: '1.7',
    color: 'rgba(255, 255, 255, 0.75)',
    marginBottom: '40px',
    fontWeight: '300',
    minHeight: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slideProgress: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '32px',
  },
  slideDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    transition: 'all 0.3s ease',
  },
  subtitle: {
    fontSize: '16px',
    lineHeight: '1.8',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: '48px',
    fontWeight: '300',
  },
  button: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: '#fff',
    padding: '16px 40px',
    fontSize: '15px',
    borderRadius: '100px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: '400',
    letterSpacing: '0.3px',
  },
  fullScreenInteraction: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 10,
    pointerEvents: 'auto' as const,
  },
  questionFlash: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    pointerEvents: 'none' as const,
    animation: 'fadeIn 0.4s ease',
  },
  questionFlashCard: {
    background: 'rgba(10, 10, 10, 0.75)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '28px',
    padding: '48px 56px',
    maxWidth: '700px',
    textAlign: 'center' as const,
    backdropFilter: 'blur(30px)',
    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.6)',
  },
  questionNumber: {
    fontSize: '10px',
    color: 'rgba(255, 255, 255, 0.4)',
    textTransform: 'uppercase' as const,
    letterSpacing: '2px',
    fontWeight: '500',
    display: 'block',
    marginBottom: '20px',
  },
  flashQuestionText: {
    fontSize: '32px',
    fontWeight: '300',
    color: '#fff',
    lineHeight: '1.4',
    letterSpacing: '-0.5px',
    margin: 0,
  },
  tapCollectionUI: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    pointerEvents: 'none' as const,
    zIndex: 50,
  },
  progressBar: {
    position: 'absolute' as const,
    top: '32px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '10px',
  },
  progressDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    transition: 'all 0.4s ease',
  },
  tapCounter: {
    position: 'absolute' as const,
    bottom: '32px',
    right: '32px',
  },
  tapCountCircle: {
    background: 'rgba(10, 10, 10, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '50%',
    width: '80px',
    height: '80px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(12px)',
  },
  tapCountNumber: {
    fontSize: '24px',
    fontWeight: '300',
    color: '#fff',
    lineHeight: '1',
  },
  tapCountMax: {
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: '4px',
  },
  analyzingOverlay: {
    position: 'fixed' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 100,
  },
  analyzingText: {
    fontSize: '18px',
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '300',
    fontStyle: 'italic',
  },
  archetypeCard: {
    background: 'rgba(10, 10, 10, 0.7)',
    border: '2px solid',
    borderRadius: '28px',
    padding: '56px',
    maxWidth: '720px',
    backdropFilter: 'blur(24px)',
    maxHeight: '90vh',
    overflowY: 'auto' as const,
  },
  archetypeHeader: {
    textAlign: 'center' as const,
    marginBottom: '40px',
    paddingBottom: '32px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  },
  archetypeName: {
    fontSize: '48px',
    fontWeight: '300',
    letterSpacing: '-0.5px',
    marginBottom: '16px',
    textTransform: 'uppercase' as const,
  },
  archetypeEssence: {
    fontSize: '18px',
    fontStyle: 'italic',
    color: 'rgba(255, 255, 255, 0.65)',
    lineHeight: '1.7',
    fontWeight: '300',
  },
  archetypeDescription: {
    fontSize: '16px',
    lineHeight: '1.8',
    color: 'rgba(255, 255, 255, 0.75)',
    marginBottom: '32px',
    fontWeight: '300',
  },
  strengthsSection: {
    marginBottom: '32px',
  },
  sectionTitle: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.45)',
    textTransform: 'uppercase' as const,
    letterSpacing: '1.5px',
    marginBottom: '16px',
    fontWeight: '500',
  },
  strengthsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  strengthItem: {
    fontSize: '15px',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: '12px',
    paddingLeft: '20px',
    position: 'relative' as const,
    lineHeight: '1.6',
    fontWeight: '300',
    '::before': {
      content: '"→"',
      position: 'absolute' as const,
      left: 0,
    },
  },
  shadowSection: {
    marginBottom: '32px',
    padding: '24px',
    background: 'rgba(0, 0, 0, 0.25)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 100, 100, 0.15)',
  },
  shadowText: {
    fontSize: '15px',
    color: 'rgba(255, 140, 140, 0.85)',
    lineHeight: '1.7',
    fontStyle: 'italic',
    fontWeight: '300',
  },
  patternSection: {
    marginBottom: '32px',
  },
  patternGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  patternItem: {
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  patternLabel: {
    fontSize: '10px',
    color: 'rgba(255, 255, 255, 0.4)',
    textTransform: 'uppercase' as const,
    letterSpacing: '1.2px',
    fontWeight: '500',
  },
  patternValue: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '400',
    textTransform: 'capitalize' as const,
  },
  statsSection: {
    marginBottom: '20px',
    textAlign: 'center' as const,
  },
  statsText: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.4)',
    fontWeight: '300',
  },
};
