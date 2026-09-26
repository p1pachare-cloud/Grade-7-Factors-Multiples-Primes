import { say, ask, cheer, emphasize, think, celebrate, instruct } from './audio';

export function wonderNarration() {
  return [
    think("A baker in Cairo has eighty-four cookies."),
    ask("She wants to pack them into equal boxes, with more than one cookie per box, and none left over. How many different box sizes could she use?"),
    cheer("Let's discover how factors help us crack this case!")
  ];
}

export function getStoryNarration(panelIndex) {
  const panels = [
    [say("John, Mike, Sarah, Emma, Liam, Sofia, Noah, Aisha, Carlos, and Yuki form the Global Prime Detective Agency.")],
    [say("Mike in Cairo finds a locker with a two-digit code. The clue reads: I am a factor of eighty-four, and also a factor of sixty.")],
    [say("Sarah in Rio needs to arrange sixty mangoes into equal rows for her market stall, with no mangoes left over.")],
    [emphasize("Aisha in Nairobi finds a strange number: forty-seven. It has only two factors, one and itself.")],
    [say("Carlos in Mexico City builds a factor tree to crack a vault code, splitting seventy-two again and again until only primes remain.")],
    [emphasize("Every number has a hidden fingerprint made of primes. The Global Prime Detective Agency never fails to crack the case!")]
  ];
  return panels[panelIndex] || [];
}

export function stationANarration() {
  return [
    instruct("Rearrange the rows and columns until every tile is used, with no gaps!"),
    ask("Each array you build reveals a real factor pair. How many can you find?")
  ];
}

export function stationBNarration() {
  return [
    instruct("Tap a number to split it into two factors. Keep going until every branch ends in a prime!")
  ];
}

export function stationCNarration() {
  return [
    instruct("Cross out the multiples on the grid, then sort the numbers that remain.")
  ];
}

export function correctNarration() {
  return [
    celebrate("Case cracked! Your factor detective work is perfect! You are a true Prime Detective!")
  ];
}

export function incorrectNarration() {
  return [
    cheer("Not quite the right clue! Let's check the number again.")
  ];
}

export function reflectNarration() {
  return [
    think("If a number were a suspect, what clues would you look for to prove it is prime? Tell Sift what you learned today!"),
    celebrate("Lesson complete! You are a Global Prime Detective Champion!")
  ];
}
