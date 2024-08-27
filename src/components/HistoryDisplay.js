import React from 'react';
import './HistoryDisplay.css';

const HistoryDisplay = ({ expression, lastResult, showExpression }) => {
  return (
    <div className="history-display">
      {showExpression ? (
        <div className="history-expression">{expression}</div>
      ) : (
        lastResult !== null && (
          <div className="history-result">Ans: {lastResult}</div>
        )
      )}
    </div>
  );
};

export default HistoryDisplay;
