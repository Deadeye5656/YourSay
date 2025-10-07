import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updatePreferences } from '../api';
import { US_STATES } from '../constants';
import './Login.css'; // Reuse the login styles for consistency

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

const Settings = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [state, setState] = useState('');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load current user data from localStorage on component mount
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    
    // Redirect to login if not authenticated
    if (isAuthenticated !== 'true') {
      navigate('/login');
      return;
    }

    const userEmail = localStorage.getItem('userEmail');
    const userZipcode = localStorage.getItem('userZipcode');
    const userState = localStorage.getItem('userState');
    const userPreferences = localStorage.getItem('userPreferences');

    if (userEmail) setEmail(userEmail);
    if (userZipcode) setZipcode(userZipcode);
    if (userState) setState(userState);
    if (userPreferences) {
      try {
        // Handle both string format (comma-separated) and JSON array format
        let preferences;
        if (userPreferences.startsWith('[')) {
          // JSON array format (from signup)
          preferences = JSON.parse(userPreferences);
        } else {
          // Comma-separated string format (from login response)
          preferences = userPreferences.split(',').filter(pref => pref.trim());
        }
        setSelectedTopics(preferences);
      } catch (e) {
        console.error('Error parsing user preferences:', e);
      }
    }
  }, [navigate]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!zipcode || zipcode.length !== 5 || !/^[0-9]{5}$/.test(zipcode)) {
      setError('Please enter a valid 5-digit zip code.');
      return;
    }
    
    if (!state) {
      setError('Please select your state.');
      return;
    }
    
    if (selectedTopics.length === 0) {
      setError('Please select at least one political topic.');
      return;
    }

    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      // Prepare data for API call
      const preferencesData = {
        email: email,
        zipcode: zipcode,
        state: state,
        preferences: selectedTopics.join(',') // Convert array to comma-separated string
      };

      // Call the update preferences API
      const response = await updatePreferences(preferencesData);

      if (response.success) {
        // Update localStorage with new data
        localStorage.setItem('userZipcode', zipcode);
        localStorage.setItem('userState', state);
        localStorage.setItem('userPreferences', JSON.stringify(selectedTopics));
        
        setSuccess('Settings updated successfully!');
      } else {
        setError(response.message || 'Failed to update settings. Please try again.');
      }
    } catch (error) {
      console.error('Settings update error:', error);
      setError('An error occurred while updating settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Settings</h2>
        
        {error && <div className="error">{error}</div>}
        {success && <div style={{ color: 'green', marginBottom: '1rem', textAlign: 'center' }}>{success}</div>}

        {/* State */}
        <div style={{ marginBottom: '1rem', width: '100%', maxWidth: '320px', margin: '0 auto 1rem auto' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontSize: '0.9rem' }}>
            State
          </label>
          <select
            value={state}
            onChange={e => setState(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem',
              backgroundColor: 'white',
              color: '#333'
            }}
          >
            <option value="" style={{color: '#333'}}>Select your state</option>
            {US_STATES.map(stateAbbr => (
              <option key={stateAbbr} value={stateAbbr} style={{color: '#333'}}>
                {stateAbbr}
              </option>
            ))}
          </select>
        </div>

        {/* Zipcode */}
        <div style={{ marginBottom: '1rem', width: '100%', maxWidth: '320px', margin: '0 auto 1rem auto' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontSize: '0.9rem' }}>
            Zip Code
          </label>
          <input
            type="text"
            placeholder="Zip Code"
            value={zipcode}
            maxLength={5}
            onChange={e => setZipcode(e.target.value.replace(/[^0-9]/g, ''))}
          />
        </div>

        {/* Topics Section */}
        <div className="topics-section">
          {selectedTopics.length === 5 && (
            <div className="error">
              You can't choose more than 5 topics of interest.
            </div>
          )}
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
          {isLoading ? 'Updating...' : 'Update Settings'}
        </button>
      </form>
    </div>
  );
};

export default Settings;