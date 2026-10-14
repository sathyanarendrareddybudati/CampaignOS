import React, { useState } from 'react';
import './index.css';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';

const ModulePlaceholder = ({ title, assignee, description }) => (
  <div style={{
    margin: '2rem auto',
    maxWidth: '600px',
    padding: '2.5rem',
    borderRadius: '16px',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    textAlign: 'center'
  }}>
    <h3 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '0.75rem', color: '#fff' }}>
      {title} Module
    </h3>
    <div style={{
      display: 'inline-block',
      padding: '0.35rem 0.85rem',
      borderRadius: '20px',
      background: 'rgba(99, 102, 241, 0.2)',
      color: '#818cf8',
      fontSize: '0.85rem',
      fontWeight: 500,
      marginBottom: '1rem'
    }}>
      Assigned to: {assignee}
    </div>
    <p style={{ color: '#94a3b8', fontSize: '0.925rem', lineHeight: 1.5 }}>
      {description}
    </p>
  </div>
);

export default function Dashboard({ token, onLogout }) {
  const [activeTab, setactiveTab] = useState('overview');
  const [activeSubPage, setactiveSubPage] = useState('list');

  return (
    <div className="app-layout">
      <Sidebar activeTab={activeTab} setactiveTab={setactiveTab} setactiveSubPage={setactiveSubPage} />
      <div className="main-content">
        <Topbar activeTab={activeTab} activeSubPage={activeSubPage} onLogout={onLogout} />

        {activeTab === "overview" && (
          <ModulePlaceholder
            title="Overview & Metrics"
            assignee="Suresh"
            description="Overview dashboard with system KPIs, active campaigns summary, and high-level engagement stats."
          />
        )}

        {activeTab === "campaigns" && (
          <ModulePlaceholder
            title="Campaigns Management"
            assignee="Suresh"
            description="Campaign creation, target audience selection, scheduling, budget controls, and campaign performance."
          />
        )}

        {activeTab === "automations" && (
          <ModulePlaceholder
            title="Automations & Rules"
            assignee="Suresh"
            description="Automated trigger-action flows, win-back series, birthday rewards, and rule configuration."
          />
        )}

        {activeTab === "analytics" && (
          <ModulePlaceholder
            title="Analytics & Reports"
            assignee="Meg"
            description="Conversion funnel tracking, channel attribution, revenue trends, and exportable campaign reports."
          />
        )}

        {activeTab === "event-stream" && (
          <ModulePlaceholder
            title="Real-Time Event Stream"
            assignee="Meg"
            description="Live feed of incoming customer events, purchase notifications, and dispatch status."
          />
        )}

        {activeTab === "gamification" && (
          <ModulePlaceholder
            title="Gamification Engine"
            assignee="Meg"
            description="Interactive rewards, Spin-to-Win games, scratch cards, and reward distribution templates."
          />
        )}
      </div>
    </div>
  );
}
