import React from 'react';
import { isPrime } from '../../utils/numberTheory';

// Helper to get divisibility hint shimmer text for X-ray mode
function getXRayNudge(val) {
  if (val <= 1) return '';
  const nudges = [];
  if (val % 2 === 0) nudges.push('Even (÷2)');
  const sumDigits = String(val).split('').reduce((acc, c) => acc + parseInt(c, 10), 0);
  if (sumDigits % 3 === 0) nudges.push('Sum÷3 (÷3)');
  if (val % 5 === 0) nudges.push('Ends 0/5 (÷5)');
  if (val % 7 === 0) nudges.push('÷7');
  return nudges.length > 0 ? nudges.join(' • ') : 'Test small primes';
}

export default function FactorTree({
  node,
  onSplit,
  selectedNode = null,
  wobbleNodeId = null,
  showXRay = false,
  chainLitIds = new Set(),
}) {
  if (!node) return null;

  const prime = isPrime(node.value);
  const isSelected = selectedNode && selectedNode.id === node.id;
  const isWobbling = wobbleNodeId && wobbleNodeId === node.id;
  const isChainLit = chainLitIds && chainLitIds.has(node.id);
  const isLeaf = !node.children || node.children.length === 0;

  return (
    <div className={`factor-tree-branch ${isWobbling ? 'branch-wobbling' : ''}`}>
      {/* Node Pill */}
      <div
        id={node.id}
        className={`tree-node-circle ${
          prime
            ? isChainLit
              ? 'tree-node-prime tree-node-chain-lit'
              : 'tree-node-prime'
            : 'tree-node-composite'
        } ${isSelected ? 'tree-node-selected' : ''} ${isWobbling ? 'node-wobble-shake' : ''} ${
          showXRay && !prime ? 'node-xray-active' : ''
        }`}
        onClick={() => !prime && onSplit && onSplit(node)}
        role="button"
        tabIndex={prime ? -1 : 0}
        title={
          prime
            ? `${node.value} is Prime!`
            : `Click to split composite ${node.value}`
        }
      >
        <span className="node-value">{node.value}</span>
        {prime && (
          <span className={`prime-star-badge ${isChainLit ? 'star-pulse' : ''}`} title="Prime Leaf">
            ★
          </span>
        )}

        {/* X-Ray Divisibility Shimmer Overlay */}
        {showXRay && !prime && (
          <div className="xray-shimmer-tag">
            <span>{getXRayNudge(node.value)}</span>
          </div>
        )}
      </div>

      {/* Children branches if split */}
      {node.children && node.children.length === 2 && (
        <div className="factor-tree-children-container">
          <svg className="tree-connector-lines" aria-hidden="true">
            <line
              x1="50%"
              y1="0"
              x2="25%"
              y2="100%"
              stroke={isChainLit ? '#ffd54f' : 'rgba(0, 229, 255, 0.55)'}
              strokeWidth={isChainLit ? '3.5' : '2.5'}
              className={isChainLit ? 'line-energized' : ''}
            />
            <line
              x1="50%"
              y1="0"
              x2="75%"
              y2="100%"
              stroke={isChainLit ? '#ffd54f' : 'rgba(0, 229, 255, 0.55)'}
              strokeWidth={isChainLit ? '3.5' : '2.5'}
              className={isChainLit ? 'line-energized' : ''}
            />
          </svg>
          <div className="tree-children-row">
            <div className="tree-child-slot">
              <FactorTree
                node={node.children[0]}
                onSplit={onSplit}
                selectedNode={selectedNode}
                wobbleNodeId={wobbleNodeId}
                showXRay={showXRay}
                chainLitIds={chainLitIds}
              />
            </div>
            <div className="tree-child-slot">
              <FactorTree
                node={node.children[1]}
                onSplit={onSplit}
                selectedNode={selectedNode}
                wobbleNodeId={wobbleNodeId}
                showXRay={showXRay}
                chainLitIds={chainLitIds}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
