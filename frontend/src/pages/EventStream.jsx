import React, { useState, useEffect } from 'react';

export default function EventStream({ token }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('/api/v1/events/', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setEvents(data);
        }
      })
      .catch(err => console.error(err));
  }, [token]);

  return (
    <main className="page-content fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Event stream</h1>
          <p className="page-subtitle">Watch customer events move through rules, dispatch, and delivery.</p>
        </div>
        <div className="header-actions">
          <div className="sync-status"><span className="dot green"></span> Processing normally</div>
          <button className="btn-secondary">Pause stream</button>
        </div>
      </div>

      <div className="stream-layout">
        <div className="stream-main">
          <div className="filter-bar">
            <div className="dropdowns">
              <select><option>All events</option></select>
              <select><option>All campaigns</option></select>
              <select><option>All statuses</option></select>
            </div>
            <div className="search-box">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="#94A3B8" strokeWidth="2" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" placeholder="Search event ID or customer" />
            </div>
          </div>

          <div className="card no-pad">
            <table className="data-table clean padded">
              <thead>
                <tr>
                  <th>TIME</th>
                  <th>EVENT</th>
                  <th>RULE EVALUATION</th>
                  <th>DISPATCH</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev, idx) => (<tr key={idx}>
                  <td>{ev.time}</td>
                  <td><span className={`event-badge ${ev.css_class}`}>{ev.event}</span></td>
                  <td>{ev.rule}</td>
                  <td>{ev.dispatch}</td>
                  <td><span className={`text-status ${ev.status.toLowerCase()}`}>{ev.status}</span></td>
                </tr>))}
              </tbody>
            </table>
          </div>
          <p className="table-footer-note">Partitioned by merchant_id - Last sync 12 seconds ago</p>
        </div>
        <div className="stream-sidebar">
          <div className="card">
            <h3>Pipeline health</h3>
            <div className="health-stats">
              <div className="hs-row"><span>Kafka lag</span> <strong>0.8s</strong></div>
              <div className="hs-row"><span>Rules engine</span> <strong className="green-text">99.98%</strong></div>
              <div className="hs-row"><span>Delivery success</span> <strong className="green-text">98.6%</strong></div>
              <div className="hs-row"><span>Events today</span> <strong>28,642</strong></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}