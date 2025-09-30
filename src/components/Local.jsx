import React, { useState } from 'react';
import './Local.css';

const localLegislation = [];

const filterOptions = ['All', 'Upcoming', 'Past'];

const Local = () => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filteredLegislation = [];

  return (
    <div className="local-page">
      <h2>Local Legislation</h2>
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
        <div className="no-legislation-prompt">
          <p>
            There are currently no local legislations in our records.<br />
            Please add any upcoming proposals or initiatives in your local municipalities to help keep the community informed.
          </p>
          <button className="add-legislation-btn" onClick={() => alert('Feature coming soon!')}>Add New Legislation</button>
        </div>
      </div>
    </div>
  );
};

export default Local;
