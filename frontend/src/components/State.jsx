import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import './State.css';

import { fetchStateLegislation } from '../api';


// You may want to get the user's state from props, context, or user profile. For demo, default to 'CA'.
const DEFAULT_STATE = 'MI';

const filterOptions = ['All', 'Upcoming', 'Past'];

const State = () => {
  const [filter, setFilter] = useState('All');
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

  useEffect(() => {
    async function loadLegislation() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchStateLegislation(DEFAULT_STATE);
        setLegislation(Array.isArray(data) ? data : []);
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
    // Example filter logic: treat all as upcoming for demo
    return matchesSearch && (filter === 'All' || filter === 'Upcoming');
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
      <h2>State Legislation</h2>
      <div className="filter-bar">
        <select value={filter} onChange={e => setFilter(e.target.value)} className="filter-dropdown">
          {filterOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
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
        {!error && filteredLegislation.map((item, idx) => (
          <div key={item.id || idx} className="legislation-card big">
            <h3>{item.title}</h3>
            <p><strong>Date:</strong> {item.billDate || 'N/A'}</p>
            <p><strong>Summary:</strong> {item.description}</p>
            <div className="card-actions">
              <button className="view-btn" onClick={() => { setModalData(item); setModalOpen(true); }}>View Legislation</button>
            </div>
          </div>
        ))}
        {/* Add invisible card for spacing if only one card in row */}
        {!error && filteredLegislation.length === 1 && (
          <div className="legislation-card big invisible-card" aria-hidden="true"></div>
        )}
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          {modalData && (
            <div>
              <div className="modal-header">
                <h2>{modalData.title}</h2>
                <button className="modal-close" onClick={() => { setModalOpen(false); setVoting(false); setVote(null); setOpinionMode(false); setOpinionText(''); }}>&times;</button>
              </div>
              <p><strong>Date:</strong> {modalData.date}</p>
              <p><strong>Summary:</strong> {modalData.summary}</p>
              {!voting && !opinionMode ? (
                <div className="modal-actions">
                  <button className="vote-btn" onClick={() => setVoting(true)}>Vote</button>
                  <button className="opinion-btn" onClick={() => setOpinionMode(true)}>Submit Opinion</button>
                </div>
              ) : null}
              {voting && !opinionMode && (
                <>
                  <div className="vote-choices">
                    <div className={`vote-choice${vote === 'yay' ? ' selected' : ''}`} onClick={() => setVote('yay')}>
                      <span className="vote-icon yay">&#10003;</span>
                      <span className="vote-label yay">YAY</span>
                    </div>
                    <div className={`vote-choice${vote === 'nay' ? ' selected' : ''}`} onClick={() => setVote('nay')}>
                      <span className="vote-icon nay">&#10007;</span>
                      <span className="vote-label nay">NAY</span>
                    </div>
                  </div>
                  <div className="modal-actions">
                    <button className="back-btn" onClick={() => { setVoting(false); setVote(null); }}>Back</button>
                    <button className="submit-btn" disabled={!vote} onClick={() => alert(`Vote submitted: ${vote}`)}>Submit</button>
                  </div>
                </>
              )}
              {opinionMode && (
                <>
                  <textarea
                    className="opinion-textarea"
                    value={opinionText}
                    onChange={e => setOpinionText(e.target.value)}
                    placeholder="Write your opinion here..."
                    rows={5}
                    style={{
                      width: '80%',
                      margin: '2rem auto 0.5rem auto',
                      display: 'block',
                      fontSize: '1.1rem',
                      borderRadius: '8px',
                      border: '1px solid #ccc',
                      padding: '1rem',
                      background: '#f9f9f9',
                      color: '#222',
                    }}
                  />
                  {opinionText.length > 0 && (
                    <div style={{ color: '#e53935', marginBottom: '1rem', textAlign: 'center', fontWeight: '500' }}>
                      {opinionText.length < 50 && `Your opinion must be at least 50 characters to submit. (${opinionText.length}/50)`}
                    </div>
                  )}
                  <div className="modal-actions">
                    <button className="back-btn" onClick={() => { setOpinionMode(false); setOpinionText(''); }}>Back</button>
                    <button className="submit-btn" disabled={opinionText.trim().length < 50} onClick={() => alert(`Opinion submitted: ${opinionText}`)}>Submit</button>
                  </div>
                </>
              )}
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default State;
