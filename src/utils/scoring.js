import { shuffleArray } from './shuffle';

/**
 * Calculates XP earned per question attempt
 * 10 XP on 1st attempt, 7 XP on 2nd, 5 XP with hint / 3rd attempt
 * +5 streak bonus when streak >= 5
 */
export function calcXP(attemptNumber, hintsUsed = 0, streak = 0) {
  const base = attemptNumber === 1 ? 10 : hintsUsed > 0 || attemptNumber >= 3 ? 5 : 7;
  const streakBonus = streak >= 5 ? 5 : 0;
  return base + streakBonus;
}

/**
 * Calculates 0–3 stars for a case file of 10 questions
 */
export function calcStars(correct, total = 10) {
  if (correct === null || correct === undefined) return 0;
  if (correct >= 9) return 3; // Gold: >= 90%
  if (correct >= 7) return 2; // Silver: >= 70%
  if (correct >= 5) return 1; // Bronze: >= 50%
  return 0;
}

/**
 * Check if the next world can be unlocked (requires at least 1 star / 50%)
 */
export function canUnlockWorld(prevCaseScore) {
  return prevCaseScore !== null && prevCaseScore !== undefined && prevCaseScore >= 5;
}

/**
 * Sum total stars across all worlds
 */
export function calcTotalStars(worldScores) {
  return worldScores.reduce((sum, score) => sum + calcStars(score), 0);
}

/**
 * Generate plausible MCQ distractors for factors of targetNumber
 */
export function generateFactorDistractors(correctFactors, targetNumber, count = 3) {
  const distractors = new Set();
  let candidate = 2;
  while (distractors.size < count && candidate < targetNumber + 10) {
    if (!correctFactors.includes(candidate) && candidate !== 1 && targetNumber % candidate !== 0) {
      distractors.add(candidate);
    }
    candidate++;
  }
  return shuffleArray([...distractors]).slice(0, count);
}

/**
 * Generate plausible prime near-miss composite distractors (numbers that trick learners like 51, 91, 119)
 */
export function generatePrimeDistractors() {
  const nearMisses = [51, 57, 87, 91, 119, 133, 143, 161, 221];
  return shuffleArray(nearMisses).slice(0, 3);
}
