import React from 'react';
import './ErrorMessage.css';

/**
 * ErrorMessage Component
 * Displays error messages to the user
 * @param {string} message - The error message to display
 * @param {function} onClose - Optional callback to close/dismiss the error
 */
const ErrorMessage = ({ message, onClose }) => {
  return (
    <div className="error-message">
      <div className="error-content">
        <span className="error-icon">⚠️</span>
        <span className="error-text">{message}</span>
        {onClose && (
          <button className="error-close" onClick={onClose}>
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;

