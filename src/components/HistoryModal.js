import React from "react";
import "./HistoryModal.css";

const HistoryModal = ({ showHistory, toggleHistory, history }) => {
  if (!showHistory) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={toggleHistory}>&times;</span>
        <h2>History</h2>
        <div className="history-list">
          {history.length === 0 ? (
            <div className="no-history">No history available</div>
          ) : (
            history.map((entry, index) => {
              const [expression, result] = entry.split('=');
              return (
                <div key={index} className="history-entry">
                  <div className="history-expression">{expression.trim()}</div>
                  <div className="equal-sign">=</div>
                  <div className="history-result">{result.trim()}</div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
