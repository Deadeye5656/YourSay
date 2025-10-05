import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import './Federal.css';

import { fetchFederalLegislation } from '../api';

const filterOptions = ['All', 'Upcoming', 'Past'];


const Federal = () => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [voting, setVoting] = useState(false);
  const [vote, setVote] = useState(null);
  const [opinionMode, setOpinionMode] = useState(false);
  const [opinionText, setOpinionText] = useState('');
  const [legislation, setLegislation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [minLoading, setMinLoading] = useState(true);

  useEffect(() => {
    async function loadLegislation() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchFederalLegislation();
        setLegislation(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Failed to load federal legislation.');
      } finally {
        setLoading(false);
      }
    }
    loadLegislation();
    const timer = setTimeout(() => setMinLoading(false), 250);
    return () => clearTimeout(timer);
  }, []);

  const filteredLegislation = legislation.filter(item => {
    const matchesSearch = (item.title?.toLowerCase() || '').includes(search.toLowerCase()) || (item.summary?.toLowerCase() || '').includes(search.toLowerCase());
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
    <div className="federal-page">
      <div className="federal-page-header">
        <h2>Federal Legislation</h2>
        <div className="federal-page-subtitle">National Laws & Congressional Bills</div>
      </div>
      <div className="federal-page-content">
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
          {!error && filteredLegislation.map((item, idx) => (
            <div key={item.id || idx} className="legislation-card big">
              <h3>{item.title}</h3>
              <p><strong>Last Updated:</strong> {item.date || item.billDate || 'N/A'}</p>
              <p><strong>Summary:</strong> {item.summary || item.description}</p>
              <div className="card-actions">
                <button className="view-btn" onClick={() => { setModalData(item); setModalOpen(true); }}>View Legislation</button>
              </div>
            </div>
          ))}
          {/* Add invisible card for spacing if only one card in row */}
          {!error && filteredLegislation.length === 1 && (
            <div className="legislation-card big invisible-card" aria-hidden="true"></div>
          )}
        </div>
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          {modalData && (
            <div className="view-legislation-modal">
              <div className="modal-header view-modal-header">
                <h2>{modalData.title}</h2>
                <button className="modal-close modern-close" onClick={() => { setModalOpen(false); setVoting(false); setVote(null); setOpinionMode(false); setOpinionText(''); }}>&times;</button>
              </div>
              <div className="modal-content-body">
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
                      <button className="btn-primary" disabled={!vote} onClick={() => alert(`Vote submitted: ${vote}`)}>Submit</button>
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
                      <button className="btn-primary" disabled={opinionText.trim().length < 50} onClick={() => alert(`Opinion submitted: ${opinionText}`)}>Submit</button>
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

export default Federal;
