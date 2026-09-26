import React from 'react';
import { CheckCircle2, XCircle, ArrowRight, Zap, Sparkles } from 'lucide-react';
import Mascot from '../Mascot';

export default function FeedbackOverlay({
  isCorrect,
  explanation,
  xpEarned = 0,
  onContinue,
}) {
  return (
    <div className="feedback-backdrop" onClick={onContinue}>
      <div
        className={`feedback-modal ${isCorrect ? 'modal-correct' : 'modal-incorrect'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="feedback-header-row">
          <Mascot mood={isCorrect ? 'celebrating' : 'thinking'} size="small" />
          <div className="feedback-status-title">
            {isCorrect ? (
              <div className="status-badge-correct">
                <CheckCircle2 size={24} />
                <span>Case Solved! Detective Work Verified!</span>
              </div>
            ) : (
              <div className="status-badge-incorrect">
                <XCircle size={24} />
                <span>Case Clue Solution</span>
              </div>
            )}
          </div>
        </div>

        {isCorrect && xpEarned > 0 && (
          <div className="feedback-xp-callout">
            <Zap size={22} className="xp-lightning" />
            <span className="xp-amount">+{xpEarned} XP</span>
            <span className="xp-sub">Clue Solved!</span>
          </div>
        )}

        <div className="feedback-explanation-body">
          <h4>💡 Detective Explanation:</h4>
          <p>{explanation}</p>
        </div>

        <button className="btn btn-primary feedback-continue-btn" onClick={onContinue} autoFocus>
          <span>Continue Investigation</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
