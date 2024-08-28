import React from 'react';
import './HistoryDisplay.css';

const HistoryDisplay = ({ expression, lastResult, showExpression }) => {
  return (
    <div class="parent-container">
    <div className="history-display">
      {showExpression ? (
        <div className="expression">{expression}</div>
      ) : (
        lastResult !== null && (
          <div className="result">{lastResult}</div>
        )
      )}
    </div>
    </div>
  );
};

export default HistoryDisplay;
