# Technical Requirements Document (TRD)
## Factors, Multiples and Primes | Grade 7 Math
### Intellia | Global Grade 7 Mathematics Curriculum

---

## 1. Technical Overview

This document specifies the architecture, component design, state management, data models, simulation logic, gamification implementation, audio pipeline, and quality standards for the **"The Global Prime Detective Agency — Factors, Multiples and Primes"** interactive lesson module for Grade 7 Math.

The module is a **React 18 application (Vite + JSX)**, structured identically to the reference repository **https://github.com/p1pachare-cloud/Grade5-Time-Intervals**, and styled to strictly match **https://grade5-time-intervals.vercel.app/**. It will be embedded at:

```
https://intelliasg.com/courses/grade-7-math/lessons/factors-multiples-primes/
```

Audio narration uses **ElevenLabs exclusively** (no browser Web Speech API fallback), directly implementing the pipeline documented in `audio_generation_pipeline.md`, adapted for this lesson's scripts.

---

## 2. Technology Stack

| Layer | Technology | Rationale |
| --- | --- | --- |
| UI Framework | React 18 (JSX, Vite) | Matches reference repo structure |
| State Management | `useState` + `useReducer` | Sufficient for single-module complexity |
| Styling | CSS Modules + Tailwind | Matches existing repo CSS approach |
| Icons | Lucide React | Available in artifact environment |
| Animation | CSS keyframes + transitions | No external dependency needed |
| SVG Diagrams | Inline SVG (React) | Array grids, factor trees, sieve grid |
| Persistence | `localStorage` | Session state, no backend needed |
| Audio (Primary) | ElevenLabs API | Premium, consistent voice (Alice) |
| Audio (Playback) | HTML5 Audio API (`new Audio()`) | Browser-native, no library needed |
| Number Theory Math | Vanilla JS (integer-only arithmetic) | Deterministic, no floating-point drift |
| Build Tool | Vite | Matches repo (`vite.config.js` present) |

---

## 3. Project Structure (mirrors reference repo)

```
factors-multiples-primes/
├── public/
│   ├── assets/
│   │   ├── audio/                          # Pre-generated .mp3 files (ElevenLabs)
│   │   │   ├── audio_wonder_hook_0.mp3
│   │   │   ├── audio_story_panel1_0.mp3
│   │   │   ├── audio_story_panel2_0.mp3
│   │   │   ├── audio_story_panel3_0.mp3
│   │   │   ├── audio_story_panel4_0.mp3
│   │   │   ├── audio_story_panel5_0.mp3
│   │   │   ├── audio_story_panel6_0.mp3
│   │   │   ├── audio_story_panel7_0.mp3
│   │   │   ├── audio_station_a_instruction_0.mp3
│   │   │   ├── audio_station_b_instruction_0.mp3
│   │   │   ├── audio_station_c_instruction_0.mp3
│   │   │   ├── audio_correct_0.mp3
│   │   │   ├── audio_reflect_prompt_0.mp3
│   │   │   └── ... (all phase phrases pre-generated)
│   │   └── images/
│   │       ├── mascot-idle.svg
│   │       ├── mascot-happy.svg
│   │       ├── mascot-thinking.svg
│   │       ├── mascot-celebrate.svg
│   │       └── world-map-bg.svg
├── src/
│   ├── main.jsx                            # React entry point
│   ├── App.jsx                             # Root component, global state (useReducer)
│   ├── App.css                             # Global styles (mirrors reference CSS)
│   ├── components/
│   │   ├── IntroScreen.jsx                 # Welcome + lesson overview + phase dot tracker
│   │   ├── ProgressMap.jsx                 # 6-phase dot tracker (top bar)
│   │   ├── phases/
│   │   │   ├── WonderPhase.jsx             # Phase 1: Hook animation + ElevenLabs narration
│   │   │   ├── StoryPhase.jsx              # Phase 2: Illustrated narrative panels
│   │   │   ├── SimulatePhase.jsx           # Phase 3: Simulation station wrapper
│   │   │   ├── PlayPhase.jsx               # Phase 4: IntelliPlay™ quiz engine
│   │   │   └── ReflectPhase.jsx            # Phase 5: Journal + completion badge
│   │   ├── simulations/
│   │   │   ├── FactorArrayStation.jsx      # Station A: Build rectangular arrays for factor pairs
│   │   │   ├── FactorTreeStation.jsx       # Station B: Build a branching prime factor tree
│   │   │   └── NumberSorterStation.jsx     # Station C: Sieve grid + Prime/Composite/Neither bins
│   │   ├── quiz/
│   │   │   ├── QuestionRenderer.jsx        # Polymorphic dispatcher → type-specific component
│   │   │   ├── ListFactorsQ.jsx            # Q1: List/select all factors of a number
│   │   │   ├── IsFactorQ.jsx               # Q2: Is a number a factor of another?
│   │   │   ├── ListMultiplesQ.jsx          # Q3: List first n multiples of a number
│   │   │   ├── IsMultipleQ.jsx             # Q4: Is a number a multiple of another?
│   │   │   ├── PrimeOrCompositeQ.jsx       # Q5: Classify prime vs. composite
│   │   │   ├── PrimeFactorizationQ.jsx     # Q6: Prime factorization in index notation
│   │   │   ├── DivisibilityRuleQ.jsx       # Q7: Apply a divisibility rule
│   │   │   ├── PackagingWordProbQ.jsx      # Q8: Word problem — grouping/packaging
│   │   │   ├── CommonFactorsMultiplesQ.jsx # Q9: Common factors/multiples of two numbers
│   │   │   ├── TrueFalseNumberTheoryQ.jsx  # Q10: True/False statement
│   │   │   └── HintOverlay.jsx             # Hint 1 & 2 + animated explanation after 3 fails
│   │   ├── gamification/
│   │   │   ├── XPTracker.jsx               # XP bar + floating XP animation
│   │   │   ├── StarRating.jsx              # 1–3 star rating per case file
│   │   │   ├── BadgePanel.jsx              # Badge unlock toast + panel
│   │   │   ├── StreakCounter.jsx           # Fire streak counter
│   │   │   └── CaseFileMap.jsx             # 10-case-file progress map (horizontal scroll)
│   │   └── shared/
│   │       ├── Mascot.jsx                  # "Sift" the owl detective with mood states
│   │       ├── ArrayGrid.jsx               # Reusable SVG: resizable rows × columns array
│   │       ├── FactorTree.jsx              # Reusable SVG: branching factor-tree diagram
│   │       ├── SieveGrid.jsx               # Reusable SVG/HTML: 1–100 tap-to-cross-out grid
│   │       ├── NumberPad.jsx               # Large tap-friendly numeric input
│   │       └── FeedbackOverlay.jsx         # Correct/incorrect overlay with animation
│   ├── data/
│   │   ├── questionBank.js                 # 100 question objects (all types)
│   │   └── storyContent.js                 # Story phase panel data (text + visuals)
│   ├── hooks/
│   │   ├── useAudio.js                     # ElevenLabs + HTML5 Audio playback hook
│   │   ├── useGameState.js                 # Gamification state hook
│   │   └── useLocalStorage.js              # Session persistence hook (24hr resume)
│   └── utils/
│       ├── audioMap.js                     # AUTO-GENERATED: text → .mp3 path map
│       ├── numberTheory.js                 # Factor/multiple/prime/factorization engine (core)
│       ├── shuffle.js                      # Fisher-Yates randomization
│       ├── scoring.js                      # XP + star calculation + distractor gen
│       └── badgeEngine.js                  # Badge unlock condition logic
├── scripts/
│   ├── generate_audio.js                   # Offline ElevenLabs audio pre-generation
│   └── clean_audio.js                      # Remove orphaned .mp3 files
├── api/
│   └── elevenlabs.js                       # ElevenLabs proxy (if server-side key needed)
├── index.html
├── package.json
├── vite.config.js
└── .gitignore
```

---

## 4. Application State Architecture

### 4.1 Global State (`App.jsx` — `useReducer`)

```
const initialState = {
  // Navigation
  phase: 'intro',            // 'intro'|'wonder'|'story'|'simulate'|'play'|'reflect'|'results'
  storyPanel: 0,              // 0–6 (7 story panels)
  currentSimStation: 0,       // 0=FactorArray, 1=FactorTree, 2=NumberSorter
  simStationsComplete: [false, false, false],
  simRound: 0,                 // Round index within current station (0–3)

  // Play / Challenge phase
  questionSet: [],             // 100 shuffled Question objects
  currentQuestion: 0,          // 0–99
  currentCaseFile: 0,          // 0–9 (10 case files)
  caseScores: Array(10).fill(null),
  hintsUsed: 0,
  attemptCount: 0,             // Attempts on current question (max 3)

  // Gamification
  xp: 0,
  totalStars: 0,
  streak: 0,
  maxStreak: 0,
  badges: [],                  // Array of unlocked badge IDs
  primesIdentifiedCorrectly: 0, // Tracks "Prime Hunter" badge progress
  stationCPerfect: false,       // Tracks "Sharp Sift" badge progress

  // Session metadata
  phaseComplete: {
    wonder: false, story: false, simulate: false,
    play: false, reflect: false,
  },
  sessionId: crypto.randomUUID(),

  // Settings
  audioEnabled: true,           // ElevenLabs narration on/off
  musicEnabled: false,          // Background ambient music (off by default)
};
```

### 4.2 Reducer Action Types

```
const ACTIONS = {
  SET_PHASE: 'SET_PHASE',
  NEXT_STORY_PANEL: 'NEXT_STORY_PANEL',
  ADVANCE_SIM_STATION: 'ADVANCE_SIM_STATION',
  COMPLETE_SIM_STATION: 'COMPLETE_SIM_STATION',
  NEXT_SIM_ROUND: 'NEXT_SIM_ROUND',
  LOAD_QUESTIONS: 'LOAD_QUESTIONS',
  ANSWER_CORRECT: 'ANSWER_CORRECT',
  ANSWER_INCORRECT: 'ANSWER_INCORRECT',
  USE_HINT: 'USE_HINT',
  NEXT_QUESTION: 'NEXT_QUESTION',
  UNLOCK_BADGE: 'UNLOCK_BADGE',
  COMPLETE_PHASE: 'COMPLETE_PHASE',
  TOGGLE_AUDIO: 'TOGGLE_AUDIO',
  TOGGLE_MUSIC: 'TOGGLE_MUSIC',
  RESTORE_SESSION: 'RESTORE_SESSION',
  RESET_SESSION: 'RESET_SESSION',
};
```

### 4.3 Key Reducer Logic

```
// ANSWER_CORRECT dispatch
case ACTIONS.ANSWER_CORRECT: {
  const xpEarned = calcXP(state.attemptCount + 1, state.hintsUsed, state.streak);
  const newStreak = state.streak + 1;
  const caseIndex = Math.floor(state.currentQuestion / 10);
  const newCaseScore = (state.caseScores[caseIndex] || 0) + 1;
  const updatedCaseScores = [...state.caseScores];
  updatedCaseScores[caseIndex] = newCaseScore;

  return {
    ...state,
    xp: state.xp + xpEarned,
    streak: newStreak,
    maxStreak: Math.max(state.maxStreak, newStreak),
    caseScores: updatedCaseScores,
    totalStars: calcTotalStars(updatedCaseScores),
    hintsUsed: 0,
    attemptCount: 0,
  };
}

// ANSWER_INCORRECT dispatch
case ACTIONS.ANSWER_INCORRECT: {
  return {
    ...state,
    streak: 0,
    attemptCount: state.attemptCount + 1,
  };
}
```

---

## 5. Number Theory Engine (`utils/numberTheory.js`)

All factor/multiple/prime logic is performed with **plain integer arithmetic** (no floating point), keeping every operation deterministic and easily testable.

```
// Return all factors of n, sorted ascending
export function getFactors(n) {
  const factors = [];
  for (let i = 1; i * i <= n; i++) {
    if (n % i === 0) {
      factors.push(i);
      if (i !== n / i) factors.push(n / i);
    }
  }
  return factors.sort((a, b) => a - b);
}

// Return factor pairs of n, e.g. [[1,24],[2,12],[3,8],[4,6]]
export function getFactorPairs(n) {
  const pairs = [];
  for (let i = 1; i * i <= n; i++) {
    if (n % i === 0) pairs.push([i, n / i]);
  }
  return pairs;
}

// Return the first `count` multiples of n (n, 2n, 3n, ...)
export function getMultiples(n, count = 5) {
  return Array.from({ length: count }, (_, i) => n * (i + 1));
}

// Trial division primality test up to sqrt(n)
export function isPrime(n) {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

// Prime factorization as an array of { prime, exponent } pairs
export function primeFactorize(n) {
  const result = [];
  let remaining = n;
  for (let p = 2; p * p <= remaining; p++) {
    let exponent = 0;
    while (remaining % p === 0) {
      remaining /= p;
      exponent++;
    }
    if (exponent > 0) result.push({ prime: p, exponent });
  }
  if (remaining > 1) result.push({ prime: remaining, exponent: 1 });
  return result;
}

// Format a prime factorization array as an index-notation string, e.g. "2^3 x 3^2"
export function formatFactorization(factorization) {
  return factorization
    .map(({ prime, exponent }) => (exponent === 1 ? `${prime}` : `${prime}^${exponent}`))
    .join(' x ');
}

// Common factors of two numbers
export function getCommonFactors(a, b) {
  const factorsA = new Set(getFactors(a));
  return getFactors(b).filter((f) => factorsA.has(f)).sort((x, y) => x - y);
}

// First `count` common multiples of two numbers (brute-force, small ranges only)
export function getCommonMultiples(a, b, count = 3) {
  const multiplesA = new Set(getMultiples(a, 200));
  const common = [];
  for (let k = 1; common.length < count; k++) {
    const candidate = b * k;
    if (multiplesA.has(candidate)) common.push(candidate);
  }
  return common;
}

// Divisibility rule check (returns boolean; also used to generate rule-based hints)
export function isDivisibleBy(n, divisor) {
  return n % divisor === 0;
}

// Sieve of Eratosthenes up to limit (used by Station C to drive the sieve grid)
export function sieveOfEratosthenes(limit = 100) {
  const isCompositeFlags = new Array(limit + 1).fill(false);
  const primes = [];
  for (let i = 2; i <= limit; i++) {
    if (!isCompositeFlags[i]) {
      primes.push(i);
      for (let j = i * i; j <= limit; j += i) isCompositeFlags[j] = true;
    }
  }
  return primes;
}
```

All quiz and simulation components consume and emit **plain integers and arrays of integers only** — no floating-point rounding anywhere in the factor/multiple/prime engine, eliminating precision bugs entirely.

---

## 6. Question Data Model

### 6.1 Question Schema

```
interface Question {
  id: string;                    // e.g. "Q1_003", "Q7_008"
  type: QuestionType;            // One of 10 enum values (see below)
  caseFile: number;              // 0–9 (which case file this belongs to)
  difficulty: 1 | 2 | 3;         // 1=easy, 2=medium, 3=hard

  // Core number-theory values
  targetNumber?: number;
  secondNumber?: number;         // For common-factor/multiple and is-factor/is-multiple types
  divisor?: number;               // For divisibility-rule questions

  // Rendering
  questionText: string;          // Full narrated question text (ElevenLabs reads this)
  visual: VisualType;             // 'arrayGrid' | 'factorTree' | 'sieveGrid' | 'sentence' | 'trueFalse'

  // MCQ
  options?: (string|number)[];   // 4 MCQ options (always includes correctAnswer)

  // Hints
  hint1: string;                  // Shown after 1 wrong attempt
  hint2: string;                  // Shown after 2 wrong attempts (animation trigger)
  explanation: string;            // Full text explanation after 3 fails (read aloud)

  // Word problems only
  characterName?: string;
  city?: string;
  contextObject?: string;         // 'cookies', 'roses', 'lockers', 'mangoes', 'gift boxes'

  // True/False only
  isTrue?: boolean;

  // Answer
  correctAnswer: number | string;
}

type QuestionType =
  | 'list_factors'              // Q1
  | 'is_factor'                 // Q2
  | 'list_multiples'            // Q3
  | 'is_multiple'                // Q4
  | 'prime_or_composite'        // Q5
  | 'prime_factorization'        // Q6
  | 'divisibility_rule'          // Q7
  | 'packaging_word_problem'     // Q8
  | 'common_factors_multiples'   // Q9
  | 'true_false_number_theory';  // Q10

type VisualType =
  | 'arrayGrid'    // ArrayGrid factor visual
  | 'factorTree'   // FactorTree diagram
  | 'sieveGrid'    // SieveGrid 1–100 visual
  | 'sentence'     // Equation-style text with a highlighted blank
  | 'trueFalse';   // Statement + True/False buttons
```

### 6.2 Sample Question Objects

```
// Q1 — List Factors
{
  id: "Q1_001",
  type: "list_factors",
  caseFile: 0,
  difficulty: 1,
  targetNumber: 48,
  questionText: "Which of these numbers is NOT a factor of 48?",
  visual: "arrayGrid",
  hint1: "Try dividing 48 by each option. Which one leaves a remainder?",
  hint2: "48 ÷ 9 = 5 remainder 3 — that one doesn't divide evenly!",
  explanation: "The factors of 48 are 1, 2, 3, 4, 6, 8, 12, 16, 24, 48. Nine is not on this list.",
  options: [6, 8, 9, 12],
  correctAnswer: 9,
}

// Q6 — Prime Factorization
{
  id: "Q6_004",
  type: "prime_factorization",
  caseFile: 6,
  difficulty: 3,
  targetNumber: 180,
  questionText: "Write 180 as a product of its prime factors, using index notation.",
  visual: "factorTree",
  hint1: "Start by splitting 180 into 18 x 10.",
  hint2: "18 = 2 x 3 x 3, and 10 = 2 x 5. Combine all the prime factors together!",
  explanation: "180 = 2 x 2 x 3 x 3 x 5 = 2^2 x 3^2 x 5.",
  options: ["2^2 x 3^2 x 5", "2 x 3^3 x 5", "2^3 x 3 x 5", "2^2 x 3 x 5^2"],
  correctAnswer: "2^2 x 3^2 x 5",
}

// Q8 — Packaging Word Problem
{
  id: "Q8_002",
  type: "packaging_word_problem",
  caseFile: 7,
  difficulty: 2,
  targetNumber: 90,
  questionText: "A florist in Seoul has 90 roses. Which of these box sizes leaves no roses left over?",
  visual: "sentence",
  characterName: "Sofia",
  city: "Seoul",
  contextObject: "roses",
  hint1: "A box size 'works' only if it divides 90 exactly — try dividing each option into 90.",
  hint2: "90 ÷ 7 = 12 remainder 6 — that size leaves roses over!",
  explanation: "90 is divisible by 9 (90 ÷ 9 = 10 exactly), so boxes of 9 leave none over.",
  options: [7, 8, 9, 11],
  correctAnswer: 9,
}

// Q9 — Common Factors
{
  id: "Q9_005",
  type: "common_factors_multiples",
  caseFile: 8,
  difficulty: 3,
  targetNumber: 18,
  secondNumber: 24,
  questionText: "List all the common factors of 18 and 24.",
  visual: "arrayGrid",
  hint1: "List the factors of 18 first: 1, 2, 3, 6, 9, 18.",
  hint2: "Now list the factors of 24: 1, 2, 3, 4, 6, 8, 12, 24. Which ones appear in both lists?",
  explanation: "The factors of 18 are 1, 2, 3, 6, 9, 18. The factors of 24 are 1, 2, 3, 4, 6, 8, 12, 24. The common factors are 1, 2, 3, and 6.",
  options: ["1, 2, 3, 6", "1, 2, 4, 6", "2, 3, 6, 9", "1, 3, 6, 9"],
  correctAnswer: "1, 2, 3, 6",
}
```

---

## 7. Array, Tree & Sieve SVG Components

### 7.1 `ArrayGrid.jsx` — Reusable Rectangular Array

```
// ArrayGrid.jsx — renders a rows x cols grid of tiles for a given target number
const ArrayGrid = ({
  rows,
  cols,
  targetNumber,
  animated = false,
  tileSize = 28,
}) => {
  const total = rows * cols;
  const isValid = total === targetNumber;

  return (
    <div className="array-grid-wrapper">
      <svg
        viewBox={`0 0 ${cols * tileSize + 20} ${rows * tileSize + 20}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {Array.from({ length: rows }).map((_, r) =>
          Array.from({ length: cols }).map((_, c) => (
            <rect
              key={`${r}-${c}`}
              x={10 + c * tileSize}
              y={10 + r * tileSize}
              width={tileSize - 4}
              height={tileSize - 4}
              rx="4"
              fill={isValid ? '#4A90D9' : '#F5A623'}
              className={animated ? 'array-tile-animated' : ''}
            />
          ))
        )}
      </svg>
      <div className="array-grid-readout">
        {rows} rows x {cols} cols = {total} {isValid ? '✓' : `(target: ${targetNumber})`}
      </div>
    </div>
  );
};
```

Animation variants:

- `animated=true` → CSS transition on tile position/opacity (400ms ease-in-out) whenever `rows`/`cols` changes
- `shake` variant → CSS `shake` keyframe applied to `.array-grid-wrapper` on an invalid (non-exact) array
- `bounce` variant → CSS `bounceIn` keyframe applied when a valid factor pair is logged

### 7.2 `FactorTree.jsx` — Branching Prime Factor Diagram

```
// FactorTree.jsx — recursive branching tree; leaf nodes lock gold once prime
const FactorTree = ({ node, onSplit }) => {
  const prime = isPrime(node.value);
  return (
    <div className="factor-tree-node">
      <div
        className={prime ? 'tree-node-prime' : 'tree-node-composite'}
        onClick={() => !prime && onSplit(node)}
      >
        {node.value}
      </div>
      {node.children && (
        <div className="factor-tree-children">
          {node.children.map((child, i) => (
            <FactorTree key={i} node={child} onSplit={onSplit} />
          ))}
        </div>
      )}
    </div>
  );
};

// onSplit(node) opens a factor-pair picker restricted to getFactorPairs(node.value)
// excluding the trivial pair [1, node.value]; selecting {a, b} sets
// node.children = [{ value: a }, { value: b }]
```

### 7.3 `SieveGrid.jsx` — 1–100 Tap-to-Cross-Out Grid

```
// SieveGrid.jsx — 10x10 grid; tapping a prime crosses out all its multiples
const SieveGrid = ({ crossedOut, onTogglePrime, limit = 100 }) => {
  return (
    <div className="sieve-grid">
      {Array.from({ length: limit }, (_, i) => i + 1).map((num) => (
        <button
          key={num}
          className={crossedOut.has(num) ? 'sieve-tile-crossed' : 'sieve-tile-active'}
          onClick={() => onTogglePrime(num)}
          disabled={num === 1}
        >
          {num}
        </button>
      ))}
    </div>
  );
};

// onTogglePrime(p): if p is not already crossed out, mark p*2, p*3, p*4, ...
// up to `limit` as crossed out (does not cross out p itself)
```

---

## 8. Simulation Station Component Specs

### 8.1 `FactorArrayStation.jsx` — Station A (Concrete)

```
const [round, setRound] = useState(getStationARound(state.simRound));
// round: { targetNumber: 24, minPairsToLog: 4 }
const [rows, setRows] = useState(1);
const [cols, setCols] = useState(round.targetNumber);
const [loggedPairs, setLoggedPairs] = useState([]);   // Array of {rows, cols}
```

**Interaction (Drag/tap row-col controls):**

- `+1 row` / `−1 row` / `+1 col` / `−1 col` buttons adjust `rows`/`cols`
- `ArrayGrid` animates to the new dimensions on every change
- "Log this factor pair" button enabled only when `rows * cols === round.targetNumber`
- Logging a pair adds `{rows, cols}` to `loggedPairs` (de-duplicated, order-independent)

**Completion Check:**

- `loggedPairs.length >= round.minPairsToLog` → "Submit case notes" button unlocks
- On correct submit: mascot celebrates, ElevenLabs plays celebration audio
- On incomplete submit: shake + narration "Not quite an even array — check for leftover tiles!"

**Station A Rounds (4 rounds, randomized order):**

```
{ targetNumber: 24, minPairsToLog: 4 }   // many easy factor pairs
{ targetNumber: 36, minPairsToLog: 4 }   // includes a square pair 6x6
{ targetNumber: 60, minPairsToLog: 5 }   // larger number, more pairs
{ targetNumber: 47, minPairsToLog: 1 }   // prime — only 1x47 exists
```

### 8.2 `FactorTreeStation.jsx` — Station B (Pictorial)

```
const [tree, setTree] = useState({ value: round.targetNumber, children: null });
const [isComplete, setIsComplete] = useState(false);
```

**Split Handling:**

- `onSplit(node)` opens a factor-pair picker restricted to `getFactorPairs(node.value)` (excluding the trivial `[1, n]` pair)
- Selecting `{a, b}` sets `node.children = [{ value: a, children: null }, { value: b, children: null }]`
- Recursively re-renders `FactorTree`; nodes where `isPrime(value)` is true lock gold and stop accepting further splits

**Completion Check (`checkTreeComplete`):**

```
function checkTreeComplete(node) {
  if (!node.children) return isPrime(node.value);
  return node.children.every(checkTreeComplete);
}

function collectLeafProduct(node) {
  if (!node.children) return [node.value];
  return node.children.flatMap(collectLeafProduct);
}
// Verify: checkTreeComplete(tree) === true
// AND: collectLeafProduct(tree).reduce((a,b) => a*b, 1) === round.targetNumber
```

**Rounds (3 rounds per station):**

- Round 1: Two-level tree (e.g. 36)
- Round 2: Three-level tree (e.g. 72)
- Round 3: Larger number with a repeated prime factor, prompts index-notation entry (e.g. 150 = 2 x 3 x 5^2)

### 8.3 `NumberSorterStation.jsx` — Station C (Abstract)

```
const [crossedOut, setCrossedOut] = useState(new Set());
const [primesUsed, setPrimesUsed] = useState([]);   // Sequence of primes tapped: [2, 3, 5, 7]
const [sortedBins, setSortedBins] = useState({ prime: [], composite: [], neither: [] });
```

**Sieve Step:**

- `onTogglePrime(p)` (see `SieveGrid.jsx`) crosses out all multiples of `p` up to the round's `limit`
- Round 1 limit = 30 (sieve with 2, 3); Round 2 limit = 60 (sieve with 2, 3, 5); Round 3 limit = 100 (full sieve with 2, 3, 5, 7)

**Classify Step:**

- After sieving, a sample of un-crossed numbers (excluding 1) must be dragged into the **Prime** bin
- A sample of crossed-out numbers must be dragged into the **Composite** bin
- The number 1 must be dragged into **Neither**
- Validated against `isPrime(n)` from `numberTheory.js`

**Divisibility Equation Step:**

- A short set of True/False divisibility-rule prompts appears (e.g. "Is 5 a factor of 3,215? Use the divisibility rule for 5.")
- Validated against `isDivisibleBy(n, divisor)`

**On submit:** correct sorts/answers glow green; incorrect glow red with a hint referencing the specific divisibility rule

---

## 9. Audio Pipeline (ElevenLabs — Matching `audio_generation_pipeline.md`)

### 9.1 Voice Configuration

- **Voice Name:** Alice
- **Voice ID:** `Xb7hH8MSUJpSbSDYk0k2`
- **Model:** `eleven_multilingual_v2`
- **API Key Var:** `VITE_ELEVENLABS_API_KEY` (in `.env.local`)

### 9.2 Speech Style Settings (per style type)

| Style | Stability | Similarity Boost | Style | Speaker Boost |
| --- | --- | --- | --- | --- |
| `celebration` | 0.12 | 0.45 | 0.75 | ✅ |
| `encouragement` | 0.16 | 0.50 | 0.65 | ✅ |
| `question` | 0.20 | 0.55 | 0.55 | ✅ |
| `emphasis` | 0.16 | 0.50 | 0.60 | ✅ |
| `thinking` | 0.24 | 0.60 | 0.35 | ✅ |
| `statement` / `instruction` | 0.20 | 0.55 | 0.50 | ✅ |

### 9.3 Offline Pre-generation Script (`scripts/generate_audio.js`)

```
const phrases = [
  // Phase 1 — Wonder
  { text: "A baker in Cairo has eighty-four cookies.", style: 'thinking' },
  { text: "She wants to pack them into equal boxes, with more than one cookie per box, and none left over. How many different box sizes could she use?", style: 'question' },
  { text: "Let's discover how factors help us crack this case!", style: 'encouragement' },

  // Phase 2 — Story Panels
  { text: "John, Mike, Sarah, Emma, Liam, Sofia, Noah, Aisha, Carlos, and Yuki form the Global Prime Detective Agency.", style: 'statement' },
  { text: "Mike in Cairo finds a locker with a two-digit code. The clue reads: I am a factor of eighty-four, and also a factor of sixty.", style: 'statement' },
  { text: "Sarah in Rio needs to arrange sixty mangoes into equal rows for her market stall, with no mangoes left over.", style: 'statement' },
  { text: "Aisha in Nairobi finds a strange number: forty-seven. It has only two factors, one and itself.", style: 'emphasis' },
  { text: "Carlos in Mexico City builds a factor tree to crack a vault code, splitting seventy-two again and again until only primes remain.", style: 'statement' },
  { text: "Every number has a hidden fingerprint made of primes. The Global Prime Detective Agency never fails to crack the case!", style: 'emphasis' },

  // Phase 3 — Simulation Instructions
  { text: "Rearrange the rows and columns until every tile is used, with no gaps!", style: 'instruction' },
  { text: "Each array you build reveals a real factor pair. How many can you find?", style: 'question' },
  { text: "Tap a number to split it into two factors. Keep going until every branch ends in a prime!", style: 'instruction' },
  { text: "Cross out the multiples on the grid, then sort the numbers that remain.", style: 'instruction' },

  // Phase 4 — Feedback
  { text: "Case cracked! Your factor detective work is perfect! You are a true Prime Detective!", style: 'celebration' },
  { text: "Not quite the right clue! Let's check the number again.", style: 'encouragement' },
  { text: "Let's test it together! Can you divide it out with me?", style: 'thinking' },

  // Phase 5 — Reflect
  { text: "If a number were a suspect, what clues would you look for to prove it is prime? Tell Sift what you learned today!", style: 'thinking' },
  { text: "Lesson complete! You are a Global Prime Detective Champion!", style: 'celebration' },

  // Badge unlocks
  { text: "Badge unlocked! You are a Junior Detective!", style: 'celebration' },
  { text: "Badge unlocked! Factor Finder! You completed all three stations!", style: 'celebration' },
  { text: "Badge unlocked! Prime Champion! You scored over eighty percent!", style: 'celebration' },
];

// Script hits ElevenLabs API for each phrase, saves to public/assets/audio/
// Auto-generates src/utils/audioMap.js mapping text → .mp3 path
// Rate-limits at 500ms between API calls (per audio_generation_pipeline.md)
```

### 9.4 Frontend Audio Engine (`src/hooks/useAudio.js`)

```
// Step 1: Check audioMap for pre-generated static asset
// Step 2: If not found + API key present → fetch from ElevenLabs dynamically
// Step 3: Cache dynamic result in elevenLabsCache (in-memory Map)
// Step 4: Play via HTML5 Audio API (new Audio(url))
// Step 5: While segment i plays → preload segment i+1 (eager preload)

const elevenLabsCache = new Map(); // In-memory; cleared on page refresh

export async function getAudioUrl(text, style = 'statement', apiKey) {
  // 1. Static map check (fastest path)
  if (audioMap[text]) return audioMap[text];

  // 2. Memory cache check
  const cacheKey = `${text}::${style}`;
  if (elevenLabsCache.has(cacheKey)) return elevenLabsCache.get(cacheKey);

  // 3. Dynamic generation (requires API key)
  if (!apiKey) return null; // Silent skip — no fallback

  const styleSettings = STYLE_SETTINGS[style] ?? STYLE_SETTINGS.statement;
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/Xb7hH8MSUJpSbSDYk0k2`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: styleSettings,
      }),
    }
  );

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  elevenLabsCache.set(cacheKey, url);
  return url;
}

export async function narrate(segments, apiKey, onSegmentStart) {
  for (let i = 0; i < segments.length; i++) {
    const { text, style } = segments[i];
    const url = await getAudioUrl(text, style, apiKey);
    if (!url) continue; // Silent skip if no audio available

    // Eager preload next segment
    if (i + 1 < segments.length) {
      getAudioUrl(segments[i + 1].text, segments[i + 1].style, apiKey);
    }

    if (onSegmentStart) onSegmentStart(i);
    await playAudio(url); // Resolves on 'ended' event
  }
}

async function playAudio(url) {
  return new Promise((resolve) => {
    const audio = new Audio(url);
    audio.onended = resolve;
    audio.onerror = resolve; // Silent fail — never block UX
    audio.play().catch(resolve);
  });
}
```

### 9.5 Audio Cleanup (`scripts/clean_audio.js`)

- Imports `audioMap.js` to determine all valid referenced `.mp3` paths
- Scans `public/assets/audio/` for all `.mp3` files
- Deletes any `.mp3` not present in `audioMap` (orphaned files)
- Run after any phrase deletion or text edit in `generate_audio.js`

### 9.6 Narration Synchronization Rules (1:1 Parity)

> **CRITICAL:** Every on-screen text string that is narrated must match `narration.js` **exactly** (same words, same punctuation, same capitalization). Titles, headings, and case-file names are **never** narrated.

Any UI text change requires:

1. Update `generate_audio.js` `phrases` array
2. Re-run: `node scripts/generate_audio.js`
3. Update corresponding text in the React UI component
4. Optionally run: `node scripts/clean_audio.js`

---

## 10. Randomization Engine

### 10.1 Fisher-Yates Shuffle (`utils/shuffle.js`)

```
export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateSessionQuestions(bank) {
  const byType = {};
  bank.forEach(q => {
    if (!byType[q.type]) byType[q.type] = [];
    byType[q.type].push(q);
  });

  // Pick 10 from each type (shuffled), then shuffle the combined 100
  const selected = Object.values(byType)
    .flatMap(qs => shuffleArray(qs).slice(0, 10));

  return shuffleArray(selected);
}
```

### 10.2 MCQ Distractor Generation (`utils/scoring.js`)

```
export function generateFactorDistractors(correctFactors, targetNumber, count = 3) {
  const distractors = new Set();
  // Strategy: nearby integers that are NOT factors of targetNumber — plausible near-misses
  let candidate = 2;
  while (distractors.size < count && candidate < targetNumber) {
    if (!correctFactors.includes(candidate) && candidate !== 1) {
      distractors.add(candidate);
    }
    candidate++;
  }
  return shuffleArray([...correctFactors.slice(0, 1), ...distractors]);
}

export function generatePrimeDistractors(n) {
  // Common near-miss composites that "look" prime to learners: 51, 91, 119, 133
  const nearMissComposites = [51, 91, 119, 133, 143, 161];
  return shuffleArray(nearMissComposites).slice(0, 3);
}
```

### 10.3 Session Persistence (24-hour resume)

```
const SESSION_KEY = 'intellia_factors_multiples_primes_v1';

// On app mount: restore if within 24 hours
const saved = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
if (saved && Date.now() - saved.timestamp < 86400000) {
  dispatch({ type: ACTIONS.RESTORE_SESSION, payload: saved });
}

// On every state change: persist progress
useEffect(() => {
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    phase: state.phase,
    storyPanel: state.storyPanel,
    simStationsComplete: state.simStationsComplete,
    currentQuestion: state.currentQuestion,
    xp: state.xp,
    streak: state.streak,
    maxStreak: state.maxStreak,
    badges: state.badges,
    caseScores: state.caseScores,
    phaseComplete: state.phaseComplete,
    timestamp: Date.now(),
  }));
}, [state]);
```

---

## 11. Gamification Implementation

### 11.1 XP Calculation (`utils/scoring.js`)

```
export function calcXP(attemptNumber, hintsUsed, streak) {
  const base = attemptNumber === 1 ? 10 : hintsUsed > 0 ? 5 : 7;
  const streakBonus = streak >= 5 ? 5 : 0;
  return base + streakBonus;
}
```

### 11.2 Star Rating (per case file of 10 questions)

```
export function calcStars(correct, total = 10) {
  if (correct >= 9) return 3; // Gold: ≥90%
  if (correct >= 7) return 2; // Silver: ≥70%
  if (correct >= 5) return 1; // Bronze: ≥50% (case-file unlock gate)
  return 0; // Try again
}

export function canUnlockCaseFile(caseScore) {
  return caseScore !== null && caseScore >= 5;
}

export function calcTotalStars(caseScores) {
  return caseScores.reduce((sum, cs) => sum + (cs !== null ? calcStars(cs) : 0), 0);
}
```

### 11.3 Badge Engine (`utils/badgeEngine.js`)

```
export const BADGES = [
  {
    id: 'junior_detective',
    label: '🏅 Junior Detective',
    description: 'Complete Wonder and Story phases',
    condition: (s) => s.phaseComplete.wonder && s.phaseComplete.story,
  },
  {
    id: 'factor_finder',
    label: '🥈 Factor Finder',
    description: 'Complete all 3 Simulation stations',
    condition: (s) => s.simStationsComplete.every(Boolean),
  },
  {
    id: 'prime_champion',
    label: '🥇 Prime Champion',
    description: 'Score 80%+ in Play phase',
    condition: (s) => {
      const totalCorrect = s.caseScores.reduce((sum, cs) => sum + (cs || 0), 0);
      return totalCorrect >= 80;
    },
  },
  {
    id: 'perfect_case_file',
    label: '💎 Perfect Case File',
    description: 'Score 10/10 in any case file',
    condition: (s) => s.caseScores.some(cs => cs === 10),
  },
  {
    id: 'case_streak',
    label: '🔥 Case Streak',
    description: 'Achieve a streak of 10 consecutive correct answers',
    condition: (s) => s.maxStreak >= 10,
  },
  {
    id: 'global_detective',
    label: '🌍 Global Detective',
    description: 'Complete all 6 phases',
    condition: (s) => Object.values(s.phaseComplete).every(Boolean),
  },
  {
    id: 'sharp_sift',
    label: '🎯 Sharp Sift',
    description: 'Complete Station C without any wrong sort',
    condition: (s) => s.stationCPerfect === true,
  },
  {
    id: 'prime_hunter',
    label: '🔢 Prime Hunter',
    description: 'Correctly identify 10 prime numbers across the session',
    condition: (s) => (s.primesIdentifiedCorrectly || 0) >= 10,
  },
];

export function checkBadges(state) {
  return BADGES
    .filter(b => !state.badges.includes(b.id) && b.condition(state))
    .map(b => b.id);
}

// Call after every state update that could unlock a badge:
const newBadges = checkBadges(newState);
if (newBadges.length > 0) {
  dispatch({ type: ACTIONS.UNLOCK_BADGE, payload: newBadges });
  newBadges.forEach(id => {
    const badge = BADGES.find(b => b.id === id);
    narrate([{ text: badge.description, style: 'celebration' }], apiKey);
  });
}
```

---

## 12. CSS Animation Keyframes (matching grade5-time-intervals.vercel.app style)

```
@keyframes bounceIn {
  0%   { transform: scale(0.3); opacity: 0; }
  50%  { transform: scale(1.05); opacity: 1; }
  70%  { transform: scale(0.9); }
  100% { transform: scale(1); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%      { transform: translateX(-8px); }
  40%      { transform: translateX(8px); }
  60%      { transform: translateX(-6px); }
  80%      { transform: translateX(6px); }
}

@keyframes floatUp {
  0%   { transform: translateY(0) scale(1); opacity: 1; }
  100% { transform: translateY(-60px) scale(1.5); opacity: 0; }
}

@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(74, 144, 217, 0.4); }
  50%      { box-shadow: 0 0 0 12px rgba(74, 144, 217, 0); }
}

@keyframes celebrate {
  0%   { transform: rotate(-5deg) scale(1); }
  25%  { transform: rotate(5deg) scale(1.1); }
  50%  { transform: rotate(-3deg) scale(1.05); }
  75%  { transform: rotate(3deg) scale(1.1); }
  100% { transform: rotate(0deg) scale(1); }
}

@keyframes slideInUp {
  from { transform: translateY(30px); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}

@keyframes treeNodeGrow {
  from { transform: scale(0); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}

@keyframes sieveCrossOut {
  from { opacity: 1; }
  to   { opacity: 0.25; text-decoration: line-through; }
}

/* Stagger: each array tile/tree node gets animation-delay: (index * 60ms) */
```

---

## 13. Component Prop Contracts

| Component | Props | Returns |
| --- | --- | --- |
| `ArrayGrid` | `{ rows, cols, targetNumber, animated?, tileSize? }` | SVG grid + readout element (inline, responsive) |
| `FactorTree` | `{ node: {value, children}, onSplit }` | Recursive branching tree element |
| `SieveGrid` | `{ crossedOut: Set<number>, onTogglePrime, limit? }` | 1–100 tappable grid element |
| `NumberPad` | `{ value, onChange, onSubmit }` | Large tap-friendly numeric input (min 44×44px targets) |
| `Mascot` | `{ mood: 'idle'\|'happy'\|'thinking'\|'celebrating'\|'encouraging' }` | img/svg + CSS animation class mapped to mood |
| `QuestionRenderer` | `{ question: Question, onAnswer: (answer) => void, hints: number }` | Type-specific question component |
| `FeedbackOverlay` | `{ isCorrect: boolean, explanation?: string, xpEarned: number, onContinue: () => void }` | Animated modal overlay (bounceIn correct / shake wrong) |
| `CaseFileMap` | `{ caseScores: (number\|null)[], currentCaseFile: number, onSelectCase: (i) => void }` | Horizontal scrollable case-file list with star ratings and lock icons |
| `BadgePanel` | `{ badges: string[], newBadgeId?: string }` | Badge grid with unlock toast animation for `newBadgeId` |

---

## 14. Performance Requirements

| Metric | Target |
| --- | --- |
| Initial load time | < 2 seconds (Vite production build) |
| Time to first meaningful paint | < 1 second |
| SVG/diagram animation frame rate | 60 fps |
| Memory usage | < 60 MB |
| Bundle size (gzipped) | < 600 KB |
| Lighthouse Performance score | ≥ 90 |
| Lighthouse Accessibility score | ≥ 90 |
| ElevenLabs pre-gen audio TTFB | 0ms (static .mp3 assets) |
| ElevenLabs dynamic audio TTFB | < 2 seconds (API latency) |

---

## 15. Browser & Device Support

| Environment | Support Level |
| --- | --- |
| Chrome 110+ (desktop) | Full |
| Safari 15+ (iPad/Mac) | Full |
| Firefox 110+ | Full |
| Edge 110+ | Full |
| Android Chrome | Full |
| iOS Safari 15+ | Full |
| IE 11 | Not supported |

Primary test device: Desktop Chrome (1280px+) and tablet (768px, touch) — classroom use context.

---

## 16. Quality & Testing Standards

- **Unit tests** for `numberTheory.js` covering: `getFactors`, `getFactorPairs`, `getMultiples`, `isPrime` (including known primes/composites and edge cases 0, 1, 2), `primeFactorize` (verifying leaf product equals original number), `getCommonFactors`, `getCommonMultiples`, and `sieveOfEratosthenes` (verified against a known prime list up to 100)
- **Snapshot tests** for `ArrayGrid`, `FactorTree`, and `SieveGrid` SVG components at each size/state variant
- **Randomization integrity test:** run `generateSessionQuestions()` 1,000 times and assert no two runs produce an identical question order
- **Accessibility audit:** automated Lighthouse + manual keyboard-navigation pass on all 6 phases
- **Audio parity check:** automated script diffs all narrated strings in `narration.js` against `generate_audio.js`'s `phrases` array to catch drift

---

**Document Version:** 1.0 | September 2026
**Product:** Intellia — Grade 7 Math, Factors, Multiples and Primes
**Reference UI:** https://grade5-time-intervals.vercel.app/
**Reference Repo:** https://github.com/p1pachare-cloud/Grade5-Time-Intervals
**Audio Pipeline:** ElevenLabs (Alice, `Xb7hH8MSUJpSbSDYk0k2`, `eleven_multilingual_v2`) — per `audio_generation_pipeline.md`
