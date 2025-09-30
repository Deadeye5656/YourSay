
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import VerifyCode from './components/VerifyCode';
import Local from './components/Local';
import State from './components/State';
import Federal from './components/Federal';
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
        onNavigate={navigate}
      />
        {/* Development-only button to toggle login state */}
        <div style={{ position: 'fixed', top: 10, right: 10, zIndex: 9999 }}>
          <button
            onClick={() => setIsAuthenticated((prev) => !prev)}
            style={{ padding: '0.5rem 1rem', background: '#007bff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {isAuthenticated ? 'Set Logged Out' : 'Set Logged In'} (Dev)
          </button>
        </div>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/local" element={
            isAuthenticated ? (
              <Local />
            ) : (
              <div style={{padding: '2rem', textAlign: 'center', background: '#222', borderRadius: '12px', color: '#fff', margin: '2rem auto', maxWidth: '500px', boxShadow: '0 2px 12px rgba(0,0,0,0.15)'}}>
                <h2 style={{color:'#fff'}}>Local Legislation</h2>
                <p>You must <button style={{color:'#00bfff', background:'none', border:'none', cursor:'pointer', textDecoration:'underline', fontSize:'inherit', fontWeight:'inherit', padding:0}} onClick={handleSignup}>sign up</button> to see upcoming legislation in your area.</p>
              </div>
            )
          } />
          <Route path="/state" element={
            isAuthenticated ? (
              <State />
            ) : (
              <div style={{padding: '2rem', textAlign: 'center', background: '#222', borderRadius: '12px', color: '#fff', margin: '2rem auto', maxWidth: '500px', boxShadow: '0 2px 12px rgba(0,0,0,0.15)'}}>
                <h2 style={{color:'#fff'}}>State Legislation</h2>
                <p>You must <button style={{color:'#00bfff', background:'none', border:'none', cursor:'pointer', textDecoration:'underline', fontSize:'inherit', fontWeight:'inherit', padding:0}} onClick={handleSignup}>sign up</button> to see upcoming legislation in your area.</p>
              </div>
            )
          } />
          <Route path="/federal" element={
            isAuthenticated ? (
              <Federal />
            ) : (
              <div style={{padding: '2rem', textAlign: 'center', background: '#222', borderRadius: '12px', color: '#fff', margin: '2rem auto', maxWidth: '500px', boxShadow: '0 2px 12px rgba(0,0,0,0.15)'}}>
                <h2 style={{color:'#fff'}}>Federal Legislation</h2>
                <p>You must <button style={{color:'#00bfff', background:'none', border:'none', cursor:'pointer', textDecoration:'underline', fontSize:'inherit', fontWeight:'inherit', padding:0}} onClick={handleSignup}>sign up</button> to see upcoming legislation in your area.</p>
              </div>
            )
          } />
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
