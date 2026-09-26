import React, { useState, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, Home } from 'lucide-react';
import FloatingNumbers from './components/FloatingNumbers';
import JourneyBar from './components/JourneyBar';
import IntroScreen from './components/IntroScreen';
import WonderPhase from './components/phases/WonderPhase';
import StoryPhase from './components/phases/StoryPhase';
import SimulatePhase from './components/phases/SimulatePhase';
import PracticePhase from './components/phases/PracticePhase';
import ReflectPhase from './components/phases/ReflectPhase';
import { checkBadges } from './utils/badgeEngine';
import { stopNarration, playSound } from './utils/audio';

const STORAGE_KEY = 'intellia_factors_primes_v1';

export default function App() {
  const [phase, setPhase] = useState('intro');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [worldScores, setWorldScores] = useState(Array(10).fill(null));
  const [unlockedBadges, setUnlockedBadges] = useState([]);
  const [stationCPerfect, setStationCPerfect] = useState(false);
  const [primesIdentifiedCorrectly, setPrimesIdentifiedCorrectly] = useState(0);

  const [phaseComplete, setPhaseComplete] = useState({
    wonder: false,
    story: false,
    simulate: false,
    practice: false,
    reflect: false,
  });

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.timestamp && Date.now() - parsed.timestamp < 86400000) {
          if (parsed.phase) setPhase(parsed.phase);
          if (parsed.xp) setXp(parsed.xp);
          if (parsed.streak) setStreak(parsed.streak);
          if (parsed.maxStreak) setMaxStreak(parsed.maxStreak);
          if (parsed.worldScores) setWorldScores(parsed.worldScores);
          if (parsed.unlockedBadges) setUnlockedBadges(parsed.unlockedBadges);
          if (parsed.phaseComplete) setPhaseComplete(parsed.phaseComplete);
        }
      }
    } catch (e) {
      console.warn('Session restore failed:', e);
    }
  }, []);

  // Save session state on change
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          phase,
          xp,
          streak,
          maxStreak,
          worldScores,
          unlockedBadges,
          phaseComplete,
          timestamp: Date.now(),
        })
      );
    } catch (e) {
      console.warn('Session save failed:', e);
    }
  }, [phase, xp, streak, maxStreak, worldScores, unlockedBadges, phaseComplete]);

  // Check and unlock badges automatically whenever game state updates
  useEffect(() => {
    const currentState = {
      phaseComplete,
      simStationsComplete: [phaseComplete.simulate, phaseComplete.simulate, phaseComplete.simulate],
      worldScores: worldScores.map((s) => s || 0),
      maxStreak,
      badges: unlockedBadges,
      stationCPerfect,
      primesIdentifiedCorrectly,
    };
    const newBadges = checkBadges(currentState);
    if (newBadges.length > 0) {
      playSound('fanfare');
      setUnlockedBadges((prev) => [...prev, ...newBadges]);
    }
  }, [phaseComplete, worldScores, maxStreak, stationCPerfect, primesIdentifiedCorrectly, unlockedBadges]);

  const toggleAudio = useCallback(() => {
    playSound('click');
    setAudioEnabled((prev) => {
      if (prev) stopNarration();
      return !prev;
    });
  }, []);

  const goHome = useCallback(() => {
    playSound('click');
    stopNarration();
    setPhase('intro');
  }, []);

  const handleNextPhase = (nextPhaseName) => {
    playSound('click');
    stopNarration();

    // Mark completed phase
    if (phase === 'wonder') setPhaseComplete((p) => ({ ...p, wonder: true }));
    if (phase === 'story') setPhaseComplete((p) => ({ ...p, story: true }));
    if (phase === 'simulate') setPhaseComplete((p) => ({ ...p, simulate: true }));
    if (phase === 'practice') setPhaseComplete((p) => ({ ...p, practice: true }));
    if (phase === 'reflect') setPhaseComplete((p) => ({ ...p, reflect: true }));

    setPhase(nextPhaseName);
  };

  return (
    <div className="app-container">
      <FloatingNumbers />

      {/* Top Header Buttons */}
      {phase !== 'intro' && (
        <button className="home-btn" onClick={goHome} title="Return to Intro">
          <Home size={18} />
          <span>Home</span>
        </button>
      )}

      <button
        className="audio-toggle-btn"
        onClick={toggleAudio}
        title={audioEnabled ? 'Mute Audio Narration' : 'Unmute Audio Narration'}
      >
        {audioEnabled ? <Volume2 size={20} color="#ffc107" /> : <VolumeX size={20} color="#ef5350" />}
      </button>

      {/* Journey Bar */}
      <JourneyBar
        currentPhase={phase}
        onSelectPhase={(selectedPhase) => {
          playSound('click');
          setPhase(selectedPhase);
        }}
        completedPhases={phaseComplete}
      />

      {/* Main Content Stage */}
      <main className="main-stage">
        {phase === 'intro' && (
          <IntroScreen
            onStart={() => {
              playSound('click');
              setPhase('wonder');
            }}
            onSelectPhase={(targetPhase) => {
              playSound('click');
              setPhase(targetPhase);
            }}
          />
        )}

        {phase === 'wonder' && (
          <WonderPhase
            audioEnabled={audioEnabled}
            onNext={() => handleNextPhase('story')}
          />
        )}

        {phase === 'story' && (
          <StoryPhase
            audioEnabled={audioEnabled}
            onNext={() => handleNextPhase('simulate')}
          />
        )}

        {phase === 'simulate' && (
          <SimulatePhase
            audioEnabled={audioEnabled}
            onNext={() => handleNextPhase('practice')}
            onSimulationsComplete={() => {
              setPhaseComplete((p) => ({ ...p, simulate: true }));
            }}
            onStationCPerfect={() => {
              setStationCPerfect(true);
            }}
          />
        )}

        {phase === 'practice' && (
          <PracticePhase
            audioEnabled={audioEnabled}
            onNext={() => handleNextPhase('reflect')}
            xp={xp}
            setXp={setXp}
            streak={streak}
            setStreak={setStreak}
            maxStreak={maxStreak}
            setMaxStreak={setMaxStreak}
            worldScores={worldScores}
            setWorldScores={setWorldScores}
            onPrimeIdentified={() => setPrimesIdentifiedCorrectly((prev) => prev + 1)}
          />
        )}

        {phase === 'reflect' && (
          <ReflectPhase
            audioEnabled={audioEnabled}
            onRestart={() => {
              playSound('click');
              setPhase('intro');
            }}
            xp={xp}
            worldScores={worldScores}
            unlockedBadges={unlockedBadges}
          />
        )}
      </main>
    </div>
  );
}
