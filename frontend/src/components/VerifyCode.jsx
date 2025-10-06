
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import { sendVerification, signupUser } from "../api";
import { BCRYPT_FIXED_SALT } from "../constants";

const VerifyCode = ({ onVerifySuccess }) => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const navigate = useNavigate();
  const inputsRef = useRef([]);

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    if (!val) return;
    const newCode = [...code];
    newCode[idx] = val[0];
    setCode(newCode);
    // Move to next input if not last
    if (idx < 5 && val) {
      inputsRef.current[idx + 1].focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      if (code[idx]) {
        const newCode = [...code];
        newCode[idx] = "";
        setCode(newCode);
      } else if (idx > 0) {
        inputsRef.current[idx - 1].focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const codeStr = code.join("");
    if (codeStr.length !== 6 || !/^[0-9]{6}$/.test(codeStr)) {
      setError("Please enter a valid 6-digit code.");
      return;
    }
    
    setError("");
    setIsVerifying(true);
    
    try {
      // Get the pending signup data from localStorage
      const pendingDataStr = localStorage.getItem('pendingSignupData');
      if (!pendingDataStr) {
        setError("No signup data found. Please start the signup process again.");
        setIsVerifying(false);
        return;
      }
      
      const pendingData = JSON.parse(pendingDataStr);
      
      // Hash the password using bcrypt with fixed salt for consistency
      const hashedPassword = await bcrypt.hash(pendingData.password, BCRYPT_FIXED_SALT);
      
      // Prepare the data to send to backend
      const signupData = {
        email: pendingData.email,
        password: hashedPassword,
        zipcode: pendingData.zipcode,
        state: pendingData.state || '',
        preferences: pendingData.preferences.join(','), // Convert array to comma-separated string
        phoneNumber: '', // Optional field, can be empty for now
        verificationCode: parseInt(codeStr) // The verification code entered by user
      };
      
      // Call the backend API to create user
      const response = await signupUser(signupData);
      
      if (response.success) {
        // User created successfully
        localStorage.removeItem('pendingSignupData'); // Clean up
        
        // Store user data in localStorage for app use
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', pendingData.email);
        localStorage.setItem('userZipcode', pendingData.zipcode);
        localStorage.setItem('userState', pendingData.state || '');
        localStorage.setItem('userPreferences', JSON.stringify(pendingData.preferences));
        
        if (onVerifySuccess) onVerifySuccess();
        navigate('/'); // Navigate to home or dashboard
      } else {
        // Handle error response from backend
        setError(response.message || 'Invalid verification code or signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError('An error occurred during verification. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setError("");
    setResendMessage("");
    
    try {
      // Get email from pending signup data or localStorage
      const pendingDataStr = localStorage.getItem('pendingSignupData');
      let userEmail;
      
      if (pendingDataStr) {
        const pendingData = JSON.parse(pendingDataStr);
        userEmail = pendingData.email;
      } else {
        userEmail = localStorage.getItem('userEmail');
      }
      
      if (!userEmail) {
        setError("No email found. Please sign up again.");
        setIsResending(false);
        return;
      }
      
      const response = await sendVerification({ email: userEmail });
      
      if (response.success) {
        setResendMessage("Verification code sent successfully!");
      } else {
        setError("Failed to resend verification code. Please try again.");
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      setError("An error occurred while resending the code.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="verify-code-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '3rem' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Verify Your Email & Create Account</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ marginBottom: '1rem', fontSize: '1.1rem', color: '#333', textAlign: 'center' }}>
          Please enter the 6-digit verification code we sent to your email.
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          {code.map((digit, idx) => (
            <input
              key={idx}
              ref={el => inputsRef.current[idx] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(e, idx)}
              onKeyDown={e => handleKeyDown(e, idx)}
              style={{
                width: '3rem',
                height: '3rem',
                fontSize: '2rem',
                textAlign: 'center',
                border: '2px solid #0077ff',
                borderRadius: '8px',
                outline: 'none',
                background: '#f9f9f9',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                color: '#000'
              }}
              autoFocus={idx === 0}
            />
          ))}
        </div>
        <button 
          type="submit" 
          disabled={isVerifying}
          style={{ 
            padding: '0.75rem 2rem', 
            fontSize: '1.1rem', 
            background: isVerifying ? '#ccc' : '#0077ff', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '6px', 
            cursor: isVerifying ? 'not-allowed' : 'pointer', 
            marginBottom: '1rem' 
          }}
        >
          {isVerifying ? 'Creating Account...' : 'Verify & Create Account'}
        </button>
        
        <button 
          type="button" 
          onClick={handleResendCode}
          disabled={isResending}
          style={{ 
            padding: '0.5rem 1.5rem', 
            fontSize: '0.9rem', 
            background: 'transparent', 
            color: '#0077ff', 
            border: '1px solid #0077ff', 
            borderRadius: '6px', 
            cursor: isResending ? 'not-allowed' : 'pointer',
            opacity: isResending ? 0.6 : 1
          }}
        >
          {isResending ? 'Sending...' : 'Resend Code'}
        </button>
      </form>
      {error && <p className="error" style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
      {resendMessage && <p style={{ color: 'green', marginTop: '1rem' }}>{resendMessage}</p>}
    </div>
  );
};

export default VerifyCode;
