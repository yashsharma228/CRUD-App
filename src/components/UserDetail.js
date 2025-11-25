import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUserById } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import './UserDetail.css';

/**
 * UserDetail Component
 * Displays detailed information about a single user
 */
const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data on component mount
  useEffect(() => {
    loadUserData();
  }, [id]);

  /**
   * Load user data from the API
   */
  const loadUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      const userData = await fetchUserById(id);
      setUser(userData);
    } catch (err) {
      setError('Failed to load user details. Please try again.');
      console.error('Error loading user:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle edit button click
   */
  const handleEdit = () => {
    navigate(`/user/${id}/edit`);
  };

  /**
   * Handle back button click
   */
  const handleBack = () => {
    navigate('/');
  };

  // Show loading spinner while fetching data
  if (loading) {
    return <LoadingSpinner />;
  }

  // Show error message if user data failed to load
  if (error || !user) {
    return (
      <div className="user-detail-container">
        {error && <ErrorMessage message={error} />}
        <button className="btn btn-secondary" onClick={handleBack}>
          ← Back to Users
        </button>
      </div>
    );
  }

  return (
    <div className="user-detail-container">
      <div className="detail-header">
        <button className="btn btn-secondary" onClick={handleBack}>
          ← Back to Users
        </button>
        <button className="btn btn-primary" onClick={handleEdit}>
          Edit User
        </button>
      </div>

      <div className="user-detail-card">
        <div className="detail-section">
          <h2>Basic Information</h2>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">ID:</span>
              <span className="detail-value">{user.id}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Name:</span>
              <span className="detail-value">{user.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Username:</span>
              <span className="detail-value">{user.username || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">
                <a href={`mailto:${user.email}`}>{user.email}</a>
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Phone:</span>
              <span className="detail-value">{user.phone || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Website:</span>
              <span className="detail-value">
                {user.website ? (
                  <a href={`https://${user.website}`} target="_blank" rel="noopener noreferrer">
                    {user.website}
                  </a>
                ) : (
                  'N/A'
                )}
              </span>
            </div>
          </div>
        </div>

        {user.address && (
          <div className="detail-section">
            <h2>Address</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Street:</span>
                <span className="detail-value">{user.address.street || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Suite:</span>
                <span className="detail-value">{user.address.suite || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">City:</span>
                <span className="detail-value">{user.address.city || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Zip Code:</span>
                <span className="detail-value">{user.address.zipcode || 'N/A'}</span>
              </div>
              {user.address.geo && (
                <>
                  <div className="detail-item">
                    <span className="detail-label">Latitude:</span>
                    <span className="detail-value">{user.address.geo.lat || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Longitude:</span>
                    <span className="detail-value">{user.address.geo.lng || 'N/A'}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {user.company && (
          <div className="detail-section">
            <h2>Company</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{user.company.name || 'N/A'}</span>
              </div>
              {user.company.catchPhrase && (
                <div className="detail-item full-width">
                  <span className="detail-label">Catch Phrase:</span>
                  <span className="detail-value">{user.company.catchPhrase}</span>
                </div>
              )}
              {user.company.bs && (
                <div className="detail-item full-width">
                  <span className="detail-label">Business:</span>
                  <span className="detail-value">{user.company.bs}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetail;

