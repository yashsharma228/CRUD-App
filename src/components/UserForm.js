import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createUser, updateUser, fetchUserById } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import './UserForm.css';

/**
 * UserForm Component
 * Handles both creating new users and editing existing users
 */
const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    website: '',
    address: {
      street: '',
      suite: '',
      city: '',
      zipcode: '',
    },
    company: {
      name: '',
    },
  });

  const [loading, setLoading] = useState(isEditMode); // Load user data if editing
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Load user data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      loadUserData();
    }
  }, [id, isEditMode]);

  /**
   * Load user data for editing
   */
  const loadUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await fetchUserById(id);
      setFormData({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        website: user.website || '',
        address: {
          street: user.address?.street || '',
          suite: user.address?.suite || '',
          city: user.address?.city || '',
          zipcode: user.address?.zipcode || '',
        },
        company: {
          name: user.company?.name || '',
        },
      });
    } catch (err) {
      setError('Failed to load user data. Please try again.');
      console.error('Error loading user:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle form input changes
   * @param {Event} e - The input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested fields (address, company)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  /**
   * Validate form data
   * @returns {boolean} True if form is valid
   */
  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Phone is required');
      return false;
    }
    return true;
  };

  /**
   * Handle form submission
   * @param {Event} e - The form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      if (isEditMode) {
        await updateUser(id, formData);
        navigate(`/user/${id}`);
      } else {
        await createUser(formData);
        navigate('/');
      }
    } catch (err) {
      setError(
        isEditMode
          ? 'Failed to update user. Please try again.'
          : 'Failed to create user. Please try again.'
      );
      console.error('Error saving user:', err);
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Handle cancel button click
   */
  const handleCancel = () => {
    if (isEditMode) {
      navigate(`/user/${id}`);
    } else {
      navigate('/');
    }
  };

  // Show loading spinner while fetching user data in edit mode
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="user-form-container">
      <div className="form-header">
        <h1>{isEditMode ? 'Edit User' : 'Create New User'}</h1>
        <button className="btn btn-secondary" onClick={handleCancel}>
          Cancel
        </button>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-section">
          <h2>Basic Information</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">
                Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter full name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">
                Email <span className="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter email address"
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">
                Phone <span className="required">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="website">Website</label>
            <input
              type="text"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="Enter website URL"
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Address</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="address.street">Street</label>
              <input
                type="text"
                id="address.street"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                placeholder="Enter street address"
              />
            </div>
            <div className="form-group">
              <label htmlFor="address.suite">Suite</label>
              <input
                type="text"
                id="address.suite"
                name="address.suite"
                value={formData.address.suite}
                onChange={handleChange}
                placeholder="Enter suite/apartment"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="address.city">City</label>
              <input
                type="text"
                id="address.city"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                placeholder="Enter city"
              />
            </div>
            <div className="form-group">
              <label htmlFor="address.zipcode">Zip Code</label>
              <input
                type="text"
                id="address.zipcode"
                name="address.zipcode"
                value={formData.address.zipcode}
                onChange={handleChange}
                placeholder="Enter zip code"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Company</h2>
          <div className="form-group">
            <label htmlFor="company.name">Company Name</label>
            <input
              type="text"
              id="company.name"
              name="company.name"
              value={formData.company.name}
              onChange={handleChange}
              placeholder="Enter company name"
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancel}
            disabled={submitting}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : isEditMode ? 'Update User' : 'Create User'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;

