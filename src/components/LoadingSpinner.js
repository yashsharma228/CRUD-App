import React from 'react';
import './LoadingSpinner.css';

/**
 * LoadingSpinner Component
 * Displays a loading spinner while data is being fetched
 */
const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p className="loading-text">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;

