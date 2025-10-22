import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import './State.css';
import DOMPurify from 'dompurify';

import { fetchStateLegislation, addVote, addOpinion, getUserVotes, getUserOpinions, getAISummary, validateToken, refreshToken } from '../api';


// You may want to get the user's state from props, context, or user profile. For demo, default to 'CA'.
const DEFAULT_STATE = 'MI';

const categoryOptions = [
  'All',
  'My Preferences',
  'Healthcare',
  'Education',
  'Economy',
  'Environment',
  'Immigration',
  'Gun Control',
  'Civil Rights',
  'Foreign Policy',
  'Taxes',
  'Public Safety',
  'Infrastructure',
  'Other'
];

const State = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  // Existing state
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [opinionMode, setOpinionMode] = useState(false);
  const [opinionText, setOpinionText] = useState('');
  const [voting, setVoting] = useState(false);
  const [vote, setVote] = useState(null);

  const [legislation, setLegislation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [minLoading, setMinLoading] = useState(true);
  const [userVotes, setUserVotes] = useState([]);
  const [userOpinions, setUserOpinions] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState(''); // 'success' or 'error'
  const [aiSummary, setAiSummary] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiSummary, setShowAiSummary] = useState(false);
  const [typewriterText, setTypewriterText] = useState('');
  const [aiError, setAiError] = useState(false);
  const [aiButtonClicked, setAiButtonClicked] = useState(false);

  // Get user preferences for filtering
  const getUserPreferences = () => {
    const userPreferences = localStorage.getItem('userPreferences');
    if (userPreferences) {
      try {
        // Handle both string format (comma-separated) and JSON array format
        if (userPreferences.startsWith('[')) {
          return JSON.parse(userPreferences);
        } else {
          return userPreferences.split(',').filter(pref => pref.trim());
        }
      } catch (e) {
        console.error('Error parsing user preferences:', e);
        return [];
      }
    }
    return [];
  };

  // Secure authentication helpers
  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };

  const clearAuth = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userState');
    localStorage.removeItem('userPreferences');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  // Content sanitization helper
  const sanitizeContent = (content) => {
    if (!content) return '';
    return DOMPurify.sanitize(content, { 
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
      ALLOWED_ATTR: []
    });
  };

  // Get user email from authenticated user or localStorage (fallback)
  const getUserEmail = () => {
    if (isAuthenticated && currentUser?.email) {
      return currentUser.email;
    }
    return localStorage.getItem('userEmail') || '';
  };

  // Load user votes and opinions
  const loadUserData = async () => {
    const userEmail = getUserEmail();
    if (!userEmail) return;

    try {
      const [votesResult, opinionsResult] = await Promise.all([
        getUserVotes(userEmail),
        getUserOpinions(userEmail)
      ]);

      if (votesResult.success) {
        setUserVotes(votesResult.votes);
      } else if (votesResult.authError) {
        clearAuth();
        showStatusMessage('Session expired. Please log in again.', 'error');
        return;
      }
      
      if (opinionsResult.success) {
        setUserOpinions(opinionsResult.opinions);
      } else if (opinionsResult.authError) {
        clearAuth();
        showStatusMessage('Session expired. Please log in again.', 'error');
        return;
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  // Check if user has voted on a bill
  const getUserVoteForBill = (billId) => {
    return userVotes.find(vote => vote.bill_id === billId);
  };

  // Check if user has opinion on a bill
  const getUserOpinionForBill = (billId) => {
    return userOpinions.find(opinion => opinion.bill_id === billId);
  };

  // Show status message
  const showStatusMessage = (message, type) => {
    setStatusMessage(message);
    setStatusType(type);
    setTimeout(() => {
      setStatusMessage('');
      setStatusType('');
    }, 3000);
  };

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup function to restore scrolling
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [modalOpen]);

  // Authentication validation on component mount
  useEffect(() => {
    const validateAuth = async () => {
      setAuthLoading(true);
      const token = getAuthToken();
      
      if (token) {
        try {
          const response = await validateToken(token);
          if (response.valid) {
            setIsAuthenticated(true);
            setCurrentUser(response.user);
            console.log('User authenticated:', response.user);
            // Load user data after successful authentication
            await loadUserData();
          } else {
            // Token invalid, try to refresh
            const refreshResult = await refreshToken();
            if (refreshResult.success) {
              // Retry validation with new token
              const retryResponse = await validateToken(refreshResult.accessToken);
              if (retryResponse.valid) {
                setIsAuthenticated(true);
                setCurrentUser(retryResponse.user);
                console.log('User authenticated after refresh:', retryResponse.user);
                await loadUserData();
              } else {
                clearAuth();
              }
            } else {
              clearAuth();
            }
          }
        } catch (error) {
          console.error('Auth validation failed:', error);
          clearAuth();
        }
      } else {
        // No token, check if user email exists (legacy support)
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
          console.warn('User using legacy authentication method');
          // For backward compatibility, allow basic functionality
          // Try to load user data even without JWT tokens
          await loadUserData();
        }
      }
      
      setAuthLoading(false);
    };
    
    validateAuth();
  }, []);

  // Handle vote submission
  const handleVoteSubmit = async () => {
    const userEmail = getUserEmail();
    if (!userEmail) {
      showStatusMessage('Please log in to vote', 'error');
      return;
    }

    if (!vote || !modalData) return;

    try {
      const voteData = {
        email: userEmail,
        bill_id: modalData.bill_id || modalData.id,
        vote: vote === 'yay'
      };

      const result = await addVote(voteData);
      if (result.success) {
        showStatusMessage(`Vote submitted: ${vote.toUpperCase()}`, 'success');
        setVoting(false);
        setVote(null);
        // Reload user data to update UI
        await loadUserData();
      } else if (result.authError) {
        // Handle authentication error
        clearAuth();
        showStatusMessage('Session expired. Please log in again.', 'error');
      } else {
        showStatusMessage(`Failed to submit vote: ${result.message}`, 'error');
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
      showStatusMessage('Error submitting vote. Please try again.', 'error');
    }
  };

  // Handle opinion submission
  const handleOpinionSubmit = async () => {
    const userEmail = getUserEmail();
    if (!userEmail) {
      showStatusMessage('Please log in to submit an opinion', 'error');
      return;
    }

    if (opinionText.trim().length < 50 || !modalData) return;

    try {
      const opinionData = {
        email: userEmail,
        bill_id: modalData.bill_id || modalData.id,
        opinion: opinionText.trim()
      };

      const result = await addOpinion(opinionData);
      if (result.success) {
        showStatusMessage('Opinion submitted successfully!', 'success');
        setOpinionMode(false);
        setOpinionText('');
        // Reload user data to update UI
        await loadUserData();
      } else {
        showStatusMessage(`Failed to submit opinion: ${result.message}`, 'error');
      }
    } catch (error) {
      console.error('Error submitting opinion:', error);
      showStatusMessage('Error submitting opinion. Please try again.', 'error');
    }
  };

  // Typewriter effect for AI summary (faster speed)
  const typewriterEffect = (text, speed = 10) => {
    setTypewriterText('');
    let i = 0;
    const timer = setInterval(() => {
      setTypewriterText(text.substring(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(timer);
      }
    }, speed);
    return timer;
  };

  // Handle AI summary request
  const handleAISummary = async () => {
    if (!modalData) return;
    
    setAiLoading(true);
    setShowAiSummary(true);
    setAiSummary('');
    setTypewriterText('');
    setAiError(false);
    setAiButtonClicked(true);

    try {
      const userState = localStorage.getItem('userState') || DEFAULT_STATE;
      const billId = modalData.bill_id || modalData.id;
      const title = modalData.title;

      const result = await getAISummary(userState, billId, title);
      if (result.success) {
        setAiSummary(result.summary);
        setAiLoading(false);
        // Start typewriter effect
        typewriterEffect(result.summary);
      } else {
        setAiLoading(false);
        setAiError(true);
      }
    } catch (error) {
      console.error('Error getting AI summary:', error);
      setAiLoading(false);
      setAiError(true);
    }
  };

  useEffect(() => {
    async function loadLegislation() {
      setLoading(true);
      setError(null);
      try {
        // Get user's state from localStorage, fallback to default
        const userState = localStorage.getItem('userState') || DEFAULT_STATE;
        const data = await fetchStateLegislation(userState);
        setLegislation(Array.isArray(data) ? data : []);
        // Load user data after legislation is loaded
        await loadUserData();
      } catch (err) {
        setError('Failed to load state legislation.');
      } finally {
        setLoading(false);
      }
    }
    loadLegislation();
    const timer = setTimeout(() => setMinLoading(false), 250);
    return () => clearTimeout(timer);
  }, []);

  const filteredLegislation = legislation.filter(item => {
    const matchesSearch = (item.title?.toLowerCase() || '').includes(search.toLowerCase()) || (item.description?.toLowerCase() || '').includes(search.toLowerCase());
    
    let matchesCategory = true;
    if (categoryFilter === 'All') {
      matchesCategory = true;
    } else if (categoryFilter === 'My Preferences') {
      const userPreferences = getUserPreferences();
      matchesCategory = userPreferences.length > 0 && userPreferences.includes(item.category);
    } else {
      matchesCategory = item.category === categoryFilter;
    }
    
    return matchesSearch && matchesCategory;
  });

  if (loading || minLoading || authLoading) {
    return (
      <div className="loading-spinner-container">
        <div className="big-blue-spinner"></div>
      </div>
    );
  }
  return (
    <div className="state-page">
      <div className="state-page-header">
        <h2>State Legislation</h2>
        <div className="state-page-subtitle">State Laws & Proposals</div>
      </div>
      <div className="state-page-content">
        <div className="filter-bar">
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="filter-dropdown">
            {categoryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <input
            type="text"
            className="search-bar"
            placeholder="Search legislation..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="legislation-list">
          {error && <div className="error">{error}</div>}
          {!error && filteredLegislation.length === 0 && <div className="no-results">No legislation found.</div>}
          {!error && filteredLegislation.map((item, idx) => {
            const billId = item.bill_id || item.id;
            const userVote = getUserVoteForBill(billId);
            const userOpinion = getUserOpinionForBill(billId);
            
            return (
              <div key={item.id || idx} className="legislation-card big">
                <div className="card-content">
                  <h3>{item.title}</h3>
                  <div className="card-details">
                    {item.category && (
                      <p><strong>Category:</strong> <span style={{color: '#0077ff', fontWeight: '600'}}>{sanitizeContent(item.category)}</span></p>
                    )}
                    <p><strong>Last Updated:</strong> {sanitizeContent(item.billDate || 'N/A')}</p>
                    <p><strong>Summary:</strong> {sanitizeContent(item.description)}</p>
                  </div>
                  
                  {/* Status indicators */}
                  <div className="user-status">
                    {userVote && (
                      <span className={`status-badge vote-status ${userVote.vote ? 'yay' : 'nay'}`}>
                        {userVote.vote ? '✓ Voted YAY' : '✗ Voted NAY'}
                      </span>
                    )}
                    {userOpinion && (
                      <span className="status-badge opinion-status">
                        💭 Opinion Submitted
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="card-actions">
                  <button className="view-btn" onClick={() => { setModalData(item); setModalOpen(true); }}>View Legislation</button>
                </div>
              </div>
            );
          })}
        </div>
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          {modalData && (
            <div className="view-legislation-modal">
              <div className="modal-header view-modal-header">
                <h2>{modalData.title}</h2>
                <button className="modal-close modern-close" onClick={() => { 
                  setModalOpen(false); 
                  setVoting(false); 
                  setVote(null); 
                  setOpinionMode(false); 
                  setOpinionText(''); 
                  setShowAiSummary(false);
                  setAiSummary('');
                  setTypewriterText('');
                  setAiLoading(false);
                  setAiError(false);
                  setAiButtonClicked(false);
                }}>&times;</button>
              </div>
              <div className="modal-content-body">
                {statusMessage && (
                  <div className={`status-message ${statusType}`}>
                    {statusMessage}
                  </div>
                )}
                {/* Show full title if it's longer than what would fit in 2 lines (approximately 80 characters) */}
                {modalData.title && modalData.title.length > 83 && (
                  <p><strong>Full Title:</strong> <span dangerouslySetInnerHTML={{ __html: sanitizeContent(modalData.title) }}></span></p>
                )}
                {modalData.category && (
                  <p><strong>Category:</strong> <span style={{color: '#0077ff', fontWeight: '600'}} dangerouslySetInnerHTML={{ __html: sanitizeContent(modalData.category) }}></span></p>
                )}
                <p><strong>Last Updated:</strong> <span dangerouslySetInnerHTML={{ __html: sanitizeContent(modalData.billDate) }}></span></p>
                <p><strong>Summary:</strong> <span dangerouslySetInnerHTML={{ __html: sanitizeContent(modalData.description) }}></span></p>
                
                {/* AI Summary Button */}
                <div className="ai-summary-section">
                  {aiError ? (
                    <div className="ai-unavailable">
                      <span className="ai-icon-sad">🤖</span>
                      <span>Sorry, AI generation isn't available right now</span>
                    </div>
                  ) : !aiButtonClicked ? (
                    <button 
                      className="btn-ai-summary" 
                      onClick={handleAISummary}
                      disabled={aiLoading}
                    >
                      {aiLoading ? (
                        <>
                          <div className="ai-spinner"></div>
                          <span>Generating AI Summary...</span>
                        </>
                      ) : (
                        <>
                          <span className="ai-icon">🤖</span>
                          <span>Get AI Summary</span>
                        </>
                      )}
                    </button>
                  ) : null}
                  
                  {/* AI Summary Content */}
                  {showAiSummary && !aiError && (
                    <div className="ai-summary-content">
                      <h4>🤖 AI Summary</h4>
                      <div className="ai-summary-text">
                        {aiLoading ? (
                          <div className="ai-loading">
                            <div className="ai-spinner"></div>
                            <span>Analyzing legislation...</span>
                          </div>
                        ) : (
                          <p>{typewriterText}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {!voting && !opinionMode ? (
                  <div className="modal-actions modern-actions">
                    <button className="btn-secondary" onClick={() => setVoting(true)}>Vote</button>
                    <button className="btn-primary" onClick={() => setOpinionMode(true)}>Submit Opinion</button>
                  </div>
                ) : null}
                {voting && !opinionMode && (
                  <>
                    <div className="vote-choices">
                      <div className={`vote-choice${vote === 'yay' ? ' selected yay-selected' : ''}`} onClick={() => setVote('yay')}>
                        <span className="vote-icon yay">&#10003;</span>
                        <span className="vote-label yay">YAY</span>
                      </div>
                      <div className={`vote-choice${vote === 'nay' ? ' selected nay-selected' : ''}`} onClick={() => setVote('nay')}>
                        <span className="vote-icon nay">&#10007;</span>
                        <span className="vote-label nay">NAY</span>
                      </div>
                    </div>
                    <div className="modal-actions modern-actions">
                      <button className="btn-secondary" onClick={() => { setVoting(false); setVote(null); }}>Back</button>
                      <button className="btn-primary" disabled={!vote} onClick={handleVoteSubmit}>Submit</button>
                    </div>
                  </>
                )}
                {opinionMode && (
                  <>
                    <textarea
                      className="form-textarea"
                      value={opinionText}
                      onChange={e => setOpinionText(e.target.value)}
                      placeholder="Write your opinion here..."
                      rows={5}
                    />
                    <div className="char-count">{opinionText.length}/500</div>
                    {opinionText.length > 0 && opinionText.length < 50 && (
                      <div className="error-message">
                        Your opinion must be at least 50 characters to submit. ({opinionText.length}/50)
                      </div>
                    )}
                    <div className="modal-actions modern-actions">
                      <button className="btn-secondary" onClick={() => { setOpinionMode(false); setOpinionText(''); }}>Back</button>
                      <button className="btn-primary" disabled={opinionText.trim().length < 50} onClick={handleOpinionSubmit}>Submit</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default State;
