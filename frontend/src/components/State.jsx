import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import './State.css';

import { fetchStateLegislation, addVote, addOpinion, getUserVotes, getUserOpinions } from '../api';


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

  // Get user email from localStorage
  const getUserEmail = () => {
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
      }
      
      if (opinionsResult.success) {
        setUserOpinions(opinionsResult.opinions);
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

  if (loading || minLoading) {
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
        <div className="state-page-subtitle">Michigan State Laws & Proposals</div>
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
          {statusMessage && (
            <div className={`status-message ${statusType}`}>
              {statusMessage}
            </div>
          )}
          {error && <div className="error">{error}</div>}
          {!error && filteredLegislation.length === 0 && <div className="no-results">No legislation found.</div>}
          {!error && filteredLegislation.map((item, idx) => {
            const billId = item.bill_id || item.id;
            const userVote = getUserVoteForBill(billId);
            const userOpinion = getUserOpinionForBill(billId);
            
            return (
              <div key={item.id || idx} className="legislation-card big">
                <h3>{item.title}</h3>
                {item.category && (
                  <p><strong>Category:</strong> <span style={{color: '#0077ff', fontWeight: '600'}}>{item.category}</span></p>
                )}
                <p><strong>Last Updated:</strong> {item.billDate || 'N/A'}</p>
                <p><strong>Summary:</strong> {item.description}</p>
                
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
                <button className="modal-close modern-close" onClick={() => { setModalOpen(false); setVoting(false); setVote(null); setOpinionMode(false); setOpinionText(''); }}>&times;</button>
              </div>
              <div className="modal-content-body">
                {modalData.category && (
                  <p><strong>Category:</strong> <span style={{color: '#0077ff', fontWeight: '600'}}>{modalData.category}</span></p>
                )}
                <p><strong>Last Updated:</strong> {modalData.billDate}</p>
                <p><strong>Summary:</strong> {modalData.description}</p>
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
