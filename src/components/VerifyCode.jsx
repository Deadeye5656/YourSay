
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const VerifyCode = ({ onVerifySuccess }) => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const codeStr = code.join("");
    if (codeStr.length !== 6 || !/^[0-9]{6}$/.test(codeStr)) {
      setError("Please enter a valid 6-digit code.");
      return;
    }
    // TODO: Add API call to verify code
    if (onVerifySuccess) onVerifySuccess();
  };

  return (
    <div className="verify-code-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '3rem' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Enter the 6-digit code sent to your email</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ marginBottom: '1rem', fontSize: '1.1rem', color: '#333', textAlign: 'center' }}>
          Please enter the 6-digit verification code we emailed you.
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
        <button type="submit" style={{ padding: '0.75rem 2rem', fontSize: '1.1rem', background: '#0077ff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Verify</button>
      </form>
      {error && <p className="error" style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
};

export default VerifyCode;
