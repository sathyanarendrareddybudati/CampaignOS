import React from 'react';
import { useLocation } from 'react-router-dom';
import { LoyumIcon } from '../common/LoyumLogo';

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
        <span className="brand-breadcrumb-prefix">LOYUM</span> <span className="separator">&gt;</span> {breadcrumbContent}
      </div>
      <div className="topbar-actions">
        <div className="loyum-status-pill">
          <span className="status-indicator-dot"></span>
          <span>LOYUM Live Node</span>
        </div>
        <button 
          title="Search campaigns & telemetry"
          className="topbar-icon-btn"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </button>
        <button 
          title="Notifications & Dispatches"
          className="topbar-icon-btn"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
        </button>
        <button 
          onClick={onLogout} 
          className="topbar-logout-btn"
        >
          Logout
        </button>
        <div className="avatar-seal" title="Loyum Merchant Profile">
          <LoyumIcon size={26} fill="#001F46" letterFill="#F2B12F" />
        </div>
      </div>
    </header>
  );
}

