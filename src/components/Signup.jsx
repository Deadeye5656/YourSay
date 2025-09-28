import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Signup = ({ onSignup }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    if (onSignup) onSignup(email, password);
    // Redirect to code verification page
    navigate('/verify-code');
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={step === 1 ? handleEmailSubmit : handlePasswordSubmit}>
        <h2>Sign Up</h2>
        {error && <div className="error">{error}</div>}
        {step === 1 ? (
          <>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <button type="submit">Sign Up</button>
          </>
        ) : (
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
            <button type="submit">Create Account</button>
          </>
        )}
      </form>
    </div>
  );
};

export default Signup;
