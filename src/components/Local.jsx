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
                <button className="modal-close" onClick={() => setModalOpen(false)}>&times;</button>
              </div>
              <p><strong>Date:</strong> {modalData.date}</p>
              <p><strong>Summary:</strong> {modalData.summary}</p>
              <p><strong>Details:</strong> {modalData.details}</p>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Local;
