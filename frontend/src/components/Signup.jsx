import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendVerification } from '../api';
import { US_STATES } from '../constants';
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
  const [state, setState] = useState('');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
    if (!state) {
      setError('Please select your state.');
      return;
    }
    setError('');
    setStep(4);
  };

  const handleStateSubmit = (e) => {
    e.preventDefault();
    if (!state) {
      setError('Please select your state.');
      return;
    }
    setError('');
    setStep(5);
  };

  const handleTopicsSubmit = async (e) => {
    e.preventDefault();
    if (selectedTopics.length === 0) {
      setError('Please select at least one political topic.');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      // Store signup data in localStorage for later use after verification
      const signupData = {
        email: email,
        password: password, // Store unhashed password for now
        zipcode: zip,
        state: state,
        preferences: selectedTopics
      };
      
      localStorage.setItem('pendingSignupData', JSON.stringify(signupData));
      
      // Send verification code
      const verificationResponse = await sendVerification({ email: email });
      
      if (verificationResponse.success) {
        // Verification code sent successfully
        if (onSignup) onSignup(email, password, zip, state, selectedTopics);
        navigate('/verify-code');
      } else {
        // Handle error response from verification
        setError(verificationResponse.message || 'Failed to send verification code. Please try again.');
      }
    } catch (error) {
      console.error('Verification sending error:', error);
      setError('An error occurred while sending verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
      <form className="login-form"
          onSubmit={
            step === 1 ? handleEmailSubmit :
            step === 2 ? handlePasswordSubmit :
            step === 3 ? handleZipSubmit :
            handleTopicsSubmit
          }
          >
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
            <button type="submit" className="submit-button">Sign Up</button>
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
            <button type="submit" className="submit-button">Next</button>
          </>
        )}
        {step === 3 && (
          <>
            <select
              value={state}
              onChange={e => setState(e.target.value)}
            >
              <option value="" style={{color: '#333'}}>Select your state</option>
              {US_STATES.map(stateAbbr => (
                <option key={stateAbbr} value={stateAbbr} style={{color: '#333'}}>
                  {stateAbbr}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Zip Code"
              value={zip}
              maxLength={5}
              onChange={e => setZip(e.target.value.replace(/[^0-9]/g, ''))}
            />
            <button type="submit" className="submit-button">Next</button>
          </>
        )}
        {step === 4 && (
          <>
            {selectedTopics.length === 5 && (
              <div className="error">
                You can't choose more than 5 topics of interest.
              </div>
            )}
            <div className="topics-section">
              <p>Select the political topics most important to you:</p>
              <div className="topics-grid">
                {topicsList.map(topic => (
                  <button
                    type="button"
                    key={topic}
                    onClick={() => toggleTopic(topic)}
                    className={`topic-button ${selectedTopics.includes(topic) ? 'selected' : ''}`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? 'Sending Verification Code...' : 'Send Verification Code'}
            </button>
          </>
        )}
        </form>
    </div>
  );
};

export default Signup;
