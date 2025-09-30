import React, { useState } from 'react';
import Modal from './Modal';
import './Local.css';

const localLegislation = [];

const filterOptions = ['All', 'Upcoming', 'Past'];

const Local = () => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [opinionMode, setOpinionMode] = useState(false);
  const [opinionText, setOpinionText] = useState('');

  const filteredLegislation = [];

  return (
    <div className="local-page">
      <h2>Local Legislation</h2>
      {localLegislation.length > 0 && (
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
        <div className="no-legislation-prompt">
          <p>
            There are currently no local legislations in our records.<br />
            Please add any upcoming proposals or initiatives in your local municipalities to help keep the community informed.
          </p>
          <button className="add-legislation-btn" onClick={() => alert('Feature coming soon!')}>Add New Legislation</button>
        </div>
        {/* Example for future: <button onClick={() => { setModalData(item); setModalOpen(true); }}>View Legislation</button> */}
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          {modalData && (
            <div>
              <div className="modal-header">
                <h2>{modalData.title}</h2>
                <button className="modal-close" onClick={() => { setModalOpen(false); setOpinionMode(false); setOpinionText(''); }}>&times;</button>
              </div>
              <p><strong>Date:</strong> {modalData.date}</p>
              <p><strong>Summary:</strong> {modalData.summary}</p>
              <p><strong>Details:</strong> {modalData.details}</p>
              {!opinionMode ? (
                <div className="modal-actions">
                  <button className="vote-btn" onClick={() => alert('Vote feature coming soon!')}>Vote</button>
                  <button className="opinion-btn" onClick={() => setOpinionMode(true)}>Submit Opinion</button>
                </div>
              ) : null}
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

export default Local;
