
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import VerifyCode from './components/VerifyCode';
import Settings from './components/Settings';
import Local from './components/Local';
import State from './components/State';
import Federal from './components/Federal';
import React, { useState, useEffect } from 'react';
import { isSessionValid, clearSession } from './api';

function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check localStorage for authentication state on app load
  useEffect(() => {
    const authState = localStorage.getItem('isAuthenticated');
    if (authState === 'true') {
      // Validate that required tokens exist
      if (isSessionValid()) {
        setIsAuthenticated(true);
      } else {
        // Session is invalid, clear everything and log out
        clearSession();
        setIsAuthenticated(false);
        // Redirect to home page
        navigate('/');
      }
    }
  }, [navigate]);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  const handleSignupSuccess = (email, password, zip, selectedTopics) => {
    // Store user data in localStorage for later use
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userZipcode', zip);
    // You might want to derive state from zipcode or ask user for state
    // For now, we'll set a default and update it later when we have proper state mapping
    localStorage.setItem('userState', 'CA'); // Default state, should be derived from zipcode
    localStorage.setItem('userPreferences', JSON.stringify(selectedTopics));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    // Clear all user data from localStorage using the centralized function
    clearSession();
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
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/local" element={
            isAuthenticated ? (
              <Local />
            ) : (
              <div style={{
                padding: '3rem',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
                borderRadius: '20px',
                color: '#fff',
                margin: '2rem auto',
                maxWidth: '600px',
                boxShadow: '0 8px 32px rgba(26, 35, 126, 0.25)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                  pointerEvents: 'none'
                }}></div>
                <h2 style={{
                  color: '#fff',
                  fontSize: '2.5rem',
                  marginBottom: '1.5rem',
                  fontWeight: '700'
                }}>Local Legislation</h2>
                <p style={{
                  fontSize: '1.2rem',
                  lineHeight: '1.6',
                  marginBottom: '2rem',
                  color: 'rgba(255,255,255,0.9)'
                }}>Get involved in your local community's decision-making process. Stay updated on city council meetings, local ordinances, and neighborhood initiatives that directly affect your daily life.</p>
                <button 
                  onClick={handleSignup}
                  style={{
                    background: '#ffca28',
                    color: '#1a237e',
                    border: 'none',
                    padding: '1rem 2.5rem',
                    borderRadius: '30px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    boxShadow: '0 4px 12px rgba(255, 202, 40, 0.3)'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 202, 40, 0.4)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 202, 40, 0.3)';
                  }}
                >
                  Sign Up Now
                </button>
              </div>
            )
          } />
          <Route path="/state" element={
            isAuthenticated ? (
              <State />
            ) : (
              <div style={{
                padding: '3rem',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
                borderRadius: '20px',
                color: '#fff',
                margin: '2rem auto',
                maxWidth: '600px',
                boxShadow: '0 8px 32px rgba(26, 35, 126, 0.25)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                  pointerEvents: 'none'
                }}></div>
                <h2 style={{
                  color: '#fff',
                  fontSize: '2.5rem',
                  marginBottom: '1.5rem',
                  fontWeight: '700'
                }}>State Legislation</h2>
                <p style={{
                  fontSize: '1.2rem',
                  lineHeight: '1.6',
                  marginBottom: '2rem',
                  color: 'rgba(255,255,255,0.9)'
                }}>Keep up with important state laws and regulations that impact your community. Engage with your state representatives and help shape local policies.</p>
                <button 
                  onClick={handleSignup}
                  style={{
                    background: '#ffca28',
                    color: '#1a237e',
                    border: 'none',
                    padding: '1rem 2.5rem',
                    borderRadius: '30px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    boxShadow: '0 4px 12px rgba(255, 202, 40, 0.3)'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 202, 40, 0.4)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 202, 40, 0.3)';
                  }}
                >
                  Sign Up Now
                </button>
              </div>
            )
          } />
          <Route path="/federal" element={
            isAuthenticated ? (
              <Federal />
            ) : (
              <div style={{
                padding: '3rem',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
                borderRadius: '20px',
                color: '#fff',
                margin: '2rem auto',
                maxWidth: '600px',
                boxShadow: '0 8px 32px rgba(26, 35, 126, 0.25)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                  pointerEvents: 'none'
                }}></div>
                <h2 style={{
                  color: '#fff',
                  fontSize: '2.5rem',
                  marginBottom: '1.5rem',
                  fontWeight: '700'
                }}>Federal Legislation</h2>
                <p style={{
                  fontSize: '1.2rem',
                  lineHeight: '1.6',
                  marginBottom: '2rem',
                  color: 'rgba(255,255,255,0.9)'
                }}>Stay informed about federal laws and policies that affect your life. Track legislation, share your opinions, and make your voice heard in Congress.</p>
                <button 
                  onClick={handleSignup}
                  style={{
                    background: '#ffca28',
                    color: '#1a237e',
                    border: 'none',
                    padding: '1rem 2.5rem',
                    borderRadius: '30px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    boxShadow: '0 4px 12px rgba(255, 202, 40, 0.3)'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 202, 40, 0.4)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 202, 40, 0.3)';
                  }}
                >
                  Sign Up Now
                </button>
              </div>
            )
          } />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/signup" element={<Signup onSignup={handleSignupSuccess} />} />
          <Route path="/verify-code" element={<VerifyCode onVerifySuccess={handleLoginSuccess} />} />
          <Route path="/settings" element={<Settings />} />
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
