import React, { useState, useEffect } from 'react';

export default function Automations({ token }) {
  const [automations, setAutomations] = useState([]);

  useEffect(() => {
    fetch('/api/v1/campaigns/rules/all', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAutomations(data.map(rule => ({
            id: rule.id,
            name: rule.action?.type || 'Rule ' + rule.id.substring(0, 4),
            trigger: rule.trigger?.event || 'Event',
            audience: 'All customers',
            performance: '0 sent',
            status: 'Active',
            lastUpdated: 'Today'
          })));
        }
      })
      .catch(err => console.error(err));
  }, [token]);

  return (
    <main className="page-content fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Automations</h1>
          <p className="page-subtitle">Turn customer moments into timely, personalized actions.</p>
        </div>
        <button className="btn-primary">+ Create automation</button>
      </div>

      <div className="stats-cards" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem", marginBottom: "2rem" }}>
        <div className="stat-card" style={{ padding: "1.25rem" }}>
          <div className="stat-label">Active automations</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: "0.5rem" }}>
            <div className="stat-value" style={{ fontSize: "1.75rem", margin: "0" }}>8</div>
            <div className="stat-trend positive" style={{ fontSize: "0.75rem" }}>+2 this month</div>
          </div>
        </div>
        <div className="stat-card" style={{ padding: "1.25rem" }}>
          <div className="stat-label">Messages sent</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: "0.5rem" }}>
            <div className="stat-value" style={{ fontSize: "1.75rem", margin: "0" }}>12,480</div>
            <div className="stat-desc" style={{ fontSize: "0.75rem" }}>Last 30 days</div>
          </div>
        </div>
        <div className="stat-card" style={{ padding: "1.25rem" }}>
          <div className="stat-label">Conversion rate</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: "0.5rem" }}>
            <div className="stat-value" style={{ fontSize: "1.75rem", margin: "0" }}>18.6%</div>
            <div className="stat-trend positive" style={{ fontSize: "0.75rem" }}>+3.2%</div>
          </div>
        </div>
        <div className="stat-card" style={{ padding: "1.25rem" }}>
          <div className="stat-label">Revenue influenced</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: "0.5rem" }}>
            <div className="stat-value" style={{ fontSize: "1.75rem", margin: "0" }}>€24,860</div>
            <div className="stat-trend positive" style={{ fontSize: "0.75rem" }}>+11.4%</div>
          </div>
        </div>
      </div>

      <div className="data-table-container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 1.5rem", borderBottom: "1px solid #E2E8F0", background: "white" }}>
          <h3 style={{ margin: "0", fontSize: "1.1rem" }}>Your automations</h3>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div style={{ background: "#F1F5F9", borderRadius: "6px", padding: "0.3rem 0.6rem", fontSize: "0.8rem", color: "#475569" }}>
              <span style={{ fontWeight: "600", color: "#0F172A", marginRight: "8px" }}>All 8</span>
              <span style={{ marginRight: "8px" }}>Active 6</span>
              <span>Drafts 2</span>
            </div>
            <div className="search-box" style={{ margin: "0" }}>
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="#94A3B8" strokeWidth="2" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" placeholder="Search automations" style={{ width: "140px", fontSize: "0.8rem" }} />
            </div>
            <button className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: "6px", padding: "0.4rem 0.8rem" }}>
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
              Filter
            </button>
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>AUTOMATION</th>
              <th>TRIGGER</th>
              <th>AUDIENCE</th>
              <th>PERFORMANCE</th>
              <th>STATUS</th>
              <th>LAST UPDATED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {automations.map(a => (<tr key={a.id}>
              <td className="primary-col">{a.name}</td>
              <td>{a.trigger}</td>
              <td>{a.audience}</td>
              <td>{a.performance}</td>
              <td><span className={`status-badge ${a.status.toLowerCase()}`}>{a.status}</span></td>
              <td>{a.lastUpdated}</td>
              <td><button className="more-btn">•••</button></td>
            </tr>))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
