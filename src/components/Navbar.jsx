import React from 'react';
import './Navbar.css';

const Navbar = ({ onLogin, onSignup }) => {
  return (
    <nav className="navbar">
      <div className="navbar__logo">YourSay</div>
      <div className="navbar__auth">
        <button className="navbar__btn" onClick={onLogin}>Login</button>
        <button className="navbar__btn navbar__btn--signup" onClick={onSignup}>Sign Up</button>
      </div>
    </nav>
  );
};

export default Navbar;
