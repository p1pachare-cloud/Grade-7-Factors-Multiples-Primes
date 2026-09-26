export const BADGES = [
  {
    id: 'junior_detective',
    label: '🏅 Junior Detective',
    icon: '🏅',
    description: 'Complete Wonder and Story phases',
    condition: (s) => s.phaseComplete?.wonder && s.phaseComplete?.story,
  },
  {
    id: 'factor_finder',
    label: '🥈 Factor Finder',
    icon: '🥈',
    description: 'Complete all 3 Simulation stations',
    condition: (s) => s.simStationsComplete && s.simStationsComplete.every(Boolean),
  },
  {
    id: 'prime_champion',
    label: '🥇 Prime Champion',
    icon: '🥇',
    description: 'Score 80%+ across practice cases',
    condition: (s) => {
      const totalCorrect = (s.worldScores || []).reduce((sum, cs) => sum + (cs || 0), 0);
      return totalCorrect >= 80;
    },
  },
  {
    id: 'perfect_case_file',
    label: '💎 Perfect Case File',
    icon: '💎',
    description: 'Score 10/10 in any case file',
    condition: (s) => (s.worldScores || []).some((cs) => cs === 10),
  },
  {
    id: 'case_streak',
    label: '🔥 Case Streak',
    icon: '🔥',
    description: 'Achieve a streak of 10 consecutive correct answers',
    condition: (s) => (s.maxStreak || 0) >= 10,
  },
  {
    id: 'global_detective',
    label: '🌍 Global Detective',
    icon: '🌍',
    description: 'Complete all 6 phases of the lesson',
    condition: (s) => s.phaseComplete && Object.values(s.phaseComplete).every(Boolean),
  },
  {
    id: 'sharp_sift',
    label: '🎯 Sharp Sift',
    icon: '🎯',
    description: 'Complete Station C Sieve without any wrong sort',
    condition: (s) => s.stationCPerfect === true,
  },
  {
    id: 'prime_hunter',
    label: '🔢 Prime Hunter',
    icon: '🔢',
    description: 'Correctly identify 10 prime numbers across the session',
    condition: (s) => (s.primesIdentifiedCorrectly || 0) >= 10,
  },
];

export function checkBadges(state) {
  const currentBadges = state.badges || [];
  return BADGES
    .filter((b) => !currentBadges.includes(b.id) && b.condition(state))
    .map((b) => b.id);
}
