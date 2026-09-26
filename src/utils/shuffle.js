/**
 * Fisher-Yates array shuffle
 * @param {Array} array 
 * @returns {Array} new shuffled copy
 */
export function shuffleArray(array) {
  if (!array) return [];
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generates session question set balancing case files and question types
 * @param {Array} bank 
 * @returns {Array}
 */
export function generateSessionQuestions(bank) {
  if (!bank || bank.length === 0) return [];
  
  // Group questions by caseFile (0 through 9)
  const byCase = {};
  bank.forEach((q) => {
    const caseIdx = q.caseFile ?? Math.floor((parseInt(q.id.replace(/\D/g, '') || 1) - 1) / 10);
    if (!byCase[caseIdx]) byCase[caseIdx] = [];
    byCase[caseIdx].push(q);
  });

  const session = [];
  for (let c = 0; c < 10; c++) {
    const caseQuestions = byCase[c] || [];
    if (caseQuestions.length > 0) {
      session.push(...shuffleArray(caseQuestions).slice(0, 10));
    }
  }

  // If there are fewer than 100 questions, fill or fall back
  if (session.length < 100) {
    const remaining = bank.filter(q => !session.some(s => s.id === q.id));
    session.push(...shuffleArray(remaining).slice(0, 100 - session.length));
  }

  return session.slice(0, 100);
}
