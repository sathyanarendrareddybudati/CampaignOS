import React, { useState, useEffect } from 'react';

export default function Automations({ token, campaigns = [] }) {
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [newAction, setNewAction] = useState('Send Welcome Email');
  const [newTrigger, setNewTrigger] = useState('user.signup');
  const [selectedCampaignId, setSelectedCampaignId] = useState('');

  const fetchRules = () => {
    fetch('/api/v1/campaigns/rules/all', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAutomations(data.map(rule => ({
            id: rule.id,
            campaign_id: rule.campaign_id,
            name: rule.action?.type || 'Rule ' + rule.id.substring(0, 4),
            trigger: rule.trigger?.event || 'Event',
            audience: 'All customers',
            performance: 'Active listener',
            status: 'Active',
            lastUpdated: 'Today'
          })));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRules();
  }, [token]);

  useEffect(() => {
    if (campaigns.length > 0 && !selectedCampaignId) {
      setSelectedCampaignId(campaigns[0].id);
    }
  }, [campaigns]);

  const handleCreateAutomation = (e) => {
    e.preventDefault();
    if (!selectedCampaignId) {
      alert("Please select a campaign to link this automation to.");
      return;
    }
    setSubmitting(true);

    fetch(`/api/v1/campaigns/${selectedCampaignId}/rules`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        trigger: { event: newTrigger },
        action: { type: newAction }
      })
    })
      .then(res => res.json())
      .then(() => {
        setSubmitting(false);
        setShowModal(false);
        fetchRules();
      })
      .catch(err => {
        console.error(err);
        setSubmitting(false);
      });
  };

  const handleDeleteRule = (ruleId) => {
    if (!window.confirm("Are you sure you want to delete this automation rule?")) return;

    fetch(`/api/v1/campaigns/rules/${ruleId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(() => {
        fetchRules();
      })
      .catch(err => console.error(err));
  };

  const filteredAutomations = automations.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.trigger.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' ? true : a.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <main className="page-content fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Automations</h1>
          <p className="page-subtitle">Turn customer moments into timely, personalized actions.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>+ Create automation</button>
      </div>

      <div className="stats-cards" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem", marginBottom: "2rem" }}>
        <div className="stat-card" style={{ padding: "1.25rem" }}>
          <div className="stat-label">Active automations</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: "0.5rem" }}>
            <div className="stat-value" style={{ fontSize: "1.75rem", margin: "0" }}>{automations.length}</div>
            <div className="stat-trend positive" style={{ fontSize: "0.75rem" }}>Live in DB</div>
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
          <h3 style={{ margin: "0", fontSize: "1.1rem" }}>Your automations ({automations.length})</h3>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div style={{ background: "#F1F5F9", borderRadius: "6px", padding: "0.3rem 0.6rem", fontSize: "0.8rem", color: "#475569" }}>
              <span 
                onClick={() => setStatusFilter('All')} 
                style={{ cursor: 'pointer', fontWeight: statusFilter === 'All' ? "700" : "500", color: statusFilter === 'All' ? "#6366F1" : "#0F172A", marginRight: "8px" }}
              >
                All {automations.length}
              </span>
              <span 
                onClick={() => setStatusFilter('Active')} 
                style={{ cursor: 'pointer', fontWeight: statusFilter === 'Active' ? "700" : "500", color: statusFilter === 'Active' ? "#6366F1" : "#475569" }}
              >
                Active {automations.length}
              </span>
            </div>
            <div className="search-box" style={{ margin: "0" }}>
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="#94A3B8" strokeWidth="2" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input 
                type="text" 
                placeholder="Search automations" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: "160px", fontSize: "0.8rem" }} 
              />
            </div>
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>AUTOMATION ACTION</th>
              <th>TRIGGER EVENT</th>
              <th>AUDIENCE</th>
              <th>PERFORMANCE</th>
              <th>STATUS</th>
              <th>LAST UPDATED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredAutomations.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "2.5rem", color: "#64748B" }}>
                  {loading ? "Loading automations from backend..." : "No automations found. Click '+ Create automation' to add your first rule."}
                </td>
              </tr>
            ) : (
              filteredAutomations.map(a => (
                <tr key={a.id}>
                  <td className="primary-col">
                    <div style={{ fontWeight: '600', color: '#0F172A' }}>{a.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Rule ID: {a.id.substring(0, 8)}...</div>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', background: '#F1F5F9', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      {a.trigger}
                    </span>
                  </td>
                  <td>{a.audience}</td>
                  <td>{a.performance}</td>
                  <td><span className={`status-badge ${(a.status || 'active').toLowerCase()}`}>{a.status}</span></td>
                  <td>{a.lastUpdated}</td>
                  <td>
                    <button 
                      onClick={() => handleDeleteRule(a.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', fontSize: '0.85rem', padding: '0.3rem 0.6rem' }}
                      title="Delete rule"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Automation Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }}>
          <div className="card" style={{ width: '480px', padding: '2rem', background: 'white', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Create Automation</h2>
              <button 
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#64748B' }}
              >
                &times;
              </button>
            </div>
            <p style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Define when an event occurs and what action the marketing engine should dispatch.
            </p>

            <form onSubmit={handleCreateAutomation}>
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label>Action / Output</label>
                <select 
                  className="input" 
                  value={newAction} 
                  onChange={e => setNewAction(e.target.value)}
                >
                  <option value="Send Welcome Email">Send Welcome Email</option>
                  <option value="Dispatch Push Discount Voucher">Dispatch Push Discount Voucher</option>
                  <option value="Send SMS Inactivity Reminder">Send SMS Inactivity Reminder</option>
                  <option value="Trigger Spin the Wheel Game">Trigger Spin the Wheel Game</option>
                  <option value="Issue VIP Reward Points">Issue VIP Reward Points</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label>Event Trigger (Kafka Event)</label>
                <select 
                  className="input" 
                  value={newTrigger} 
                  onChange={e => setNewTrigger(e.target.value)}
                >
                  <option value="user.signup">user.signup (Customer account created)</option>
                  <option value="customer.purchase">customer.purchase (Order completed)</option>
                  <option value="customer.inactivity">customer.inactivity (30 days without visit)</option>
                  <option value="loyalty.points_earned">loyalty.points_earned (Points added)</option>
                  <option value="cart.abandoned">cart.abandoned (Cart left without checkout)</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label>Attach to Campaign</label>
                <select 
                  className="input" 
                  value={selectedCampaignId} 
                  onChange={e => setSelectedCampaignId(e.target.value)}
                  required
                >
                  {campaigns.length === 0 ? (
                    <option value="">No campaigns found</option>
                  ) : (
                    campaigns.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.status})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setShowModal(false)}
                  style={{ width: 'auto' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={submitting}
                  style={{ width: 'auto' }}
                >
                  {submitting ? 'Creating...' : 'Save automation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
