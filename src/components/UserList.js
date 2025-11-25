import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUsers, deleteUser } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import './UserList.css';

/**
 * UserList Component
 * Displays a list of all users with options to view, edit, or delete
 */
const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const navigate = useNavigate();

  // Fetch users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  /**
   * Load users from the API
   */
  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const usersData = await fetchUsers();
      setUsers(usersData);
    } catch (err) {
      setError('Failed to load users. Please try again later.');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle delete user action
   * @param {number} userId - ID of the user to delete
   */
  const handleDelete = async (userId) => {
    // Confirm before deleting
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    setDeletingUserId(userId);
    try {
      await deleteUser(userId);
      // Remove user from local state (since API doesn't actually delete)
      setUsers(users.filter((user) => user.id !== userId));
    } catch (err) {
      setError('Failed to delete user. Please try again.');
      console.error('Error deleting user:', err);
    } finally {
      setDeletingUserId(null);
    }
  };

  /**
   * Navigate to user detail page
   * @param {number} userId - ID of the user to view
   */
  const handleView = (userId) => {
    navigate(`/user/${userId}`);
  };

  /**
   * Navigate to edit user page
   * @param {number} userId - ID of the user to edit
   */
  const handleEdit = (userId) => {
    navigate(`/user/${userId}/edit`);
  };

  // Show loading spinner while fetching data
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <h1>User Management</h1>
        <button className="btn btn-primary" onClick={() => navigate('/user/create')}>
          + Add New User
        </button>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

      {users.length === 0 && !loading ? (
        <div className="empty-state">
          <p>No users found.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td className="actions-cell">
                    <button
                      className="btn btn-view"
                      onClick={() => handleView(user.id)}
                      title="View Details"
                    >
                      View
                    </button>
                    <button
                      className="btn btn-edit"
                      onClick={() => handleEdit(user.id)}
                      title="Edit User"
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDelete(user.id)}
                      disabled={deletingUserId === user.id}
                      title="Delete User"
                    >
                      {deletingUserId === user.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserList;

