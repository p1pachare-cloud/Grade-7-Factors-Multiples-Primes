import React from 'react';
import { Sparkles, Check } from 'lucide-react';

export default function ScenarioPicker({
  scenarios = [],
  activeScenarioIdx = 0,
  onSelectScenario,
}) {
  if (!scenarios || scenarios.length < 2) return null;

  return (
    <div className="scenario-picker-container">
      <span className="scenario-picker-label">
        <Sparkles size={14} color="#ffd54f" /> Choose Your Real-World Frame:
      </span>
      <div className="scenario-options-row">
        {scenarios.map((sc, idx) => {
          const isSelected = idx === activeScenarioIdx;
          return (
            <button
              key={idx}
              className={`scenario-choice-card ${isSelected ? 'is-selected' : ''}`}
              onClick={() => onSelectScenario(idx)}
              type="button"
            >
              <span className="scenario-icon">{sc.icon}</span>
              <div className="scenario-info">
                <span className="scenario-title">{sc.title}</span>
                <span className="scenario-sub">{sc.contextShort}</span>
              </div>
              {isSelected && <Check size={16} className="scenario-check" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
