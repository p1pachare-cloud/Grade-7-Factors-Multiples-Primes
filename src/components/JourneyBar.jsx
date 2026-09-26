import React from 'react';

const JOURNEY_ITEMS = [
  { id: 'wonder', icon: '🔍', label: 'Wonder' },
  { id: 'story', icon: '📖', label: 'Story' },
  { id: 'simulate', icon: '🧪', label: 'Simulate' },
  { id: 'practice', icon: '🎮', label: 'Practice' },
  { id: 'reflect', icon: '📓', label: 'Reflect' },
];

export default function JourneyBar({ currentPhase, onSelectPhase, completedPhases = {} }) {
  if (currentPhase === 'intro') return null;

  const getStepStatus = (phaseId, index) => {
    if (currentPhase === phaseId) return 'active';
    if (completedPhases[phaseId]) return 'completed';
    const currentIndex = JOURNEY_ITEMS.findIndex((item) => item.id === currentPhase);
    if (index < currentIndex) return 'completed';
    return 'locked';
  };

  return (
    <div className="journey-bar" role="navigation" aria-label="Lesson Phase Tracker">
      {JOURNEY_ITEMS.map((item, index) => {
        const status = getStepStatus(item.id, index);
        const isConnectorFilled =
          index > 0 && getStepStatus(JOURNEY_ITEMS[index - 1].id, index - 1) === 'completed';

        return (
          <React.Fragment key={item.id}>
            {index > 0 && (
              <div className={`journey-connector ${isConnectorFilled ? 'filled' : ''}`} />
            )}
            <div
              className={`journey-step ${status}`}
              onClick={() =>
                (status !== 'locked' || completedPhases[item.id]) && onSelectPhase(item.id)
              }
              style={{ cursor: status !== 'locked' || completedPhases[item.id] ? 'pointer' : 'default' }}
              title={`${item.label} (${status})`}
            >
              <div className="journey-step-dot">
                {status === 'completed' ? '✓' : item.icon}
              </div>
              <span className="journey-step-label">{item.label}</span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
