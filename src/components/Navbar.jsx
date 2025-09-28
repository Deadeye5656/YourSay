import React from 'react';
import './Navbar.css';

const Navbar = ({ onLogin, onSignup, onLogout, isAuthenticated }) => {
  return (
    <nav className="navbar">
      <div className="navbar__logo">YourSay</div>
      <div className="navbar__auth">
        {!isAuthenticated && (
          <>
            <button className="navbar__btn" onClick={onLogin}>Login</button>
            <button className="navbar__btn navbar__btn--signup" onClick={onSignup}>Sign Up</button>
          </>
        )}
        {isAuthenticated && (
          <>
            <button className="navbar__btn" onClick={() => alert('Settings coming soon!')}>Settings</button>
            <button className="navbar__btn navbar__btn--logout" onClick={onLogout}>Log Out</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
