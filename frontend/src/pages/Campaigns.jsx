import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Campaigns({ 
  activeSubPage, 
  campaigns, 
  newCampaignName, 
  setNewCampaignName, 
  handleCreateCampaign,
  onSelectCampaign,
  token,
  onRefreshCampaigns
}) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [budgetCap, setBudgetCap] = useState('1000');
  const [rewardCap, setRewardCap] = useState('500');
  const [objective, setObjective] = useState('Increase repeat visits');
  const [selectedChannels, setSelectedChannels] = useState(['Push', 'SMS']);
  const [actionLoading, setActionLoading] = useState(null);

  // Filter campaigns
  const filteredCampaigns = campaigns.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' ? true : (c.status.toLowerCase() === statusFilter.toLowerCase());
    return matchesSearch && matchesStatus;
  });

  const allCount = campaigns.length;
  const activeCount = campaigns.filter(c => c.status === 'Active').length;
  const draftCount = campaigns.filter(c => c.status === 'Draft').length;
  const pausedCount = campaigns.filter(c => c.status === 'Paused').length;

  const toggleChannel = (channel) => {
    setSelectedChannels(prev => 
      prev.includes(channel) ? prev.filter(c => c !== channel) : [...prev, channel]
    );
  };

  const handleToggleStatus = (e, c) => {
    e.stopPropagation();
    setActionLoading(c.id);
    const endpoint = c.status === 'Active' ? `/api/v1/campaigns/${c.id}/pause` : `/api/v1/campaigns/${c.id}/activate`;
    
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(() => {
        setActionLoading(null);
        if (onRefreshCampaigns) onRefreshCampaigns();
      })
      .catch(err => {
        console.error(err);
        setActionLoading(null);
      });
  };

  const submitCreate = () => {
    handleCreateCampaign({
      name: newCampaignName,
      budget_cap: parseFloat(budgetCap) || 1000,
      reward_cap: parseInt(rewardCap) || 500,
      targeting_criteria: { audience: "All customers", objective },
      schedule: { type: "Run continuously" }
    });
  };

  return (
    <main className="page-content fade-in">
      {activeSubPage === "list" && <div>
        <div className="page-header">
          <div>
            <h1 className="page-title">Campaigns</h1>
            <p className="page-subtitle">Create, automate, and measure every customer moment.</p>
          </div>
          <button className="btn-primary" onClick={() => navigate('/campaigns/create')}>+ Create campaign</button>
        </div>

        <div className="filter-bar">
          <div className="status-summary" style={{ display: 'flex', gap: '8px' }}>
            <span 
              onClick={() => setStatusFilter('All')} 
              style={{ cursor: 'pointer', fontWeight: statusFilter === 'All' ? '700' : '500', color: statusFilter === 'All' ? '#6366F1' : '#64748B' }}
            >
              All {allCount}
            </span>
            <span 
              onClick={() => setStatusFilter('Active')} 
              style={{ cursor: 'pointer', fontWeight: statusFilter === 'Active' ? '700' : '500', color: statusFilter === 'Active' ? '#6366F1' : '#64748B' }}
            >
              Active {activeCount}
            </span>
            <span 
              onClick={() => setStatusFilter('Draft')} 
              style={{ cursor: 'pointer', fontWeight: statusFilter === 'Draft' ? '700' : '500', color: statusFilter === 'Draft' ? '#6366F1' : '#64748B' }}
            >
              Draft {draftCount}
            </span>
            <span 
              onClick={() => setStatusFilter('Paused')} 
              style={{ cursor: 'pointer', fontWeight: statusFilter === 'Paused' ? '700' : '500', color: statusFilter === 'Paused' ? '#6366F1' : '#64748B' }}
            >
              Paused {pausedCount}
            </span>
          </div>
          <div className="search-box">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="#94A3B8" strokeWidth="2" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              type="text" 
              placeholder="Search campaigns" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>CAMPAIGN</th>
                <th>STATUS</th>
                <th>CHANNEL</th>
                <th>AUDIENCE</th>
                <th>PERFORMANCE</th>
                <th>BUDGET</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>
                    No campaigns found matching your search.
                  </td>
                </tr>
              ) : (
                filteredCampaigns.map(c => (
                  <tr 
                    key={c.id} 
                    onClick={() => { if (onSelectCampaign) onSelectCampaign(c); }} 
                    className="clickable-row"
                  >
                    <td className="primary-col">
                      <div style={{ fontWeight: '600', color: '#0F172A' }}>{c.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>ID: {c.id.substring(0, 8)}...</div>
                    </td>
                    <td>
                      <span className={`status-badge ${(c.status || '').toLowerCase()}`}>
                        {c.status}
                      </span>
                    </td>
                    <td>{c.channel}</td>
                    <td>{c.audience}</td>
                    <td>{c.performance}</td>
                    <td>{c.budget}</td>
                    <td>
                      <button 
                        className="btn-secondary"
                        style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem', width: 'auto' }}
                        disabled={actionLoading === c.id}
                        onClick={(e) => handleToggleStatus(e, c)}
                      >
                        {actionLoading === c.id ? '...' : (c.status === 'Active' ? 'Pause' : 'Activate')}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <p className="table-footer-note">Budgets and reward caps are enforced transactionally.</p>
      </div>}

      {activeSubPage === "create" && <div className="create-wizard fade-in">
        <h1 className="page-title">Create campaign</h1>
        <p className="page-subtitle">Build a campaign that brings your customers back.</p>

        <div className="stepper">
          <div className="step active"><div className="step-num">1</div> Details</div>
          <div className="step-line"></div>
          <div className="step"><div className="step-num">2</div> Audience</div>
          <div className="step-line"></div>
          <div className="step"><div className="step-num">3</div> Budget & caps</div>
          <div className="step-line"></div>
          <div className="step"><div className="step-num">4</div> Review</div>
        </div>

        <div className="wizard-content">
          <div className="wizard-form card">
            <h2>Bring customers back</h2>
            <p className="section-desc">Set the goal and basic details for this campaign.</p>

            <div className="form-group">
              <label>Campaign name</label>
              <input 
                type="text" 
                value={newCampaignName} 
                onChange={e => setNewCampaignName(e.target.value)} 
                className="input" 
                placeholder="e.g. Weekend comeback"
              />
            </div>

            <div className="form-group">
              <label>Objective</label>
              <select className="input" value={objective} onChange={e => setObjective(e.target.value)}>
                <option value="Increase repeat visits">Increase repeat visits</option>
                <option value="Boost average order value">Boost average order value</option>
                <option value="Win back lapsed customers">Win back lapsed customers</option>
                <option value="Promote new product launch">Promote new product launch</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Budget Cap (€)</label>
                <input 
                  type="number" 
                  value={budgetCap} 
                  onChange={e => setBudgetCap(e.target.value)} 
                  className="input" 
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label>Reward Cap (Units)</label>
                <input 
                  type="number" 
                  value={rewardCap} 
                  onChange={e => setRewardCap(e.target.value)} 
                  className="input" 
                />
              </div>
            </div>

            <div className="form-group">
              <label>Channels</label>
              <div className="channels-grid">
                <div 
                  className={`channel-card ${selectedChannels.includes('Push') ? 'selected' : ''}`}
                  onClick={() => toggleChannel('Push')}
                  style={{ cursor: 'pointer' }}
                >
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                  <h4>Push</h4>
                  <p>Mobile notifications</p>
                </div>
                <div 
                  className={`channel-card ${selectedChannels.includes('SMS') ? 'selected' : ''}`}
                  onClick={() => toggleChannel('SMS')}
                  style={{ cursor: 'pointer' }}
                >
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                  <h4>SMS</h4>
                  <p>Direct messages</p>
                </div>
                <div 
                  className={`channel-card ${selectedChannels.includes('Ad') ? 'selected' : ''}`}
                  onClick={() => toggleChannel('Ad')}
                  style={{ cursor: 'pointer' }}
                >
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                  <h4>Ad</h4>
                  <p>Digital banners</p>
                </div>
                <div 
                  className={`channel-card ${selectedChannels.includes('Game') ? 'selected' : ''}`}
                  onClick={() => toggleChannel('Game')}
                  style={{ cursor: 'pointer' }}
                >
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><rect x="2" y="6" width="20" height="12" rx="2" ry="2"></rect><path d="M12 12h.01"></path><path d="M17 12h.01"></path><path d="M7 12h.01"></path></svg>
                  <h4>Game</h4>
                  <p>Interactive play</p>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button className="btn-secondary" onClick={() => navigate('/campaigns')}>Cancel</button>
              <button className="btn-primary" onClick={submitCreate}>Create campaign &rarr;</button>
            </div>
          </div>

          <div className="wizard-summary">
            <div className="card summary-card">
              <h3>Campaign summary</h3>
              <p className="section-desc">Review your campaign setup.</p>
              <div className="summary-list">
                <div className="summary-item"><span>Status</span> <strong>Draft</strong></div>
                <div className="summary-item"><span>Objective</span> <strong>{objective}</strong></div>
                <div className="summary-item"><span>Budget Cap</span> <strong>€{budgetCap}</strong></div>
                <div className="summary-item"><span>Reward Cap</span> <strong>{rewardCap} units</strong></div>
                <div className="summary-item"><span>Channels</span> <strong>{selectedChannels.join(', ') || 'None'}</strong></div>
              </div>
              <p className="next-step-hint">Click Create to initialize your campaign in the database.</p>
            </div>
          </div>
        </div>
      </div>}
    </main>
  );
}
