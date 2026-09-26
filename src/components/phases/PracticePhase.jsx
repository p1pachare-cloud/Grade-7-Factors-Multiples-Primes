import React, { useState } from 'react';
import { Flame, Zap, Star, ArrowRight } from 'lucide-react';
import WorldMap from '../quiz/WorldMap';
import QuestionRenderer from '../quiz/QuestionRenderer';
import FeedbackOverlay from '../shared/FeedbackOverlay';
import Mascot from '../Mascot';
import { generateSessionQuestions } from '../../utils/shuffle';
import { questionBank, worlds } from '../../data/questionBank';
import { calcXP, calcStars } from '../../utils/scoring';
import { isPrime } from '../../utils/numberTheory';
import { narrate, playSound } from '../../utils/audio';
import { correctNarration, incorrectNarration } from '../../utils/narration';

export default function PracticePhase({
  onNext,
  audioEnabled,
  xp,
  setXp,
  streak,
  setStreak,
  maxStreak,
  setMaxStreak,
  worldScores,
  setWorldScores,
  onPrimeIdentified,
}) {
  const [questions] = useState(() => generateSessionQuestions(questionBank));
  const [currentWorld, setCurrentWorld] = useState(0);
  const [questionIdxInWorld, setQuestionIdxInWorld] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const [feedback, setFeedback] = useState(null); // { isCorrect, xpEarned, explanation }

  const worldQuestions = questions.slice(currentWorld * 10, (currentWorld + 1) * 10);
  const currentQuestion = worldQuestions[questionIdxInWorld] || worldQuestions[0];

  const handleSelectAnswer = (answer) => {
    const isCorrect = String(answer).trim().toLowerCase() === String(currentQuestion.correctAnswer).trim().toLowerCase();

    if (isCorrect) {
      playSound('correct');
      const xpEarned = calcXP(attemptCount + 1, 0, streak);
      setXp((prev) => prev + xpEarned);

      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);

      const updatedScores = [...worldScores];
      updatedScores[currentWorld] = (updatedScores[currentWorld] || 0) + 1;
      setWorldScores(updatedScores);

      // Check if question was prime related
      if (
        currentQuestion.type === 'prime_or_composite' ||
        (currentQuestion.targetNumber && isPrime(currentQuestion.targetNumber))
      ) {
        if (onPrimeIdentified) onPrimeIdentified();
      }

      narrate(correctNarration(), audioEnabled);
      setFeedback({ isCorrect: true, xpEarned, explanation: currentQuestion.explanation });
    } else {
      playSound('incorrect');
      setStreak(0);
      const nextAttempt = attemptCount + 1;
      setAttemptCount(nextAttempt);

      narrate(incorrectNarration(), audioEnabled);
      if (nextAttempt >= 3) {
        setFeedback({ isCorrect: false, xpEarned: 0, explanation: currentQuestion.explanation });
      }
    }
  };

  const handleContinueFeedback = () => {
    setFeedback(null);
    setAttemptCount(0);

    if (questionIdxInWorld < worldQuestions.length - 1) {
      setQuestionIdxInWorld((prev) => prev + 1);
    } else {
      // Completed world case file
      if (currentWorld < 9) {
        setCurrentWorld((prev) => prev + 1);
        setQuestionIdxInWorld(0);
      } else {
        onNext();
      }
    }
  };

  const currentWorldScore = worldScores[currentWorld] || 0;
  const stars = calcStars(currentWorldScore);

  return (
    <div className="phase-container practice-phase">
      <div className="glass-card phase-card">
        {/* Header Stats Bar */}
        <div className="play-stats-bar">
          <div className="stat-pill xp-pill">
            <Zap size={18} />
            <span>{xp} XP</span>
          </div>

          <div className="stat-pill streak-pill">
            <Flame size={18} className="flame-icon" />
            <span>{streak} Streak</span>
          </div>

          <div className="stat-pill stars-pill">
            <Star size={18} className="star-icon" />
            <span>{stars}/3 Stars (Case {currentWorld + 1})</span>
          </div>
        </div>

        {/* World Map Navigation */}
        <WorldMap
          worldScores={worldScores}
          currentWorld={currentWorld}
          onSelectWorld={(wIdx) => {
            playSound('click');
            setCurrentWorld(wIdx);
            setQuestionIdxInWorld(0);
            setAttemptCount(0);
          }}
        />

        <div className="world-banner">
          <Mascot mood="happy" size="small" />
          <div>
            <h3>{worlds[currentWorld].name}</h3>
            <span>Case Clue {questionIdxInWorld + 1} of 10 • Topic: {worlds[currentWorld].topic}</span>
          </div>
        </div>

        {/* Question Area */}
        <QuestionRenderer
          question={currentQuestion}
          onSelectAnswer={handleSelectAnswer}
          attemptCount={attemptCount}
        />

        {feedback && (
          <FeedbackOverlay
            isCorrect={feedback.isCorrect}
            explanation={feedback.explanation}
            xpEarned={feedback.xpEarned}
            onContinue={handleContinueFeedback}
          />
        )}

        <div className="play-footer-nav">
          <button className="btn btn-outline btn-sm" onClick={onNext}>
            <span>Skip to Reflect Phase</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
