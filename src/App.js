import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserList from './components/UserList';
import UserDetail from './components/UserDetail';
import UserForm from './components/UserForm';
import './App.css';

/**
 * Main App Component
 * Sets up routing for the application
 */
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Home route - displays list of users */}
          <Route path="/" element={<UserList />} />
          
          {/* Create user route - must come before /user/:id */}
          <Route path="/user/create" element={<UserForm />} />
          
          {/* Edit user route - must come before /user/:id */}
          <Route path="/user/:id/edit" element={<UserForm />} />
          
          {/* User detail route */}
          <Route path="/user/:id" element={<UserDetail />} />
          
          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
