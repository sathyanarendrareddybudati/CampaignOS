import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Overview({ token, userName }) {
  const navigate = useNavigate();
  const displayName = userName || localStorage.getItem('username') || localStorage.getItem('user_email')?.split('@')[0] || "Marie";
  const [data, setData] = useState({
    active_campaigns: 0,
    audience_reached: "0",
    conversions: "0",
    rewards_issued: "€0",
    recent_activity: [],
    campaign_health: []
  });

  const [activeMetricTab, setActiveMetricTab] = useState('revenue');

  useEffect(() => {
    fetch('/api/v1/overview/', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(resData => {
        if (resData && !resData.detail) {
          setData(resData);
        }
      })
      .catch(err => console.error(err));
  }, [token]);

  const metricConfigs = {
    reach: {
      label: 'Reach',
      color: '#6366F1',
      dotClass: 'purple',
      path: "M0,170 L40,165 L80,170 L120,150 L160,155 L200,135 L240,145 L280,130 L320,138 L360,118 L400,125 L440,105 L480,110 L500,80",
      endY: 80,
      primaryText: `${data.audience_reached || '9,150'} total audience reached`,
      secondaryText: "+18.4% monthly reach velocity"
    },
    conversions: {
      label: 'Conversions',
      color: '#10B981',
      dotClass: 'green',
      path: "M0,185 L50,180 L100,175 L150,160 L200,140 L250,150 L300,120 L350,110 L400,95 L450,75 L500,50",
      endY: 50,
      primaryText: `${data.conversions || '434'} total conversions`,
      secondaryText: data.conversion_rate || "4.7% conversion rate"
    },
    revenue: {
      label: 'Revenue',
      color: '#8B5CF6',
      dotClass: 'purple',
      path: "M0,180 L50,170 L100,160 L150,150 L200,130 L250,135 L300,110 L350,90 L400,80 L450,60 L500,35",
      endY: 35,
      primaryText: data.attributed_revenue || "€8,778 attributed revenue",
      secondaryText: `${data.conversion_rate || "4.7% conversion rate"} · 2.85x ROI`
    }
  };

  const currentMetric = metricConfigs[activeMetricTab] || metricConfigs.revenue;

  return (
    <main className="page-content fade-in">
      <div className="page-header" style={{ marginBottom: "1.5rem" }}>
        <div>
          <h1 className="page-title">Good morning, {displayName}</h1>
          <p className="page-subtitle">Here's what's happening across your campaigns today.</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/campaigns/create')}>+ Create campaign</button>
      </div>

      <div className="stats-cards" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem", marginBottom: "1.5rem" }}>
        <div className="stat-card" style={{ padding: "1.5rem" }}>
          <div className="stat-label">Active campaigns</div>
          <div className="stat-value" style={{ fontSize: "2rem" }}>{data.active_campaigns}</div>
          <div className="stat-trend positive">+2 this month</div>
        </div>
        <div className="stat-card" style={{ padding: "1.5rem" }}>
          <div className="stat-label">Audience reached</div>
          <div className="stat-value" style={{ fontSize: "2rem" }}>{data.audience_reached}</div>
          <div className="stat-trend positive">+18.4%</div>
        </div>
        <div className="stat-card" style={{ padding: "1.5rem" }}>
          <div className="stat-label">Conversions</div>
          <div className="stat-value" style={{ fontSize: "2rem" }}>{data.conversions}</div>
          <div className="stat-trend positive">+12.8%</div>
        </div>
        <div className="stat-card" style={{ padding: "1.5rem" }}>
          <div className="stat-label">Rewards issued</div>
          <div className="stat-value" style={{ fontSize: "2rem" }}>{data.rewards_issued}</div>
          <div className="stat-desc">{data.rewards_desc || "68% of cap"}</div>
        </div>
      </div>

      <div className="charts-grid" style={{ gridTemplateColumns: "2fr 1fr", marginBottom: "1.5rem" }}>
        <div className="card chart-card large" style={{ padding: "1.5rem", display: "flex", flexDirection: "column" }}>
          <h3 style={{ margin: "0 0 0.75rem 0", fontSize: "1.1rem" }}>Performance overview</h3>
          <div style={{ display: "flex", gap: "8px", marginBottom: "1rem" }}>
            <button 
              className={`btn-secondary ${activeMetricTab === 'reach' ? 'active' : ''}`}
              onClick={() => setActiveMetricTab('reach')}
              style={{
                padding: "0.35rem 0.85rem",
                borderRadius: "6px",
                fontSize: "0.8rem",
                background: activeMetricTab === 'reach' ? "#EEF2FF" : "#F8FAFC",
                border: activeMetricTab === 'reach' ? "1px solid #C7D2FE" : "1px solid transparent",
                color: activeMetricTab === 'reach' ? "#4338CA" : "#64748B",
                fontWeight: activeMetricTab === 'reach' ? "600" : "500",
                cursor: "pointer",
                boxShadow: "none"
              }}
            >
              Reach
            </button>
            <button 
              className={`btn-secondary ${activeMetricTab === 'conversions' ? 'active' : ''}`}
              onClick={() => setActiveMetricTab('conversions')}
              style={{
                padding: "0.35rem 0.85rem",
                borderRadius: "6px",
                fontSize: "0.8rem",
                background: activeMetricTab === 'conversions' ? "#ECFDF5" : "#F8FAFC",
                border: activeMetricTab === 'conversions' ? "1px solid #A7F3D0" : "1px solid transparent",
                color: activeMetricTab === 'conversions' ? "#065F46" : "#64748B",
                fontWeight: activeMetricTab === 'conversions' ? "600" : "500",
                cursor: "pointer",
                boxShadow: "none"
              }}
            >
              Conversions
            </button>
            <button 
              className={`btn-secondary ${activeMetricTab === 'revenue' ? 'active' : ''}`}
              onClick={() => setActiveMetricTab('revenue')}
              style={{
                padding: "0.35rem 0.85rem",
                borderRadius: "6px",
                fontSize: "0.8rem",
                background: activeMetricTab === 'revenue' ? "#F5F3FF" : "#F8FAFC",
                border: activeMetricTab === 'revenue' ? "1px solid #DDD6FE" : "1px solid transparent",
                color: activeMetricTab === 'revenue' ? "#5B21B6" : "#64748B",
                fontWeight: activeMetricTab === 'revenue' ? "600" : "500",
                cursor: "pointer",
                boxShadow: "none"
              }}
            >
              Revenue
            </button>
          </div>

          <div className="chart-placeholder line-chart" style={{ flex: "1", position: "relative", minHeight: "180px", marginTop: "1rem" }}>
            <svg width="100%" height="100%" viewBox="0 0 500 200" preserveAspectRatio="none" style={{ position: "absolute", bottom: "0", left: "0", width: "100%", height: "100%", zIndex: "2" }}>
              <path 
                d={currentMetric.path} 
                stroke={currentMetric.color} 
                strokeWidth="3.5" 
                fill="none" 
                style={{ transition: 'all 0.4s ease' }}
              />
              <circle 
                cx="500" 
                cy={currentMetric.endY} 
                r="5" 
                fill={currentMetric.color} 
                style={{ transition: 'all 0.4s ease' }}
              />
            </svg>
            {/* Horizontal grid lines */}
            <div style={{ position: "absolute", top: "0", width: "100%", height: "1px", background: "#F1F5F9", zIndex: "1" }}></div>
            <div style={{ position: "absolute", top: "25%", width: "100%", height: "1px", background: "#F1F5F9", zIndex: "1" }}></div>
            <div style={{ position: "absolute", top: "50%", width: "100%", height: "1px", background: "#F1F5F9", zIndex: "1" }}></div>
            <div style={{ position: "absolute", top: "75%", width: "100%", height: "1px", background: "#F1F5F9", zIndex: "1" }}></div>
            <div style={{ position: "absolute", top: "100%", width: "100%", height: "1px", background: "#F1F5F9", zIndex: "1" }}></div>
          </div>
          <div className="legend" style={{ marginTop: "1.5rem", alignItems: "center", color: "#475569" }}>
            <span className={`dot ${currentMetric.dotClass}`}></span> {currentMetric.primaryText} 
            <span style={{ marginLeft: "1.5rem", display: "flex", alignItems: "center", gap: "4px" }}>
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="#64748B" strokeWidth="2" fill="none"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg> 
              {currentMetric.secondaryText}
            </span>
          </div>
        </div>

        <div className="card chart-card" style={{ padding: "1.5rem" }}>
          <h3 style={{ margin: "0", fontSize: "1.1rem" }}>Campaign health</h3>
          <div className="health-list" style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {data.campaign_health.map((ch, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "1rem", borderBottom: "1px solid #F1F5F9" }}>
                <div>
                  <div style={{ fontWeight: "600", fontSize: "0.9rem", color: "#0F172A" }}>{ch.name}</div>
                  <div style={{ color: "#64748B", fontSize: "0.8rem", marginTop: "4px" }}>{ch.desc}</div>
                </div>
                <span className={`status-badge ${ch.status === 'Active' ? 'active' : 'gray'}`} style={{ fontSize: "0.7rem", padding: "0.15rem 0.5rem" }}>{ch.status}</span>
              </div>
            ))}
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
            {data.recent_activity.map((ra, i) => (
              <tr key={i}>
                <td style={{ padding: "1rem 0", fontWeight: "500", color: "#0F172A", fontSize: "0.85rem", borderBottom: "1px solid #F8FAFC" }}>{ra.event}</td>
                <td style={{ padding: "1rem 0", fontSize: "0.85rem", color: "#475569", borderBottom: "1px solid #F8FAFC" }}>{ra.channel}</td>
                <td style={{ padding: "1rem 0", borderBottom: "1px solid #F8FAFC" }}><span className="status-badge active" style={{ fontSize: "0.7rem", padding: "0.15rem 0.5rem" }}>{ra.status}</span></td>
                <td style={{ padding: "1rem 0", fontSize: "0.8rem", color: "#64748B", textAlign: "right", borderBottom: "1px solid #F8FAFC" }}>{ra.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
