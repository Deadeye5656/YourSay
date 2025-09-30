import React, { useState } from 'react';
import './State.css';

const stateLegislation = [
  {
    title: 'Education Funding Bill',
    date: 'State Legislature - Oct 15, 2025',
    summary: 'A bill to increase funding for public schools and improve teacher salaries.',
    details: 'This bill proposes a 15% increase in state education funding, targeting under-resourced districts and teacher retention.'
  },
  {
    title: 'Transportation Bill',
    date: 'State Legislature - Nov 12, 2025',
    summary: 'Comprehensive improvements to state highways and public transit systems.',
    details: 'The bill includes new investments in road repairs, expanded bus routes, and incentives for green transportation.'
  }
];

const filterOptions = ['All', 'Upcoming', 'Past'];

const State = () => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filteredLegislation = stateLegislation.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || item.summary.toLowerCase().includes(search.toLowerCase());
    // Example filter logic: treat all as upcoming for demo
    return matchesSearch && (filter === 'All' || filter === 'Upcoming');
  });

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
        {filteredLegislation.map((item, idx) => (
          <div key={idx} className="legislation-card big">
            <h3>{item.title}</h3>
            <p><strong>Date:</strong> {item.date}</p>
            <p><strong>Summary:</strong> {item.summary}</p>
            <p><strong>Details:</strong> {item.details}</p>
            <div className="card-actions">
              <button className="view-btn">View Legislation</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default State;
