import React from 'react';

export default function Mascot({ mood = 'idle', size = 'medium', className = '' }) {
  const sizePx = size === 'large' ? 120 : size === 'medium' ? 80 : 54;

  return (
    <div
      className={`mascot-robot mascot-mood-${mood} ${className}`}
      style={{ width: sizePx, height: sizePx, position: 'relative', display: 'inline-block' }}
      title={`Sift the Owl Detective (${mood})`}
    >
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="owlBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3d5afe" />
            <stop offset="50%" stopColor="#2979ff" />
            <stop offset="100%" stopColor="#00e5ff" />
          </linearGradient>
          <linearGradient id="owlBellyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e1f5fe" />
          </linearGradient>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffd54f" />
            <stop offset="100%" stopColor="#ff9800" />
          </linearGradient>
          <filter id="detectiveGlow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Detective Fedora Hat */}
        <ellipse cx="50" cy="24" rx="28" ry="6" fill="#1a237e" />
        <path d="M 32 24 C 32 12, 68 12, 68 24 Z" fill="#283593" />
        <rect x="33" y="21" width="34" height="4" fill="url(#goldGrad)" rx="1" />
        {/* Detective badge on hat */}
        <polygon points="50,15 52,19 57,19 53,22 55,26 50,23 45,26 47,22 43,19 48,19" fill="#ffd54f" />

        {/* Owl Ear Tufts */}
        <polygon points="26,22 34,34 22,32" fill="#1e88e5" />
        <polygon points="74,22 66,34 78,32" fill="#1e88e5" />

        {/* Owl Main Body */}
        <ellipse cx="50" cy="58" rx="26" ry="30" fill="url(#owlBodyGrad)" filter="url(#detectiveGlow)" />

        {/* Owl Belly */}
        <ellipse cx="50" cy="65" rx="17" ry="19" fill="url(#owlBellyGrad)" />

        {/* Feather marks on belly */}
        <path d="M 44 56 Q 50 60 56 56" stroke="#00e5ff" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M 42 64 Q 50 68 58 64" stroke="#00e5ff" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M 45 72 Q 50 75 55 72" stroke="#00e5ff" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* Owl Wings */}
        <ellipse cx="23" cy="58" rx="8" ry="18" fill="#1565c0" transform="rotate(12 23 58)" />
        <ellipse cx="77" cy="58" rx="8" ry="18" fill="#1565c0" transform="rotate(-12 77 58)" />

        {/* Detective Round Spectacles (Glasses) */}
        <circle cx="39" cy="45" r="11" fill="#ffffff" stroke="#ffd54f" strokeWidth="2.5" />
        <circle cx="61" cy="45" r="11" fill="#ffffff" stroke="#ffd54f" strokeWidth="2.5" />
        <line x1="50" y1="45" x2="50" y2="45" stroke="#ffd54f" strokeWidth="3" />
        <line x1="47" y1="43" x2="53" y2="43" stroke="#ffd54f" strokeWidth="2.5" />

        {/* Eyes based on mood */}
        {mood === 'happy' || mood === 'celebrating' ? (
          <>
            <path d="M 33 46 Q 39 39 45 46" stroke="#0d47a1" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 55 46 Q 61 39 67 46" stroke="#0d47a1" strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        ) : mood === 'thinking' ? (
          <>
            <circle cx="37" cy="43" r="4.5" fill="#0d47a1" />
            <circle cx="63" cy="43" r="4.5" fill="#0d47a1" />
            <circle cx="38" cy="42" r="1.5" fill="#ffffff" />
            <circle cx="64" cy="42" r="1.5" fill="#ffffff" />
          </>
        ) : mood === 'encouraging' ? (
          <>
            <circle cx="39" cy="45" r="5" fill="#0d47a1" />
            <circle cx="61" cy="45" r="5" fill="#0d47a1" />
            <circle cx="41" cy="43" r="1.8" fill="#ffffff" />
            <circle cx="63" cy="43" r="1.8" fill="#ffffff" />
          </>
        ) : (
          <>
            <circle cx="39" cy="45" r="5" fill="#0d47a1" />
            <circle cx="61" cy="45" r="5" fill="#0d47a1" />
            <circle cx="41" cy="43" r="2" fill="#ffffff" />
            <circle cx="63" cy="43" r="2" fill="#ffffff" />
          </>
        )}

        {/* Owl Beak */}
        <polygon points="50,49 45,56 55,56" fill="url(#goldGrad)" />

        {/* Magnifying Glass in Wing */}
        <g transform="translate(64, 48) rotate(-25)">
          <circle cx="14" cy="14" r="9" fill="rgba(0, 229, 255, 0.25)" stroke="#ffd54f" strokeWidth="2.5" />
          <line x1="20" y1="20" x2="28" y2="28" stroke="#f57c00" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M 10 10 Q 14 7 17 11" stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.8" />
        </g>

        {/* Owl Feet */}
        <ellipse cx="43" cy="88" rx="5" ry="3" fill="#ff9800" />
        <ellipse cx="57" cy="88" rx="5" ry="3" fill="#ff9800" />
      </svg>
    </div>
  );
}
