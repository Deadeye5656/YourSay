import React, { useState } from 'react';
import bcrypt from 'bcryptjs';
import { loginUser } from '../api';
import { BCRYPT_FIXED_SALT } from '../constants';
import './Login.css';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simple validation
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      // Use the same fixed salt for consistent hashing
      const hashedPassword = await bcrypt.hash(password, BCRYPT_FIXED_SALT);
      
      // Prepare login data with consistently hashed password
      const loginData = {
        email: email,
        password: hashedPassword
      };
      
      // Call the login API
      const response = await loginUser(loginData);
      
      if (response.success && response.isAuthenticated) {
        // Login successful - store user data and call success callback
        localStorage.setItem('userEmail', email);
        localStorage.setItem('isAuthenticated', 'true');
        
        // TODO: Fetch user preferences and other data from backend if needed
        // For now, we'll rely on the data that might already be in localStorage
        
        if (onLoginSuccess) onLoginSuccess();
      } else {
        // Login failed
        setError('Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <div className="error">{error}</div>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        
      </form>
    </div>
  );
};

export default Login;
