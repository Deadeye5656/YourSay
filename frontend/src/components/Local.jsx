import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import './Local.css';

import { fetchLocalLegislation, addLocalLegislation, addVote, addOpinion, getUserVotes, getUserOpinions } from '../api';

const DEFAULT_ZIPCODE = '48067';

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

const Local = () => {
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newLegislation, setNewLegislation] = useState({
    zipcode: '',
    city: '',
    state: '',
    title: '',
    description: '',
  });
  const [addError, setAddError] = useState('');
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
        // Get user's zipcode from localStorage, fallback to default
        const userZipcode = localStorage.getItem('userZipcode') || DEFAULT_ZIPCODE;
        const data = await fetchLocalLegislation(userZipcode);
        setLegislation(Array.isArray(data) ? data : []);
        // Load user data after legislation is loaded
        await loadUserData();
      } catch (err) {
        setError('Failed to load local legislation.');
      } finally {
        setLoading(false);
      }
    }
    loadLegislation();
    // Display loading for at least 1 second for better UX
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
    <div className="local-page">
      <div className="local-page-header">
        <h2>Local Legislation</h2>
        <div className="local-page-subtitle">Community Laws & Municipal Proposals</div>
      </div>
      <div className="local-page-content">
        {/* Filter bar - always show */}
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
          <button className="add-legislation-btn" onClick={() => setAddModalOpen(true)}>Add New Legislation</button>
        </div>
        <div className="legislation-list">
          {statusMessage && (
            <div className={`status-message ${statusType}`}>
              {statusMessage}
            </div>
          )}
          {error && <div className="error">{error}</div>}
          {!error && filteredLegislation.length === 0 && (
            <div className="no-results">No local legislation found.</div>
          )}
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
                <p><strong>Last Updated:</strong> {item.billDate || item.date || 'N/A'}</p>
                <p><strong>Summary:</strong> {item.description || item.summary}</p>
                
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
        {/* Add New Legislation Modal */}
        <Modal isOpen={addModalOpen} onClose={() => { setAddModalOpen(false); setAddError(''); setNewLegislation({ zipcode: '', city: '', state: '', title: '', description: '' }); }}>
          <div className="add-legislation-modal">
            <div className="modal-header add-modal-header">
              <h2>Add New Legislation</h2>
              <button className="modal-close modern-close" onClick={() => { setAddModalOpen(false); setAddError(''); setNewLegislation({ zipcode: '', city: '', state: '', title: '', description: '' }); }}>&times;</button>
            </div>
            <div className="modal-subtitle">
              Help keep your community informed about local legislative matters
            </div>
            <form
              onSubmit={async e => {
                e.preventDefault();
                // Simple validation
                if (!newLegislation.zipcode || !newLegislation.city || !newLegislation.state || !newLegislation.title || !newLegislation.description) {
                  setAddError('All fields are required.');
                  return;
                }
                setAddError('');
                try {
                  const result = await addLocalLegislation(newLegislation);
                  if (result === true) {
                    setAddModalOpen(false);
                    setNewLegislation({ zipcode: '', city: '', state: '', title: '', description: '' });
                    // Optionally, reload the local legislation list
                    const data = await fetchLocalLegislation(newLegislation.zipcode);
                    setLegislation(Array.isArray(data) ? data : []);
                  } else {
                    setAddError('Failed to submit legislation.');
                  }
                } catch (err) {
                  setAddError('Failed to submit legislation.');
                }
              }}
              className="add-legislation-form"
            >
              <div className="form-row">
                <div className="form-group">
                  <label>Zipcode</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter zipcode"
                    value={newLegislation.zipcode}
                    onChange={e => setNewLegislation({ ...newLegislation, zipcode: e.target.value })}
                    maxLength={10}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter city"
                    value={newLegislation.city}
                    onChange={e => setNewLegislation({ ...newLegislation, city: e.target.value })}
                    maxLength={50}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>State</label>
                <select
                  className="form-input"
                  value={newLegislation.state}
                  onChange={e => setNewLegislation({ ...newLegislation, state: e.target.value })}
                  required
                >
                  <option value="" disabled>Select state</option>
                  <option value="AL">AL</option>
                  <option value="AK">AK</option>
                  <option value="AZ">AZ</option>
                  <option value="AR">AR</option>
                  <option value="CA">CA</option>
                  <option value="CO">CO</option>
                  <option value="CT">CT</option>
                  <option value="DE">DE</option>
                  <option value="FL">FL</option>
                  <option value="GA">GA</option>
                  <option value="HI">HI</option>
                  <option value="ID">ID</option>
                  <option value="IL">IL</option>
                  <option value="IN">IN</option>
                  <option value="IA">IA</option>
                  <option value="KS">KS</option>
                  <option value="KY">KY</option>
                  <option value="LA">LA</option>
                  <option value="ME">ME</option>
                  <option value="MD">MD</option>
                  <option value="MA">MA</option>
                  <option value="MI">MI</option>
                  <option value="MN">MN</option>
                  <option value="MS">MS</option>
                  <option value="MO">MO</option>
                  <option value="MT">MT</option>
                  <option value="NE">NE</option>
                  <option value="NV">NV</option>
                  <option value="NH">NH</option>
                  <option value="NJ">NJ</option>
                  <option value="NM">NM</option>
                  <option value="NY">NY</option>
                  <option value="NC">NC</option>
                  <option value="ND">ND</option>
                  <option value="OH">OH</option>
                  <option value="OK">OK</option>
                  <option value="OR">OR</option>
                  <option value="PA">PA</option>
                  <option value="RI">RI</option>
                  <option value="SC">SC</option>
                  <option value="SD">SD</option>
                  <option value="TN">TN</option>
                  <option value="TX">TX</option>
                  <option value="UT">UT</option>
                  <option value="VT">VT</option>
                  <option value="VA">VA</option>
                  <option value="WA">WA</option>
                  <option value="WV">WV</option>
                  <option value="WI">WI</option>
                  <option value="WY">WY</option>
                </select>
              </div>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter legislation title"
                  value={newLegislation.title}
                  onChange={e => setNewLegislation({ ...newLegislation, title: e.target.value })}
                  maxLength={100}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-textarea"
                  placeholder="Provide a detailed description of the legislation..."
                  value={newLegislation.description}
                  onChange={e => setNewLegislation({ ...newLegislation, description: e.target.value })}
                  rows={4}
                  maxLength={500}
                  required
                />
                <div className="char-count">{newLegislation.description.length}/500</div>
              </div>
              {addError && <div className="error-message">{addError}</div>}
              <div className="modal-actions modern-actions">
                <button type="button" className="btn-secondary" onClick={() => { setAddModalOpen(false); setAddError(''); setNewLegislation({ zipcode: '', city: '', state: '', title: '', description: '' }); }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Submit Legislation
                </button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Local;
