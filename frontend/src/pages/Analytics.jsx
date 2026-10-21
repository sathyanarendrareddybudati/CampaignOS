import React, { useState, useEffect } from 'react';

export default function Analytics({ activeSubPage, setactiveSubPage, setactiveTab, token }) {
  const [data, setData] = useState({
    impressions: "0",
    impressions_trend: "0%",
    engagements: "0",
    engagements_rate: "0%",
    conversions: "0",
    conversions_rate: "0%",
    revenue: "€0",
    revenue_trend: "0%",
    logs: []
  });

  useEffect(() => {
    if (activeSubPage === "details") {
      fetch('/api/v1/analytics/', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(resData => {
          if (!resData.detail) {
            setData(resData);
          }
        })
        .catch(err => console.error(err));
    }
  }, [activeSubPage, token]);

  return (
    <main className="page-content fade-in">
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
            <div className="stat-value">{data.impressions}</div>
            <div className="stat-trend positive">{data.impressions_trend}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Engagements</div>
            <div className="stat-value">{data.engagements}</div>
            <div className="stat-desc">{data.engagements_rate}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Conversions</div>
            <div className="stat-value">{data.conversions}</div>
            <div className="stat-desc">{data.conversions_rate}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Attributed revenue</div>
            <div className="stat-value">{data.revenue}</div>
            <div className="stat-trend positive">{data.revenue_trend}</div>
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
              {data.logs.map((log, i) => (
                <tr key={i}>
                  <td>{log.timestamp}</td>
                  <td>{log.trigger}</td>
                  <td>{log.channel}</td>
                  <td><span className={`status-badge ${log.class || 'active'}`}>{log.status}</span></td>
                  <td style={{ textAlign: "right" }}>{log.value.includes('€') ? <strong>{log.value}</strong> : log.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>}
    </main>
  );
}