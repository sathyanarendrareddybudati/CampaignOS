import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Topbar({ onLogout, selectedCampaign }) {
  const location = useLocation();
  const path = location.pathname;

  let breadcrumbContent = <span>Overview</span>;
  if (path === '/campaigns/create' || path === '/campaigns/new') {
    breadcrumbContent = <span>Campaigns <span className="separator">&gt;</span> New campaign</span>;
  } else if (path.startsWith('/campaigns') && path.includes('/analytics')) {
    breadcrumbContent = <span>Campaigns <span className="separator">&gt;</span> Analytics <span className="separator">&gt;</span> {selectedCampaign?.name || 'Campaign'}</span>;
  } else if (path.startsWith('/campaigns')) {
    breadcrumbContent = <span>Campaigns</span>;
  } else if (path.startsWith('/automations')) {
    breadcrumbContent = <span>Automations</span>;
  } else if (path.startsWith('/gamification')) {
    breadcrumbContent = <span>Gamification</span>;
  } else if (path.startsWith('/banners')) {
    breadcrumbContent = <span>Promo Banners</span>;
  } else if (path.startsWith('/analytics')) {
    breadcrumbContent = <span>Analytics <span className="separator">&gt;</span> {selectedCampaign?.name || 'Overview'}</span>;
  } else if (path.startsWith('/event-stream')) {
    breadcrumbContent = <span>Event stream</span>;
  } else if (path.startsWith('/settings')) {
    breadcrumbContent = <span>Settings</span>;
  }

  return (
    <header className="topbar">
      <div className="breadcrumbs">
        Merchant marketing <span className="separator">&gt;</span> {breadcrumbContent}
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
