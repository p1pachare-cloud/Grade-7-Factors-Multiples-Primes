import React, { useState, useEffect } from 'react';
import ArrayGrid from '../shared/ArrayGrid';
import FactorTree from '../shared/FactorTree';
import HintOverlay from './HintOverlay';
import { isPrime } from '../../utils/numberTheory';

export default function QuestionRenderer({ question, onSelectAnswer, attemptCount }) {
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    setSelectedOption(null);
  }, [question?.id]);

  if (!question) return null;

  const handleOptionClick = (opt) => {
    setSelectedOption(opt);
    onSelectAnswer(opt);
  };

  // Helper for mini factor tree visual if question specifies factorTree
  const miniTree = question.targetNumber
    ? {
        id: 'q_root',
        value: question.targetNumber,
        children: null,
      }
    : null;

  return (
    <div className="question-renderer-card glass-card">
      <div className="question-type-badge">
        <span>Detective Question Type: {question.type.replace(/_/g, ' ').toUpperCase()}</span>
      </div>

      <h3 className="question-text-title">{question.questionText}</h3>

      {/* Visual scaffold if available */}
      <div className="question-visual-scaffold">
        {question.visual === 'arrayGrid' && question.targetNumber && (
          <div className="q-scaffold-box">
            <ArrayGrid
              rows={question.targetNumber <= 30 ? 2 : 4}
              cols={question.targetNumber <= 30 ? Math.ceil(question.targetNumber / 2) : Math.ceil(question.targetNumber / 4)}
              targetNumber={question.targetNumber}
              tileSize={20}
              animated={false}
            />
          </div>
        )}

        {question.visual === 'factorTree' && miniTree && (
          <div className="q-scaffold-box factor-tree-mini-scaffold">
            <FactorTree node={miniTree} />
          </div>
        )}
      </div>

      {/* Options grid */}
      <div className="mcq-options-grid">
        {question.options &&
          question.options.map((option, idx) => {
            const isSelected = selectedOption === option;
            return (
              <button
                key={idx}
                className={`mcq-option-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => handleOptionClick(option)}
              >
                <span className="option-letter">{String.fromCharCode(65 + idx)}.</span>
                <span className="option-text">{option}</span>
              </button>
            );
          })}
      </div>

      <HintOverlay
        hint1={question.hint1}
        hint2={question.hint2}
        explanation={question.explanation}
        attemptCount={attemptCount}
      />
    </div>
  );
}
