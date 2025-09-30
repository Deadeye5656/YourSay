import React from 'react';
import './Navbar.css';

const Navbar = ({ onLogin, onSignup, onLogout, isAuthenticated, onNavigate }) => {
  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <span className="logo-your">Your</span>
        <span className="logo-say">Say</span>
        <div className="logo-underline"></div>
      </div>
      <div className="navbar__navlinks">
        <button className="navbar__navbtn" onClick={() => onNavigate('/')}>Home</button>
        <button className="navbar__navbtn" onClick={() => onNavigate('/local')}>Local</button>
        <button className="navbar__navbtn" onClick={() => onNavigate('/state')}>State</button>
        <button className="navbar__navbtn" onClick={() => onNavigate('/federal')}>Federal</button>
      </div>
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
