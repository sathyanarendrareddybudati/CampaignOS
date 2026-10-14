import React from 'react';

export default function Topbar({ activeTab, activeSubPage, onLogout }) {
  return (
    <header className="topbar">
      <div className="breadcrumbs">
        Merchant marketing <span className="separator">&gt;</span>
        {activeTab === "campaigns" && activeSubPage === "create" && <span>Campaigns <span className="separator">&gt;</span> New campaign</span>}
        {activeTab === "gamification" && activeSubPage === "create" && <span>Gamification <span className="separator">&gt;</span> Spin & save</span>}
        {activeTab === "analytics" && activeSubPage === "details" && <span>Analytics <span className="separator">&gt;</span> Weekend comeback</span>}
        {!(activeTab === "campaigns" && activeSubPage === "create") && !(activeTab === "gamification" && activeSubPage === "create") && !(activeTab === "analytics" && activeSubPage === "details") && <span>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span>}
      </div>
      <div className="topbar-actions">
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="#64748B" strokeWidth="2" fill="none" className="action-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="#64748B" strokeWidth="2" fill="none" className="action-icon"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
        <button onClick={onLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', fontWeight: '500', marginLeft: '8px' }}>Logout</button>
        <div className="avatar">ML</div>
      </div>
    </header>
  );
}
