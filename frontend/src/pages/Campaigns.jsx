import React from 'react';

export default function Campaigns({ activeSubPage, setactiveSubPage, setactiveTab, campaigns, newCampaignName, setNewCampaignName, handleCreateCampaign }) {
  return (
    <main className="page-content fade-in">
      {activeSubPage === "list" && <div>
        <div className="page-header">
          <div>
            <h1 className="page-title">Campaigns</h1>
            <p className="page-subtitle">Create, automate, and measure every customer moment.</p>
          </div>
          <button className="btn-primary" onClick={() => { setactiveSubPage("create") }}>+ Create campaign</button>
        </div>

        <div className="filter-bar">
          <span className="status-summary">All 12 Active 6 Scheduled 3 Draft 2 Paused 1</span>
          <div className="search-box">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="#94A3B8" strokeWidth="2" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" placeholder="Search campaigns" />
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
                <th>LAST UPDATED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map(c => (<tr key={c.id} onClick={() => { setactiveTab("analytics"); setactiveSubPage("details"); }} className="clickable-row">
                <td className="primary-col">{c.name}</td>
                <td><span className={`status-badge ${c.status.toLowerCase()}`}>{c.status}</span></td>
                <td>{c.channel}</td>
                <td>{c.audience}</td>
                <td>{c.performance}</td>
                <td>{c.budget}</td>
                <td>{c.lastUpdated}</td>
                <td><button className="more-btn">•••</button></td>
              </tr>))}
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
          <div className="step"><div className="step-num">3</div> Trigger & action</div>
          <div className="step-line"></div>
          <div className="step"><div className="step-num">4</div> Budget</div>
          <div className="step-line"></div>
          <div className="step"><div className="step-num">5</div> Review</div>
        </div>

        <div className="wizard-content">
          <div className="wizard-form card">
            <h2>Bring customers back</h2>
            <p className="section-desc">Set the goal and basic details for this campaign.</p>

            <div className="form-group">
              <label>Campaign name</label>
              <input type="text" value={newCampaignName} onChange={e => setNewCampaignName(e.target.value)} className="input" />
            </div>

            <div className="form-group">
              <label>Objective</label>
              <select className="input"><option>Increase repeat visits</option></select>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea className="input" rows="3">A gentle reminder for customers who have not visited in 30 days.</textarea>
            </div>

            <div className="form-group">
              <label>Channels</label>
              <div className="channels-grid">
                <div className="channel-card selected">
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                  <h4>Push</h4>
                  <p>Mobile notifications</p>
                </div>
                <div className="channel-card">
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                  <h4>SMS</h4>
                  <p>Direct messages</p>
                </div>
                <div className="channel-card">
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                  <h4>Ad</h4>
                  <p>Digital banners</p>
                </div>
                <div className="channel-card">
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><rect x="2" y="6" width="20" height="12" rx="2" ry="2"></rect><path d="M12 12h.01"></path><path d="M17 12h.01"></path><path d="M7 12h.01"></path></svg>
                  <h4>Game</h4>
                  <p>Interactive play</p>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Schedule</label>
              <div className="radio-group">
                <label className="radio-label selected"><input type="radio" checked readOnly /> Run continuously</label>
                <label className="radio-label"><input type="radio" readOnly /> Set an end date</label>
              </div>
            </div>

            <div className="form-actions">
              <button className="btn-secondary" onClick={() => { setactiveSubPage("list") }}>Save draft</button>
              <button className="btn-primary" onClick={handleCreateCampaign}>Continue to audience &rarr;</button>
            </div>
          </div>

          <div className="wizard-summary">
            <div className="card summary-card">
              <h3>Campaign summary</h3>
              <p className="section-desc">Review your campaign setup.</p>
              <div className="summary-list">
                <div className="summary-item"><span>Status</span> <strong>Draft</strong></div>
                <div className="summary-item"><span>Objective</span> <strong>Increase repeat visits</strong></div>
                <div className="summary-item"><span>Channels</span> <strong>2 channels</strong></div>
              </div>
              <p className="next-step-hint">Next: define who should receive this campaign.</p>
            </div>
          </div>
        </div>
      </div>}
    </main>
  );
}
