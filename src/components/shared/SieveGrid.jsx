import React from 'react';
import { isPrime } from '../../utils/numberTheory';

export default function SieveGrid({
  crossedOut = new Set(),
  activePrimes = [],
  onTogglePrime,
  limit = 100,
  interactive = true,
  highlightPrimes = false,
  ripplingNumber = null,
  activeRippleBatch = new Set(),
}) {
  const numbers = Array.from({ length: limit }, (_, i) => i + 1);

  return (
    <div className="sieve-grid-container">
      <div
        className="sieve-grid"
        style={{
          gridTemplateColumns: `repeat(${limit <= 30 ? 6 : limit <= 60 ? 10 : 10}, minmax(0, 1fr))`,
        }}
      >
        {numbers.map((num) => {
          const isOne = num === 1;
          const isCrossed = crossedOut.has(num);
          const isPrimeNum = isPrime(num);
          const isPrimeActive = activePrimes.includes(num);
          const isRippling = activeRippleBatch && activeRippleBatch.has(num);

          let tileClass = 'sieve-tile';
          if (isOne) tileClass += ' sieve-tile-one';
          else if (isCrossed) tileClass += ' sieve-tile-crossed';
          else if (isPrimeActive || (highlightPrimes && isPrimeNum)) tileClass += ' sieve-tile-prime';
          else tileClass += ' sieve-tile-candidate';

          if (isRippling) tileClass += ' sieve-tile-ripple-impact';

          return (
            <button
              key={num}
              type="button"
              className={tileClass}
              onClick={() => interactive && onTogglePrime && onTogglePrime(num)}
              disabled={!interactive || isOne}
              title={
                isOne
                  ? '1 is neither prime nor composite'
                  : isCrossed
                  ? `${num} eliminated (multiple of a prime)`
                  : isPrimeNum
                  ? `${num} is a Prime number!`
                  : `${num}`
              }
              aria-label={`Number ${num}${isCrossed ? ' eliminated' : isPrimeNum ? ' prime' : ''}`}
            >
              <span className="sieve-num-text">{num}</span>
              {isCrossed && <span className="sieve-cross-mark animate-stamp">✕</span>}
              {(isPrimeActive || (highlightPrimes && isPrimeNum)) && !isCrossed && (
                <span className="sieve-prime-dot">★</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
