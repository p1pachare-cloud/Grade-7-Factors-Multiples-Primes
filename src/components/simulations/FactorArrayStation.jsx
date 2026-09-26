import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Plus, Minus, Check, Sparkles, BookOpen, AlertCircle, ArrowRight, HelpCircle, Trophy } from 'lucide-react';
import ArrayGrid from '../shared/ArrayGrid';
import Mascot from '../Mascot';
import FreePlaySandbox from '../shared/FreePlaySandbox';
import ScenarioPicker from '../shared/ScenarioPicker';
import SiftChallengeModal from '../shared/SiftChallengeModal';
import { stationANarration } from '../../utils/narration';
import { narrate, playSound } from '../../utils/audio';
import { getRandomReaction } from '../../utils/siftReactions';

const STATION_A_ROUNDS = [
  {
    round: 1,
    targetNumber: 24,
    minPairsToLog: 4,
    scenarios: [
      {
        title: "Cairo Lab Sample Vials",
        contextShort: "Cairo Lab Locker",
        icon: "🧪",
        itemLabel: "sample vials",
        openingStory: "Sift found 24 chemical sample vials in the Cairo lab locker — help arrange them neatly on the shelf with zero gaps or broken vials!",
        whyResolution: "6 vials per shelf across 4 shelves means all 24 fit with zero glass left on the counter!",
      },
      {
        title: "Alexandria Bakery Baklava",
        contextShort: "Bakery Trays",
        icon: "🍯",
        itemLabel: "baklava pieces",
        openingStory: "The master baker has 24 honey baklava pastries to arrange onto equal rectangular baking trays without overlapping!",
        whyResolution: "4 pieces per row across 6 rows bakes all 24 pastries to golden perfection with zero crumbs wasted!",
      },
    ],
    curiousFact: "24 is a highly composite number with 8 total factors: 1, 2, 3, 4, 6, 8, 12, 24!",
  },
  {
    round: 2,
    targetNumber: 36,
    minPairsToLog: 4,
    scenarios: [
      {
        title: "Observatory Solar Panel Grid",
        contextShort: "Solar Roof Cells",
        icon: "☀️",
        itemLabel: "solar cells",
        openingStory: "The high-altitude observatory needs 36 solar cells mounted in a stable rectangular array to power the prime radar!",
        whyResolution: "6 rows of 6 solar panels forms a perfect square grid with balanced voltage across every circuit!",
      },
      {
        title: "Rio Carnival Marching Band",
        contextShort: "Parade Ranks",
        icon: "🎺",
        itemLabel: "brass players",
        openingStory: "36 samba brass players need to march down the Sambadrome in uniform rectangular columns so everyone stays in rhythm!",
        whyResolution: "9 musicians in 4 marching columns ensures sound waves reach both sides of the parade stadium evenly!",
      },
    ],
    curiousFact: "36 is a perfect square! (6 × 6 = 36). Square numbers always have an ODD number of factors.",
  },
  {
    round: 3,
    targetNumber: 60,
    minPairsToLog: 5,
    scenarios: [
      {
        title: "Vaccine Cold-Chain Packs",
        contextShort: "Medical Transport",
        icon: "💉",
        itemLabel: "vaccine doses",
        openingStory: "60 refrigerated vaccine doses must be packed into insulated rectangular containers with no air pockets to keep temperature steady!",
        whyResolution: "12 doses per tray in 5 stacked layers ensures maximum cold retention during long flights!",
      },
      {
        title: "Drone Light-Show Fleet",
        contextShort: "Skyline Drone Swarm",
        icon: "🛸",
        itemLabel: "LED drones",
        openingStory: "Program 60 synchronized aerial drones into rectangular takeoff grids so their flight paths never collide in mid-air!",
        whyResolution: "10 drones across 6 flight corridors gives each drone clearance for smooth synchronized takeoff!",
      },
    ],
    curiousFact: "60 was chosen by ancient Babylonians for timekeeping (60 seconds, 60 minutes) because it has 12 distinct factors!",
  },
  {
    round: 4,
    targetNumber: 47,
    minPairsToLog: 1,
    scenarios: [
      {
        title: "Treasury Unbreakable Gold Bars",
        contextShort: "Vault Pallet",
        icon: "🪙",
        itemLabel: "gold bars",
        openingStory: "Can 47 heavy bullion bars be arranged into any two-dimensional rectangular pallet other than a single line? Test and see!",
        whyResolution: "Because 47 is prime, only a single continuous line of 1 × 47 can ever be formed. Math guarantees it cannot be divided!",
      },
      {
        title: "Relay Race Sprint Lineup",
        contextShort: "Stadium Lanes",
        icon: "🏃",
        itemLabel: "sprinters",
        openingStory: "Try organizing 47 athletes into multi-row marching teams without having an uneven odd runner left out.",
        whyResolution: "Only a single row of 1 × 47 works! 47 is an irreducible prime number with no equal team divisions.",
      },
    ],
    curiousFact: "47 is a PRIME number! No matter what you try, only a single row of 1 × 47 works!",
  },
];

export default function FactorArrayStation({ onComplete, audioEnabled }) {
  const [inSandbox, setInSandbox] = useState(true);
  const [sandboxRows, setSandboxRows] = useState(2);
  const [sandboxCols, setSandboxCols] = useState(6);

  const [roundIdx, setRoundIdx] = useState(0);
  const currentRound = STATION_A_ROUNDS[roundIdx];
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState(0);
  const activeScenario = currentRound.scenarios[selectedScenarioIdx] || currentRound.scenarios[0];

  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(12);
  const [loggedPairs, setLoggedPairs] = useState([]);
  const [discoveredPairs, setDiscoveredPairs] = useState(new Set());
  const [feedback, setFeedback] = useState(null);
  const [siftReaction, setSiftReaction] = useState(null);
  const lastReactionRef = useRef('');

  // Sift's Challenge state
  const [isChallengeOpen, setIsChallengeOpen] = useState(false);
  const [challengePairs, setChallengePairs] = useState([]);
  const [challengeRows, setChallengeRows] = useState(8);
  const [challengeCols, setChallengeCols] = useState(9);
  const [hasClaimedBadge, setHasClaimedBadge] = useState(false);

  // Play narration on round change
  useEffect(() => {
    if (!inSandbox) {
      narrate(stationANarration(), audioEnabled);
    }
  }, [roundIdx, audioEnabled, inSandbox]);

  // Reset dimensions and discovered pairs when round changes
  useEffect(() => {
    setSelectedScenarioIdx(0);
    setLoggedPairs([]);
    setDiscoveredPairs(new Set());
    setFeedback(null);
    setSiftReaction(null);

    const target = currentRound.targetNumber;
    if (target === 24) { setRows(2); setCols(12); }
    else if (target === 36) { setRows(3); setCols(12); }
    else if (target === 60) { setRows(5); setCols(12); }
    else if (target === 47) { setRows(1); setCols(47); }
  }, [roundIdx]);

  const total = rows * cols;
  const isMatch = total === currentRound.targetNumber;

  // Live snap detection
  useEffect(() => {
    if (isMatch) {
      const pairKey = `${Math.min(rows, cols)}×${Math.max(rows, cols)}`;
      if (!discoveredPairs.has(pairKey)) {
        playSound('correct');
        setDiscoveredPairs((prev) => new Set([...prev, pairKey]));
        const reaction = getRandomReaction('arrayMatch', lastReactionRef.current);
        lastReactionRef.current = reaction;
        setSiftReaction(reaction);
      }
    }
  }, [rows, cols, isMatch]);

  const handleDragDimensions = (newRows, newCols) => {
    setRows(newRows);
    setCols(newCols);
  };

  const handleAdjustRows = (delta) => {
    playSound('click');
    setRows((prev) => Math.max(1, Math.min(60, prev + delta)));
  };

  const handleAdjustCols = (delta) => {
    playSound('click');
    setCols((prev) => Math.max(1, Math.min(60, prev + delta)));
  };

  const handleLogPair = () => {
    if (!isMatch) return;

    const sortedPair = [Math.min(rows, cols), Math.max(rows, cols)];
    const alreadyLogged = loggedPairs.some(
      (p) => p[0] === sortedPair[0] && p[1] === sortedPair[1]
    );

    if (alreadyLogged) {
      const reaction = getRandomReaction('arrayDuplicate', lastReactionRef.current);
      lastReactionRef.current = reaction;
      setSiftReaction(reaction);
      setFeedback({ type: 'info', msg: `Factor pair ${sortedPair[0]} × ${sortedPair[1]} is already logged in your case notebook!` });
      setTimeout(() => setFeedback(null), 2000);
      return;
    }

    playSound('correct');
    setLoggedPairs((prev) => [...prev, sortedPair]);
    setFeedback({
      type: 'success',
      msg: `Logged factor pair: ${sortedPair[0]} × ${sortedPair[1]} = ${currentRound.targetNumber}!`,
    });
    setTimeout(() => setFeedback(null), 2000);
  };

  const handleSubmitRound = () => {
    if (loggedPairs.length < currentRound.minPairsToLog) {
      playSound('incorrect');
      setFeedback({
        type: 'warning',
        msg: `Log at least ${currentRound.minPairsToLog} pairs before submitting case notes!`,
      });
      setTimeout(() => setFeedback(null), 2200);
      return;
    }

    playSound('fanfare');
    try {
      confetti({ particleCount: 55, spread: 65, origin: { y: 0.6 } });
    } catch (e) {}

    // Show concrete "Why" in-the-moment resolution
    setFeedback({
      type: 'round-complete',
      msg: activeScenario.whyResolution,
    });

    setTimeout(() => {
      if (roundIdx < STATION_A_ROUNDS.length - 1) {
        setRoundIdx((prev) => prev + 1);
      } else {
        // Offer Sift's Bonus Challenge before calling onComplete
        setIsChallengeOpen(true);
      }
    }, 2400);
  };

  // Sift's Challenge handlers (Target 72)
  const isChallengeMatch = challengeRows * challengeCols === 72;
  const handleLogChallengePair = () => {
    if (!isChallengeMatch) return;
    const pair = [Math.min(challengeRows, challengeCols), Math.max(challengeRows, challengeCols)];
    if (!challengePairs.some((p) => p[0] === pair[0] && p[1] === pair[1])) {
      playSound('correct');
      setChallengePairs((prev) => [...prev, pair]);
    }
  };

  // If in sandbox mode, render sandbox overlay
  if (inSandbox) {
    return (
      <FreePlaySandbox
        stationTitle="Station A: Factor Array Builder"
        mechanicTip="Stretch the grid using the corner handle or the +/- buttons. Notice how the shelf turns glowing green and settles with zero leftover items whenever rows × cols equals 12!"
        durationSeconds={12}
        onStartRealMission={() => setInSandbox(false)}
      >
        <div className="sandbox-playground-row">
          <div className="sandbox-controls">
            <span className="sandbox-control-label">Rows: {sandboxRows}</span>
            <div className="stepper-row">
              <button className="stepper-btn" onClick={() => setSandboxRows((r) => Math.max(1, r - 1))}>
                <Minus size={16} />
              </button>
              <button className="stepper-btn" onClick={() => setSandboxRows((r) => Math.min(12, r + 1))}>
                <Plus size={16} />
              </button>
            </div>
            <span className="sandbox-control-label">Columns: {sandboxCols}</span>
            <div className="stepper-row">
              <button className="stepper-btn" onClick={() => setSandboxCols((c) => Math.max(1, c - 1))}>
                <Minus size={16} />
              </button>
              <button className="stepper-btn" onClick={() => setSandboxCols((c) => Math.min(12, c + 1))}>
                <Plus size={16} />
              </button>
            </div>
          </div>
          <ArrayGrid
            rows={sandboxRows}
            cols={sandboxCols}
            targetNumber={12}
            animated={true}
            tileSize={26}
            icon="🧪"
            scenarioName="Warm-up Vials"
            onDragDimensions={(r, c) => {
              setSandboxRows(r);
              setSandboxCols(c);
            }}
          />
        </div>
      </FreePlaySandbox>
    );
  }

  return (
    <div className="station-container station-a">
      {/* Real-World Scenario Picker */}
      <ScenarioPicker
        scenarios={currentRound.scenarios.map((sc) => ({
          title: sc.title,
          contextShort: sc.contextShort,
          icon: sc.icon,
        }))}
        activeScenarioIdx={selectedScenarioIdx}
        onSelectScenario={(idx) => {
          playSound('click');
          setSelectedScenarioIdx(idx);
        }}
      />

      {/* Mission Card with Sensory Real-World Framing */}
      <div className="station-mission-card real-world-frame">
        <div className="station-mission-header">
          <div className="mission-title-group">
            <span className="lab-tag">{activeScenario.icon} Real-World Case • {activeScenario.title}</span>
            <h3 className="story-opening-title">{activeScenario.openingStory}</h3>
            <p className="mission-desc">
              Adjust rows & columns to fit all <strong>{currentRound.targetNumber} {activeScenario.itemLabel}</strong> without a single leftover or gap!
            </p>
          </div>
          <div className="round-progress-indicator">
            <span>Round {roundIdx + 1} of {STATION_A_ROUNDS.length}</span>
          </div>
        </div>
      </div>

      {/* Live "Ways Discovered" Exploration Tracker */}
      <div className="discovery-tracker-bar glass-card">
        <div className="ways-counter-badge">
          <Sparkles size={18} color="#ffd54f" />
          <span>Ways Discovered: <strong>{discoveredPairs.size}</strong></span>
        </div>
        <div className="ways-pills-row">
          {Array.from(discoveredPairs).map((pairKey) => (
            <span key={pairKey} className="discovered-pill animate-pop">
              ✓ {pairKey}
            </span>
          ))}
          {discoveredPairs.size === 0 && (
            <span className="exploration-nudge">Stretch or tap dimensions to discover rectangular factor pairs!</span>
          )}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="station-stage-grid">
        {/* Left: Dimension Controls & Presets */}
        <div className="station-controls-card glass-card">
          <h4>📐 Dimension Controls</h4>
          <p className="control-help-sub">
            Drag the bottom-right corner handle on the shelf, or use the accessible tap buttons below:
          </p>

          <div className="dimension-control-group">
            <div className="control-row">
              <span className="dim-label">Rows:</span>
              <button
                className="stepper-btn"
                onClick={() => handleAdjustRows(-1)}
                aria-label="Decrease rows"
              >
                <Minus size={18} />
              </button>
              <span className="dim-value">{rows}</span>
              <button
                className="stepper-btn"
                onClick={() => handleAdjustRows(1)}
                aria-label="Increase rows"
              >
                <Plus size={18} />
              </button>
            </div>

            <div className="control-row">
              <span className="dim-label">Columns:</span>
              <button
                className="stepper-btn"
                onClick={() => handleAdjustCols(-1)}
                aria-label="Decrease columns"
              >
                <Minus size={18} />
              </button>
              <span className="dim-value">{cols}</span>
              <button
                className="stepper-btn"
                onClick={() => handleAdjustCols(1)}
                aria-label="Increase columns"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Quick Row Presets for keyboard / fast access */}
          <div className="quick-presets-box">
            <span className="presets-label">Row Presets:</span>
            <div className="presets-buttons">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12].map((r) => (
                <button
                  key={r}
                  className={`preset-pill ${rows === r ? 'active' : ''}`}
                  onClick={() => {
                    playSound('click');
                    setRows(r);
                    if (currentRound.targetNumber % r === 0) {
                      setCols(currentRound.targetNumber / r);
                    }
                  }}
                  aria-label={`Set rows to ${r}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Log Pair Action Button */}
          <button
            className={`btn btn-lg btn-log-pair ${isMatch ? 'btn-match' : 'btn-disabled'}`}
            onClick={handleLogPair}
            disabled={!isMatch}
          >
            <Check size={20} />
            <span>
              {isMatch
                ? `Log Factor Pair (${rows} × ${cols}) in Case Notes`
                : `Adjust shelf to fit ${currentRound.targetNumber} exactly`}
            </span>
          </button>

          {/* Sift's Live Reaction Dialogue */}
          {siftReaction && (
            <div className="sift-speech-bubble animate-bounce-short">
              <Mascot mood={isMatch ? 'happy' : 'thinking'} size="small" />
              <p className="bubble-text">"{siftReaction}"</p>
            </div>
          )}

          {/* Feedback banner */}
          {feedback && (
            <div className={`station-feedback-toast toast-${feedback.type}`}>
              <span>{feedback.msg}</span>
            </div>
          )}
        </div>

        {/* Right: Shelf Visual Grid & Logged Pairs */}
        <div className="station-display-card glass-card">
          <ArrayGrid
            rows={rows}
            cols={cols}
            targetNumber={currentRound.targetNumber}
            animated={true}
            tileSize={26}
            icon={activeScenario.icon}
            scenarioName={activeScenario.itemLabel}
            onDragDimensions={handleDragDimensions}
            isSettled={isMatch}
          />

          {/* Running Case Notes of Logged Factor Pairs */}
          <div className="logged-pairs-container">
            <div className="logged-pairs-header">
              <BookOpen size={18} />
              <h5>Logged Factor Pairs ({loggedPairs.length}/{currentRound.minPairsToLog} required)</h5>
            </div>

            <div className="logged-pairs-list">
              {loggedPairs.length === 0 ? (
                <span className="empty-pairs-text">
                  No factor pairs logged yet. Adjust dimensions to {currentRound.targetNumber} and tap 'Log Factor Pair'!
                </span>
              ) : (
                loggedPairs.map((pair, idx) => (
                  <span key={idx} className="logged-pair-pill">
                    {pair[0]} × {pair[1]} = {currentRound.targetNumber}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Curious Detective Fact */}
          <div className="curious-fact-box">
            <Mascot mood="thinking" size="small" />
            <p><strong>Sift's Note:</strong> {currentRound.curiousFact}</p>
          </div>

          {/* Submit Round Button */}
          <button
            className="btn btn-primary btn-submit-station"
            onClick={handleSubmitRound}
            disabled={loggedPairs.length < currentRound.minPairsToLog}
          >
            <span>{roundIdx < STATION_A_ROUNDS.length - 1 ? 'Next Detective Target' : 'Complete Station A'}</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* Sift's Master Challenge Modal for Target 72 */}
      <SiftChallengeModal
        isOpen={isChallengeOpen}
        onClose={() => {
          setIsChallengeOpen(false);
          onComplete();
        }}
        title="Sift's Challenge: The 72 Master Archivist's Pallet"
        subtitle="72 has an incredible 12 total factor pairs! Discover at least 4 factor pairs for 72 to unlock the Grand Array Architect badge shard."
        badgeName="Grand Array Architect"
        badgeIcon="📐"
        isSolved={challengePairs.length >= 4}
        onClaimReward={() => setHasClaimedBadge(true)}
      >
        <div className="challenge-array-body">
          <div className="challenge-controls-row">
            <button className="stepper-btn" onClick={() => setChallengeRows((r) => Math.max(1, r - 1))}>
              <Minus size={16} />
            </button>
            <span>Rows: <strong>{challengeRows}</strong></span>
            <button className="stepper-btn" onClick={() => setChallengeRows((r) => Math.min(36, r + 1))}>
              <Plus size={16} />
            </button>
            <button className="stepper-btn" onClick={() => setChallengeCols((c) => Math.max(1, c - 1))}>
              <Minus size={16} />
            </button>
            <span>Cols: <strong>{challengeCols}</strong></span>
            <button className="stepper-btn" onClick={() => setChallengeCols((c) => Math.min(36, c + 1))}>
              <Plus size={16} />
            </button>
            <button
              className={`btn btn-sm ${isChallengeMatch ? 'btn-primary' : 'btn-outline'}`}
              onClick={handleLogChallengePair}
              disabled={!isChallengeMatch}
            >
              Log ({challengeRows} × {challengeCols})
            </button>
          </div>

          <ArrayGrid
            rows={challengeRows}
            cols={challengeCols}
            targetNumber={72}
            tileSize={20}
            icon="📦"
            scenarioName="Archivist Crates"
          />

          <div className="challenge-logged-summary">
            <strong>Logged Pairs ({challengePairs.length}/4 for Shard):</strong>
            <div className="logged-pairs-list">
              {challengePairs.map((p, i) => (
                <span key={i} className="logged-pair-pill">{p[0]} × {p[1]} = 72</span>
              ))}
            </div>
          </div>
        </div>
      </SiftChallengeModal>
    </div>
  );
}
