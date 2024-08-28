import React, { useEffect, useRef } from "react";
import "./HistoryModal.css";

const HistoryModal = ({ showHistory, toggleHistory, history }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        toggleHistory();
      }
    };
    if (showHistory) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showHistory, toggleHistory]);

  if (!showHistory) return null;

  return (
    <div className="modal">
      <div className="modal-content" ref={modalRef} >
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
