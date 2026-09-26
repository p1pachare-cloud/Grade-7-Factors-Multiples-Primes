// Number Theory Engine — plain integer arithmetic for Factors, Multiples & Primes

/**
 * Returns all factors of n, sorted ascending
 * @param {number} n 
 * @returns {number[]}
 */
export function getFactors(n) {
  if (n <= 0) return [];
  const factors = [];
  for (let i = 1; i * i <= n; i++) {
    if (n % i === 0) {
      factors.push(i);
      if (i !== n / i) {
        factors.push(n / i);
      }
    }
  }
  return factors.sort((a, b) => a - b);
}

/**
 * Returns factor pairs of n, e.g. [[1,24],[2,12],[3,8],[4,6]]
 * @param {number} n 
 * @returns {[number, number][]}
 */
export function getFactorPairs(n) {
  if (n <= 0) return [];
  const pairs = [];
  for (let i = 1; i * i <= n; i++) {
    if (n % i === 0) {
      pairs.push([i, n / i]);
    }
  }
  return pairs;
}

/**
 * Returns the first `count` multiples of n (n, 2n, 3n, ...)
 * @param {number} n 
 * @param {number} count 
 * @returns {number[]}
 */
export function getMultiples(n, count = 5) {
  if (n <= 0) return [];
  return Array.from({ length: count }, (_, i) => n * (i + 1));
}

/**
 * Primality test using trial division up to sqrt(n)
 * @param {number} n 
 * @returns {boolean}
 */
export function isPrime(n) {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

/**
 * Prime factorization as an array of { prime, exponent } pairs
 * @param {number} n 
 * @returns {{ prime: number, exponent: number }[]}
 */
export function primeFactorize(n) {
  if (n < 2) return [];
  const result = [];
  let remaining = n;
  for (let p = 2; p * p <= remaining; p++) {
    let exponent = 0;
    while (remaining % p === 0) {
      remaining /= p;
      exponent++;
    }
    if (exponent > 0) {
      result.push({ prime: p, exponent });
    }
  }
  if (remaining > 1) {
    result.push({ prime: remaining, exponent: 1 });
  }
  return result;
}

/**
 * Formats prime factorization into index notation string, e.g. "2^3 × 3^2" or "2³ × 3²"
 * @param {{ prime: number, exponent: number }[]} factorization 
 * @param {boolean} useSuperscript 
 * @returns {string}
 */
export function formatFactorization(factorization, useSuperscript = false) {
  const superscripts = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
  };

  return factorization
    .map(({ prime, exponent }) => {
      if (exponent === 1) return `${prime}`;
      if (useSuperscript) {
        const expStr = String(exponent).split('').map(d => superscripts[d] || d).join('');
        return `${prime}${expStr}`;
      }
      return `${prime}^${exponent}`;
    })
    .join(' × ');
}

/**
 * Common factors of two numbers
 * @param {number} a 
 * @param {number} b 
 * @returns {number[]}
 */
export function getCommonFactors(a, b) {
  const factorsA = new Set(getFactors(a));
  return getFactors(b).filter(f => factorsA.has(f)).sort((x, y) => x - y);
}

/**
 * First `count` common multiples of two numbers
 * @param {number} a 
 * @param {number} b 
 * @param {number} count 
 * @returns {number[]}
 */
export function getCommonMultiples(a, b, count = 3) {
  const limit = Math.max(a, b) * 20;
  const multiplesA = new Set(getMultiples(a, limit));
  const common = [];
  for (let k = 1; common.length < count && k <= limit; k++) {
    const candidate = b * k;
    if (multiplesA.has(candidate)) {
      common.push(candidate);
    }
  }
  return common;
}

/**
 * Checks if n is divisible by divisor
 * @param {number} n 
 * @param {number} divisor 
 * @returns {boolean}
 */
export function isDivisibleBy(n, divisor) {
  if (divisor === 0) return false;
  return n % divisor === 0;
}

/**
 * Sieve of Eratosthenes up to limit
 * @param {number} limit 
 * @returns {number[]} array of primes
 */
export function sieveOfEratosthenes(limit = 100) {
  const isCompositeFlags = new Array(limit + 1).fill(false);
  const primes = [];
  for (let i = 2; i <= limit; i++) {
    if (!isCompositeFlags[i]) {
      primes.push(i);
      for (let j = i * i; j <= limit; j += i) {
        isCompositeFlags[j] = true;
      }
    }
  }
  return primes;
}

/**
 * Divisibility rules explanation helper
 * @param {number} divisor 
 * @returns {string}
 */
export function getDivisibilityRuleExplanation(divisor) {
  const rules = {
    2: "A number is divisible by 2 if its last digit is even (0, 2, 4, 6, 8).",
    3: "A number is divisible by 3 if the sum of all its digits is divisible by 3.",
    4: "A number is divisible by 4 if the last two digits form a number divisible by 4.",
    5: "A number is divisible by 5 if its last digit is 0 or 5.",
    6: "A number is divisible by 6 if it is divisible by BOTH 2 (even) and 3 (digit sum).",
    8: "A number is divisible by 8 if the last three digits form a number divisible by 8.",
    9: "A number is divisible by 9 if the sum of all its digits is divisible by 9.",
    10: "A number is divisible by 10 if its last digit is 0.",
    11: "A number is divisible by 11 if the alternating sum of its digits is divisible by 11 (or 0)."
  };
  return rules[divisor] || `Check if the number divides evenly by ${divisor}.`;
}
