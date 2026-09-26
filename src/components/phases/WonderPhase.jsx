import React, { useState, useEffect } from 'react';
import { ArrowRight, Box, Sparkles, Check, AlertTriangle, Layers } from 'lucide-react';
import Mascot from '../Mascot';
import { wonderNarration } from '../../utils/narration';
import { narrate, playSound } from '../../utils/audio';

const VALID_BOX_SIZES = [2, 3, 4, 6, 7, 12, 14, 21, 28, 42];

export default function WonderPhase({ onNext, audioEnabled }) {
  const [boxSize, setBoxSize] = useState(6);
  const [testedFactors, setTestedFactors] = useState([6]);

  const totalCookies = 84;
  const numBoxes = Math.floor(totalCookies / boxSize);
  const remainder = totalCookies % boxSize;
  const isExactFit = remainder === 0;

  useEffect(() => {
    narrate(wonderNarration(), audioEnabled);
  }, [audioEnabled]);

  const handleTestBoxSize = (size) => {
    playSound('click');
    setBoxSize(size);
    if (!testedFactors.includes(size)) {
      setTestedFactors((prev) => [...prev, size]);
    }
  };

  return (
    <div className="phase-container wonder-phase">
      <div className="glass-card phase-card">
        {/* Header */}
        <div className="phase-header">
          <span className="phase-tag">PHASE 1 — WONDER</span>
          <h2>The Cairo Baker's Cookie Mystery</h2>
        </div>

        <div className="wonder-content-grid">
          {/* Visual Simulation Panel: Cookie Packing Tray */}
          <div className="wonder-visual-panel">
            <div className="cookie-bakery-stage">
              <div className="bakery-header-bar">
                <span className="bakery-label">🍪 Cairo Sweet Bakery — 84 Fresh Cookies</span>
                <span className={`packing-status-badge ${isExactFit ? 'fit-perfect' : 'fit-leftover'}`}>
                  {isExactFit ? '✓ Zero Leftover! (Valid Factor)' : `⚠️ ${remainder} cookies left over!`}
                </span>
              </div>

              {/* Dynamic Cookie Box Display */}
              <div className="boxes-display-grid">
                {Array.from({ length: Math.min(numBoxes, 14) }).map((_, bIdx) => (
                  <div key={bIdx} className="cookie-box-item">
                    <div className="box-tag">Box {bIdx + 1}</div>
                    <div className="box-cookies-wrap">
                      {Array.from({ length: Math.min(boxSize, 12) }).map((_, cIdx) => (
                        <span key={cIdx} className="cookie-dot" title="Cookie">
                          🍪
                        </span>
                      ))}
                      {boxSize > 12 && <span className="more-cookies-indicator">+{boxSize - 12}</span>}
                    </div>
                  </div>
                ))}
                {numBoxes > 14 && (
                  <div className="cookie-box-more">
                    +{numBoxes - 14} more boxes
                  </div>
                )}
              </div>

              {/* Leftover crumbs indicator */}
              {remainder > 0 && (
                <div className="leftover-crumbs-tray">
                  <AlertTriangle size={16} />
                  <span>Leftover on baker's table: {remainder} cookies cannot make a full box of {boxSize}!</span>
                </div>
              )}
            </div>

            {/* Box Size Picker Buttons */}
            <div className="box-size-controls">
              <span className="control-label">Test Box Size (Cookies per box):</span>
              <div className="box-size-buttons">
                {[2, 3, 4, 5, 6, 7, 8, 9, 12, 14].map((size) => {
                  const isValid = totalCookies % size === 0;
                  const isSelected = boxSize === size;
                  return (
                    <button
                      key={size}
                      className={`btn-test-size ${isSelected ? 'selected' : ''} ${
                        testedFactors.includes(size) ? (isValid ? 'tested-valid' : 'tested-invalid') : ''
                      }`}
                      onClick={() => handleTestBoxSize(size)}
                    >
                      <span>{size}</span>
                      {isValid ? <Check size={12} className="size-check" /> : null}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Text and Sift Guidance Panel */}
          <div className="wonder-text-panel">
            <Mascot mood="curious" size="medium" />

            <div className="wonder-narrative">
              <p>
                A baker in Cairo has <strong>84 cookies</strong>. She wants to pack them into equal boxes, with more than 1 cookie per box, and none left over.
              </p>
              <p className="highlight-text">
                How many different box sizes could she use?
              </p>
            </div>

            {/* Readout of current calculation */}
            <div className="wonder-math-readout">
              <div className="math-pill">
                <span>84 ÷ {boxSize} = <strong>{numBoxes} boxes</strong></span>
                <span className="remainder-text">{remainder > 0 ? ` (+${remainder} left)` : ' (0 left over!)'}</span>
              </div>
            </div>

            <div className="wonder-discovered-factors">
              <span className="factors-label">Discovered Box Sizes (Factors of 84):</span>
              <div className="factors-chips-row">
                {testedFactors
                  .filter((s) => totalCookies % s === 0)
                  .sort((a, b) => a - b)
                  .map((f) => (
                    <span key={f} className="discovered-chip">
                      {f} cookies/box
                    </span>
                  ))}
              </div>
            </div>

            <button className="btn btn-primary next-phase-btn" onClick={onNext}>
              <span>Enter Detective Story</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
