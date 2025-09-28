
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
      </div>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/local" element={
            isAuthenticated ? (
              <div style={{padding: '2rem'}}>
                <h2>Local Legislation</h2>
                <p>Scroll through upcoming local town hall legislation here.</p>
              </div>
            ) : (
              <div style={{padding: '2rem', textAlign: 'center', background: '#222', borderRadius: '12px', color: '#fff', margin: '2rem auto', maxWidth: '500px', boxShadow: '0 2px 12px rgba(0,0,0,0.15)'}}>
                <h2 style={{color:'#fff'}}>Local Legislation</h2>
                <p>You must <span style={{color:'#00bfff', fontWeight:'bold'}}>sign up</span> to see upcoming legislation in your area.</p>
              </div>
            )
          } />
          <Route path="/state" element={
            isAuthenticated ? (
              <div style={{padding: '2rem'}}>
                <h2>State Legislation</h2>
                <p>Scroll through upcoming state legislature bills here.</p>
              </div>
            ) : (
              <div style={{padding: '2rem', textAlign: 'center', background: '#222', borderRadius: '12px', color: '#fff', margin: '2rem auto', maxWidth: '500px', boxShadow: '0 2px 12px rgba(0,0,0,0.15)'}}>
                <h2 style={{color:'#fff'}}>State Legislation</h2>
                <p>You must <span style={{color:'#00bfff', fontWeight:'bold'}}>sign up</span> to see upcoming legislation in your area.</p>
              </div>
            )
          } />
          <Route path="/federal" element={
            isAuthenticated ? (
              <div style={{padding: '2rem'}}>
                <h2>Federal Legislation</h2>
                <p>Scroll through upcoming federal congress bills here.</p>
              </div>
            ) : (
              <div style={{padding: '2rem', textAlign: 'center', background: '#222', borderRadius: '12px', color: '#fff', margin: '2rem auto', maxWidth: '500px', boxShadow: '0 2px 12px rgba(0,0,0,0.15)'}}>
                <h2 style={{color:'#fff'}}>Federal Legislation</h2>
                <p>You must <span style={{color:'#00bfff', fontWeight:'bold'}}>sign up</span> to see upcoming legislation in your area.</p>
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
