# Product Requirements Document (PRD)
## Factors, Multiples and Primes | Grade 7 Math
### Intellia SG | Global Grade 7 Mathematics Curriculum

---

## 1. Executive Summary

This document defines the product requirements for **"The Global Prime Detective Agency — Factors, Multiples and Primes"**, an interactive, gamified, simulation-based lesson module for **Grade 7 students (age 12–13)**, teaching **Factors, Multiples and Prime Numbers** (factor pairs, multiples, divisibility rules, prime vs. composite classification, prime factorization/factor trees, and common factors & common multiples).

The module is built as a standalone **React (Vite + JSX)** web application and is designed to **strictly mirror the visual language, UX structure, and interaction patterns** of the reference product:

- Reference site: **https://grade5-time-intervals.vercel.app/**
- Reference repository: **https://github.com/p1pachare-cloud/Grade5-Time-Intervals** (which itself contains a PRD/TRD pair used as the structural template for this document)

The module will be hosted within the Intellia course catalogue (the same family of URLs as `https://intelliasg.com/courses/grade-3-math`, restructured for Grade 7), e.g.:

```
https://intelliasg.com/courses/grade-7-math/lessons/factors-multiples-primes/
```

Audio narration follows the **ElevenLabs pipeline** documented in `audio_generation_pipeline.md` (Voice: **Alice**, Voice ID: `Xb7hH8MSUJpSbSDYk0k2`, Model: `eleven_multilingual_v2`), using the same hybrid pre-generation + dynamic fallback architecture, the same per-style voice settings table, and the same strict rule that **only paragraph text and questions are narrated — never titles or headings**.

The lesson follows a global, multicultural narrative featuring students from around the world (John, Mike, Sarah, Emma, Liam, Sofia, Noah, Aisha, Carlos, Yuki, Priya, Fatima, Diego, Chloe, Ravi) who form **The Global Prime Detective Agency**, a junior-detective club guided by mascot **Sift the Owl**, cracking numeric mysteries in cities around the world using factors, multiples, and primes.

The module follows Intellia's proven **6-phase learner journey**: INTRO → WONDER → STORY → SIMULATE → PLAY → REFLECT.

---

## 2. Product Vision & Goals

**Vision:** To make factors, multiples, and prime numbers feel like real detective work — helping 12–13 year old learners confidently classify, decompose, and reason about whole numbers through a fully simulation-first, story-driven, and randomized gamified experience.

**Goals**

| Goal | Metric |
| --- | --- |
| Learning Completion | ≥85% of students complete all 6 phases |
| Practice Engagement | ≥90% attempt at least 10 practice questions |
| Score Achievement | Average challenge score ≥75% on first attempt |
| Session Duration | Average engagement ≥18 minutes per session |
| Curriculum Alignment | 100% aligned to global Grade 7 number-theory standards |
| Phase Progression | ≥80% reach Play phase in a single session |
| Simulation Interaction Rate | ≥95% attempt all 3 simulation stations |
| Randomization Integrity | 0% repeated question order across sessions |

---

## 3. Target Users

**Primary: Grade 7 Students (Age 12–13)**

- Transitioning from concrete arithmetic to structured number-theory reasoning
- Learn best through simulation-first exploration (arrays, factor trees, sieve grids) before formal practice
- Motivated by streaks, badges, a detective-agency case-file world map, and a strong mystery-driven story arc
- International/global classroom context — familiar with locker codes, packaging puzzles, and scheduling patterns

**Secondary: Parents & Teachers**

- Assign as classwork, homework, or enrichment
- Expect alignment to recognized global standards (see Section 4)
- Monitor completion via in-lesson phase indicators

---

## 4. Curriculum Alignment — Global Grade 7 Mathematics

**Topic:** Factors, Multiples and Primes
**Programme:** Intellia Grade 7 Math — Number Theory: Factors, Multiples & Primes
**Lesson URL:** `https://intelliasg.com/courses/grade-7-math/lessons/factors-multiples-primes/`

**Source References (cross-referenced against major global frameworks):**

- Singapore MOE Secondary 1 Mathematics Syllabus — Chapter 1: Primes, Factors and Multiples (HCF & LCM foundation)
- U.S. Common Core Math Standards — Grade 6 The Number System (6.NS.B.4: GCF and LCM), extended into Grade 7 fluency
- UK National Curriculum — Key Stage 3, Year 7 Number (recognise/use factors, multiples, primes; use prime factor decomposition)
- CBSE/NCERT Class 6/7 Mathematics — "Playing with Numbers" chapter (factors, multiples, prime/composite, divisibility rules, prime factorization)
- Australian Curriculum — Year 7 Number and Algebra (ACMNA149: identify and describe factors and multiples, index notation for prime factorization)

**Learning Objectives Covered:**

| LO | Description |
| --- | --- |
| LO1 | Define and identify factors of a given whole number |
| LO2 | List all factors of numbers up to 100 systematically, using factor pairs |
| LO3 | Define and identify multiples of a given whole number |
| LO4 | List the first several multiples of a number |
| LO5 | Distinguish prime numbers from composite numbers (know 1 is neither; 2 is the only even prime) |
| LO6 | Apply divisibility rules (2, 3, 4, 5, 6, 8, 9, 10, 11) to test factors quickly |
| LO7 | Express a composite number as a product of its prime factors (prime factorization / factor trees) using index/exponent notation |
| LO8 | Identify common factors and common multiples shared by two numbers |
| LO9 | Solve real-world word problems involving factors and multiples (grouping, packaging, repeating schedules) |
| LO10 | Reason about prime/composite classification for larger numbers using systematic trial division up to √n |

**Concrete → Pictorial → Abstract (CPA) Progression:**

- **Concrete:** Interactive rectangular array tiles (rows × columns) physically built to discover factor pairs of a number
- **Pictorial:** Branching factor-tree diagrams that split composite numbers into smaller factors until every leaf is prime
- **Abstract:** A 1–100 sieve grid and symbolic classification exercises (prime factorization written in index notation, divisibility-rule equations)

**Number Ranges:**

- Easy: Numbers up to 30; factor pairs and multiples with small, familiar values
- Medium: Numbers 31–100; divisibility rule application; two-level factor trees
- Hard: Numbers up to 150; three-level+ factor trees; common factors/multiples of two numbers; primality of larger numbers via trial division

**Vocabulary Focus:** "factor", "factor pair", "multiple", "prime number", "composite number", "divisibility", "prime factorization", "factor tree", "index notation", "common factor", "common multiple", "trial division"

---

## 5. The 6-Phase Learner Journey (Intellia Model)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ INTRO SCREEN → Progress Map (6-step visual tracker, top bar)               │
│ Welcome: "Hello, Detective! Ready to crack the case of Factors,           │
│ Multiples and Primes? 🔍🔢"                                                │
│ Lesson badge shown (locked). 6 glowing phase dots visible.                 │
└────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ PHASE 1 — WONDER (≈1–2 min)                                                │
│                                                                             │
│ Hook: "A baker in Cairo has 84 cookies. She wants to pack them into       │
│ equal boxes with more than 1 cookie per box, but no box left over.        │
│ How many different box sizes could she use?"                              │
│                                                                             │
│ Visual: Animated cookie tray splitting into different equal groupings     │
│ Narration (ElevenLabs): Alice voice reads the hook warmly                 │
│ → Mascot "Sift the Owl" appears, magnifying glass in wing, curious        │
│ → "Let's discover how FACTORS help us crack this case!"                  │
└────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ PHASE 2 — STORY (≈2–3 min) — "The Global Prime Detective Agency"          │
│                                                                             │
│ Panel 1: John, Mike, Sarah, Emma, Liam, Sofia, Noah, Aisha, Carlos, and   │
│          Yuki form the Global Prime Detective Agency — junior detectives  │
│          in different countries, guided by their mentor Sift the Owl,     │
│          who solve numeric mysteries using factors, multiples and primes. │
│ Panel 2: "Mike in Cairo finds a locker with a 2-digit code. The clue      │
│          reads: 'I am a factor of 84, and also a factor of 60.'"          │
│ Panel 3: Array diagram animates — rows and columns rearranging to show   │
│          how 84 and 60 share the factor 12.                              │
│ Panel 4: "Sarah in Rio needs to arrange 60 mangoes into equal rows for   │
│          her market stall — with no mangoes left over. Which row sizes   │
│          work?"                                                          │
│ Panel 5: "Aisha in Nairobi finds a strange number: 47. It has only two   │
│          factors — 1 and itself. Sift calls it a PRIME NUMBER."          │
│ Panel 6: "Carlos in Mexico City builds a factor tree to crack a vault    │
│          code — splitting 72 again and again until only primes remain." │
│ Panel 7: "Every number has a hidden fingerprint made of primes — the     │
│          Global Prime Detective Agency never fails to crack the case!"   │
│                                                                             │
│ → Illustrated story panels (animated slide-in), ElevenLabs narration      │
│ → Key vocabulary highlighted: "factor", "multiple", "prime number"        │
│ → World map background with pins on each character's city                │
└────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ PHASE 3 — SIMULATE (≈5–7 min)                                              │
│                                                                             │
│ 3 Interactive Stations — student must complete all 3 to advance           │
│                                                                             │
│ Station A — "Factor Array Builder" (Concrete)                             │
│ Drag row/column tiles to build a rectangular array of exactly N tiles;    │
│ each valid array reveals a factor pair, added to a running "factor list". │
│                                                                             │
│ Station B — "Prime Factor Tree Lab" (Pictorial)                           │
│ Tap a composite node on a branching tree and split it into two factors;   │
│ keep splitting until every leaf on the tree is a prime number.            │
│                                                                             │
│ Station C — "Sift's Number Sorter" (Abstract)                             │
│ A 1–100 sieve grid: tap to cross out multiples of a chosen prime (Sieve  │
│ of Eratosthenes-style), then drag remaining numbers into Prime/Composite  │
│ bins and apply divisibility-rule equations.                              │
│                                                                             │
│ → Mascot Sift reacts to each completed station                           │
│ → ElevenLabs narrates each station instruction and feedback              │
└────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ PHASE 4 — PLAY (≈7–9 min)                                                  │
│                                                                             │
│ IntelliPlay™ Level: 100 randomized questions across 10 case files         │
│ (each case file = a real-world global city mystery)                      │
│ 10 questions per case file, case unlocks at ≥6/10 correct                │
│ Stars (1–3), XP, badges, and streak fire counter active                  │
│ → Mastery gates the world map; encouragement-first feedback              │
└────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ PHASE 5 — REFLECT (≈1–2 min)                                               │
│                                                                             │
│ Journal prompt: "If a number were a suspect, what clues (factors) would   │
│ you look for to prove it is prime? Tell Sift!"                           │
│ Or: LearnFlow AI chat — type/speak your understanding                    │
│ Lesson complete badge unlocks here. Summary of XP + badges shown.        │
│ → "Share with your teacher!" button (screenshot / export)                │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Phase 3 — Simulation Design (Detailed)

### 6.1 Station A — "Factor Array Builder" (Concrete)

**Visual:**

- A grid canvas showing a target total (e.g. "Build an array of 24 tiles")
- A tray of draggable **row/column controls** (`+1 row`, `+1 column`, `−1 row`, `−1 column`)
- "Rearrange the rows and columns until every tile is used, with no gaps!" narrated by Alice

**Interaction:**

- Student adjusts rows × columns using the tray controls (or tap +/− buttons for accessibility mode)
- The array grid **animates** to resize smoothly as rows/columns change
- Once rows × columns exactly equals the target number, a "Log this factor pair" button appears
- Student logs at least 4 distinct factor pairs before the "Submit case notes" button unlocks

**Feedback:**

- Correct array logged → mascot Sift spins happily, "Case note logged! That's a real factor pair!" 🎉
- Incomplete array on submit → gentle shake + "Not quite an even array — check for leftover tiles!"

**Variants per round (randomized):**

- Round 1: Target 24 (many factor pairs, easy — builds confidence)
- Round 2: Target 36 (includes a square factor pair 6×6)
- Round 3: Target 60 (larger number, more factor pairs to log)
- Round 4: Target 47 (a prime — no array possible except 1×47, teaching the prime concept directly)

### 6.2 Station B — "Prime Factor Tree Lab" (Pictorial)

**Visual:**

- A branching tree diagram starts with a single root node showing the target composite number
- Tapping a composite node opens a "split" input: choose any two factors whose product equals that node's value
- Prime nodes automatically highlight in gold and stop branching

**Interaction:**

- Student taps a node, selects a valid factor pair from a pop-up wheel, and the tree branches into two child nodes
- Continue splitting any composite child node until **every leaf on the tree is prime**
- "Check my tree" button verifies: (a) all leaves are prime, and (b) the leaves multiply back to the original number

**Teaching goal:**

- Reinforces that every whole number greater than 1 has a unique prime factorization (Fundamental Theorem of Arithmetic, introduced informally)

**Distractor design:**

- If a student selects a non-factor pair, the split is rejected with a gentle explanation
- Bonus prompt after completion: "Can you write this as index notation?" (e.g. 72 = 2³ × 3²)

**3 rounds with increasing complexity:**

- Round 1: Two-level tree (e.g. 36 = 6 × 6 → 2×3, 2×3)
- Round 2: Three-level tree (e.g. 72, requiring multiple splits)
- Round 3: Larger number with a repeated prime factor written in index notation (e.g. 150 = 2 × 3 × 5²)

### 6.3 Station C — "Sift's Number Sorter" (Abstract)

**Visual:**

```
[ 1-100 sieve grid, 10×10 tiles ]
Prime bin  |  Composite bin  |  Neither (1) bin
```

- A 1–100 grid of number tiles, initially all "unsorted"
- Below the grid: three drop bins labeled **Prime**, **Composite**, and **Neither**

**Interaction:**

- Step 1 (Sieve): Student picks a prime (starting at 2), and taps to cross out every multiple of it on the grid (mirrors the Sieve of Eratosthenes); repeats for 3, 5, 7
- Step 2 (Classify): Remaining un-crossed numbers (other than 1) light up gold — student drags a sample of them into the **Prime** bin; a sample of crossed-out numbers must be dragged into **Composite**; the number 1 must be dragged into **Neither**
- Step 3 (Divisibility equations): A short set of divisibility-rule equations appears (e.g. "Is 5 a factor of 3,215? Use the divisibility rule for 5.") with tap-to-answer True/False

**On submit:** correct sorts glow green; incorrect glow red with a hint referencing the relevant divisibility rule

**3 rounds with increasing complexity:**

- Round 1: Sieve for multiples of 2 and 3 only; classify numbers 1–30
- Round 2: Sieve for multiples of 2, 3, 5; classify numbers 1–60; add divisibility-rule equations for 4, 6, 9
- Round 3: Full sieve to 100; classify larger primes (e.g. 83, 89, 97); divisibility-rule equations for 8, 10, 11

---

## 7. Phase 4 — Question Bank (100 Randomized Questions)

### 7.1 Question Types (10 types × 10 questions = 100 total)

| Type | Description | Example |
| --- | --- | --- |
| Q1 | List/select all factors of a number | Which of these is NOT a factor of 48? |
| Q2 | Is a number a factor of another? (True/False or MCQ) | Is 9 a factor of 108? |
| Q3 | List the first n multiples of a number | What are the first five multiples of 7? |
| Q4 | Is a number a multiple of another? (True/False or MCQ) | Is 96 a multiple of 8? |
| Q5 | Classify a number as prime or composite | Is 91 prime or composite? |
| Q6 | Prime factorization in index notation | Write 180 as a product of its prime factors. |
| Q7 | Apply a divisibility rule | Using the rule for 3, is 4,317 divisible by 3? |
| Q8 | Word problem — grouping/packaging with factors | A florist has 90 roses. Which of these box sizes leaves no roses over? |
| Q9 | Common factors / common multiples of two numbers | List all common factors of 18 and 24. |
| Q10 | True/False statement about primes, factors, or multiples | "1 is a prime number." True or False? |

### 7.2 Question Distribution by Difficulty

| Type | Count | Easy | Medium | Hard |
| --- | --- | --- | --- | --- |
| Q1 | 10 | 4 | 4 | 2 |
| Q2 | 10 | 4 | 4 | 2 |
| Q3 | 10 | 4 | 4 | 2 |
| Q4 | 10 | 4 | 4 | 2 |
| Q5 | 10 | 3 | 4 | 3 |
| Q6 | 10 | 2 | 4 | 4 |
| Q7 | 10 | 3 | 4 | 3 |
| Q8 | 10 | 3 | 4 | 3 |
| Q9 | 10 | 3 | 4 | 3 |
| Q10 | 10 | 4 | 3 | 3 |
| **TOTAL** | **100** | **34** | **39** | **27** |

### 7.3 Number Ranges by Difficulty

- **Easy:** Numbers up to 30; short factor/multiple lists; single-step divisibility checks
- **Medium:** Numbers 31–100; two-level factor trees; multi-rule divisibility checks
- **Hard:** Numbers up to 150; three-level+ factor trees with index notation; common factors/multiples requiring systematic listing; primality testing via trial division up to √n

### 7.4 Global Context — Names, Places & Objects Used in Word Problems

**Names (global set):** John, Mike, Sarah, Emma, Liam, Sofia, Noah, Aisha, Carlos, Yuki, Priya, Fatima, Diego, Chloe, Ravi

**Cities/Landmarks:** Cairo, Rio de Janeiro, Nairobi, Tokyo, London, Toronto, Rome, Seoul, Sydney, Reykjavik

**Contexts:** locker/vault codes, market-stall packing, bakery box arrangements, relay-team formations, gift-hamper assembly, marching-band row formations, and detective-agency "case files" across the Global Prime Detective Agency

### 7.5 Language & Notation Requirements

All questions use globally recognized number-theory vocabulary and notation:

- Index/exponent notation for prime factorization (e.g. `2³ × 3²`)
- "factor", "factor pair", "multiple", "prime", "composite", "divisible by", "common factor", "common multiple"
- Divisibility rules stated explicitly where tested (e.g. "divisible by 3 if the digit sum is divisible by 3")

---

## 8. Gamification Design

### 8.1 Reward System

- **Stars (⭐):** Earned per 10-question case file (1–3 stars based on score)
- **XP Points:** 10 XP correct first try | 7 XP second try | 5 XP with hint used
- **Streak 🔥:** Fire counter for consecutive correct answers
- **Streak Bonus:** +5 XP per correct answer when streak ≥ 5

### 8.2 Badges (Unlockable)

- 🏅 **"Junior Detective"** — Complete Wonder + Story phases
- 🥈 **"Factor Finder"** — Complete all 3 Simulation stations
- 🥇 **"Prime Champion"** — Score ≥80% on Play phase
- 💎 **"Perfect Case File"** — Score 10/10 in any case file
- 🔥 **"Case Streak"** — Achieve a streak of 10 consecutive correct answers
- 🌍 **"Global Detective"** — Complete all 6 phases (lesson complete badge)
- 🎯 **"Sharp Sift"** — Complete Station C without any wrong sort
- 🔢 **"Prime Hunter"** — Correctly identify 10 prime numbers across the session

### 8.3 Feedback Mechanics

**✅ Correct:**

- Bounce animation on answer card + mascot happy mood
- ElevenLabs celebration audio: "Case cracked! Your factor detective work is perfect! 🎉"
- XP floats up from answer card (+10 / +7 / +5)
- Streak fire counter increments

**❌ Incorrect (Attempt 1):**

- Gentle shake animation + ElevenLabs: "Not quite the right clue! Let's check the number again 🔍"
- Hint 1 activates: relevant factor array, factor tree, or divisibility rule highlighted

**❌ Incorrect (Attempt 2):**

- Stronger shake + Hint 2: the correct reasoning shown step by step
- ElevenLabs: "Let's test it together! Can you divide it out with me?"

**❌ Incorrect (Attempt 3):**

- Answer revealed with animated explanation (mascot explains)
- ElevenLabs: full explanation read aloud
- No score penalty — encouragement only

No negative scoring. Encouragement-first approach always.

### 8.4 World Map (IntelliPlay™ Case-File Progression — Global Landmarks)

1. **Case 1 — "Cairo Bazaar Case"** (Q1–10, factors, easy)
2. **Case 2 — "Rio Carnival Puzzle"** (Q11–20, factors/multiples, easy-medium)
3. **Case 3 — "Nairobi Savannah Trail"** (Q21–30, multiples, medium)
4. **Case 4 — "Tokyo Neon Case Files"** (Q31–40, divisibility rules, medium)
5. **Case 5 — "London Fog Vault"** (Q41–50, prime vs. composite, medium)
6. **Case 6 — "Toronto Maple Mystery"** (Q51–60, prime factorization, medium-hard)
7. **Case 7 — "Rome Colosseum Code"** (Q61–70, prime factorization/index notation, hard)
8. **Case 8 — "Seoul Skyline Secret"** (Q71–80, word problems, hard)
9. **Case 9 — "Sydney Harbour Heist"** (Q81–90, common factors/multiples, hard)
10. **Case 10 — "Reykjavik Northern Lights Finale"** (Q91–100, mixed all types, hardest)

**Unlock gate:** ≥6/10 correct (1-star minimum) required to advance to the next case file.
3 stars in a case file unlocks a hidden "Bonus Clue" (3 extra questions).

### 8.5 Mascot (Sift — Prime Detective Companion)

- **Character:** A wise, bespectacled owl detective named **"Sift"**, carrying a magnifying glass
- **Mood States:** idle | curious | happy | thinking | celebrating | encouraging
- **Appearances:** Wonder hook, Story narration, Simulation feedback, Reflect phase
- **Reactions:** Correct answer, badge unlock, streak milestone, case-file completion
- **Audio:** All mascot speech via ElevenLabs Alice voice (pre-generated .mp3)

---

## 9. Audio & Narration Design

Fully aligned with `audio_generation_pipeline.md`.

### 9.1 Pipeline Summary

- **Voice Provider:** ElevenLabs (only — no browser Web Speech API fallback)
- **Voice Name:** Alice (Clear, Engaging Educator)
- **Voice ID:** `Xb7hH8MSUJpSbSDYk0k2`
- **Model:** `eleven_multilingual_v2`
- **API Key Env Var:** `VITE_ELEVENLABS_API_KEY`
- **Pre-generation:** `scripts/generate_audio.js` → static `.mp3` in `public/assets/audio/`
- **Dynamic fallback:** Practice questions not yet cached are generated on-the-fly
- **Mapping:** Auto-generated `src/utils/audioMap.js` (exact text → file path)
- **Cleanup:** `scripts/clean_audio.js` removes orphaned audio files

### 9.2 Content Policy — Paragraphs & Questions ONLY

> **IMPORTANT:** Audio is generated ONLY for paragraph/story text and question text. Titles, headings, case-file names, and section labels are **never** narrated.

### 9.3 Speech Styles Mapped to ElevenLabs Settings

| Style | Stability | Similarity Boost | Style | Speaker Boost | Use case |
| --- | --- | --- | --- | --- | --- |
| `celebration` | 0.12 | 0.45 | 0.75 | ✅ | Badge unlock, case-file complete |
| `encouragement` | 0.16 | 0.50 | 0.65 | ✅ | Correct answer feedback |
| `question` | 0.20 | 0.55 | 0.55 | ✅ | Practice question read-aloud |
| `emphasis` | 0.16 | 0.50 | 0.60 | ✅ | Key vocabulary highlight |
| `thinking` | 0.24 | 0.60 | 0.35 | ✅ | Mascot thinking moments |
| `statement` / `instruction` | 0.20 | 0.55 | 0.50 | ✅ | Story narration, instructions |

### 9.4 Narration Script Examples

**Phase 1 (Wonder) — style: thinking**
> "A baker in Cairo has eighty-four cookies."
> "She wants to pack them into equal boxes, with more than one cookie per box, and none left over. How many different box sizes could she use?"
> "Let's discover how factors help us crack this case!"

**Phase 2 (Story, Panel 2) — style: statement**
> "Mike in Cairo finds a locker with a two-digit code. The clue reads: I am a factor of eighty-four, and also a factor of sixty."

**Phase 3 (Station A) — style: instruction**
> "Rearrange the rows and columns until every tile is used, with no gaps!"
> "Each array you build reveals a real factor pair. How many can you find?"

**Phase 4 (Correct feedback) — style: celebration**
> "Case cracked! Your factor detective work is perfect! You are a true Prime Detective!"

**Phase 5 (Reflect) — style: thinking**
> "If a number were a suspect, what clues would you look for to prove it is prime? Tell Sift what you learned today!"

### 9.5 Strict 1:1 Parity Rule

Every on-screen narrated string in `narration.js` must match the UI text **exactly** (same words, punctuation, capitalization). Any UI text change requires updating both `generate_audio.js`'s `phrases` array and `narration.js`.

---

## 10. UX & Visual Design Requirements

### 10.1 Visual Theme

- **Brand:** Intellia — Think. Explore. Become.
- **Reference UI (strict match):** `https://grade5-time-intervals.vercel.app/`
- **Reference Repo (strict match):** `https://github.com/p1pachare-cloud/Grade5-Time-Intervals`
- **Colours:** Match `grade5-time-intervals.vercel.app` exactly — primary brand blue, accent gold/yellow for rewards, soft coral/red for wrong-answer states, white card backgrounds, soft drop shadows, distinct phase-band colours
- **Typography:** Rounded, confident — Nunito or Fredoka One (slightly more mature weight than lower-grade modules to suit a 12–13-year-old audience)
- **Illustrations:** Detective-agency motifs (magnifying glasses, case files, locker codes) layered over globally inclusive character designs and landmark backdrops (Pyramids of Giza, Christ the Redeemer, Mount Kenya savannah, Tokyo skyline, Big Ben, CN Tower, Colosseum, Seoul skyline, Sydney Opera House, Northern Lights)
- **Number Diagrams:** Clean rectangular array grids, branching SVG factor trees, and a 10×10 sieve grid — each with a distinct colour per case file

### 10.2 Layout Structure (mirrors grade5-time-intervals.vercel.app)

- **Top Bar:** Intellia logo | Lesson title "Factors, Multiples and Primes" | 6-phase dot tracker
- **Main Area:** Phase content (fills screen, responsive, smooth phase transitions)
- **Bottom Bar:** XP counter | Star count | Streak fire | Phase navigation arrows
- **Sidebar:** Hidden on mobile; shown on tablet+ as vertical phase map

### 10.3 Array, Tree & Sieve Diagram Visual Components (Primary Visuals)

Used throughout all phases:

- Rectangular array grid (SVG) that resizes smoothly as rows/columns change
- Branching factor-tree diagram (SVG) with gold-highlighted prime leaf nodes
- 10×10 sieve grid with tap-to-cross-out animation and Prime/Composite/Neither bins
- Missing value shown as a dashed-outline tile or "?" marker
- Diagrams animate (smooth transition) when they first render or update

### 10.4 Accessibility

- Large tap targets (minimum 44×44px on all interactive elements)
- WCAG AA colour contrast on all text elements
- All narration via ElevenLabs (premium, consistent voice)
- Keyboard navigable (Tab + Enter for all interactions)
- No mandatory time pressure (optional timer toggle in challenge mode only)
- Drag interactions have touch-equivalent tap+tap fallback

### 10.5 Responsive Design

- Primary: Desktop browser (1024px+) and tablet (768px+) — classroom context
- Secondary: iPad/tablet
- Tertiary: Mobile (375px+) — stacked single-column layout

---

## 11. Content Requirements

### 11.1 Simulation Visuals

- Array grids: SVG-rendered rectangles that resize with row/column controls
- Factor tree nodes: colourful branching diagram, gold leaf nodes for primes
- Sieve grid: 100 tappable number tiles with cross-out animation
- Abstract sentences: large bold typography for divisibility-rule equations

### 11.2 Question Bank Coverage

- All 10 question types × 10 questions = 100 unique question objects in `questionBank.js`
- Questions randomized per session using Fisher-Yates shuffle
- No two sessions present the same question order
- MCQ distractors always plausible (off-by-one factor errors, common divisibility-rule mix-ups, or near-miss primes like 91 and 51)

### 11.3 Word Problem Formats

**Packaging/grouping sense:**
> "[Name] has [N] [items] in [City]. [He/She] wants to arrange them into equal groups with none left over. Which group size works?"

**Detective-code sense:**
> "[Name] finds a locker in [City]. The clue reads: I am a factor of [A], and also a factor of [B]. What number could I be?"

**Extended "Let's Think Along" style:**
> "[Name] is sorting numbers from 1 to ___ . Cross out the multiples of ___ . Which numbers remain? Are they all prime?"

### 11.4 Audio Script Parity (Strict 1:1 Rule)

Every on-screen text string that is narrated must match `narration.js` exactly — same words, same punctuation. Any UI text change requires updating both the `generate_audio.js` phrases array and `narration.js`.

---

## 12. Success Criteria (v1.0)

| Criterion | Target |
| --- | --- |
| All 100 questions randomized correctly | ✅ Required |
| All 3 simulation stations functional | ✅ Required |
| All 6 phases navigable end-to-end | ✅ Required |
| Gamification (XP, stars, 8 badges) working | ✅ Required |
| Case-file map 10-case progression logic correct | ✅ Required |
| ElevenLabs audio plays for all phase narration | ✅ Required |
| Audio pipeline (pre-gen + dynamic) functional | ✅ Required |
| Mobile/tablet/desktop responsive layout | ✅ Required |
| Global Grade 7 syllabus coverage confirmed | ✅ Required |
| Loads in < 3 seconds (Vite production build) | ✅ Required |
| WCAG AA accessible | ✅ Required |
| UI matches grade5-time-intervals.vercel.app structure | ✅ Required |
| Hosted correctly at Intellia Grade 7 lesson URL | ✅ Required |

---

## 13. Out of Scope (v1.0)

- Full HCF/LCM computation methods (Euclidean algorithm, listing-method HCF/LCM) — reserved for the separate Grade 7 "HCF and LCM" module
- Teacher dashboard / backend analytics
- Student login / account persistence across devices
- Multiplayer or class competition features
- Parent progress report emails
- Print worksheet generation
- Primality testing beyond trial division up to √n (e.g. formal proofs, Fermat tests)
- Assessment against the full curriculum (broader test engine)

---

**Document Version:** 1.0 | September 2026
**Product:** Intellia — Grade 7 Math, Factors, Multiples and Primes
**Lesson Title:** The Global Prime Detective Agency — Factors, Multiples and Primes
**Curriculum:** Global Grade 7 Mathematics (Singapore MOE Secondary 1, Common Core Grade 6/7, UK KS3 Year 7, CBSE/NCERT, Australian Curriculum Year 7 cross-aligned)
**Reference UI:** https://grade5-time-intervals.vercel.app/
**Reference Repo:** https://github.com/p1pachare-cloud/Grade5-Time-Intervals
**Audio Pipeline:** ElevenLabs (Alice, `Xb7hH8MSUJpSbSDYk0k2`, `eleven_multilingual_v2`) — per `audio_generation_pipeline.md`
**Parent Course Page:** https://intelliasg.com/courses/grade-7-math/
**Lesson URL:** https://intelliasg.com/courses/grade-7-math/lessons/factors-multiples-primes/
