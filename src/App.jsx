
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';

function App() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    alert('Signup modal coming soon!');
  };

  return (
    <div className="app-container">
      <Navbar onLogin={handleLogin} onSignup={handleSignup} />
      <div className="tabs-bar">
        <button className="tab" onClick={() => navigate('/')}>Home</button>
        <button className="tab" onClick={() => navigate('/local')}>Local</button>
        <button className="tab" onClick={() => navigate('/state')}>State</button>
        <button className="tab" onClick={() => navigate('/federal')}>Federal</button>
        <button className="tab" onClick={() => navigate('/login')}>Login</button>
      </div>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/local" element={<div style={{padding: '2rem'}}><h2>Local Legislation</h2><p>Scroll through upcoming local town hall legislation here.</p></div>} />
          <Route path="/state" element={<div style={{padding: '2rem'}}><h2>State Legislation</h2><p>Scroll through upcoming state legislature bills here.</p></div>} />
          <Route path="/federal" element={<div style={{padding: '2rem'}}><h2>Federal Legislation</h2><p>Scroll through upcoming federal congress bills here.</p></div>} />
          <Route path="/login" element={<Login />} />
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
