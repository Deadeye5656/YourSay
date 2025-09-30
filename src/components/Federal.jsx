import React, { useState } from 'react';
import Modal from './Modal';
import './Federal.css';

const federalLegislation = [
  {
    title: 'Healthcare Expansion Act',
    date: 'Congress - Nov 1, 2025',
    summary: 'Expands access to healthcare for low-income families and rural communities.',
    details: 'The act increases subsidies, expands Medicaid, and funds new rural clinics to improve national health outcomes.'
  },
  {
    title: 'Tax Reform Act',
    date: 'Congress - Nov 20, 2025',
    summary: 'Major overhaul of the federal tax code to simplify filing and adjust rates.',
    details: 'This reform reduces paperwork, adjusts tax brackets, and aims to make the system fairer for middle-class families.'
  }
];

const filterOptions = ['All', 'Upcoming', 'Past'];

const Federal = () => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const filteredLegislation = federalLegislation.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || item.summary.toLowerCase().includes(search.toLowerCase());
    // Example filter logic: treat all as upcoming for demo
    return matchesSearch && (filter === 'All' || filter === 'Upcoming');
  });

  return (
    <div className="federal-page">
      <h2>Federal Legislation</h2>
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
        {filteredLegislation.map((item, idx) => (
          <div key={idx} className="legislation-card big">
            <h3>{item.title}</h3>
            <p><strong>Date:</strong> {item.date}</p>
            <p><strong>Summary:</strong> {item.summary}</p>
            <p><strong>Details:</strong> {item.details}</p>
            <div className="card-actions">
              <button className="view-btn" onClick={() => { setModalData(item); setModalOpen(true); }}>View Legislation</button>
            </div>
          </div>
        ))}
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

export default Federal;
