'use client';

import { useState, useEffect, useRef } from 'react';
import { analyzeArchetype, Archetype } from '@/data/archetypes30';
import { getAudioManager } from '@/audio/audioManager';

interface TapData {
  x: number;
  y: number;
  duration: number;
  timestamp: number;
  intervalSincePrevious?: number; // Time since last tap (reveals rhythm)
  emotionalState?: string; // Which emotional state was active (if any)
  questionIndex?: number; // Which question this was for
  reactionLatency?: number; // Time from collection start to this tap (for first tap only)
}

interface Props {
  onTap: (x: number, y: number, duration: number) => void;
}

const EMOTIONAL_STATES = [
  "Joy",
  "Curiosity",
  "Peace",
  "Excitement",
  "Gratitude",
  "Wonder",
  "Courage",
  "Love",
];

const QUESTIONS = [
  "What brings you the most joy in this moment?",
  "What are you most grateful for today?",
  "What makes you feel most alive?",
  "What dream would you chase if you knew you couldn't fail?",
  "What part of yourself are you most proud of?",
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
    title: "First: Emotional States",
    text: "You'll see emotional words appear.\nTap if you feel moved to - or simply observe.",
  },
  {
    title: "Then: Timed Questions",
    text: "Each question lasts 5 seconds.\nTap as many times as you feel called to.",
  },
  {
    title: "Express yourself",
    text: "Fast, slow, gentle, forceful - there's no right way.\nLet your body speak through touch.",
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
  const [showingEmotionalStates, setShowingEmotionalStates] = useState(false);
  const [currentEmotionalStateIndex, setCurrentEmotionalStateIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [collectingTaps, setCollectingTaps] = useState(false);
  const [collectingEmotionalTaps, setCollectingEmotionalTaps] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(10);
  const [tapData, setTapData] = useState<TapData[][]>([[], [], [], [], []]);
  const [emotionalStateTaps, setEmotionalStateTaps] = useState<TapData[][]>([[], [], [], [], [], [], [], []]);
  const [currentQuestionTaps, setCurrentQuestionTaps] = useState<TapData[]>([]);
  const [currentEmotionalStateTaps, setCurrentEmotionalStateTaps] = useState<TapData[]>([]);
  const [reactionLatencies, setReactionLatencies] = useState<number[]>([]);
  const [finalArchetype, setFinalArchetype] = useState<Archetype | null>(null);
  const [showArchetypeReveal, setShowArchetypeReveal] = useState(false);

  const tapStartTimeRef = useRef<number>(0);
  const questionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const collectionStartTimestampRef = useRef<number>(0);
  const lastTapTimestampRef = useRef<number>(0);
  const audioManager = useRef(getAudioManager());

  const EMOTIONAL_STATE_DURATION = 2500; // 2.5 seconds per state
  const QUESTION_FLASH_DURATION = 3500; // 3.5 seconds
  const COLLECTION_TIME = 5; // 5 seconds to tap
  const TOTAL_QUESTIONS = 5;

  // Start session with emotional states
  const startSession = () => {
    setSessionStarted(true);
    setShowingEmotionalStates(true);
    setCollectingEmotionalTaps(true);
    setCurrentEmotionalStateIndex(0);
    setCurrentQuestionIndex(0);
    setTapData([[], [], [], [], []]);
    setEmotionalStateTaps([[], [], [], [], [], [], [], []]);
    setCurrentQuestionTaps([]);
    setCurrentEmotionalStateTaps([]);
    setReactionLatencies([]);
    setFinalArchetype(null);
    setShowArchetypeReveal(false);
    lastTapTimestampRef.current = 0;
    showNextEmotionalState();
  };

  // Show next emotional state (with index parameter to avoid closure issues)
  const showNextEmotionalState = (index: number = currentEmotionalStateIndex) => {
    if (index >= EMOTIONAL_STATES.length) {
      // All states shown - move to questions
      setShowingEmotionalStates(false);
      setCollectingEmotionalTaps(false);
      setTimeout(() => {
        showNextQuestion();
      }, 500);
      return;
    }

    // Update to current index
    setCurrentEmotionalStateIndex(index);
    setCurrentEmotionalStateTaps([]);

    // Show state for 2.5 seconds, then move to next
    questionTimerRef.current = setTimeout(() => {
      // Save current emotional state's taps
      setEmotionalStateTaps(prev => {
        const newTaps = [...prev];
        newTaps[index] = currentEmotionalStateTaps;
        return newTaps;
      });

      // Move to next state
      showNextEmotionalState(index + 1);
    }, EMOTIONAL_STATE_DURATION);
  };

  // Show question for 3.5 seconds then start 10-second collection
  const showNextQuestion = () => {
    setShowQuestion(true);
    setCollectingTaps(false);
    setCurrentQuestionTaps([]);
    setTimeRemaining(COLLECTION_TIME);

    questionTimerRef.current = setTimeout(() => {
      setShowQuestion(false);
      setCollectingTaps(true);
      // Track when collection starts for reaction latency measurement
      collectionStartTimestampRef.current = Date.now();
      startCollectionTimer();
    }, QUESTION_FLASH_DURATION);
  };

  // Start countdown timer
  const startCollectionTimer = () => {
    setTimeRemaining(COLLECTION_TIME);

    countdownIntervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Time's up - move to next question
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
          }
          // Use a ref to get current taps to avoid closure issues
          setCurrentQuestionTaps(taps => {
            advanceToNextQuestion(taps);
            return taps;
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle tap down
  const handleTapStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!collectingTaps && !collectingEmotionalTaps) return;
    tapStartTimeRef.current = Date.now();
  };

  // Handle tap release
  const handleTapEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!collectingTaps && !collectingEmotionalTaps) return;

    const now = Date.now();
    const duration = now - tapStartTimeRef.current;
    let x: number, y: number;

    if ('touches' in e) {
      const touch = e.changedTouches[0];
      x = touch.clientX / window.innerWidth;
      y = touch.clientY / window.innerHeight;
    } else {
      x = e.clientX / window.innerWidth;
      y = e.clientY / window.innerHeight;
    }

    // Calculate interval since previous tap (reveals rhythm)
    const intervalSincePrevious = lastTapTimestampRef.current > 0
      ? now - lastTapTimestampRef.current
      : undefined;

    const newTap: TapData = {
      x,
      y,
      duration,
      timestamp: now,
      intervalSincePrevious,
    };

    // Add emotional state context if we're in that phase
    if (collectingEmotionalTaps) {
      newTap.emotionalState = EMOTIONAL_STATES[currentEmotionalStateIndex];
      const updatedTaps = [...currentEmotionalStateTaps, newTap];
      setCurrentEmotionalStateTaps(updatedTaps);
    }

    // Add question context and reaction latency if we're in question phase
    if (collectingTaps) {
      newTap.questionIndex = currentQuestionIndex;

      // For FIRST tap of this question, calculate reaction latency
      if (currentQuestionTaps.length === 0) {
        const latency = now - collectionStartTimestampRef.current;
        newTap.reactionLatency = latency;

        // Store reaction latency for this question
        const newLatencies = [...reactionLatencies];
        newLatencies[currentQuestionIndex] = latency;
        setReactionLatencies(newLatencies);
      }

      const updatedTaps = [...currentQuestionTaps, newTap];
      setCurrentQuestionTaps(updatedTaps);
    }

    // Update last tap timestamp for interval calculation
    lastTapTimestampRef.current = now;

    // Call parent's onTap for visual feedback
    onTap(x, y, duration);
  };

  // Advance to next question or finish
  const advanceToNextQuestion = (taps: TapData[]) => {
    // Use functional setState to avoid closure issues
    setCurrentQuestionIndex(prevIndex => {
      // Save current question's taps
      setTapData(prevTapData => {
        const newTapData = [...prevTapData];
        newTapData[prevIndex] = taps;

        if (prevIndex < TOTAL_QUESTIONS - 1) {
          // Move to next question - will happen after this setState
          return newTapData;
        } else {
          // All questions complete - analyze
          analyzeAllData(newTapData);
          return newTapData;
        }
      });

      if (prevIndex < TOTAL_QUESTIONS - 1) {
        // Move to next question
        setCollectingTaps(false);
        setTimeout(() => {
          showNextQuestion();
        }, 500);
        return prevIndex + 1;
      }

      return prevIndex;
    });
  };

  // Analyze spatial patterns in tap distribution
  const analyzeSpatialPatterns = (taps: TapData[]) => {
    if (taps.length < 2) return null;

    // Calculate center of mass
    const centerX = taps.reduce((sum, t) => sum + t.x, 0) / taps.length;
    const centerY = taps.reduce((sum, t) => sum + t.y, 0) / taps.length;

    // Calculate spatial variance (spread)
    const variance = taps.reduce((sum, t) => {
      const dx = t.x - centerX;
      const dy = t.y - centerY;
      return sum + (dx * dx + dy * dy);
    }, 0) / taps.length;
    const spatialEntropy = Math.sqrt(variance);

    // Calculate cluster density (average distance to nearest neighbor)
    let totalNearestDistance = 0;
    taps.forEach((tap, i) => {
      let minDist = Infinity;
      taps.forEach((other, j) => {
        if (i !== j) {
          const dx = tap.x - other.x;
          const dy = tap.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < minDist) minDist = dist;
        }
      });
      totalNearestDistance += minDist;
    });
    const clusterDensity = 1 - (totalNearestDistance / taps.length); // Higher = more clustered

    // Calculate edge vs center preference
    const edgeTaps = taps.filter(t => {
      const distFromCenterX = Math.abs(t.x - 0.5);
      const distFromCenterY = Math.abs(t.y - 0.5);
      return distFromCenterX > 0.3 || distFromCenterY > 0.3; // Outer 40%
    }).length;
    const edgeRatio = edgeTaps / taps.length;

    // Calculate grid-like behavior (check for patterns in coordinates)
    const xCoords = taps.map(t => Math.round(t.x * 10) / 10); // Round to nearest 0.1
    const yCoords = taps.map(t => Math.round(t.y * 10) / 10);
    const uniqueX = new Set(xCoords).size;
    const uniqueY = new Set(yCoords).size;
    const gridScore = 1 - (uniqueX * uniqueY) / (taps.length * taps.length); // Higher = more grid-like

    // Determine pattern type
    let pattern = 'organic';
    if (gridScore > 0.5) pattern = 'systematic-grid';
    else if (clusterDensity > 0.7) pattern = 'comfort-seeking';
    else if (spatialEntropy > 0.3) pattern = 'exploratory';
    else if (edgeRatio > 0.6) pattern = 'boundary-testing';

    return {
      spatialEntropy: Number(spatialEntropy.toFixed(3)),
      clusterDensity: Number(clusterDensity.toFixed(3)),
      edgeRatio: Number(edgeRatio.toFixed(3)),
      gridScore: Number(gridScore.toFixed(3)),
      pattern,
      centerOfMass: {
        x: Number(centerX.toFixed(3)),
        y: Number(centerY.toFixed(3))
      }
    };
  };

  // Analyze all tap data
  const analyzeAllData = (allTaps: TapData[][]) => {
    setCollectingTaps(false);

    // Flatten all taps into one array - include both emotional state AND question taps
    const emotionalTaps = emotionalStateTaps.flat();
    const questionTaps = allTaps.flat();
    const allCombinedTaps = [...emotionalTaps, ...questionTaps];

    // Analyze spatial patterns
    const spatialPatterns = analyzeSpatialPatterns(allCombinedTaps);

    console.log('📊 Analysis Data:', {
      emotionalStateTaps: emotionalTaps.length,
      questionTaps: questionTaps.length,
      total: allCombinedTaps.length,
      reactionLatencies,
      avgLatency: reactionLatencies.length > 0
        ? (reactionLatencies.reduce((a, b) => a + b, 0) / reactionLatencies.length).toFixed(0) + 'ms'
        : 'N/A'
    });

    console.log('🎯 Spatial Patterns:', spatialPatterns);

    // Run analysis on combined dataset
    const archetype = analyzeArchetype(allCombinedTaps);
    setFinalArchetype(archetype);

    // Show reveal after 2 seconds
    setTimeout(() => {
      setShowArchetypeReveal(true);
    }, 2000);
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (questionTimerRef.current) {
        clearTimeout(questionTimerRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
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

          <div style={styles.growthSection}>
            <h3 style={styles.sectionTitle}>Your Growth Edge</h3>
            <p style={styles.growthText}>{finalArchetype.shadowSide}</p>
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

  // Emotional states display (before questions) - minimal top banner
  if (showingEmotionalStates && currentEmotionalStateIndex < EMOTIONAL_STATES.length) {
    const currentState = EMOTIONAL_STATES[currentEmotionalStateIndex];
    // Cycle through warm colors for accent
    const hue = (currentEmotionalStateIndex * 45) % 360;

    return (
      <>
        {/* Fullscreen interaction layer (invisible but captures taps) */}
        <div
          style={styles.fullScreenTapLayer}
          onMouseDown={handleTapStart}
          onMouseUp={handleTapEnd}
          onTouchStart={handleTapStart}
          onTouchEnd={handleTapEnd}
        />

        {/* Minimal top banner */}
        <div style={styles.emotionalStateBanner}>
          <div style={styles.emotionalStateBannerContent}>
            <h1 style={{
              ...styles.emotionalStateTextSmall,
              color: `hsl(${hue}, 80%, 70%)`
            }}>
              {currentState}
            </h1>
            <div style={styles.stateProgress}>
              {Array.from({ length: EMOTIONAL_STATES.length }).map((_, idx) => (
                <div
                  key={idx}
                  style={{
                    ...styles.stateProgressDot,
                    background: idx === currentEmotionalStateIndex
                      ? `hsl(${hue}, 80%, 70%)`
                      : 'rgba(255, 255, 255, 0.15)',
                  }}
                />
              ))}
            </div>
            {currentEmotionalStateTaps.length > 0 && (
              <div style={styles.emotionalTapCountSmall}>
                {currentEmotionalStateTaps.length} {currentEmotionalStateTaps.length === 1 ? 'tap' : 'taps'}
              </div>
            )}
          </div>
        </div>
      </>
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
                      ? 'rgba(255, 200, 100, 0.9)'
                      : idx === currentQuestionIndex
                      ? 'rgba(255, 200, 100, 0.5)'
                      : 'rgba(255, 255, 255, 0.15)',
                }}
              />
            ))}
          </div>

          {/* Timer - bottom right corner */}
          <div style={styles.tapCounter}>
            <div style={styles.tapCountCircle}>
              <span style={styles.tapCountNumber}>{timeRemaining}</span>
              <span style={styles.tapCountMax}>seconds</span>
            </div>
            <div style={styles.tapCountDisplay}>
              {currentQuestionTaps.length} taps
            </div>
          </div>
        </div>
      )}

      {/* Analyzing state */}
      {!showQuestion && !collectingTaps && !showArchetypeReveal && (
        <div style={styles.analyzingOverlay}>
          <p style={styles.analyzingText}>Discovering your unique essence ✨</p>
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
  growthSection: {
    marginBottom: '32px',
    padding: '24px',
    background: 'rgba(255, 200, 100, 0.08)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 200, 100, 0.25)',
  },
  growthText: {
    fontSize: '15px',
    color: 'rgba(255, 220, 150, 0.9)',
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
  emotionalStateOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    transition: 'background 0.5s ease',
  },
  emotionalStateContainer: {
    textAlign: 'center' as const,
  },
  emotionalStateText: {
    fontSize: '96px',
    fontWeight: '200',
    color: '#fff',
    letterSpacing: '8px',
    textTransform: 'uppercase' as const,
    marginBottom: '60px',
  },
  stateProgress: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
  },
  stateProgressDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    transition: 'all 0.3s ease',
  },
  tapCountDisplay: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: '8px',
    textAlign: 'center' as const,
  },
  emotionalTapCount: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: '24px',
    fontStyle: 'italic',
  },
  fullScreenTapLayer: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 5,
    pointerEvents: 'auto' as const,
  },
  emotionalStateBanner: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100vw',
    padding: '24px 32px',
    background: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(8px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    zIndex: 100,
    pointerEvents: 'none' as const,
  },
  emotionalStateBannerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  emotionalStateTextSmall: {
    fontSize: '32px',
    fontWeight: '200',
    letterSpacing: '4px',
    textTransform: 'uppercase' as const,
    margin: 0,
  },
  emotionalTapCountSmall: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.4)',
    fontStyle: 'italic',
  },
};
