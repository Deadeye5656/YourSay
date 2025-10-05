import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import './Local.css';

import { fetchLocalLegislation } from '../api';

const DEFAULT_ZIPCODE = '90210';

const filterOptions = ['All', 'Upcoming', 'Past'];


const Local = () => {
  const [filter, setFilter] = useState('All');
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

  useEffect(() => {
    async function loadLegislation() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchLocalLegislation(DEFAULT_ZIPCODE);
        setLegislation(Array.isArray(data) ? data : []);
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
    <div className="local-page">
      <h2>Local Legislation</h2>
      {/* Only show filter and search bar if there are cards to show */}
      {(!error && filteredLegislation.length > 0) && (
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
      )}
      <div className="legislation-list">
        {error && <div className="error">{error}</div>}
        {!error && filteredLegislation.length === 0 && (
          <div className="no-legislation-prompt">
            <p>
              There are currently no local legislations in our records.<br />
              Please add any upcoming proposals or initiatives in your local municipalities to help keep the community informed.
            </p>
            <button className="add-legislation-btn" onClick={() => setAddModalOpen(true)}>Add New Legislation</button>
          </div>
        )}
        {!error && filteredLegislation.map((item, idx) => (
          <div key={item.id || idx} className="legislation-card big">
            <h3>{item.title}</h3>
            <p><strong>Date:</strong> {item.billDate || item.date || 'N/A'}</p>
            <p><strong>Summary:</strong> {item.description || item.summary}</p>
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
              onSubmit={e => {
                e.preventDefault();
                // Simple validation
                if (!newLegislation.zipcode || !newLegislation.city || !newLegislation.state || !newLegislation.title || !newLegislation.description) {
                  setAddError('All fields are required.');
                  return;
                }
                setAddError('');
                // Here you would send to backend, for now just close and reset
                setAddModalOpen(false);
                setNewLegislation({ zipcode: '', city: '', state: '', title: '', description: '' });
                alert('Legislation submitted! (Demo only)');
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
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter state"
                  value={newLegislation.state}
                  onChange={e => setNewLegislation({ ...newLegislation, state: e.target.value })}
                  maxLength={30}
                  required
                />
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
