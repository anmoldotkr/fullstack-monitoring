// components/Navbar.jsx
import React from 'react';
import '../stylesheets/Navbar.css';

const Navbar = ({ user, onLogout }) => {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <span className="brand-logo">⚡</span>
        <h2>TaskFlow</h2>
      </div>

      <div className="navbar-actions">
        <div className="user-profile">
          <div className="avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <span className="user-name">{user?.name || 'User'}</span>
        </div>

        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;