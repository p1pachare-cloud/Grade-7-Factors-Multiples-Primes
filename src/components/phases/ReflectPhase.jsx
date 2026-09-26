import React, { useState, useEffect } from 'react';
import { Award, Sparkles, CheckCircle2, RotateCcw, Share2 } from 'lucide-react';
import Mascot from '../Mascot';
import { BADGES } from '../../utils/badgeEngine';
import { reflectNarration } from '../../utils/narration';
import { narrate, playSound } from '../../utils/audio';

export default function ReflectPhase({
  onRestart,
  audioEnabled,
  xp,
  worldScores = [],
  unlockedBadges = [],
}) {
  const [reflectionText, setReflectionText] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    narrate(reflectNarration(), audioEnabled);
  }, [audioEnabled]);

  const handleSaveJournal = () => {
    playSound('fanfare');
    setSaved(true);
  };

  const totalCorrect = worldScores.reduce((sum, ws) => sum + (ws || 0), 0);

  return (
    <div className="phase-container reflect-phase">
      <div className="glass-card phase-card">
        <div className="phase-header">
          <span className="phase-tag">PHASE 5 — REFLECT</span>
          <h2>Agency Case Report & Certificate</h2>
        </div>

        <div className="completion-certificate-card glass-card">
          <div className="cert-header">
            <Mascot mood="celebrating" size="large" />
            <div>
              <h1 className="cert-title">Global Prime Detective Champion!</h1>
              <p className="cert-subtitle">Factors, Multiples & Primes — Grade 7 Mathematics</p>
            </div>
          </div>

          <div className="cert-stats-row">
            <div className="cert-stat-box">
              <span className="stat-value">{xp}</span>
              <span className="stat-label">Total XP Earned</span>
            </div>
            <div className="cert-stat-box">
              <span className="stat-value">{totalCorrect}/100</span>
              <span className="stat-label">Case Clues Cracked</span>
            </div>
            <div className="cert-stat-box">
              <span className="stat-value">{unlockedBadges.length}/8</span>
              <span className="stat-label">Agency Badges</span>
            </div>
          </div>

          {/* Badges Panel */}
          <div className="badges-grid-container">
            <h3>🏅 Agency Detective Badges</h3>
            <div className="badges-flex-row">
              {BADGES.map((badge) => {
                const isUnlocked = unlockedBadges.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`badge-chip-card ${isUnlocked ? 'badge-unlocked' : 'badge-locked'}`}
                    title={badge.description}
                  >
                    <span className="badge-icon">{badge.icon}</span>
                    <span className="badge-name">{badge.label.slice(2)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reflect Journal Prompt */}
          <div className="reflection-journal-box">
            <h3>📓 Sift's Detective Journal Prompt</h3>
            <p>
              "If a number were a suspect, what clues (factors) would you look for to prove it is prime? Tell Sift what you discovered today!"
            </p>
            <textarea
              className="journal-textarea"
              rows="4"
              placeholder="Record your prime detective deductions here..."
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
            />
            <div className="journal-actions">
              <button
                className="btn btn-primary btn-sm"
                onClick={handleSaveJournal}
                disabled={!reflectionText.trim()}
              >
                <CheckCircle2 size={16} />
                <span>{saved ? 'Case Journal Saved! ✓' : 'Save Detective Reflection'}</span>
              </button>
            </div>
          </div>

          <div className="reflect-footer-buttons">
            <button className="btn btn-outline" onClick={onRestart}>
              <RotateCcw size={18} />
              <span>Restart Mission</span>
            </button>
            <button className="btn btn-primary" onClick={() => window.print()}>
              <Share2 size={18} />
              <span>Print Agency Certificate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
