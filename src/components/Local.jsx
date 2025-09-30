import React, { useState } from 'react';
import './Local.css';

const localLegislation = [
  {
    title: 'Zoning Reform',
    date: 'Town Hall - Oct 10, 2025',
    summary: 'Major changes to local zoning laws to allow more housing and mixed-use development.',
    details: 'This reform aims to address housing shortages and promote economic growth by allowing higher-density construction in previously restricted zones.'
  },
  {
    title: 'Park Renovation',
    date: 'Town Hall - Nov 5, 2025',
    summary: 'Renovation of the central city park including new playgrounds and walking trails.',
    details: 'The renovation will improve accessibility, add new amenities, and enhance green spaces for community use.'
  }
];

const filterOptions = ['All', 'Upcoming', 'Past'];

const Local = () => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filteredLegislation = localLegislation.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || item.summary.toLowerCase().includes(search.toLowerCase());
    // Example filter logic: treat all as upcoming for demo
    return matchesSearch && (filter === 'All' || filter === 'Upcoming');
  });

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

export default Local;
