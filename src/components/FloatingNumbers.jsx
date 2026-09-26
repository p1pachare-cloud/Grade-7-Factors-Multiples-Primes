import React from 'react';

const FLOATING_ITEMS = [
  { text: '2', left: '8%', top: '15%', delay: '0s', size: '2.4rem' },
  { text: '3', left: '84%', top: '22%', delay: '3s', size: '3.1rem' },
  { text: '5', left: '14%', top: '65%', delay: '1s', size: '2.8rem' },
  { text: '7', left: '76%', top: '78%', delay: '4s', size: '3.4rem' },
  { text: '11', left: '32%', top: '88%', delay: '2s', size: '2.6rem' },
  { text: '13', left: '60%', top: '12%', delay: '5s', size: '2.5rem' },
  { text: '17', left: '92%', top: '50%', delay: '2.5s', size: '2.7rem' },
  { text: '47', left: '4%', top: '42%', delay: '4.5s', size: '2.9rem' },
  { text: '84', left: '45%', top: '5%', delay: '1.5s', size: '2.8rem' },
  { text: '2³', left: '72%', top: '38%', delay: '3.5s', size: '2.7rem' },
  { text: '🔍', left: '22%', top: '32%', delay: '0.5s', size: '2.2rem' },
  { text: '×', left: '52%', top: '72%', delay: '2.8s', size: '3rem' },
];

export default function FloatingNumbers() {
  return (
    <div className="floating-numbers" aria-hidden="true">
      {FLOATING_ITEMS.map((item, idx) => (
        <span
          key={idx}
          className="floating-number"
          style={{
            left: item.left,
            top: item.top,
            animationDelay: item.delay,
            fontSize: item.size,
          }}
        >
          {item.text}
        </span>
      ))}
    </div>
  );
}
