import React from 'react';
import { Star, Lock, MapPin, Briefcase } from 'lucide-react';
import { worlds } from '../../data/questionBank';
import { calcStars, canUnlockWorld } from '../../utils/scoring';

export default function WorldMap({ worldScores = [], currentWorld = 0, onSelectWorld }) {
  return (
    <div className="world-map-wrapper">
      <div className="world-map-header">
        <Briefcase size={20} className="header-case-icon" />
        <h3>Global Detective Case Files (10 Cities)</h3>
      </div>

      <div className="world-scroll-container">
        {worlds.map((world, idx) => {
          const score = worldScores[idx];
          const stars = score !== null && score !== undefined ? calcStars(score) : 0;
          const isUnlocked = idx === 0 || canUnlockWorld(worldScores[idx - 1]);
          const isActive = idx === currentWorld;

          return (
            <div
              key={world.id}
              className={`world-card-chip ${isActive ? 'active-world' : ''} ${
                isUnlocked ? 'unlocked' : 'locked'
              }`}
              onClick={() => isUnlocked && onSelectWorld(idx)}
              role="button"
              tabIndex={isUnlocked ? 0 : -1}
              title={isUnlocked ? `Open ${world.name}` : `Score ≥5/10 in Case ${idx} to unlock`}
            >
              <div className="world-num-badge">Case {idx + 1}</div>
              <div className="world-landmark-title">{world.landmark}</div>
              <div className="world-country-name">{world.country}</div>

              {isUnlocked ? (
                <div className="world-stars-row">
                  {Array.from({ length: 3 }).map((_, s) => (
                    <Star
                      key={s}
                      size={14}
                      className={s < stars ? 'star-filled' : 'star-empty'}
                    />
                  ))}
                  {score !== null && score !== undefined && (
                    <span className="case-score-tag">{score}/10</span>
                  )}
                </div>
              ) : (
                <div className="world-lock-icon">
                  <Lock size={15} />
                  <span>Locked</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
