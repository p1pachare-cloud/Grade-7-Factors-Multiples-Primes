import React from 'react';
import { HelpCircle, AlertCircle, Lightbulb } from 'lucide-react';

export default function HintOverlay({ hint1, hint2, explanation, attemptCount }) {
  if (attemptCount === 0) return null;

  return (
    <div className="hint-container-card">
      {attemptCount >= 1 && hint1 && (
        <div className="hint-pill hint-level-1">
          <Lightbulb size={18} className="hint-icon" />
          <div>
            <strong>Detective Hint 1:</strong>
            <span> {hint1}</span>
          </div>
        </div>
      )}

      {attemptCount >= 2 && hint2 && (
        <div className="hint-pill hint-level-2">
          <AlertCircle size={18} className="hint-icon" />
          <div>
            <strong>Detective Hint 2:</strong>
            <span> {hint2}</span>
          </div>
        </div>
      )}

      {attemptCount >= 3 && explanation && (
        <div className="hint-pill hint-level-3">
          <HelpCircle size={18} className="hint-icon" />
          <div>
            <strong>Step-by-Step Clue Breakdown:</strong>
            <span> {explanation}</span>
          </div>
        </div>
      )}
    </div>
  );
}
