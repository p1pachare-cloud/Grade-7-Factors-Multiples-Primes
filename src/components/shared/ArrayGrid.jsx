import React, { useRef, useState, useEffect } from 'react';

export default function ArrayGrid({
  rows = 1,
  cols = 1,
  targetNumber = null,
  animated = true,
  tileSize = 30,
  maxDisplayCols = 16,
  maxDisplayRows = 16,
  icon = '🧪',
  scenarioName = 'Sample Vials',
  onDragDimensions = null,
  isSettled = false,
}) {
  const actualRows = Math.min(rows, maxDisplayRows);
  const actualCols = Math.min(cols, maxDisplayCols);
  const total = rows * cols;
  const isValid = targetNumber !== null ? total === targetNumber : true;

  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ startX: 0, startY: 0, startRows: rows, startCols: cols });

  // Handle touch / mouse drag resize
  useEffect(() => {
    if (!onDragDimensions) return;

    const handlePointerMove = (e) => {
      if (!isDragging) return;
      const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
      const clientY = e.clientY ?? (e.touches && e.touches[0] ? e.touches[0].clientY : 0);

      const dx = clientX - dragStartRef.current.startX;
      const dy = clientY - dragStartRef.current.startY;

      // Sensitive delta threshold for snap stepping
      const colStep = Math.round(dx / 32);
      const rowStep = Math.round(dy / 32);

      const newCols = Math.max(1, Math.min(24, dragStartRef.current.startCols + colStep));
      const newRows = Math.max(1, Math.min(20, dragStartRef.current.startRows + rowStep));

      if (newCols !== cols || newRows !== rows) {
        onDragDimensions(newRows, newCols);
      }
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('touchmove', handlePointerMove);
      window.addEventListener('touchend', handlePointerUp);
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [isDragging, rows, cols, onDragDimensions]);

  const handleDragHandleDown = (e) => {
    e.preventDefault();
    const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const clientY = e.clientY ?? (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
    dragStartRef.current = {
      startX: clientX,
      startY: clientY,
      startRows: rows,
      startCols: cols,
    };
    setIsDragging(true);
  };

  const padding = 16;
  const width = Math.max(120, actualCols * tileSize + padding * 2);
  const height = Math.max(80, actualRows * tileSize + padding * 2);

  return (
    <div
      ref={containerRef}
      className={`array-grid-wrapper ${!isValid && targetNumber !== null ? 'array-mismatch' : 'array-matched'} ${
        isValid ? 'shelf-settled' : ''
      }`}
    >
      <div className="array-shelf-header">
        <span className="shelf-badge">
          {icon} Shelf Layout: {rows} × {cols}
        </span>
        <span className="shelf-status-pill">
          {isValid ? '✨ Settled into neat shelves!' : total > targetNumber ? '⚠️ Overflow on shelf' : '📦 Empty gaps on shelf'}
        </span>
      </div>

      <div className="array-interactive-canvas-box">
        <div className="array-svg-scroll">
          <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            style={{
              width: `${width}px`,
              height: `${height}px`,
              maxWidth: '100%',
              maxHeight: '260px',
              display: 'block',
              margin: '0 auto',
            }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="tileGradValid" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00e676" />
                <stop offset="100%" stopColor="#00b0ff" />
              </linearGradient>
              <linearGradient id="tileGradTarget" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffd54f" />
                <stop offset="100%" stopColor="#ff9800" />
              </linearGradient>
            </defs>

            {/* Shelf backdrop wires */}
            {Array.from({ length: actualRows }).map((_, r) => (
              <line
                key={`shelf-line-${r}`}
                x1={padding - 6}
                y1={padding + (r + 1) * tileSize - 2}
                x2={width - padding + 6}
                y2={padding + (r + 1) * tileSize - 2}
                stroke={isValid ? '#00e676' : 'rgba(255, 255, 255, 0.28)'}
                strokeWidth="2.5"
                strokeDasharray={isValid ? 'none' : '4,3'}
              />
            ))}

            {Array.from({ length: actualRows }).map((_, r) =>
              Array.from({ length: actualCols }).map((_, c) => {
                const tileIndex = r * cols + c + 1;
                const isWithinTarget = targetNumber ? tileIndex <= targetNumber : true;
                const x = padding + c * tileSize;
                const y = padding + r * tileSize;

                return (
                  <g key={`${r}-${c}`} className="array-tile-group">
                    <rect
                      x={x + 2}
                      y={y + 2}
                      width={tileSize - 4}
                      height={tileSize - 4}
                      rx="6"
                      fill={
                        isValid
                          ? 'url(#tileGradValid)'
                          : isWithinTarget
                          ? 'url(#tileGradTarget)'
                          : 'rgba(239, 83, 80, 0.8)'
                      }
                      stroke={isValid ? '#ffffff' : isWithinTarget ? '#ffd54f' : '#ef5350'}
                      strokeWidth="1.5"
                      className="array-tile"
                    />
                    {/* Real-world item emoji icon centered inside tile */}
                    <text
                      x={x + tileSize / 2}
                      y={y + tileSize / 2}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={tileSize > 26 ? "15" : "12"}
                      style={{ pointerEvents: 'none', userSelect: 'none' }}
                    >
                      {icon}
                    </text>
                  </g>
                );
              })
            )}
          </svg>
        </div>

        {/* Stretch / Squeeze Interactive Corner Handle */}
        {onDragDimensions && (
          <div
            className={`array-drag-handle ${isDragging ? 'is-dragging' : ''}`}
            onPointerDown={handleDragHandleDown}
            onTouchStart={handleDragHandleDown}
            role="slider"
            aria-label="Drag corner to stretch or squeeze rows and columns"
            tabIndex={0}
            title="Drag corner to stretch or squeeze grid rows and columns"
          >
            <span className="drag-handle-dots">⤡</span>
            <span className="drag-handle-tooltip">Drag to Resize</span>
          </div>
        )}
      </div>

      <div className="array-grid-readout">
        <span className="array-dimension-tag">
          {rows} rows × {cols} columns = <strong>{total} {scenarioName}</strong>
        </span>
        {targetNumber !== null && (
          <span className={`array-validation-badge ${isValid ? 'valid' : 'invalid'}`}>
            {isValid ? (
              `✓ Perfect Fit! Factor Pair: ${rows} × ${cols} = ${targetNumber}`
            ) : total > targetNumber ? (
              `Overflow: +${total - targetNumber} excess items (Target: ${targetNumber})`
            ) : (
              `Gaps: -${targetNumber - total} items missing to fill shelf (Target: ${targetNumber})`
            )}
          </span>
        )}
      </div>
    </div>
  );
}
