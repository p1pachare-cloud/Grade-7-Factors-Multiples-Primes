import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, MapPin, Maximize2, X, Image as ImageIcon, Box } from 'lucide-react';
import ArrayGrid from '../shared/ArrayGrid';
import FactorTree from '../shared/FactorTree';
import { STORY_PANELS } from '../../data/storyContent';
import { getStoryNarration } from '../../utils/narration';
import { narrate, playSound } from '../../utils/audio';

export default function StoryPhase({ onNext, audioEnabled }) {
  const [panelIndex, setPanelIndex] = useState(0);
  const [viewMode, setViewMode] = useState('image'); // 'image' | 'interactive'
  const [isZoomed, setIsZoomed] = useState(false);
  const [imgError, setImgError] = useState(false);

  const panel = STORY_PANELS[panelIndex];
  const hasInteractive =
    panel.visualType === 'commonFactors' ||
    panel.visualType === 'mangoArray' ||
    panel.visualType === 'primeArray' ||
    panel.visualType === 'factorTree';

  useEffect(() => {
    setImgError(false);
    narrate(getStoryNarration(panelIndex), audioEnabled);
  }, [panelIndex, audioEnabled]);

  const handleNextPanel = () => {
    playSound('click');
    if (panelIndex < STORY_PANELS.length - 1) {
      setPanelIndex((prev) => prev + 1);
    } else {
      onNext();
    }
  };

  const handlePrevPanel = () => {
    playSound('click');
    if (panelIndex > 0) {
      setPanelIndex((prev) => prev - 1);
    }
  };

  // Sample static tree node for panel 5
  const sampleTree72 = {
    id: 'p5_root',
    value: 72,
    children: [
      {
        id: 'p5_c1',
        value: 8,
        children: [
          {
            id: 'p5_c11',
            value: 2,
            children: null,
          },
          {
            id: 'p5_c12',
            value: 4,
            children: [
              { id: 'p5_c121', value: 2, children: null },
              { id: 'p5_c122', value: 2, children: null },
            ],
          },
        ],
      },
      {
        id: 'p5_c2',
        value: 9,
        children: [
          { id: 'p5_c21', value: 3, children: null },
          { id: 'p5_c22', value: 3, children: null },
        ],
      },
    ],
  };

  return (
    <div className="phase-container story-phase-container">
      {/* Central Story Card matching reference screenshot */}
      <div className="story-frame-card">
        {/* Left Column: Image Space */}
        <div className="story-frame-image-col">
          {/* Location Badge on Top Left */}
          <div className="story-frame-location-pill">
            <span className="location-pin-icon">📍</span>
            <span>{panel.location}</span>
          </div>

          {/* Interactive model toggle if available */}
          {hasInteractive && (
            <div className="story-frame-model-toggle">
              <button
                className={`model-toggle-pill ${viewMode === 'image' ? 'active' : ''}`}
                onClick={() => {
                  playSound('click');
                  setViewMode('image');
                }}
                title="View Illustrated Scene"
              >
                <ImageIcon size={13} />
                <span>Scene</span>
              </button>
              <button
                className={`model-toggle-pill ${viewMode === 'interactive' ? 'active' : ''}`}
                onClick={() => {
                  playSound('click');
                  setViewMode('interactive');
                }}
                title="View Interactive Math Model"
              >
                <Box size={13} />
                <span>Model</span>
              </button>
            </div>
          )}

          {/* Image Space */}
          <div
            className="story-image-space"
            onClick={() => (viewMode === 'image' && !imgError && panel.image ? setIsZoomed(true) : null)}
          >
            {viewMode === 'interactive' && hasInteractive ? (
              <div className="story-interactive-inner">
                {panel.visualType === 'commonFactors' && (
                  <div className="story-interactive-common-factors">
                    <h4>Common Factors of 84 and 60</h4>
                    <p>Both numbers share factor 12 (84 = 12 × 7 and 60 = 12 × 5)!</p>
                    <ArrayGrid rows={7} cols={12} targetNumber={84} tileSize={18} />
                  </div>
                )}
                {panel.visualType === 'mangoArray' && (
                  <div className="story-interactive-mangoes">
                    <h4>Sarah's 6 × 10 Mango Array (Total: 60)</h4>
                    <ArrayGrid rows={6} cols={10} targetNumber={60} tileSize={20} />
                  </div>
                )}
                {panel.visualType === 'primeArray' && (
                  <div className="story-interactive-prime">
                    <h4>Prime 47: Only 1 × 47 Works!</h4>
                    <p>A prime number cannot be formed into any rectangular array with width &gt; 1.</p>
                    <ArrayGrid rows={1} cols={20} targetNumber={47} tileSize={16} maxDisplayCols={20} />
                  </div>
                )}
                {panel.visualType === 'factorTree' && (
                  <div className="story-interactive-tree">
                    <h4>Factor Tree for 72 = 2³ × 3²</h4>
                    <FactorTree node={sampleTree72} />
                  </div>
                )}
              </div>
            ) : panel.image && !imgError ? (
              <>
                <img
                  src={panel.image}
                  alt={panel.title}
                  className="story-frame-img"
                  onError={() => setImgError(true)}
                  loading="eager"
                />
                <button
                  className="story-frame-zoom-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsZoomed(true);
                  }}
                  title="Expand image"
                  aria-label="Expand image"
                >
                  <Maximize2 size={16} />
                </button>
              </>
            ) : (
              <div className="story-image-placeholder">
                <div className="placeholder-icon-wrap">
                  <ImageIcon size={44} />
                </div>
                <span className="placeholder-title">Scene Image Space</span>
                <span className="placeholder-subtitle">
                  {panel.landmark} — {panel.location}
                </span>
                <span className="placeholder-tag">Panel {panel.id} of {STORY_PANELS.length}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Story Content */}
        <div className="story-frame-content-col">
          <div className="story-frame-top-content">
            {/* Title with Emoji matching screenshot */}
            <h1 className="story-frame-headline">
              {panel.headline || panel.title} 🔍
            </h1>

            {/* Main story narrative text */}
            <p className="story-frame-narrative">
              {panel.narrationText}
            </p>

            {/* Golden Rounded Callout Pill matching screenshot */}
            <div className="story-golden-pill-card">
              <span className="golden-pill-icon">💡</span>
              <span className="golden-pill-text">{panel.callout || panel.detailText}</span>
            </div>
          </div>

          {/* Bottom Navigation Controls Bar matching screenshot */}
          <div className="story-frame-bottom-bar">
            {/* Prev button */}
            <button
              className="story-pill-nav-btn prev-btn"
              onClick={handlePrevPanel}
              disabled={panelIndex === 0}
            >
              ← Prev
            </button>

            {/* Center dots with active pill & 1 / 6 counter */}
            <div className="story-pill-progress-wrap">
              <div className="story-pill-dots-row">
                {STORY_PANELS.map((p, idx) => (
                  <button
                    key={p.id}
                    className={`story-pill-dot ${idx === panelIndex ? 'active-pill' : 'inactive-dot'}`}
                    onClick={() => {
                      playSound('click');
                      setPanelIndex(idx);
                    }}
                    title={`Jump to Panel ${idx + 1}`}
                    aria-label={`Panel ${idx + 1}`}
                  />
                ))}
              </div>
              <span className="story-pill-counter">
                {panelIndex + 1} / {STORY_PANELS.length}
              </span>
            </div>

            {/* Next button */}
            <button
              className="story-pill-nav-btn next-btn"
              onClick={handleNextPanel}
            >
              {panelIndex === STORY_PANELS.length - 1 ? 'Enter Simulation →' : 'Next Panel →'}
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isZoomed && (
        <div className="story-lightbox-backdrop" onClick={() => setIsZoomed(false)}>
          <div className="story-lightbox-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="story-lightbox-close"
              onClick={() => setIsZoomed(false)}
              aria-label="Close zoomed image"
            >
              <X size={24} />
            </button>
            <img src={panel.image} alt={panel.title} className="story-lightbox-img" />
            <div className="story-lightbox-caption">
              <h3>{panel.title} — {panel.location}</h3>
              <p className="lightbox-main-text">{panel.narrationText}</p>
              <p className="lightbox-detail-text">{panel.callout || panel.detailText}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
