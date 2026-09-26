import React from 'react';
import { Sparkles, Award, ShieldCheck, Compass } from 'lucide-react';
import Mascot from './Mascot';

const PHASE_CARDS = [
  {
    id: 'wonder',
    emoji: '🤔',
    title: 'Wonder',
    subtitle: 'The Cairo Cookie Case!',
  },
  {
    id: 'story',
    emoji: '📖',
    title: 'Story',
    subtitle: 'Global Detective Agency',
  },
  {
    id: 'simulate',
    emoji: '🧪',
    title: 'Simulate',
    subtitle: '3 Detective Stations',
  },
  {
    id: 'practice',
    emoji: '🎮',
    title: 'Practice',
    subtitle: '100 Global Case Files',
  },
  {
    id: 'reflect',
    emoji: '📓',
    title: 'Reflect',
    subtitle: 'Journal & Badge Award',
  },
];

export default function IntroScreen({ onStart, onSelectPhase }) {
  return (
    <div className="intro-screen-layout">
      {/* Top Grade Pill */}
      <div className="grade-badge-pill">
        <span>✨ Grade 7 Math — Number Theory</span>
      </div>

      {/* Main Title & Subtitle */}
      <h1 className="hero-main-title">Factors, Multiples & Primes</h1>
      <h2 className="hero-subtitle">The Global Prime Detective Agency!</h2>

      {/* Mascot Preview */}
      <div style={{ margin: '14px 0 6px', display: 'flex', justifyContent: 'center' }}>
        <Mascot mood="happy" size="large" />
      </div>

      {/* Intro Description Box */}
      <div className="hero-description-box">
        <p>
          Hello, Detective! Sift the Owl and junior detectives across 10 global cities need your help to crack numeric codes using factor arrays, prime factor trees, divisibility rules, and common multiples! 🔍🔢
        </p>
      </div>

      {/* 5 Phase Cards Row */}
      <div className="phase-cards-row">
        {PHASE_CARDS.map((card) => (
          <div
            key={card.id}
            className="home-phase-card"
            onClick={() => (onSelectPhase ? onSelectPhase(card.id) : onStart())}
          >
            <div className="phase-card-emoji">{card.emoji}</div>
            <h3 className="phase-card-title">{card.title}</h3>
            <span className="phase-card-subtitle">{card.subtitle}</span>
          </div>
        ))}
      </div>

      {/* Main CTA Button */}
      <button className="btn-begin-journey" onClick={onStart}>
        <span className="rocket-icon">🚀</span>
        <span>Begin Detective Mission!</span>
      </button>

      {/* Bottom Feature Tags */}
      <div className="bottom-feature-tags">
        <div className="feature-tag-pill">
          <span>🎯 100 Detective Cases</span>
        </div>
        <div className="feature-tag-pill">
          <span>🔢 Arrays & Factor Trees</span>
        </div>
        <div className="feature-tag-pill">
          <span>🏆 8 Unlockable Badges & XP</span>
        </div>
      </div>
    </div>
  );
}
