import React from "react";
import "./HistoryModal.css";

const HistoryModal = ({ showHistory, toggleHistory, history }) => {
  if (!showHistory) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={toggleHistory}>&times;</span>
        <h2>History</h2>
        <ul>
          {history.length === 0 ? (
            <li>No history available</li>
          ) : (
            history.map((entry, index) => (
              <li key={index}>{entry}</li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default HistoryModal;
