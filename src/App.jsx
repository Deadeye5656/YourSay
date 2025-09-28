
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import VerifyCode from './components/VerifyCode';
import React, { useState } from 'react';

function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/');
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    navigate('/');
  };

  return (
    <div className="app-container">
      <Navbar
        onLogin={handleLogin}
        onSignup={handleSignup}
        onLogout={handleLogout}
        isAuthenticated={isAuthenticated}
      />
      <div className="tabs-bar">
        <button className="tab" onClick={() => navigate('/')}>Home</button>
        <button className="tab" onClick={() => navigate('/local')}>Local</button>
        <button className="tab" onClick={() => navigate('/state')}>State</button>
        <button className="tab" onClick={() => navigate('/federal')}>Federal</button>
        {!isAuthenticated && <button className="tab" onClick={() => navigate('/login')}>Login</button>}
        {!isAuthenticated && <button className="tab" onClick={() => navigate('/signup')}>Sign Up</button>}
        {isAuthenticated && <button className="tab" onClick={() => alert('Settings coming soon!')}>Settings</button>}
        {isAuthenticated && <button className="tab" onClick={handleLogout}>Log Out</button>}
      </div>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/local" element={<div style={{padding: '2rem'}}><h2>Local Legislation</h2><p>Scroll through upcoming local town hall legislation here.</p></div>} />
          <Route path="/state" element={<div style={{padding: '2rem'}}><h2>State Legislation</h2><p>Scroll through upcoming state legislature bills here.</p></div>} />
          <Route path="/federal" element={<div style={{padding: '2rem'}}><h2>Federal Legislation</h2><p>Scroll through upcoming federal congress bills here.</p></div>} />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-code" element={<VerifyCode onVerifySuccess={handleLoginSuccess} />} />
        </Routes>
      </main>
    </div>
  );
}

export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}
