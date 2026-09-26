import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, GitBranch, ArrowRight, RotateCcw, CheckCircle2, Eye, EyeOff, HelpCircle } from 'lucide-react';
import FactorTree from '../shared/FactorTree';
import Mascot from '../Mascot';
import FreePlaySandbox from '../shared/FreePlaySandbox';
import ScenarioPicker from '../shared/ScenarioPicker';
import SiftChallengeModal from '../shared/SiftChallengeModal';
import { isPrime, getFactorPairs } from '../../utils/numberTheory';
import { stationBNarration } from '../../utils/narration';
import { narrate, playSound } from '../../utils/audio';
import { getRandomReaction } from '../../utils/siftReactions';

const STATION_B_ROUNDS = [
  {
    round: 1,
    targetNumber: 36,
    expectedFactorization: "2² × 3²",
    scenarios: [
      {
        title: "Wind Turbine Gear Train",
        contextShort: "36-Tooth Gearbox",
        icon: "⚙️",
        itemLabel: "gear teeth",
        openingStory: "A 36-toothed transmission gear must be broken down into prime gear teeth reductions so the turbine won't vibrate or overheat!",
        whyResolution: "Reducing 36 into 2² × 3² allows 4 small dual-stage pinions to transfer rotational power with zero energy loss!",
      },
      {
        title: "Concert Audio Equalizer",
        contextShort: "36 Frequency Bands",
        icon: "🎛️",
        itemLabel: "frequency channels",
        openingStory: "Decompose 36 acoustic frequency bands into prime resonance sub-channels to eliminate stadium feedback echo!",
        whyResolution: "The 2² × 3² prime channels isolate bass and treble harmonics without phase cancellation!",
      },
    ],
  },
  {
    round: 2,
    targetNumber: 72,
    expectedFactorization: "2³ × 3²",
    scenarios: [
      {
        title: "Carlos's Bank Vault Combination",
        contextShort: "Palacio Vault Lock",
        icon: "🔐",
        itemLabel: "tumbler pins",
        openingStory: "Carlos in Mexico City is cracking a 72-pin vault lock. Split each composite tumbler pin until only unbreakable prime pins remain!",
        whyResolution: "72 = 2³ × 3²! The vault's five prime pins (three 2s and two 3s) align the shear line perfectly!",
      },
      {
        title: "Subway Relay Switching Grid",
        contextShort: "72 Rail Switches",
        icon: "🚇",
        itemLabel: "track switches",
        openingStory: "Break down 72 rail switches into prime branch clusters so automated express trains never encounter deadlock!",
        whyResolution: "Dividing into 2³ × 3² prime sectors ensures every train branch has dedicated fail-safe signals!",
      },
    ],
  },
  {
    round: 3,
    targetNumber: 150,
    expectedFactorization: "2 × 3 × 5²",
    scenarios: [
      {
        title: "Deep Space Satellite Uplink",
        contextShort: "150-Watt Power Bus",
        icon: "🛰️",
        itemLabel: "watt telemetry nodes",
        openingStory: "The 150-watt solar telemetry bus must be stepped down into prime micro-circuit voltages before reaching sensitive sensors!",
        whyResolution: "150 reduces down to 2 × 3 × 5²! The solar array steps voltage down cleanly with zero surge risk.",
      },
      {
        title: "Oceanic Sonar Pulse Array",
        contextShort: "150 Acoustic Pulses",
        icon: "🌊",
        itemLabel: "sonar beams",
        openingStory: "Factor 150 acoustic pulses into pure prime frequency harmonics to map the Mariana Trench seafloor!",
        whyResolution: "Decomposed into 2 × 3 × 5² prime wavelengths, the sonar waves penetrate deep trenches without dispersing!",
      },
    ],
  },
];

let nodeIdCounter = 1;
function makeNode(value) {
  return {
    id: `node_${nodeIdCounter++}`,
    value,
    children: null,
  };
}

function checkTreeComplete(node) {
  if (!node) return false;
  if (!node.children || node.children.length === 0) {
    return isPrime(node.value);
  }
  return node.children.every(checkTreeComplete);
}

function collectLeaves(node) {
  if (!node) return [];
  if (!node.children || node.children.length === 0) {
    return [{ id: node.id, value: node.value }];
  }
  return node.children.flatMap(collectLeaves);
}

export default function FactorTreeStation({ onComplete, audioEnabled }) {
  const [inSandbox, setInSandbox] = useState(true);
  const [sandboxTree, setSandboxTree] = useState(() => makeNode(20));
  const [sandboxSelectedNode, setSandboxSelectedNode] = useState(null);

  const [roundIdx, setRoundIdx] = useState(0);
  const currentRound = STATION_B_ROUNDS[roundIdx];
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState(0);
  const activeScenario = currentRound.scenarios[selectedScenarioIdx] || currentRound.scenarios[0];

  const [tree, setTree] = useState(() => makeNode(currentRound.targetNumber));
  const [selectedNode, setSelectedNode] = useState(null);
  const [showXRay, setShowXRay] = useState(false);
  const [wobbleNodeId, setWobbleNodeId] = useState(null);
  const [chainLitIds, setChainLitIds] = useState(new Set());
  const [typedEquation, setTypedEquation] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [siftReaction, setSiftReaction] = useState(null);
  const lastReactionRef = useRef('');

  // Sift's Challenge state (Target 180)
  const [isChallengeOpen, setIsChallengeOpen] = useState(false);
  const [challengeTree, setChallengeTree] = useState(() => makeNode(180));
  const [challengeSelectedNode, setChallengeSelectedNode] = useState(null);
  const [hasClaimedBadge, setHasClaimedBadge] = useState(false);

  useEffect(() => {
    if (!inSandbox) {
      narrate(stationBNarration(), audioEnabled);
    }
  }, [roundIdx, audioEnabled, inSandbox]);

  // Reset tree on round change
  useEffect(() => {
    nodeIdCounter = 1;
    setSelectedScenarioIdx(0);
    setTree(makeNode(currentRound.targetNumber));
    setSelectedNode(null);
    setWobbleNodeId(null);
    setChainLitIds(new Set());
    setTypedEquation('');
    setFeedback(null);
    setSiftReaction(null);
  }, [roundIdx]);

  const handleSelectNode = (node) => {
    if (isPrime(node.value)) return;
    playSound('click');
    setSelectedNode(node);
  };

  const handleSplitChoice = (pair, isDeliberateDistractor = false) => {
    if (!selectedNode) return;

    const [a, b] = pair;
    const isValidSplit = a * b === selectedNode.value && a > 1 && b > 1;

    // Wrong split attempt: animate wobble and snap back!
    if (!isValidSplit || isDeliberateDistractor) {
      playSound('incorrect');
      setWobbleNodeId(selectedNode.id);
      const reaction = getRandomReaction('treeWobbleSplit', lastReactionRef.current);
      lastReactionRef.current = reaction;
      setSiftReaction(reaction);

      setFeedback({
        type: 'warning',
        msg: `Wobble! ${a} × ${b} = ${a * b}, which does NOT equal ${selectedNode.value}! The branch snaps back.`,
      });

      setTimeout(() => {
        setWobbleNodeId(null);
      }, 700);

      setTimeout(() => {
        setFeedback(null);
      }, 2500);
      return;
    }

    // Valid split: update tree
    playSound('correct');
    const reaction = getRandomReaction('treeCorrectSplit', lastReactionRef.current);
    lastReactionRef.current = reaction;
    setSiftReaction(reaction);

    const updateNode = (curr) => {
      if (curr.id === selectedNode.id) {
        return {
          ...curr,
          children: [makeNode(a), makeNode(b)],
        };
      }
      if (curr.children) {
        return {
          ...curr,
          children: curr.children.map(updateNode),
        };
      }
      return curr;
    };

    const newTree = updateNode(tree);
    setTree(newTree);
    setSelectedNode(null);

    // Check if entire tree is completed
    if (checkTreeComplete(newTree)) {
      triggerChainReaction(newTree);
    }
  };

  // Chain Reaction Animation
  const triggerChainReaction = (completedTree) => {
    playSound('fanfare');
    try {
      confetti({ particleCount: 50, spread: 65, origin: { y: 0.6 } });
    } catch (e) {}

    const leaves = collectLeaves(completedTree);
    const leafIds = leaves.map((l) => l.id);

    // Staggered sequential lighting of prime leaves
    leafIds.forEach((id, index) => {
      setTimeout(() => {
        playSound('click');
        setChainLitIds((prev) => new Set([...prev, id]));
      }, index * 260);
    });

    // Typewriter effect for index notation reveal
    const fullText = `${currentRound.targetNumber} = ${currentRound.expectedFactorization}`;
    setTimeout(() => {
      let charIdx = 0;
      const typeTimer = setInterval(() => {
        charIdx++;
        setTypedEquation(fullText.slice(0, charIdx));
        if (charIdx >= fullText.length) {
          clearInterval(typeTimer);
          const finalReaction = getRandomReaction('treeDone', lastReactionRef.current);
          lastReactionRef.current = finalReaction;
          setSiftReaction(finalReaction);
          setFeedback({
            type: 'round-complete',
            msg: activeScenario.whyResolution,
          });
        }
      }, 60);
    }, leafIds.length * 260 + 200);
  };

  const handleResetTree = () => {
    playSound('click');
    setTree(makeNode(currentRound.targetNumber));
    setSelectedNode(null);
    setChainLitIds(new Set());
    setTypedEquation('');
    setFeedback(null);
  };

  const handleNextRound = () => {
    if (roundIdx < STATION_B_ROUNDS.length - 1) {
      setRoundIdx((prev) => prev + 1);
    } else {
      setIsChallengeOpen(true);
    }
  };

  const leafObjects = collectLeaves(tree);
  const leaves = leafObjects.map((l) => l.value);
  const isTreeDone = checkTreeComplete(tree);
  const sortedLeaves = [...leaves].sort((a, b) => a - b);
  const calculatedProduct = leaves.reduce((acc, v) => acc * v, 1);

  // Available factor pairs + 1-2 intentional experimental distractor pairs for low-stakes testing!
  const validPairs = selectedNode
    ? getFactorPairs(selectedNode.value).filter(
        ([a, b]) => a > 1 && b > 1 && a * b === selectedNode.value
      )
    : [];

  const distractorPairs = selectedNode && !isPrime(selectedNode.value)
    ? [
        [Math.floor(selectedNode.value / 2) + 1, 2],
        [3, Math.floor(selectedNode.value / 3) + 2],
      ].filter(([a, b]) => a * b !== selectedNode.value && a > 1 && b > 1).slice(0, 1)
    : [];

  // Sandbox mode
  if (inSandbox) {
    const sandboxPairs = sandboxSelectedNode
      ? getFactorPairs(sandboxSelectedNode.value).filter(([a, b]) => a > 1 && b > 1 && a * b === sandboxSelectedNode.value)
      : [];

    return (
      <FreePlaySandbox
        stationTitle="Station B: Prime Factor Tree Lab"
        mechanicTip="Tap blue composite nodes to split them into factor branches. Gold leaves with stars are primes! Try splitting 20 into 4 × 5 or 2 × 10."
        durationSeconds={12}
        onStartRealMission={() => setInSandbox(false)}
      >
        <div className="sandbox-tree-wrap">
          <div className="tree-scroll-area">
            <FactorTree
              node={sandboxTree}
              onSplit={(n) => {
                playSound('click');
                setSandboxSelectedNode(n);
              }}
              selectedNode={sandboxSelectedNode}
            />
          </div>
          {sandboxSelectedNode && (
            <div className="sandbox-split-choices">
              <span>Split {sandboxSelectedNode.value} by:</span>
              {sandboxPairs.map((p, i) => (
                <button
                  key={i}
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    playSound('click');
                    const [a, b] = p;
                    const updateN = (curr) => {
                      if (curr.id === sandboxSelectedNode.id) {
                        return { ...curr, children: [makeNode(a), makeNode(b)] };
                      }
                      if (curr.children) return { ...curr, children: curr.children.map(updateN) };
                      return curr;
                    };
                    setSandboxTree(updateN(sandboxTree));
                    setSandboxSelectedNode(null);
                  }}
                >
                  {p[0]} × {p[1]}
                </button>
              ))}
            </div>
          )}
        </div>
      </FreePlaySandbox>
    );
  }

  return (
    <div className="station-container station-b">
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

      {/* Mission Card */}
      <div className="station-mission-card real-world-frame">
        <div className="station-mission-header">
          <div className="mission-title-group">
            <span className="lab-tag">{activeScenario.icon} Real-World Case • {activeScenario.title}</span>
            <h3 className="story-opening-title">{activeScenario.openingStory}</h3>
            <p className="mission-desc">
              Branch the composite numbers down until only golden prime leaves remain!
            </p>
          </div>
          <div className="round-progress-indicator">
            <span>Round {roundIdx + 1} of {STATION_B_ROUNDS.length}</span>
          </div>
        </div>
      </div>

      <div className="station-stage-grid">
        {/* Left: Interactive Tree Canvas */}
        <div className="factor-tree-canvas-card glass-card">
          <div className="tree-top-toolbar">
            <div className="toolbar-left-tags">
              <span className="tree-target-badge">{activeScenario.icon} Target: {currentRound.targetNumber}</span>
              {/* Optional X-Ray Divisibility Scanner Toggle */}
              <button
                className={`btn btn-xs ${showXRay ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => {
                  playSound('click');
                  setShowXRay((prev) => !prev);
                }}
                title="Toggle Divisibility Rule Clues"
              >
                {showXRay ? <EyeOff size={14} /> : <Eye size={14} />}
                <span>{showXRay ? 'Hide X-Ray' : 'X-Ray Scanner'}</span>
              </button>
            </div>

            <button className="btn btn-outline btn-xs" onClick={handleResetTree} title="Reset Tree">
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          </div>

          <div className="tree-scroll-area">
            <FactorTree
              node={tree}
              onSplit={handleSelectNode}
              selectedNode={selectedNode}
              wobbleNodeId={wobbleNodeId}
              showXRay={showXRay}
              chainLitIds={chainLitIds}
            />
          </div>

          <div className="tree-instructions-footer">
            <p>
              {isTreeDone
                ? '🎉 Complete! All branches have terminated in prime numbers (★)!'
                : selectedNode
                ? `Choose a factor pair below to split ${selectedNode.value}`
                : 'Tap any blue composite circle above to choose its factor branches.'}
            </p>
          </div>
        </div>

        {/* Right: Splitting Options & Index Notation */}
        <div className="tree-info-panel glass-card">
          {/* Node Splitter Dialog with Both Valid and Test Experimental Choices */}
          {selectedNode && !isTreeDone && (
            <div className="node-split-selector-box animate-pop">
              <h4>Split Node {selectedNode.value}:</h4>
              <p>Choose two factor branches whose product equals {selectedNode.value}:</p>
              <div className="factor-split-buttons">
                {validPairs.map((pair, i) => (
                  <button
                    key={`v-${i}`}
                    className="btn btn-outline split-pair-btn"
                    onClick={() => handleSplitChoice(pair, false)}
                    aria-label={`Split into ${pair[0]} and ${pair[1]}`}
                  >
                    <span>{pair[0]} × {pair[1]}</span>
                  </button>
                ))}
                {/* Intentional experimental distractor to demonstrate wobble feedback */}
                {distractorPairs.map((pair, i) => (
                  <button
                    key={`d-${i}`}
                    className="btn btn-outline split-pair-btn distractor-btn"
                    onClick={() => handleSplitChoice(pair, true)}
                    title="Test this split!"
                  >
                    <span>{pair[0]} × {pair[1]}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Current Leaves Tracker */}
          <div className="tree-leaf-tracker-box">
            <h4>🌿 Current Leaf Nodes:</h4>
            <div className="leaves-tags-row">
              {leafObjects.map((leaf, idx) => {
                const primeLeaf = isPrime(leaf.value);
                const isLit = chainLitIds.has(leaf.id);
                return (
                  <span
                    key={idx}
                    className={`leaf-tag ${
                      primeLeaf ? 'leaf-prime' : 'leaf-composite'
                    } ${isLit ? 'leaf-chain-active' : ''}`}
                  >
                    {leaf.value} {primeLeaf ? '★' : '(composite)'}
                  </span>
                );
              })}
            </div>

            <div className="leaves-math-readout">
              <span>Leaf Product: </span>
              <strong>{sortedLeaves.join(' × ')} = {calculatedProduct}</strong>
            </div>
          </div>

          {/* Typewriter Index Notation Reveal */}
          <div className={`index-notation-box ${isTreeDone ? 'index-revealed' : ''}`}>
            <h4>✨ Prime Factorization (Index Notation):</h4>
            <div className="index-notation-display">
              {isTreeDone ? (
                <>
                  <span className="equation-main equation-typewriter">
                    {typedEquation || `${currentRound.targetNumber} = ${currentRound.expectedFactorization}`}
                  </span>
                  <span className="equation-sub">
                    (Prime building blocks: {sortedLeaves.join(' × ')})
                  </span>
                </>
              ) : (
                <span className="equation-placeholder">
                  Split all composite branches to trigger the prime chain reaction!
                </span>
              )}
            </div>
          </div>

          {/* Sift's Reaction Speech Bubble */}
          {siftReaction && (
            <div className="sift-speech-bubble animate-bounce-short">
              <Mascot mood={isTreeDone ? 'celebrating' : 'curious'} size="small" />
              <p className="bubble-text">"{siftReaction}"</p>
            </div>
          )}

          {/* Feedback banner */}
          {feedback && (
            <div className={`station-feedback-toast toast-${feedback.type}`}>
              <span>{feedback.msg}</span>
            </div>
          )}

          {/* Next Round CTA */}
          <button
            className="btn btn-primary btn-submit-station"
            onClick={handleNextRound}
            disabled={!isTreeDone}
          >
            <span>{roundIdx < STATION_B_ROUNDS.length - 1 ? 'Next Factor Tree Target' : 'Complete Station B'}</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* Sift's Master Challenge Modal for Target 180 */}
      <SiftChallengeModal
        isOpen={isChallengeOpen}
        onClose={() => {
          setIsChallengeOpen(false);
          onComplete();
        }}
        title="Sift's Challenge: The 180 Cryptographer's Cipher Tree"
        subtitle="180 is a grand composite number with prime factors 2, 3, and 5! Can you branch 180 until all leaves are prime?"
        badgeName="Prime Alchemist"
        badgeIcon="🌳"
        isSolved={checkTreeComplete(challengeTree)}
        onClaimReward={() => setHasClaimedBadge(true)}
      >
        <div className="challenge-tree-body">
          <div className="tree-scroll-area">
            <FactorTree
              node={challengeTree}
              onSplit={(n) => {
                playSound('click');
                setChallengeSelectedNode(n);
              }}
              selectedNode={challengeSelectedNode}
            />
          </div>

          {challengeSelectedNode && !checkTreeComplete(challengeTree) && (
            <div className="node-split-selector-box">
              <h4>Split {challengeSelectedNode.value}:</h4>
              <div className="factor-split-buttons">
                {getFactorPairs(challengeSelectedNode.value)
                  .filter(([a, b]) => a > 1 && b > 1 && a * b === challengeSelectedNode.value)
                  .map((p, i) => (
                    <button
                      key={i}
                      className="btn btn-outline split-pair-btn"
                      onClick={() => {
                        playSound('click');
                        const [a, b] = p;
                        const updateN = (curr) => {
                          if (curr.id === challengeSelectedNode.id) {
                            return { ...curr, children: [makeNode(a), makeNode(b)] };
                          }
                          if (curr.children) return { ...curr, children: curr.children.map(updateN) };
                          return curr;
                        };
                        const updated = updateN(challengeTree);
                        setChallengeTree(updated);
                        setChallengeSelectedNode(null);
                        if (checkTreeComplete(updated)) {
                          playSound('fanfare');
                        }
                      }}
                    >
                      {p[0]} × {p[1]}
                    </button>
                  ))}
              </div>
            </div>
          )}

          <div className="challenge-index-readout">
            {checkTreeComplete(challengeTree) ? (
              <span className="equation-main">✨ 180 = 2² × 3² × 5 (Challenge Solved!)</span>
            ) : (
              <span>Keep splitting branches to complete the cipher tree.</span>
            )}
          </div>
        </div>
      </SiftChallengeModal>
    </div>
  );
}
