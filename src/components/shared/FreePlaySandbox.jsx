import React, { useState, useEffect } from 'react';
import { Play, Sparkles, FastForward, Timer } from 'lucide-react';
import Mascot from '../Mascot';

export default function FreePlaySandbox({
  stationTitle,
  mechanicTip,
  onStartRealMission,
  durationSeconds = 15,
  children,
}) {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      onStartRealMission();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onStartRealMission();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onStartRealMission]);

  return (
    <div className="freeplay-sandbox-overlay">
      <div className="freeplay-banner-card glass-card">
        <div className="freeplay-top-bar">
          <div className="freeplay-badge-wrap">
            <span className="freeplay-badge">
              <Sparkles size={16} /> FREE PLAY SANDBOX • NO PRESSURE
            </span>
            <span className="freeplay-countdown">
              <Timer size={16} /> Warm-up: {timeLeft}s remaining
            </span>
          </div>

          <button
            className="btn btn-outline btn-sm btn-skip-sandbox"
            onClick={onStartRealMission}
            title="Skip warm-up and start official round"
          >
            <span>Skip Warm-up & Start</span>
            <FastForward size={16} />
          </button>
        </div>

        <div className="freeplay-guidance-row">
          <Mascot mood="curious" size="small" />
          <div className="freeplay-text">
            <h4>Mess around with the controls!</h4>
            <p>{mechanicTip}</p>
          </div>
        </div>

        <div className="freeplay-interactive-playground">
          {children}
        </div>
      </div>
    </div>
  );
}
