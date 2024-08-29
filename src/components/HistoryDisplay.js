import React from 'react';
import './HistoryDisplay.css';

const HistoryDisplay = ({ expression, lastResult, showExpression }) => {
  return (
    <div className="parent-container">
      <div className="history-display">
        {showExpression ? (
          <div className="expression">{expression}</div>
        ) : (
          lastResult !== null && (
            <div className="result">Ans= {lastResult}</div>
          )
        )}
      </div>
    </div>
  );
};

export default HistoryDisplay;