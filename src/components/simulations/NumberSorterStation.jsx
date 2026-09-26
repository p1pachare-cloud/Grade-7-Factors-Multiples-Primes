import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Filter, Sparkles, Check, X, Shield, ArrowRight, RotateCcw, AlertTriangle, Layers } from 'lucide-react';
import SieveGrid from '../shared/SieveGrid';
import Mascot from '../Mascot';
import FreePlaySandbox from '../shared/FreePlaySandbox';
import ScenarioPicker from '../shared/ScenarioPicker';
import SiftChallengeModal from '../shared/SiftChallengeModal';
import { isPrime, isDivisibleBy, getDivisibilityRuleExplanation } from '../../utils/numberTheory';
import { stationCNarration } from '../../utils/narration';
import { narrate, playSound } from '../../utils/audio';
import { getRandomReaction } from '../../utils/siftReactions';

const STATION_C_ROUNDS = [
  {
    round: 1,
    limit: 30,
    primesToUse: [2, 3],
    numbersToSort: [1, 2, 9, 13, 18, 29],
    scenarios: [
      {
        title: "Bio-Safety Lab Sample Sorting",
        contextShort: "30 Bacterial Culture Vials",
        icon: "🧬",
        itemLabel: "culture vials",
        openingStory: "In the Cairo bio-safety lab, 30 bacterial culture vials must be sieved. Eliminate multi-strain composite clusters so only unmutated prime cultures remain!",
        whyResolution: "Crossing out multiples of 2 and 3 leaves only 10 resilient prime culture vials safe for medical synthesis!",
      },
      {
        title: "Metro Luggage Security X-Ray",
        contextShort: "30 Station Lockers",
        icon: "🧳",
        itemLabel: "luggage lockers",
        openingStory: "Scan 30 passenger baggage lockers. Filter out composite grouped parcels and isolate individual prime security tags!",
        whyResolution: "With multiples of 2 and 3 swept away, the security scanner isolates prime luggage tags without false alarms!",
      },
    ],
    divisibilityQuestions: [
      { num: 124, divisor: 4, rule: "Last two digits: 24 ÷ 4 = 6", answer: true },
      { num: 415, divisor: 3, rule: "Digit sum: 4 + 1 + 5 = 10 (not divisible by 3)", answer: false },
    ],
  },
  {
    round: 2,
    limit: 60,
    primesToUse: [2, 3, 5],
    numbersToSort: [1, 7, 35, 41, 49, 53],
    scenarios: [
      {
        title: "Deep Sea Sensor Beacons",
        contextShort: "60 Hydrophone Transponders",
        icon: "📡",
        itemLabel: "hydrophone beacons",
        openingStory: "Calibrate 60 ocean-depth sonar transponders. Sift out composite interference waves (multiples of 2, 3, 5) to hear pure prime beacon pulses!",
        whyResolution: "Eliminating multiples of 2, 3, and 5 reveals the 17 clear prime channels free of acoustic underwater echo!",
      },
      {
        title: "Clockwork Watchmaker Gears",
        contextShort: "60 Escapement Gears",
        icon: "🕰️",
        itemLabel: "escapement wheels",
        openingStory: "Sort 60 antique escapement gears into prime, composite, and solitary 1-tooth units before assembling the royal tower clock!",
        whyResolution: "Sorting the gears into prime teeth ratios ensures the clock mechanism runs with zero backlash or jamming!",
      },
    ],
    divisibilityQuestions: [
      { num: 618, divisor: 6, rule: "Even (divisible by 2) and digit sum 6+1+8=15 (divisible by 3)", answer: true },
      { num: 7425, divisor: 9, rule: "Digit sum 7+4+2+5 = 18 (divisible by 9)", answer: true },
    ],
  },
  {
    round: 3,
    limit: 100,
    primesToUse: [2, 3, 5, 7],
    numbersToSort: [1, 19, 51, 73, 91, 97],
    scenarios: [
      {
        title: "Cybersecurity Firewall Filters",
        contextShort: "100 Data Packet Ports",
        icon: "🛡️",
        itemLabel: "firewall ports",
        openingStory: "Filter 100 incoming data ports using prime sieve rules (2, 3, 5, 7) to block botnet composite floods and safeguard prime encryption keys!",
        whyResolution: "The Sieve of Eratosthenes strips away all composite traffic, uncovering exactly 25 indestructible prime ports under 100!",
      },
      {
        title: "Pyramid Tomb Chamber Keys",
        contextShort: "100 Ancient Tomb Seals",
        icon: "🗝️",
        itemLabel: "golden chamber keys",
        openingStory: "100 ancient golden tomb keys must be filtered through Pharaoh Khufu's prime divisors to unlock the inner sanctum chamber!",
        whyResolution: "The 25 golden prime keys unlock the hidden chamber without triggering a single composite balance trap!",
      },
    ],
    divisibilityQuestions: [
      { num: 824, divisor: 8, rule: "Last three digits: 824 ÷ 8 = 103", answer: true },
      { num: 319, divisor: 11, rule: "Alternating sum (3 + 9) - 1 = 11 (divisible by 11)", answer: true },
    ],
  },
];

export default function NumberSorterStation({ onComplete, audioEnabled, onStationCPerfect }) {
  const [inSandbox, setInSandbox] = useState(true);
  const [sandboxCrossed, setSandboxCrossed] = useState(new Set());
  const [sandboxUsed, setSandboxUsed] = useState([]);

  const [roundIdx, setRoundIdx] = useState(0);
  const currentRound = STATION_C_ROUNDS[roundIdx];
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState(0);
  const activeScenario = currentRound.scenarios[selectedScenarioIdx] || currentRound.scenarios[0];

  const [activeStep, setActiveStep] = useState(1); // 1: Sieve, 2: Sort, 3: Divisibility
  const [crossedOut, setCrossedOut] = useState(new Set());
  const [usedPrimes, setUsedPrimes] = useState([]);
  const [activeRippleBatch, setActiveRippleBatch] = useState(new Set());
  const [isRippling, setIsRippling] = useState(false);

  const [bins, setBins] = useState({ prime: [], composite: [], neither: [] });
  const [unplacedNumbers, setUnplacedNumbers] = useState([]);
  const [divIdx, setDivIdx] = useState(0);
  const [divFeedback, setDivFeedback] = useState(null);
  const [hasWrongAttempt, setHasWrongAttempt] = useState(false);
  const [siftCommentary, setSiftCommentary] = useState(null);
  const lastReactionRef = useRef('');

  // Sift's Challenge state
  const [isChallengeOpen, setIsChallengeOpen] = useState(false);
  const [challengeStep, setChallengeStep] = useState(0);
  const [challengeScore, setChallengeScore] = useState(0);
  const [challengeSolved, setChallengeSolved] = useState(false);

  useEffect(() => {
    if (!inSandbox) {
      narrate(stationCNarration(), audioEnabled);
    }
  }, [roundIdx, audioEnabled, inSandbox]);

  // Reset round state
  useEffect(() => {
    setSelectedScenarioIdx(0);
    setActiveStep(1);
    setCrossedOut(new Set());
    setUsedPrimes([]);
    setActiveRippleBatch(new Set());
    setIsRippling(false);
    setBins({ prime: [], composite: [], neither: [] });
    setUnplacedNumbers([...currentRound.numbersToSort]);
    setDivIdx(0);
    setDivFeedback(null);
    setSiftCommentary(null);
  }, [roundIdx]);

  // Step 1: Ripple sieve reveal across grid tile-by-tile
  const handleCrossOutPrime = (p) => {
    if (usedPrimes.includes(p) || isRippling) return;
    playSound('click');
    setIsRippling(true);

    const multiples = [];
    for (let multiple = p * 2; multiple <= currentRound.limit; multiple += p) {
      if (!crossedOut.has(multiple)) {
        multiples.push(multiple);
      }
    }

    // Ripple wave: cross out multiples one by one with a visual shockwave
    multiples.forEach((mult, index) => {
      setTimeout(() => {
        setCrossedOut((prev) => new Set([...prev, mult]));
        setActiveRippleBatch((prev) => new Set([...prev, mult]));
      }, index * 45);
    });

    const totalDuration = multiples.length * 45 + 300;
    setTimeout(() => {
      setActiveRippleBatch(new Set());
      setIsRippling(false);

      const nextUsed = [...usedPrimes, p];
      setUsedPrimes(nextUsed);

      // Sift comments on the survivor count after the ripple
      const survivorsCount = Array.from({ length: currentRound.limit }, (_, i) => i + 1)
        .filter((n) => n > 1 && !crossedOut.has(n) && !multiples.includes(n)).length;

      let comment = `Multiples of ${p} swept away! Only ${survivorsCount} numbers left standing.`;
      if (p === 2) comment = `Half the numbers knocked out! Even composites eliminated like clockwork.`;
      else if (p === 3) comment = `Multiples of 3 down! The prime suspects are narrowing fast (${survivorsCount} standing).`;
      else if (p === 5) comment = `Multiples of 5 cleared! Look at the prime pattern emerging!`;
      else if (p === 7) comment = `Multiples of 7 filtered! All remaining numbers under ${currentRound.limit} are primes!`;

      setSiftCommentary(comment);
      playSound('correct');

      // If all primes used, celebrate and advance to Step 2
      if (currentRound.primesToUse.every((prime) => nextUsed.includes(prime))) {
        playSound('fanfare');
        setTimeout(() => {
          setActiveStep(2);
        }, 1200);
      }
    }, totalDuration);
  };

  // Step 2: Sorting numbers into bins
  const handleSortNumber = (num, targetBin) => {
    playSound('click');

    let isCorrectPlacement = false;
    if (num === 1 && targetBin === 'neither') isCorrectPlacement = true;
    else if (isPrime(num) && targetBin === 'prime') isCorrectPlacement = true;
    else if (!isPrime(num) && num !== 1 && targetBin === 'composite') isCorrectPlacement = true;

    if (!isCorrectPlacement) {
      playSound('incorrect');
      setHasWrongAttempt(true);
      const wrongReaction = getRandomReaction('binSortWrong', lastReactionRef.current);
      lastReactionRef.current = wrongReaction;
      setSiftCommentary(wrongReaction);
      return;
    }

    playSound('correct');
    const correctReaction = getRandomReaction('binSortCorrect', lastReactionRef.current);
    lastReactionRef.current = correctReaction;
    setSiftCommentary(correctReaction);

    setBins((prev) => ({
      ...prev,
      [targetBin]: [...prev[targetBin], num],
    }));
    setUnplacedNumbers((prev) => prev.filter((n) => n !== num));

    if (unplacedNumbers.length === 1) {
      playSound('fanfare');
      setTimeout(() => {
        setActiveStep(3);
      }, 900);
    }
  };

  // Step 3: Divisibility quick test
  const handleDivisibilityAnswer = (userClaim) => {
    const q = currentRound.divisibilityQuestions[divIdx];
    const isCorrect = userClaim === q.answer;

    if (isCorrect) {
      playSound('correct');
      setDivFeedback({ type: 'correct', msg: `Correct! ${q.rule}` });

      setTimeout(() => {
        setDivFeedback(null);
        if (divIdx < currentRound.divisibilityQuestions.length - 1) {
          setDivIdx((prev) => prev + 1);
        } else {
          // Completed this round
          playSound('fanfare');
          try {
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
          } catch (e) {}

          setDivFeedback({
            type: 'round-complete',
            msg: activeScenario.whyResolution,
          });

          setTimeout(() => {
            if (roundIdx < STATION_C_ROUNDS.length - 1) {
              setRoundIdx((prev) => prev + 1);
            } else {
              if (!hasWrongAttempt && onStationCPerfect) {
                onStationCPerfect();
              }
              setIsChallengeOpen(true);
            }
          }, 2400);
        }
      }, 1600);
    } else {
      playSound('incorrect');
      setHasWrongAttempt(true);
      setDivFeedback({
        type: 'incorrect',
        msg: `Not quite! Rule tip: ${getDivisibilityRuleExplanation(q.divisor)}`,
      });
      setTimeout(() => setDivFeedback(null), 2500);
    }
  };

  // Sandbox Mode
  if (inSandbox) {
    return (
      <FreePlaySandbox
        stationTitle="Station C: Sift's Number Sorter"
        mechanicTip="Tap the prime button to watch its multiples ripple across the grid! Notice how 1 is neither prime nor composite, and survivor numbers are primes."
        durationSeconds={12}
        onStartRealMission={() => setInSandbox(false)}
      >
        <div className="sandbox-sieve-wrap">
          <div className="sandbox-primes-row">
            {[2, 3].map((p) => {
              const isUsed = sandboxUsed.includes(p);
              return (
                <button
                  key={p}
                  className={`btn btn-sm ${isUsed ? 'btn-prime-used' : 'btn-prime-ready'}`}
                  onClick={() => {
                    playSound('click');
                    const next = new Set(sandboxCrossed);
                    for (let m = p * 2; m <= 20; m += p) next.add(m);
                    setSandboxCrossed(next);
                    setSandboxUsed([...sandboxUsed, p]);
                  }}
                  disabled={isUsed}
                >
                  {isUsed ? `✓ Multiples of ${p} crossed` : `Ripple Multiples of ${p}`}
                </button>
              );
            })}
          </div>
          <SieveGrid
            crossedOut={sandboxCrossed}
            activePrimes={sandboxUsed}
            limit={20}
            interactive={false}
            highlightPrimes={true}
          />
        </div>
      </FreePlaySandbox>
    );
  }

  // Divisibility Gauntlet Challenge Questions
  const challengeQuestions = [
    { num: 1024, divisor: 8, rule: "Last 3 digits: 024 ÷ 8 = 3 exactly.", answer: true },
    { num: 3519, divisor: 9, rule: "Digit sum: 3 + 5 + 1 + 9 = 18 (divisible by 9).", answer: true },
    { num: 7271, divisor: 11, rule: "Alternating sum (7 + 7) - (2 + 1) = 14 - 3 = 11.", answer: true },
  ];

  return (
    <div className="station-container station-c">
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

      {/* Header */}
      <div className="station-mission-card real-world-frame">
        <div className="station-mission-header">
          <div className="mission-title-group">
            <span className="lab-tag">{activeScenario.icon} Real-World Case • {activeScenario.title}</span>
            <h3 className="story-opening-title">{activeScenario.openingStory}</h3>
            <p className="mission-desc">
              Sieve multiples of primes, classify {activeScenario.itemLabel} into evidence lockers, and test divisibility radar!
            </p>
          </div>
          <div className="round-progress-indicator">
            <span>Round {roundIdx + 1} of {STATION_C_ROUNDS.length}</span>
          </div>
        </div>

        {/* Step indicator tabs */}
        <div className="station-c-steps-bar">
          <div className={`step-chip ${activeStep === 1 ? 'step-active' : activeStep > 1 ? 'step-done' : ''}`}>
            <span>1. Sieve Ripple Grid</span>
          </div>
          <div className={`step-chip ${activeStep === 2 ? 'step-active' : activeStep > 2 ? 'step-done' : ''}`}>
            <span>2. Sort Evidence Bins</span>
          </div>
          <div className={`step-chip ${activeStep === 3 ? 'step-active' : ''}`}>
            <span>3. Divisibility Radar</span>
          </div>
        </div>
      </div>

      {/* Sift's Live Commentary Beat */}
      {siftCommentary && (
        <div className="sift-speech-bubble animate-bounce-short">
          <Mascot mood={isRippling ? 'thinking' : 'happy'} size="small" />
          <p className="bubble-text">"{siftCommentary}"</p>
        </div>
      )}

      {/* Main Interactive Stage */}
      <div className="station-c-content">
        {/* Step 1: Sieve of Eratosthenes with Live Ripple Wave */}
        {activeStep === 1 && (
          <div className="sieve-station-view glass-card">
            <div className="sieve-instructions-bar">
              <h4>🔍 Tap prime to launch a ripple wave crossing out all its multiples:</h4>
              <div className="prime-trigger-buttons">
                {currentRound.primesToUse.map((p) => {
                  const isUsed = usedPrimes.includes(p);
                  return (
                    <button
                      key={p}
                      className={`btn ${isUsed ? 'btn-prime-used' : 'btn-prime-ready'}`}
                      onClick={() => handleCrossOutPrime(p)}
                      disabled={isUsed || isRippling}
                      aria-label={`Cross out multiples of ${p}`}
                    >
                      <span>{isUsed ? `✓ Multiples of ${p} crossed` : `Ripple Multiples of ${p}`}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <SieveGrid
              crossedOut={crossedOut}
              activePrimes={usedPrimes}
              limit={currentRound.limit}
              interactive={false}
              highlightPrimes={true}
              activeRippleBatch={activeRippleBatch}
            />
          </div>
        )}

        {/* Step 2: Sorting Evidence into 3 Drop Bins */}
        {activeStep === 2 && (
          <div className="sorting-station-view glass-card">
            <h4>📦 Classify the Evidence: Tap each number into the correct bin!</h4>

            {/* Unplaced Numbers Row */}
            <div className="unplaced-numbers-tray">
              {unplacedNumbers.map((num) => (
                <div key={num} className="number-chip-draggable animate-pop">
                  <span className="chip-val">{num}</span>
                  <div className="bin-quick-actions">
                    <button
                      className="btn-bin-pick btn-pick-prime"
                      onClick={() => handleSortNumber(num, 'prime')}
                      title="Sort into Prime Bin"
                      aria-label={`Sort ${num} into Prime Bin`}
                    >
                      Prime
                    </button>
                    <button
                      className="btn-bin-pick btn-pick-composite"
                      onClick={() => handleSortNumber(num, 'composite')}
                      title="Sort into Composite Bin"
                      aria-label={`Sort ${num} into Composite Bin`}
                    >
                      Composite
                    </button>
                    {num === 1 && (
                      <button
                        className="btn-bin-pick btn-pick-neither"
                        onClick={() => handleSortNumber(num, 'neither')}
                        title="Sort into Neither Bin"
                        aria-label="Sort 1 into Neither Bin"
                      >
                        Neither (1)
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 3 Drop Bins */}
            <div className="three-bins-grid">
              <div className="sort-bin bin-prime">
                <div className="bin-header">
                  <Shield size={18} />
                  <h5>Prime Bin</h5>
                  <span className="bin-hint">Exactly 2 factors (1 & self)</span>
                </div>
                <div className="bin-contents">
                  {bins.prime.map((n) => (
                    <span key={n} className="binned-item prime-item animate-pop">{n} ★</span>
                  ))}
                </div>
              </div>

              <div className="sort-bin bin-composite">
                <div className="bin-header">
                  <Filter size={18} />
                  <h5>Composite Bin</h5>
                  <span className="bin-hint">More than 2 factors</span>
                </div>
                <div className="bin-contents">
                  {bins.composite.map((n) => (
                    <span key={n} className="binned-item composite-item animate-pop">{n}</span>
                  ))}
                </div>
              </div>

              <div className="sort-bin bin-neither">
                <div className="bin-header">
                  <span>⚖️</span>
                  <h5>Neither Bin</h5>
                  <span className="bin-hint">Only 1 factor (1 itself)</span>
                </div>
                <div className="bin-contents">
                  {bins.neither.map((n) => (
                    <span key={n} className="binned-item neither-item animate-pop">{n}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Divisibility Rule Radar */}
        {activeStep === 3 && (
          <div className="divisibility-station-view glass-card">
            {(() => {
              const q = currentRound.divisibilityQuestions[divIdx];
              return (
                <div className="divisibility-challenge-card">
                  <span className="div-tag">
                    Divisibility Radar • Question {divIdx + 1} of {currentRound.divisibilityQuestions.length}
                  </span>
                  <h3 className="div-prompt">
                    Is <strong>{q.num.toLocaleString()}</strong> divisible by <strong>{q.divisor}</strong>?
                  </h3>
                  <p className="div-rule-hint">
                    Rule Hint: {getDivisibilityRuleExplanation(q.divisor)}
                  </p>

                  <div className="div-actions-row">
                    <button
                      className="btn btn-outline btn-lg div-choice-btn"
                      onClick={() => handleDivisibilityAnswer(true)}
                      aria-label="Yes, divisible"
                    >
                      <Check size={22} color="#00e676" />
                      <span>Yes, Divisible!</span>
                    </button>

                    <button
                      className="btn btn-outline btn-lg div-choice-btn"
                      onClick={() => handleDivisibilityAnswer(false)}
                      aria-label="No, has remainder"
                    >
                      <X size={22} color="#ef5350" />
                      <span>No, Has Remainder!</span>
                    </button>
                  </div>

                  {divFeedback && (
                    <div className={`div-feedback-banner feedback-${divFeedback.type}`}>
                      <span>{divFeedback.msg}</span>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Sift's Master Challenge Modal: Divisibility Gauntlet */}
      <SiftChallengeModal
        isOpen={isChallengeOpen}
        onClose={() => {
          setIsChallengeOpen(false);
          onComplete();
        }}
        title="Sift's Challenge: The Divisibility Gauntlet"
        subtitle="Test 3 high-number security frequencies against advanced divisibility rules (8, 9, 11) to unlock the Master Sieve Detective badge shard!"
        badgeName="Master Sieve Detective"
        badgeIcon="⚡"
        isSolved={challengeSolved}
        onClaimReward={() => {}}
      >
        <div className="challenge-divisibility-body">
          {!challengeSolved ? (
            <div className="gauntlet-question-card">
              <span className="gauntlet-step">
                Gauntlet Test {challengeStep + 1} of {challengeQuestions.length}
              </span>
              <h4>
                Is <strong>{challengeQuestions[challengeStep].num.toLocaleString()}</strong> divisible by{' '}
                <strong>{challengeQuestions[challengeStep].divisor}</strong>?
              </h4>
              <p className="rule-sub">{challengeQuestions[challengeStep].rule}</p>

              <div className="gauntlet-actions">
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    if (challengeQuestions[challengeStep].answer === true) {
                      playSound('correct');
                      if (challengeStep < challengeQuestions.length - 1) {
                        setChallengeStep((s) => s + 1);
                        setChallengeScore((sc) => sc + 1);
                      } else {
                        setChallengeSolved(true);
                      }
                    } else {
                      playSound('incorrect');
                    }
                  }}
                >
                  <Check size={18} color="#00e676" /> Yes, Divisible
                </button>
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    if (challengeQuestions[challengeStep].answer === false) {
                      playSound('correct');
                      if (challengeStep < challengeQuestions.length - 1) {
                        setChallengeStep((s) => s + 1);
                        setChallengeScore((sc) => sc + 1);
                      } else {
                        setChallengeSolved(true);
                      }
                    } else {
                      playSound('incorrect');
                    }
                  }}
                >
                  <X size={18} color="#ef5350" /> No, Has Remainder
                </button>
              </div>
            </div>
          ) : (
            <div className="gauntlet-complete-view">
              <Mascot mood="celebrating" size="medium" />
              <h4>🎉 All 3 Advanced Radar Tests Cleared!</h4>
              <p>You have mastered divisibility rules for 8, 9, and 11 with flying colors!</p>
            </div>
          )}
        </div>
      </SiftChallengeModal>
    </div>
  );
}
