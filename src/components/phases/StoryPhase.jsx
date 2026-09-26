import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, MapPin, Sparkles, Maximize2, X, Image as ImageIcon, Box } from 'lucide-react';
import Mascot from '../Mascot';
import ArrayGrid from '../shared/ArrayGrid';
import FactorTree from '../shared/FactorTree';
import { STORY_PANELS } from '../../data/storyContent';
import { getStoryNarration } from '../../utils/narration';
import { narrate, playSound } from '../../utils/audio';

export default function StoryPhase({ onNext, audioEnabled }) {
  const [panelIndex, setPanelIndex] = useState(0);
  const [viewMode, setViewMode] = useState('image'); // 'image' | 'interactive'
  const [isZoomed, setIsZoomed] = useState(false);

  const panel = STORY_PANELS[panelIndex];
  const hasInteractive =
    panel.visualType === 'commonFactors' ||
    panel.visualType === 'mangoArray' ||
    panel.visualType === 'primeArray' ||
    panel.visualType === 'factorTree';

  useEffect(() => {
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
    <div className="phase-container story-phase">
      <div className="glass-card phase-card">
        {/* Header */}
        <div className="phase-header">
          <div className="phase-header-left">
            <span className="phase-tag">PHASE 2 — STORY</span>
            <h2>The Global Prime Detective Agency</h2>
          </div>
          <div className="panel-dots">
            {STORY_PANELS.map((p, idx) => (
              <button
                key={p.id}
                className={`panel-dot ${idx === panelIndex ? 'active' : ''}`}
                onClick={() => {
                  playSound('click');
                  setPanelIndex(idx);
                }}
                title={`Panel ${idx + 1}: ${p.title}`}
                aria-label={`Panel ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Content Wrapper */}
        <div className="story-content-wrapper">
          {/* Visual Card */}
          <div className="story-visual-card">
            <div className="story-card-top-bar">
              <div className="story-location-badge">
                <MapPin size={16} />
                <span>{panel.location}</span>
              </div>

              {hasInteractive && (
                <div className="story-view-toggle">
                  <button
                    className={`story-toggle-btn ${viewMode === 'image' ? 'active' : ''}`}
                    onClick={() => {
                      playSound('click');
                      setViewMode('image');
                    }}
                    title="View Illustrated Scene"
                  >
                    <ImageIcon size={14} />
                    <span>Story Art</span>
                  </button>
                  <button
                    className={`story-toggle-btn ${viewMode === 'interactive' ? 'active' : ''}`}
                    onClick={() => {
                      playSound('click');
                      setViewMode('interactive');
                    }}
                    title="View Interactive Math Model"
                  >
                    <Box size={14} />
                    <span>Math Model</span>
                  </button>
                </div>
              )}
            </div>

            <div className="visual-graphic-container">
              {viewMode === 'image' || !hasInteractive ? (
                <div className="story-image-wrapper" onClick={() => setIsZoomed(true)}>
                  <img
                    src={panel.image}
                    alt={panel.title}
                    className="story-panel-img"
                    loading="eager"
                  />
                  <button
                    className="story-zoom-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsZoomed(true);
                    }}
                    title="Expand image"
                    aria-label="Expand image"
                  >
                    <Maximize2 size={16} />
                  </button>
                  <div className="story-badge-overlay">{panel.badge}</div>
                </div>
              ) : (
                <div className="story-interactive-wrapper">
                  {panel.visualType === 'commonFactors' && (
                    <div className="story-interactive-common-factors">
                      <h4>Common Factors of 84 and 60</h4>
                      <p>Both numbers share the factor 12 (84 = 12 × 7 and 60 = 12 × 5)!</p>
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
              )}
            </div>
          </div>

          {/* Narrative Card */}
          <div className="story-narrative-card">
            <div className="character-header">
              <Mascot mood={panelIndex === 5 ? 'celebrating' : 'happy'} size="small" />
              <div>
                <h3 className="character-name">{panel.character}</h3>
                <span className="character-title">{panel.title}</span>
              </div>
            </div>

            <p className="story-main-text">{panel.narrationText}</p>
            <p className="story-detail-text">{panel.detailText}</p>

            <div className="story-nav-buttons">
              <button
                className="btn btn-outline btn-sm"
                onClick={handlePrevPanel}
                disabled={panelIndex === 0}
              >
                <ArrowLeft size={18} />
                <span>Previous</span>
              </button>

              <button className="btn btn-primary btn-sm" onClick={handleNextPanel}>
                <span>{panelIndex === STORY_PANELS.length - 1 ? 'Enter Simulation' : 'Next Panel'}</span>
                {panelIndex === STORY_PANELS.length - 1 ? <Sparkles size={18} /> : <ArrowRight size={18} />}
              </button>
            </div>
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
              <p>{panel.narrationText}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
