import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const topicsList = [
  "Healthcare",
  "Education",
  "Economy",
  "Environment",
  "Immigration",
  "Gun Control",
  "Civil Rights",
  "Foreign Policy",
  "Taxes",
  "Public Safety",
  "Infrastructure",
  "Other"
];

const Signup = ({ onSignup }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [zip, setZip] = useState('');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      setError('Please enter your password twice.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setStep(3);
  };

  const handleZipSubmit = (e) => {
    e.preventDefault();
    if (!zip || zip.length !== 5 || !/^[0-9]{5}$/.test(zip)) {
      setError('Please enter a valid 5-digit zip code.');
      return;
    }
    setError('');
    setStep(4);
  };

  const handleTopicsSubmit = (e) => {
    e.preventDefault();
    if (selectedTopics.length === 0) {
      setError('Please select at least one political topic.');
      return;
    }
    setError('');
    if (onSignup) onSignup(email, password, zip, selectedTopics);
    navigate('/verify-code');
  };

  const toggleTopic = (topic) => {
    setSelectedTopics(prev => {
      if (prev.includes(topic)) {
        return prev.filter(t => t !== topic);
      } else if (prev.length < 5) {
        return [...prev, topic];
      } else {
        return prev;
      }
    });
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={
        step === 1 ? handleEmailSubmit :
        step === 2 ? handlePasswordSubmit :
        step === 3 ? handleZipSubmit :
        handleTopicsSubmit
      }>
        <h2>Sign Up</h2>
        {error && <div className="error">{error}</div>}
        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <button type="submit">Sign Up</button>
          </>
        )}
        {step === 2 && (
          <>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
            <button type="submit">Next</button>
          </>
        )}
        {step === 3 && (
          <>
            <input
              type="text"
              placeholder="Zip Code"
              value={zip}
              maxLength={5}
              onChange={e => setZip(e.target.value.replace(/[^0-9]/g, ''))}
              style={{marginBottom: '1rem'}}
            />
            <button type="submit">Next</button>
          </>
        )}
        {step === 4 && (
          <>
            {selectedTopics.length === 5 && (
              <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>
                You can't choose more than 5 topics of interest.
              </div>
            )}
            <div style={{marginBottom: '1rem'}}>
              <div style={{marginBottom: '0.5rem'}}>Select the political topics most important to you:</div>
              <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center'}}>
                {topicsList.map(topic => (
                  <button
                    type="button"
                    key={topic}
                    onClick={() => toggleTopic(topic)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      border: selectedTopics.includes(topic) ? '2px solid #0077ff' : '2px solid #ccc',
                      background: selectedTopics.includes(topic) ? '#0077ff' : '#f5f5f5',
                      color: selectedTopics.includes(topic) ? '#fff' : '#333',
                      cursor: 'pointer',
                      fontWeight: selectedTopics.includes(topic) ? 'bold' : 'normal',
                      width: '145px'
                    }}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit">Create Account</button>
          </>
        )}
      </form>
    </div>
  );
};

export default Signup;
