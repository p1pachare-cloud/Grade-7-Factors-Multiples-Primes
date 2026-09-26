import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Award, Sparkles, X, ArrowRight, CheckCircle2 } from 'lucide-react';
import Mascot from '../Mascot';
import { playSound } from '../../utils/audio';

export default function SiftChallengeModal({
  isOpen,
  onClose,
  title,
  subtitle,
  badgeName,
  badgeIcon = '🏅',
  children,
  isSolved = false,
  onClaimReward,
}) {
  if (!isOpen) return null;

  const handleClaim = () => {
    playSound('fanfare');
    try {
      confetti({ particleCount: 70, spread: 75, origin: { y: 0.5 } });
    } catch (e) {}
    if (onClaimReward) onClaimReward();
    onClose();
  };

  return (
    <div className="sift-challenge-overlay">
      <div className="sift-challenge-modal glass-card">
        <div className="sift-challenge-header">
          <div className="challenge-tag-group">
            <span className="challenge-badge">
              <Sparkles size={16} /> SIFT'S MASTER CHALLENGE • OPTIONAL BONUS
            </span>
            <h3>{title}</h3>
            <p className="challenge-sub">{subtitle}</p>
          </div>
          <button className="btn-close-modal" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="sift-challenge-body">
          {children}
        </div>

        <div className="sift-challenge-footer">
          <div className="badge-reward-preview">
            <span className="badge-shard-icon">{badgeIcon}</span>
            <div className="badge-shard-info">
              <strong>Reward Shard: {badgeName}</strong>
              <span>Unscored curiosity mastery badge for your detective dossier</span>
            </div>
          </div>

          <div className="challenge-actions">
            {isSolved ? (
              <button className="btn btn-primary btn-claim-shard" onClick={handleClaim}>
                <CheckCircle2 size={18} />
                <span>Claim {badgeName} Shard!</span>
              </button>
            ) : (
              <button className="btn btn-outline" onClick={onClose}>
                <span>Skip For Now</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
