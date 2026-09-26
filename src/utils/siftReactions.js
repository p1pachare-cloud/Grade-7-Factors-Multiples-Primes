// Sift the Owl's dynamic reaction dialogue pools
// Avoids repeating the same reaction line twice in a row!

const SIFT_REACTIONS = {
  arrayMatch: [
    "Boom! Clean rectangular alignment — not a single item out of place!",
    "That factor pair locks in like a precision safe bolt!",
    "Superb observation! The shelf settled with zero overhang.",
    "Aha! Rows times columns hit the bullseye exactly!",
    "Brilliant arrangement — that's a verified factor pair in your case notes!"
  ],
  arrayDuplicate: [
    "You already archived that pair! Try stretching for a new dimension.",
    "Good memory! That configuration is already in your notebook.",
    "Already logged! Can you find another rectangular pair?",
    "We have that pair in the files — keep stretching the grid!"
  ],
  arrayTryAgain: [
    "Look at the leftover overhang — adjust either rows or columns to balance it.",
    "Gaps on the bottom row! Stretch or squeeze to make all rows even.",
    "Almost there! A slight tweak will make this rectangular formation hold.",
    "Every shelf must be filled evenly with no loose items remaining!"
  ],
  treeCorrectSplit: [
    "Clean split! The branches are narrowing down toward the prime roots.",
    "Precision division! Those two factors multiply right back to the node.",
    "Nice branch! You're breaking the composite number down into its DNA.",
    "Spot on! Both branches check out cleanly.",
    "Great split choice! Notice which branch turned golden prime."
  ],
  treeWobbleSplit: [
    "Whoa, branch wobbled! Those two numbers don't multiply to this node — give it another shot!",
    "Elastic recoil! That pair doesn't match the node's product. Test another factor.",
    "The branch snaps back! Check your multiplication and try again.",
    "Close experiment! Remember, the product of the two leaves must equal the node.",
    "Wobble test failed — but that's how real detectives discover the right split!"
  ],
  treeDone: [
    "Outstanding! All branches terminate in unbreakable prime leaves!",
    "The prime fingerprint is completely unlocked! Golden leaves everywhere.",
    "Chain reaction complete! Every leaf is now an elementary prime building block.",
    "Magnificent factor tree! Carlos's vault locks could never withstand this logic.",
    "All composite numbers surrender to prime decomposition!"
  ],
  sieveSweep: [
    "Even numbers swept away! The field of candidates is shrinking fast.",
    "Multiples of 3 eliminated like clockwork! Only resilient primes standing.",
    "Sieve wave rippling through! Watching composite numbers dissolve is so satisfying.",
    "Look at the grid clear up! The survivor primes are emerging from the fog.",
    "Another prime wave cleared! The mystery numbers are cornered now."
  ],
  binSortCorrect: [
    "Filed with mathematical precision!",
    "Direct hit! Right into the correct evidence locker.",
    "Spot on classification — your number sense is razor-sharp.",
    "Perfect sorting! The evidence is categorized flawlessly.",
    "Bingo! Prime, composite, or rogue unit 1 — you know your sets!"
  ],
  binSortWrong: [
    "Check the factor count! Does it have exactly two factors, or more?",
    "Remember: 1 has only one single factor (itself), so it sits in Neither!",
    "Pause and test divisibility: can any number other than 1 and itself divide this?",
    "Encouraging try! Review whether it has composite factors and resort it immediately."
  ]
};

export function getRandomReaction(category, lastText = '') {
  const pool = SIFT_REACTIONS[category] || SIFT_REACTIONS.arrayMatch;
  const filtered = pool.filter((item) => item !== lastText);
  const choice = filtered[Math.floor(Math.random() * filtered.length)] || pool[0];
  return choice;
}
