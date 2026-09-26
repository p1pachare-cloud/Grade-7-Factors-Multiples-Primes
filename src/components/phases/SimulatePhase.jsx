import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ArrowRight, CheckCircle, Sparkles, LayoutGrid, GitBranch, Filter } from 'lucide-react';
import FactorArrayStation from '../simulations/FactorArrayStation';
import FactorTreeStation from '../simulations/FactorTreeStation';
import NumberSorterStation from '../simulations/NumberSorterStation';
import Mascot from '../Mascot';

const STATIONS = [
  {
    id: 0,
    name: 'Factor Array Builder',
    tag: 'Station A • Concrete',
    icon: <LayoutGrid size={18} />,
    desc: 'Build physical rectangular tile arrays to uncover real factor pairs!',
  },
  {
    id: 1,
    name: 'Prime Factor Tree Lab',
    tag: 'Station B • Pictorial',
    icon: <GitBranch size={18} />,
    desc: 'Branch composite numbers into smaller factors until all leaves are prime.',
  },
  {
    id: 2,
    name: "Sift's Number Sorter",
    tag: 'Station C • Abstract',
    icon: <Filter size={18} />,
    desc: 'Sieve grid of Eratosthenes, classify Prime/Composite/Neither, test divisibility rules.',
  },
];

export default function SimulatePhase({
  onNext,
  audioEnabled,
  onSimulationsComplete,
  onStationCPerfect,
}) {
  const [stationIdx, setStationIdx] = useState(0);
  const [completedStations, setCompletedStations] = useState([false, false, false]);

  const handleStationComplete = (index) => {
    const updated = [...completedStations];
    updated[index] = true;
    setCompletedStations(updated);

    if (index < 2) {
      setStationIdx(index + 1);
    } else {
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.5 },
        });
      } catch (e) {}
      if (onSimulationsComplete) onSimulationsComplete();
    }
  };

  return (
    <div className="phase-container simulate-phase-curious">
      <div className="glass-card simulate-main-card">
        {/* Phase Top Header */}
        <div className="simulate-phase-top-bar">
          <div className="simulate-title-group">
            <span className="phase-tag">PHASE 3 — SIMULATE</span>
            <h2 className="simulate-main-title">The Prime Detective Laboratory</h2>
            <p className="simulate-tagline">
              Explore concrete tile arrays, pictorial factor trees, and the abstract Sieve of Eratosthenes!
            </p>
          </div>

          {/* Laboratory Station Tabs Hub */}
          <div className="simulate-stations-hub">
            {STATIONS.map((st, i) => {
              const isActive = i === stationIdx;
              const isDone = completedStations[i];
              return (
                <div
                  key={st.id}
                  className={`station-hub-card ${isActive ? 'is-active-station' : ''} ${
                    isDone ? 'is-station-done' : ''
                  }`}
                  onClick={() => setStationIdx(i)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="station-card-icon-row">
                    <span className="station-icon-badge">{st.icon}</span>
                    <span className="station-tag-label">{st.tag}</span>
                    {isDone && <CheckCircle size={16} className="done-check-icon" />}
                  </div>
                  <h4 className="station-hub-name">{st.name}</h4>
                  <p className="station-hub-desc">{st.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Station Workspace */}
        <div className="simulation-active-stage">
          {stationIdx === 0 && (
            <FactorArrayStation
              audioEnabled={audioEnabled}
              onComplete={() => handleStationComplete(0)}
            />
          )}

          {stationIdx === 1 && (
            <FactorTreeStation
              audioEnabled={audioEnabled}
              onComplete={() => handleStationComplete(1)}
            />
          )}

          {stationIdx === 2 && (
            <NumberSorterStation
              audioEnabled={audioEnabled}
              onComplete={() => handleStationComplete(2)}
              onStationCPerfect={onStationCPerfect}
            />
          )}
        </div>

        {/* All Stations Mastered Celebration Banner */}
        {completedStations.every(Boolean) && (
          <div className="simulation-all-complete-banner curious-complete-banner">
            <div className="complete-banner-left">
              <Mascot mood="celebrating" size="medium" />
              <div>
                <h3>🎉 All 3 Detective Stations Mastered!</h3>
                <p>
                  You have conquered Concrete Arrays, Pictorial Factor Trees, and Abstract Sieve Sorting! Ready for the 10-world Practice Phase?
                </p>
              </div>
            </div>
            <button className="btn btn-primary btn-lg btn-enter-practice" onClick={onNext}>
              <span>Enter Practice Phase (100 Challenges)</span>
              <ArrowRight size={22} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
