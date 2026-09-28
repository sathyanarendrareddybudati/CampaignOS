import React, { useState } from 'react';
import './index.css';


export default function Dashboard() {


  const [activeTab, setactiveTab] = useState('overview')
  // activeSubPage = 'list' | 'create' | 'analytics'
  const [activeSubPage, setactiveSubPage] = useState('list')

  const [campaigns, setCampaigns] = useState([
    { id: 1, name: 'Weekend comeback', status: 'Active', channel: 'Push + SMS', audience: 'Lapsed customers', performance: '8.2% conversion', budget: '€820 / €1,000', lastUpdated: 'Today' },
    { id: 2, name: 'Spin & save', status: 'Active', channel: 'Game', audience: 'Loyalty members', performance: '31% play rate', budget: '€1,220 / €2,000', lastUpdated: 'Yesterday' },
    { id: 3, name: 'Summer launch', status: 'Scheduled', channel: 'Ad + Push', audience: 'All customers', performance: 'Not started', budget: '€0 / €4,000', lastUpdated: 'Jun 24' },
    { id: 4, name: 'VIP birthday reward', status: 'Draft', channel: 'SMS', audience: 'VIP customers', performance: 'Not started', budget: '€0 / €500', lastUpdated: 'Jun 18' },
    { id: 5, name: 'Win-back: 30 day lapse', status: 'Paused', channel: 'SMS', audience: 'Inactive 30d+', performance: '4.8% conversion', budget: '€340 / €1,000', lastUpdated: 'Jun 12' },
  ])
  const [automations, setAutomations] = useState([
    { id: 1, name: 'Welcome series', trigger: 'New customer signup', audience: 'First-time customers', performance: '1,248 sent · 24.8% CTR', status: 'Active', lastUpdated: 'Today' },
    { id: 2, name: 'Win-back after 30 days', trigger: 'Customer inactivity', audience: 'Lapsed customers', performance: '864 sent · 16.2% CTR', status: 'Active', lastUpdated: 'Yesterday' },
    { id: 3, name: 'VIP birthday reward', trigger: 'Customer birthday', audience: 'VIP members', performance: '96 sent · 41.7% CTR', status: 'Active', lastUpdated: '3 days ago' },
    { id: 4, name: 'Post-purchase thank you', trigger: 'Order completed', audience: 'All customers', performance: '2,104 sent · 19.4% CTR', status: 'Active', lastUpdated: '5 days ago' },
    { id: 5, name: 'Weekend comeback', trigger: 'Friday at 18:00', audience: 'Engaged customers', performance: 'Draft', status: 'Draft', lastUpdated: 'Edited 12 min ago' }
  ])

  const [events, setEvents] = useState([
    { time: '14:32:06', event: 'customer.purchase.recorded', rule: 'Purchase threshold matched', dispatch: 'Push sent', status: 'Delivered', class: 'purple' },
    { time: '14:32:05', event: 'campaign.dispatch.command', rule: 'Weekend comeback', dispatch: 'Push adapter', status: 'Delivered', class: 'blue' },
    { time: '14:31:58', event: 'customer.inactivity.detected', rule: 'No matching rule', dispatch: '—', status: 'Ignored', class: 'yellow' },
    { time: '14:30:44', event: 'customer.purchase.recorded', rule: 'Spin & save matched', dispatch: 'Game adapter', status: 'Delivered', class: 'purple' },
    { time: '14:29:18', event: 'campaign.execution.recorded', rule: 'Weekend comeback', dispatch: 'Analytics consumer', status: 'Recorded', class: 'blue' },
  ])


  return (

    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2 className="logo">Loyum</h2>
          <div className="account-selector">
            <div className="account-info">
              <span className="account-name">Maison Lune - Paris</span>
              <span className="account-role">Merchant account</span>
            </div>
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="chevron-icon"><polyline points="8 17 12 21 16 17"></polyline><polyline points="8 7 12 3 16 7"></polyline></svg>
          </div>
        </div>

        <nav className="nav-menu">
          <button className={activeTab === "overview" ? "active" : ""} onClick={() => { setactiveTab("overview") }}>
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            Overview
          </button>
          <button className={activeTab === "campaigns" ? "active" : ""} onClick={() => { setactiveTab("campaigns"); setactiveSubPage("list") }}>
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            Campaigns
          </button>
          <button className={activeTab === "automations" ? "active" : ""} onClick={() => { setactiveTab("automations") }}>
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            Automations
          </button>
          <button className={activeTab === "gamification" ? "active" : ""} onClick={() => { setactiveTab("gamification"); setactiveSubPage("list") }}>
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            Gamification
          </button>
          <button className={activeTab === "analytics" ? "active" : ""} onClick={() => { setactiveTab("analytics"); setactiveSubPage("details"); }}>
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
            Analytics
          </button>
          <button className={activeTab === "event-stream" ? "active" : ""} onClick={() => { setactiveTab("event-stream") }}>
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            Event stream
          </button>
          <button className={activeTab === "settings" ? "active" : ""} onClick={() => { setactiveTab("settings") }}>
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            Settings
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="help-btn">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            Help
          </button>
        </div>
      </aside>

      <div className="main-content">
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
            <div className="avatar">ML</div>
          </div>
        </header>

        {/*  OVERVIEW TAB  */}
        {activeTab === "overview" && <main className="page-content fade-in">
          <div className="page-header" style={{ marginBottom: "1.5rem" }}>
            <div>
              <h1 className="page-title">Good morning, Marie</h1>
              <p className="page-subtitle">Here"s what"s happening across your campaigns today.</p>
            </div>
            <button className="btn-primary" onClick={() => { setactiveTab("campaigns"); setactiveSubPage("create") }}>+ Create campaign</button>
          </div>

          <div className="stats-cards" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem", marginBottom: "1.5rem" }}>
            <div className="stat-card" style={{ padding: "1.5rem" }}>
              <div className="stat-label">Active campaigns</div>
              <div className="stat-value" style={{ fontSize: "2rem" }}>6</div>
              <div className="stat-trend positive">+2 this month</div>
            </div>
            <div className="stat-card" style={{ padding: "1.5rem" }}>
              <div className="stat-label">Audience reached</div>
              <div className="stat-value" style={{ fontSize: "2rem" }}>24,860</div>
              <div className="stat-trend positive">+18.4%</div>
            </div>
            <div className="stat-card" style={{ padding: "1.5rem" }}>
              <div className="stat-label">Conversions</div>
              <div className="stat-value" style={{ fontSize: "2rem" }}>1,284</div>
              <div className="stat-trend positive">+12.8%</div>
            </div>
            <div className="stat-card" style={{ padding: "1.5rem" }}>
              <div className="stat-label">Rewards issued</div>
              <div className="stat-value" style={{ fontSize: "2rem" }}>€3,940</div>
              <div className="stat-desc">68% of cap</div>
            </div>
          </div>

          <div className="charts-grid" style={{ gridTemplateColumns: "2fr 1fr", marginBottom: "1.5rem" }}>
            <div className="card chart-card large" style={{ padding: "1.5rem", display: "flex", flexDirection: "column" }}>
              <h3 style={{ margin: "0 0 0.75rem 0", fontSize: "1.1rem" }}>Performance overview</h3>
              <div style={{ display: "flex", gap: "8px", marginBottom: "1rem" }}>
                <button className="btn-secondary active" style={{ padding: "0.3rem 0.8rem", borderRadius: "6px", fontSize: "0.8rem", background: "#F1F5F9", border: "none", boxShadow: "none", color: "#0F172A", fontWeight: "600" }}>Reach</button>
                <button className="btn-secondary" style={{ padding: "0.3rem 0.8rem", borderRadius: "6px", fontSize: "0.8rem", border: "none", boxShadow: "none", color: "#64748B", background: "#F8FAFC", fontWeight: "500" }}>Conversions</button>
                <button className="btn-secondary" style={{ padding: "0.3rem 0.8rem", borderRadius: "6px", fontSize: "0.8rem", border: "none", boxShadow: "none", color: "#64748B", background: "#F8FAFC", fontWeight: "500" }}>Revenue</button>
              </div>

              <div className="chart-placeholder line-chart" style={{ flex: "1", position: "relative", minHeight: "180px", marginTop: "1rem" }}>
                <svg width="100%" height="100%" viewBox="0 0 500 200" preserveAspectRatio="none" style={{ position: "absolute", bottom: "0", left: "0", width: "100%", height: "100%", zIndex: "2" }}>
                  {/*  A single purple line trending up  */}
                  <path d="M0,170 L40,165 L80,170 L120,150 L160,155 L200,135 L240,145 L280,130 L320,138 L360,118 L400,125 L440,105 L480,110 L500,80" stroke="#6366F1" strokeWidth="3" fill="none" />
                  <circle cx="500" cy="80" r="4" fill="#6366F1" />
                </svg>
                {/*  Horizontal grid lines mock  */}
                <div style={{ position: "absolute", top: "0", width: "100%", height: "1px", background: "#F1F5F9", zIndex: "1" }}></div>
                <div style={{ position: "absolute", top: "25%", width: "100%", height: "1px", background: "#F1F5F9", zIndex: "1" }}></div>
                <div style={{ position: "absolute", top: "50%", width: "100%", height: "1px", background: "#F1F5F9", zIndex: "1" }}></div>
                <div style={{ position: "absolute", top: "75%", width: "100%", height: "1px", background: "#F1F5F9", zIndex: "1" }}></div>
                <div style={{ position: "absolute", top: "100%", width: "100%", height: "1px", background: "#F1F5F9", zIndex: "1" }}></div>
              </div>
              <div className="legend" style={{ marginTop: "1.5rem", alignItems: "center", color: "#475569" }}><span className="dot purple"></span> €18,420 attributed revenue <span style={{ marginLeft: "1.5rem", display: "flex", alignItems: "center", gap: "4px" }}><svg viewBox="0 0 24 24" width="14" height="14" stroke="#64748B" strokeWidth="2" fill="none"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg> 7.4% conversion rate</span></div>
            </div>

            <div className="card chart-card" style={{ padding: "1.5rem" }}>
              <h3 style={{ margin: "0", fontSize: "1.1rem" }}>Campaign health</h3>
              <div className="health-list" style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "1rem", borderBottom: "1px solid #F1F5F9" }}>
                  <div>
                    <div style={{ fontWeight: "600", fontSize: "0.9rem", color: "#0F172A" }}>Weekend comeback</div>
                    <div style={{ color: "#64748B", fontSize: "0.8rem", marginTop: "4px" }}>82% budget used</div>
                  </div>
                  <span className="status-badge active" style={{ fontSize: "0.7rem", padding: "0.15rem 0.5rem" }}>Active</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "1rem", borderBottom: "1px solid #F1F5F9" }}>
                  <div>
                    <div style={{ fontWeight: "600", fontSize: "0.9rem", color: "#0F172A" }}>Spin & save</div>
                    <div style={{ color: "#64748B", fontSize: "0.8rem", marginTop: "4px" }}>61% rewards used</div>
                  </div>
                  <span className="status-badge active" style={{ fontSize: "0.7rem", padding: "0.15rem 0.5rem" }}>Active</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: "600", fontSize: "0.9rem", color: "#0F172A" }}>Summer launch</div>
                    <div style={{ color: "#64748B", fontSize: "0.8rem", marginTop: "4px" }}>Starts Jun 24</div>
                  </div>
                  <span className="status-badge gray" style={{ fontSize: "0.7rem", padding: "0.15rem 0.5rem", background: "#F8FAFC" }}>Scheduled</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: "1.5rem" }}>
            <h3 style={{ margin: "0", fontSize: "1.1rem" }}>Recent activity</h3>
            <table className="data-table clean" style={{ marginTop: "1rem", width: "100%" }}>
              <thead>
                <tr>
                  <th style={{ padding: "0.75rem 0", fontSize: "0.7rem", color: "#64748B", borderBottom: "1px solid #E2E8F0" }}>EVENT</th>
                  <th style={{ padding: "0.75rem 0", fontSize: "0.7rem", color: "#64748B", borderBottom: "1px solid #E2E8F0" }}>CHANNEL</th>
                  <th style={{ padding: "0.75rem 0", fontSize: "0.7rem", color: "#64748B", borderBottom: "1px solid #E2E8F0" }}>STATUS</th>
                  <th style={{ padding: "0.75rem 0", fontSize: "0.7rem", color: "#64748B", borderBottom: "1px solid #E2E8F0", textAlign: "right" }}>TIMESTAMP</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: "1rem 0", fontWeight: "500", color: "#0F172A", fontSize: "0.85rem", borderBottom: "1px solid #F8FAFC" }}>Purchase threshold matched</td>
                  <td style={{ padding: "1rem 0", fontSize: "0.85rem", color: "#475569", borderBottom: "1px solid #F8FAFC" }}>Push</td>
                  <td style={{ padding: "1rem 0", borderBottom: "1px solid #F8FAFC" }}><span className="status-badge active" style={{ fontSize: "0.7rem", padding: "0.15rem 0.5rem" }}>Delivered</span></td>
                  <td style={{ padding: "1rem 0", fontSize: "0.8rem", color: "#64748B", textAlign: "right", borderBottom: "1px solid #F8FAFC" }}>2 min ago</td>
                </tr>
                <tr>
                  <td style={{ padding: "1rem 0", fontWeight: "500", color: "#0F172A", fontSize: "0.85rem", borderBottom: "1px solid #F8FAFC" }}>Spin & save reward issued</td>
                  <td style={{ padding: "1rem 0", fontSize: "0.85rem", color: "#475569", borderBottom: "1px solid #F8FAFC" }}>Game</td>
                  <td style={{ padding: "1rem 0", borderBottom: "1px solid #F8FAFC" }}><span className="status-badge active" style={{ fontSize: "0.7rem", padding: "0.15rem 0.5rem" }}>Converted</span></td>
                  <td style={{ padding: "1rem 0", fontSize: "0.8rem", color: "#64748B", textAlign: "right", borderBottom: "1px solid #F8FAFC" }}>8 min ago</td>
                </tr>
                <tr>
                  <td style={{ padding: "1rem 0", fontWeight: "500", color: "#0F172A", fontSize: "0.85rem", borderBottom: "none" }}>Inactive customer re-engaged</td>
                  <td style={{ padding: "1rem 0", fontSize: "0.85rem", color: "#475569", borderBottom: "none" }}>SMS</td>
                  <td style={{ padding: "1rem 0", borderBottom: "none" }}><span className="status-badge active" style={{ fontSize: "0.7rem", padding: "0.15rem 0.5rem" }}>Delivered</span></td>
                  <td style={{ padding: "1rem 0", fontSize: "0.8rem", color: "#64748B", textAlign: "right", borderBottom: "none" }}>14 min ago</td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>}

        {/*  CAMPAIGNS TAB  */}
        {activeTab === "campaigns" && <main className="page-content fade-in">
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
                  <input type="text" value="Weekend comeback" className="input" />
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
                    <label className="radio-label selected"><input type="radio" checked /> Run continuously</label>
                    <label className="radio-label"><input type="radio" /> Set an end date</label>
                  </div>
                </div>

                <div className="form-actions">
                  <button className="btn-secondary" onClick={() => { setactiveSubPage("list") }}>Save draft</button>
                  <button className="btn-primary" onClick={() => { setactiveSubPage("list") }}>Continue to audience &rarr;</button>
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
        </main>}

        {/*  ANALYTICS TAB  */}
        {activeTab === "analytics" && <main className="page-content fade-in">
          {activeSubPage === "details" && <div>
            <div className="page-header">
              <div>
                <div className="back-link" onClick={() => { setactiveSubPage("list"); setactiveTab("campaigns") }}>&larr; All campaigns</div>
                <h1 className="page-title">Weekend comeback</h1>
              </div>
              <div className="header-actions">
                <button className="btn-secondary">Pause campaign</button>
                <button className="btn-primary btn-icon"><svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> Export report</button>
              </div>
            </div>

            <div className="filter-bar">
              <div className="dropdowns">
                <select><option>Last 30 days</option></select>
                <select><option>All channels</option></select>
                <select><option>All audiences</option></select>
              </div>
              <div className="sync-status"><span className="dot green"></span> Last event processed 12 seconds ago</div>
            </div>

            <div className="stats-cards">
              <div className="stat-card">
                <div className="stat-label">Impressions</div>
                <div className="stat-value">18,420</div>
                <div className="stat-trend positive">+22%</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Engagements</div>
                <div className="stat-value">4,268</div>
                <div className="stat-desc">23.2%</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Conversions</div>
                <div className="stat-value">1,284</div>
                <div className="stat-desc">7.4%</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Attributed revenue</div>
                <div className="stat-value">€18,420</div>
                <div className="stat-trend positive">+18.4%</div>
              </div>
            </div>

            <div className="charts-grid">
              <div className="card chart-card large">
                <h3>Reach to conversion</h3>
                <p className="section-desc">Jun 1 - Jun 30</p>
                <div className="legend"><span className="dot purple"></span> Impressions <span className="dot green"></span> Conversions</div>
                <div className="chart-placeholder line-chart">
                  {/*  SVG MOCK FOR LINE CHART  */}
                  <svg width="100%" height="200" viewBox="0 0 500 200" preserveAspectRatio="none">
                    <path d="M0,150 C50,140 100,160 150,120 C200,80 250,110 300,70 C350,30 400,60 450,20 L500,10" stroke="#6366F1" strokeWidth="4" fill="none" />
                    <path d="M0,190 C50,185 100,195 150,170 C200,140 250,160 300,130 C350,100 400,120 450,90 L500,85" stroke="#10B981" strokeWidth="3" fill="none" />
                  </svg>
                  <div className="x-axis"><span>Jun 1</span><span>Jun 10</span><span>Jun 20</span><span>Jun 30</span></div>
                </div>
              </div>
              <div className="card chart-card">
                <h3>Channel mix</h3>
                <p className="section-desc">Attributed conversions by channel</p>
                <div className="donut-placeholder">
                  <svg viewBox="0 0 36 36" className="circular-chart">
                    <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="circle purple" strokeDasharray="48, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="circle green" strokeDasharray="32, 100" strokeDashoffset="-48" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="circle orange" strokeDasharray="20, 100" strokeDashoffset="-80" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <text x="18" y="18.5" className="percentage">100%</text>
                    <text x="18" y="14" className="percentage-label">Total</text>
                  </svg>
                  <div className="donut-legend">
                    <div className="dl-item"><span className="dot purple"></span> Push <strong>48%</strong></div>
                    <div className="dl-item"><span className="dot green"></span> SMS <strong>32%</strong></div>
                    <div className="dl-item"><span className="dot orange"></span> Ad <strong>20%</strong></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h3>Execution log</h3>
              <p className="section-desc">Recent campaign activity</p>
              <table className="data-table clean">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Trigger</th>
                    <th>Channel</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Jun 18 14:32</td><td>Purchase above €50</td><td>Push</td><td><span className="status-badge active">Converted</span></td><td style={{ textAlign: "right" }}><strong>€24</strong></td></tr>
                  <tr><td>Jun 18 13:08</td><td>30 days inactive</td><td>SMS</td><td><span className="status-badge gray">Delivered</span></td><td style={{ textAlign: "right" }}>—</td></tr>
                  <tr><td>Jun 17 19:44</td><td>Purchase above €50</td><td>Push</td><td><span className="status-badge gray">Opened</span></td><td style={{ textAlign: "right" }}>—</td></tr>
                  <tr><td>Jun 17 18:01</td><td>Purchase above €50</td><td>Ad</td><td><span className="status-badge active">Converted</span></td><td style={{ textAlign: "right" }}><strong>€42</strong></td></tr>
                </tbody>
              </table>
            </div>
          </div>}
        </main>}

        {/*  EVENT STREAM TAB  */}
        {activeTab === "event-stream" && <main className="page-content fade-in">
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
                      <td><span className={`event-badge ${ev.class}`}>{ev.event}</span></td>
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
        </main>}

        {/*  GAMIFICATION TAB  */}
        {activeTab === "gamification" && <main className="page-content fade-in">
          {activeSubPage === "list" && <div className="create-wizard">
            <div className="page-header">
              <div>
                <h1 className="page-title">Configure game</h1>
                <p className="page-subtitle">Make the reward moment feel memorable without losing control of your cap.</p>
              </div>
              <div className="header-actions">
                <div className="sync-status" style={{ background: "white", border: "1px solid #E2E8F0", padding: "0.5rem 1rem", borderRadius: "8px" }}><svg viewBox="0 0 24 24" width="14" height="14" stroke="#10B981" strokeWidth="2" fill="none" style={{ marginRight: "5px", verticalAlign: "middle" }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> Rewards are issued server-side and caps are decremented atomically.</div>
              </div>
            </div>

            <div className="wizard-content gamification-wizard">
              <div className="g-templates">
                <h4>Choose a template</h4>
                <p className="section-desc">Select the game customers will play.</p>
                <div className="template-selector active">
                  <div className="icon-circle green"><div className="inner-dot"></div></div>
                  <div>
                    <h5>Spin the wheel</h5>
                    <p>A bright, rewarding spin.</p>
                  </div>
                  <div className="active-dot"></div>
                </div>
                <div className="template-selector">
                  <div className="icon-circle empty"></div>
                  <div>
                    <h5>Scratch card</h5>
                    <p>Reveal a surprise reward.</p>
                  </div>
                </div>
                <div className="template-selector">
                  <div className="icon-circle text">?</div>
                  <div>
                    <h5>Quiz</h5>
                    <p>Turn knowledge into rewards.</p>
                  </div>
                </div>
              </div>

              <div className="g-main">
                <div className="card">
                  <h3>Game details</h3>
                  <p className="section-desc">Set the basic rules for this experience.</p>
                  <div className="grid-2">
                    <div className="form-group">
                      <label>Game title</label>
                      <input type="text" value="Spin & save" className="input" />
                    </div>
                    <div className="form-group">
                      <label>Play frequency</label>
                      <select className="input"><option>Once per customer</option></select>
                    </div>
                    <div className="form-group">
                      <label>Reward cap</label>
                      <input type="text" value="500 rewards" className="input" />
                    </div>
                    <div className="form-group">
                      <label>Redemption expiry</label>
                      <select className="input"><option>30 days</option></select>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="flex-between">
                    <div>
                      <h3>Odds and prizes</h3>
                      <p className="section-desc">Adjust the chance of each outcome. Total odds must equal 100%.</p>
                    </div>
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="#6366F1" strokeWidth="2" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                  </div>

                  <table className="odds-table">
                    <thead>
                      <tr>
                        <th>Prize</th>
                        <th style={{ textAlign: "right", width: "100px" }}>Chance</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><div className="drag-handle">⠿</div> <input type="text" value="10% off" className="input slim" /></td>
                        <td className="chance-td"><input type="text" value="20" className="input slim right" /> <span>%</span></td>
                      </tr>
                      <tr>
                        <td><div className="drag-handle">⠿</div> <input type="text" value="Free coffee" className="input slim" /></td>
                        <td className="chance-td"><input type="text" value="10" className="input slim right" /> <span>%</span></td>
                      </tr>
                      <tr>
                        <td><div className="drag-handle">⠿</div> <input type="text" value="No prize" className="input slim" /></td>
                        <td className="chance-td"><input type="text" value="70" className="input slim right" /> <span>%</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="g-preview">
                <div className="card preview-card">
                  <h3>Live preview</h3>
                  <p className="section-desc">See how the reward moment feels.</p>
                  <div className="preview-box">
                    <div className="wheel-mockup">
                      <div className="wheel-slice s1"></div>
                      <div className="wheel-slice s2"></div>
                      <div className="wheel-slice s3"></div>
                      <div className="wheel-slice s4"></div>
                      <div className="wheel-slice s5"></div>
                      <div className="wheel-slice s6"></div>
                      <div className="wheel-center"><svg viewBox="0 0 24 24" width="16" height="16" stroke="white" strokeWidth="2" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg></div>
                      <div className="wheel-pointer">▼</div>
                    </div>
                  </div>
                  <h3 className="text-center mt-4" style={{ marginTop: "1.5rem" }}>Your next spin could win</h3>
                  <p className="section-desc text-center">Try your luck and reveal a reward.</p>
                  <button className="btn-primary full-width mt-4">Spin now</button>
                </div>
              </div>
            </div>

            <div className="footer-actions flex-between mt-4">
              <button className="btn-text">Cancel</button>
              <div>
                <button className="btn-secondary mr-2">Save game</button>
                <button className="btn-primary">Activate game</button>
              </div>
            </div>
          </div>}
        </main>}

        {/*  AUTOMATIONS TAB  */}
        {activeTab === "automations" && <main className="page-content fade-in">
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
            <div style={{ padding: "1rem 1.5rem", display: "flex", justifyContent: "flex-end", alignItems: "center", borderTop: "1px solid #F1F5F9", fontSize: "0.85rem", color: "#64748B" }}>
              Showing 5 of 8 automations
              <div style={{ display: "flex", gap: "4px", marginLeft: "1rem" }}>
                <button style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: "4px", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#94A3B8" }}>&lt;</button>
                <button style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: "4px", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748B" }}>&gt;</button>
              </div>
            </div>
          </div>

          <div style={{ marginTop: "2rem", background: "linear-gradient(135deg, #F5F3FF, #EDE9FE)", border: "1px solid #E9D5FF", borderRadius: "12px", padding: "1.5rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1.1rem", color: "#0F172A" }}>Automations that work while you sleep</h3>
              <p style={{ margin: "0", fontSize: "0.9rem", color: "#475569" }}>Start with a proven recipe or build a journey from scratch.</p>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button className="btn-secondary" style={{ background: "white" }}>Browse recipes</button>
              <button className="btn-secondary" style={{ background: "white" }}>View documentation</button>
            </div>
          </div>
        </main>}

        {/*  SETTINGS TAB  */}
        {activeTab === "settings" && <main className="page-content fade-in" style={{ paddingBottom: "4rem" }}>
          <div className="page-header">
            <div>
              <h1 className="page-title">Settings</h1>
              <p className="page-subtitle">Manage your workspace, integrations, and messaging preferences.</p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start", marginTop: "1rem" }}>
            <div style={{ width: "220px", background: "white", borderRadius: "12px", border: "1px solid #E2E8F0", padding: "1rem 0" }}>
              <div style={{ padding: "0.5rem 1.25rem", fontWeight: "700", fontSize: "0.9rem", color: "#0F172A", marginBottom: "0.5rem" }}>Settings</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px", padding: "0 0.75rem" }}>
                <button style={{ textAlign: "left", background: "#F3E8FF", color: "#6366F1", border: "none", padding: "0.6rem 0.75rem", borderRadius: "6px", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer" }}>General</button>
                <button style={{ textAlign: "left", background: "transparent", color: "#64748B", border: "none", padding: "0.6rem 0.75rem", borderRadius: "6px", fontSize: "0.85rem", fontWeight: "500", cursor: "pointer" }}>Team members</button>
                <button style={{ textAlign: "left", background: "transparent", color: "#64748B", border: "none", padding: "0.6rem 0.75rem", borderRadius: "6px", fontSize: "0.85rem", fontWeight: "500", cursor: "pointer" }}>Integrations</button>
                <button style={{ textAlign: "left", background: "transparent", color: "#64748B", border: "none", padding: "0.6rem 0.75rem", borderRadius: "6px", fontSize: "0.85rem", fontWeight: "500", cursor: "pointer" }}>Messaging</button>
                <button style={{ textAlign: "left", background: "transparent", color: "#64748B", border: "none", padding: "0.6rem 0.75rem", borderRadius: "6px", fontSize: "0.85rem", fontWeight: "500", cursor: "pointer" }}>Notifications</button>
                <button style={{ textAlign: "left", background: "transparent", color: "#64748B", border: "none", padding: "0.6rem 0.75rem", borderRadius: "6px", fontSize: "0.85rem", fontWeight: "500", cursor: "pointer" }}>Billing & plan</button>
              </div>
            </div>

            <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div className="card" style={{ padding: "2rem" }}>
                <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.15rem" }}>General settings</h3>
                <p className="section-desc" style={{ marginBottom: "2rem" }}>Keep your merchant workspace details up to date.</p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2.5rem" }}>
                  <div className="form-group" style={{ margin: "0" }}>
                    <label>Workspace name</label>
                    <input type="text" className="input" value="Maison Lune - Paris" />
                  </div>
                  <div className="form-group" style={{ margin: "0" }}>
                    <label>Timezone</label>
                    <input type="text" className="input" value="Europe/Paris" />
                  </div>
                  <div className="form-group" style={{ margin: "0" }}>
                    <label>Default currency</label>
                    <input type="text" className="input" value="EUR — Euro" />
                  </div>
                  <div className="form-group" style={{ margin: "0" }}>
                    <label>Locale</label>
                    <input type="text" className="input" value="French (France)" />
                  </div>
                </div>

                <h3 style={{ margin: "0 0 1.5rem 0", fontSize: "1.05rem" }}>Workspace preferences</h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: "600", fontSize: "0.9rem", color: "#0F172A", marginBottom: "4px" }}>Enable campaign approval workflow</div>
                      <div style={{ color: "#64748B", fontSize: "0.85rem" }}>Require a second review before campaigns go live</div>
                    </div>
                    <div style={{ width: "36px", height: "20px", background: "#6366F1", borderRadius: "10px", position: "relative", cursor: "pointer" }}>
                      <div style={{ width: "16px", height: "16px", background: "white", borderRadius: "50%", position: "absolute", top: "2px", right: "2px", boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}></div>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: "600", fontSize: "0.9rem", color: "#0F172A", marginBottom: "4px" }}>Show revenue in local currency</div>
                      <div style={{ color: "#64748B", fontSize: "0.85rem" }}>Use EUR throughout reports and dashboards</div>
                    </div>
                    <div style={{ width: "36px", height: "20px", background: "#6366F1", borderRadius: "10px", position: "relative", cursor: "pointer" }}>
                      <div style={{ width: "16px", height: "16px", background: "white", borderRadius: "50%", position: "absolute", top: "2px", right: "2px", boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}></div>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: "600", fontSize: "0.9rem", color: "#0F172A", marginBottom: "4px" }}>Allow team members to export customer data</div>
                      <div style={{ color: "#64748B", fontSize: "0.85rem" }}>Exports are logged for audit purposes</div>
                    </div>
                    <div style={{ width: "36px", height: "20px", background: "#E2E8F0", borderRadius: "10px", position: "relative", cursor: "pointer" }}>
                      <div style={{ width: "16px", height: "16px", background: "white", borderRadius: "50%", position: "absolute", top: "2px", left: "2px", boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}></div>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "2.5rem", paddingTop: "2rem", borderTop: "1px solid #F1F5F9" }}>
                  <button className="btn-secondary" style={{ background: "#F1F5F9", border: "none", boxShadow: "none" }}>Cancel</button>
                  <button className="btn-primary">Save changes</button>
                </div>
              </div>

              <div className="card" style={{ padding: "2rem", borderColor: "#FECACA" }}>
                <h3 style={{ margin: "0 0 1.5rem 0", fontSize: "1.15rem", color: "#DC2626" }}>Danger zone</h3>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ color: "#475569", fontSize: "0.9rem" }}>
                    This permanently deletes your campaigns, events, and customer data.
                  </div>
                  <button className="btn-secondary" style={{ color: "#DC2626", borderColor: "#FECACA", background: "white" }}>Delete workspace</button>
                </div>
              </div>

            </div>
          </div>
        </main>}

      </div>
    </div>

  );
}
