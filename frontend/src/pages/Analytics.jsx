import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function Analytics({ token, selectedCampaign, onCampaignUpdated, campaigns = [] }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({
    impressions: "9,150",
    impressions_trend: "+22%",
    engagements: "2,154",
    engagements_rate: "23.5%",
    conversions: "434",
    conversions_rate: "4.7%",
    conversion_rate: "4.7% conversion rate",
    revenue: "€8,778",
    attributed_revenue: "€8,778 attributed revenue",
    revenue_trend: "+18.4%",
    budget_cap: 1000,
    budget_spent: 420,
    status: 'Active',
    logs: []
  });
  const [activeMetricTab, setActiveMetricTab] = useState('revenue');
  const [timeframe, setTimeframe] = useState('30d');
  const [channel, setChannel] = useState('all');
  const [hoveredChannel, setHoveredChannel] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);

  const targetId = id || selectedCampaign?.id;
  const currentCampaign = campaigns.find(c => c.id === targetId) || selectedCampaign;
  const [currentStatus, setCurrentStatus] = useState(currentCampaign?.status || 'Active');

  useEffect(() => {
    const baseUrl = targetId 
      ? `/api/v1/campaigns/${targetId}/analytics` 
      : '/api/v1/analytics/';
    
    const queryParams = new URLSearchParams();
    if (timeframe) queryParams.append('timeframe', timeframe);
    if (channel) queryParams.append('channel', channel);

    const fullUrl = `${baseUrl}?${queryParams.toString()}`;

    fetch(fullUrl, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(resData => {
        if (!resData.detail) {
          setData(resData);
          if (resData.status) setCurrentStatus(resData.status);
        }
      })
      .catch(err => console.error(err));
  }, [targetId, token, timeframe, channel]);

  const toggleCampaignStatus = () => {
    if (!targetId) return;
    setStatusLoading(true);
    const endpoint = currentStatus === 'Active' 
      ? `/api/v1/campaigns/${targetId}/pause`
      : `/api/v1/campaigns/${targetId}/activate`;

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(() => {
        const nextStatus = currentStatus === 'Active' ? 'Paused' : 'Active';
        setCurrentStatus(nextStatus);
        setStatusLoading(false);
        if (onCampaignUpdated) onCampaignUpdated();
      })
      .catch(err => {
        console.error(err);
        setStatusLoading(false);
      });
  };

  const handleExportReport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value\n"
      + `Campaign,${selectedCampaign?.name || data.name || 'Campaign Analytics'}\n`
      + `Status,${currentStatus}\n`
      + `Impressions,${data.impressions}\n`
      + `Engagements,${data.engagements}\n`
      + `Conversions,${data.conversions}\n`
      + `Attributed Revenue,${data.attributed_revenue || data.revenue}\n\n`
      + "Timestamp,Trigger,Channel,Status,Value\n"
      + (data.logs || []).map(l => `${l.timestamp},"${l.trigger}",${l.channel},${l.status},${l.value}`).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `analytics_${selectedCampaign?.name || 'campaign'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const campaignTitle = currentCampaign?.name || data.name || "Campaign Analytics";
  const pushPct = data.channel_mix?.push ?? 48;
  const smsPct = data.channel_mix?.sms ?? 32;
  const adPct = data.channel_mix?.ad ?? 20;
  const metricConfigs = {
    reach: {
      label: 'Reach',
      color: '#001F46',
      bgActive: '#001F46',
      borderActive: '#00122B',
      textActive: '#FFFFFF',
      dotClass: 'purple',
      path: timeframe === 'today'
        ? "M0,170 C100,160 200,140 300,110 400,80 500,45"
        : timeframe === '7d'
          ? "M0,175 L80,165 L160,150 L240,120 L320,100 L400,75 L500,40"
          : "M0,175 C50,165 100,160 150,135 C200,115 250,130 300,95 C350,75 400,80 450,50 L500,30",
      endY: timeframe === 'today' ? 45 : (timeframe === '7d' ? 40 : 30),
      primaryText: `${data.impressions || '9,150'} total impressions`,
      secondaryText: `${data.impressions_trend || '+22%'} reach growth`
    },
    conversions: {
      label: 'Conversions',
      color: '#F2B12F',
      bgActive: '#F2B12F',
      borderActive: '#D99B22',
      textActive: '#001F46',
      dotClass: 'orange',
      path: timeframe === 'today'
        ? "M0,185 C100,175 200,150 300,120 400,90 500,60"
        : timeframe === '7d'
          ? "M0,185 L80,175 L160,160 L240,140 L320,115 L400,90 L500,60"
          : "M0,185 L50,180 L100,175 L150,160 L200,140 L250,150 L300,120 L350,110 L400,95 L450,75 L500,50",
      endY: timeframe === 'today' ? 60 : 50,
      primaryText: `${data.conversions || '434'} total conversions`,
      secondaryText: data.conversion_rate || `${data.conversions_rate || '4.7%'} conversion rate`
    },
    revenue: {
      label: 'Revenue',
      color: '#562C2C',
      bgActive: '#562C2C',
      borderActive: '#3D1C1C',
      textActive: '#FFFFFF',
      dotClass: 'green',
      path: timeframe === 'today'
        ? "M0,180 C100,170 200,140 300,105 400,70 500,40"
        : timeframe === '7d'
          ? "M0,180 L80,165 L160,145 L240,125 L320,95 L400,70 L500,40"
          : "M0,180 L50,170 L100,160 L150,150 L200,130 L250,135 L300,110 L350,90 L400,80 L450,60 L500,35",
      endY: timeframe === 'today' ? 40 : 35,
      primaryText: data.attributed_revenue || `${data.revenue || '€8,778'} attributed revenue`,
      secondaryText: `${data.conversions_rate || '4.7%'} conversion rate · 2.85x ROI`
    }
  };

  const currentMetric = metricConfigs[activeMetricTab] || metricConfigs.revenue;

  const xAxisLabels = timeframe === 'today'
    ? ['00:00', '06:00', '12:00', '18:00', '24:00']
    : timeframe === '7d'
      ? ['Mon', 'Wed', 'Fri', 'Sun']
      : ['Jun 1', 'Jun 10', 'Jun 20', 'Jun 30'];

  return (
    <main className="page-content fade-in">
      <div>
        <div className="page-header">
          <div>
            <div 
              className="back-link" 
              onClick={() => navigate('/campaigns')}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '0.5rem', color: 'var(--loyum-navy)', fontWeight: '600' }}
            >
              &larr; All campaigns
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h1 className="page-title">{campaignTitle}</h1>
              <span className={`status-badge ${(currentStatus || 'draft').toLowerCase()}`}>
                {currentStatus}
              </span>
            </div>
          </div>
          <div className="header-actions" style={{ display: 'flex', gap: '10px' }}>
            {targetId && (
              <button 
                className="btn-secondary" 
                onClick={toggleCampaignStatus}
                disabled={statusLoading}
                style={{ width: 'auto' }}
              >
                {statusLoading ? 'Updating...' : (currentStatus === 'Active' ? 'Pause campaign' : 'Activate campaign')}
              </button>
            )}
            <button className="btn-primary btn-icon" onClick={handleExportReport} style={{ width: 'auto' }}>
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> 
              Export report
            </button>
          </div>
        </div>

        <div className="filter-bar">
          <div className="dropdowns">
            <select value={timeframe} onChange={e => setTimeframe(e.target.value)}>
              <option value="30d">Last 30 days</option>
              <option value="7d">Last 7 days</option>
              <option value="today">Today</option>
            </select>
            <select value={channel} onChange={e => setChannel(e.target.value)}>
              <option value="all">All channels</option>
              <option value="push">Push</option>
              <option value="sms">SMS</option>
            </select>
            <select>
              <option value="all">All audiences</option>
              <option value="loyalty">VIP Loyalty Passholders</option>
              <option value="new">New Customers (&lt;30d)</option>
              <option value="lapsed">Lapsed / Inactive Customers</option>
            </select>
          </div>
          <div className="sync-status"><span className="dot green"></span> Live event telemetry synced</div>
        </div>

        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-label">Impressions</div>
            <div className="stat-value">{data.impressions}</div>
            <div className="stat-trend positive">{data.impressions_trend || '+22%'}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Engagements</div>
            <div className="stat-value">{data.engagements}</div>
            <div className="stat-desc">{data.engagements_rate || '23.5%'}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Conversions</div>
            <div className="stat-value">{data.conversions}</div>
            <div className="stat-desc">{data.conversions_rate || '4.7%'}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Attributed revenue</div>
            <div className="stat-value">{data.revenue}</div>
            <div className="stat-trend positive">{data.revenue_trend || '+18.4%'}</div>
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

            <div className="chart-placeholder line-chart" style={{ flex: "1", position: "relative", minHeight: "180px", marginTop: "0.5rem" }}>
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
              <div style={{ position: "absolute", bottom: "0", width: "100%", height: "1px", background: "#F1F5F9", zIndex: "1" }}></div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
              <div className="legend" style={{ display: "flex", alignItems: "center", gap: "8px", margin: "0" }}>
                <span className={`dot ${currentMetric.dotClass}`} style={{ transition: 'all 0.3s ease' }}></span>
                <strong>{currentMetric.primaryText}</strong>
                <span style={{ color: "#64748B", fontSize: "0.85rem" }}>({currentMetric.secondaryText})</span>
              </div>
              <div className="x-axis" style={{ display: "flex", gap: "1rem", color: "#94A3B8", fontSize: "0.75rem" }}>
                {xAxisLabels.map((lbl, idx) => <span key={idx}>{lbl}</span>)}
              </div>
            </div>
          </div>
          <div className="card chart-card channel-mix-card" style={{ padding: "1.75rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.25rem" }}>
              <div>
                <h3 style={{ margin: "0 0 0.35rem 0", fontSize: "1.15rem", color: "var(--loyum-navy)" }}>Channel mix</h3>
                <p className="section-desc" style={{ margin: 0 }}>Attributed conversions by channel</p>
              </div>
              {channel !== 'all' && (
                <button 
                  onClick={() => setChannel('all')}
                  style={{
                    fontSize: '0.72rem',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: 'var(--loyum-sand-soft)',
                    border: '1px solid var(--loyum-sand-border)',
                    color: 'var(--loyum-navy)',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  View All
                </button>
              )}
            </div>

            {/* Modern Interactive LOYUM Donut Chart */}
            <div className="donut-chart-container">
              <div className="donut-svg-wrapper">
                <svg viewBox="0 0 200 200" className="donut-svg">
                  <defs>
                    <linearGradient id="loyumPushGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00122B" />
                      <stop offset="100%" stopColor="#0A2E63" />
                    </linearGradient>
                    <linearGradient id="loyumSmsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F2B12F" />
                      <stop offset="100%" stopColor="#E5A31E" />
                    </linearGradient>
                    <linearGradient id="loyumAdGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3D1C1C" />
                      <stop offset="100%" stopColor="#7A3E3E" />
                    </linearGradient>
                    <filter id="donutGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#001F46" floodOpacity="0.25"/>
                    </filter>
                  </defs>

                  {/* Base Track */}
                  <circle
                    cx="100"
                    cy="100"
                    r="72"
                    fill="none"
                    stroke="#F1F5F9"
                    strokeWidth="16"
                  />

                  {/* Slice 1: Push Notifications (#001F46 Bleu Marine) */}
                  <circle
                    cx="100"
                    cy="100"
                    r="72"
                    fill="none"
                    stroke="url(#loyumPushGrad)"
                    strokeWidth={hoveredChannel === 'push' || channel === 'push' ? "22" : "16"}
                    strokeDasharray={`${Math.max(0, (pushPct / 100) * 452.39 - 5)} 452.39`}
                    strokeDashoffset="0"
                    className="donut-slice"
                    style={{
                      opacity: channel === 'all' || channel === 'push' || hoveredChannel === 'push' ? 1 : 0.35,
                      filter: hoveredChannel === 'push' || channel === 'push' ? 'url(#donutGlow)' : 'none'
                    }}
                    onMouseEnter={() => setHoveredChannel('push')}
                    onMouseLeave={() => setHoveredChannel(null)}
                    onClick={() => setChannel(channel === 'push' ? 'all' : 'push')}
                  />

                  {/* Slice 2: SMS Gateway (#F2B12F Orange Doré) */}
                  <circle
                    cx="100"
                    cy="100"
                    r="72"
                    fill="none"
                    stroke="url(#loyumSmsGrad)"
                    strokeWidth={hoveredChannel === 'sms' || channel === 'sms' ? "22" : "16"}
                    strokeDasharray={`${Math.max(0, (smsPct / 100) * 452.39 - 5)} 452.39`}
                    strokeDashoffset={`${-((pushPct / 100) * 452.39)}`}
                    className="donut-slice"
                    style={{
                      opacity: channel === 'all' || channel === 'sms' || hoveredChannel === 'sms' ? 1 : 0.35,
                      filter: hoveredChannel === 'sms' || channel === 'sms' ? 'url(#donutGlow)' : 'none'
                    }}
                    onMouseEnter={() => setHoveredChannel('sms')}
                    onMouseLeave={() => setHoveredChannel(null)}
                    onClick={() => setChannel(channel === 'sms' ? 'all' : 'sms')}
                  />

                  {/* Slice 3: In-Store & Ads (#562C2C Brun Profond) */}
                  <circle
                    cx="100"
                    cy="100"
                    r="72"
                    fill="none"
                    stroke="url(#loyumAdGrad)"
                    strokeWidth={hoveredChannel === 'ad' || channel === 'ad' ? "22" : "16"}
                    strokeDasharray={`${Math.max(0, (adPct / 100) * 452.39 - 5)} 452.39`}
                    strokeDashoffset={`${-(((pushPct + smsPct) / 100) * 452.39)}`}
                    className="donut-slice"
                    style={{
                      opacity: channel === 'all' || channel === 'ad' || hoveredChannel === 'ad' ? 1 : 0.35,
                      filter: hoveredChannel === 'ad' || channel === 'ad' ? 'url(#donutGlow)' : 'none'
                    }}
                    onMouseEnter={() => setHoveredChannel('ad')}
                    onMouseLeave={() => setHoveredChannel(null)}
                    onClick={() => setChannel(channel === 'ad' ? 'all' : 'ad')}
                  />
                </svg>

                {/* Center Stats Display */}
                <div className="donut-center-info">
                  {(!hoveredChannel && channel === 'all') && (
                    <>
                      <span className="donut-center-pct">{data.conversions || '434'}</span>
                      <span className="donut-center-label">Total Conversions</span>
                      <span className="donut-center-sub">3 Channels Active</span>
                    </>
                  )}
                  {(hoveredChannel === 'push' || (channel === 'push' && !hoveredChannel)) && (
                    <>
                      <span className="donut-center-pct" style={{ color: "var(--loyum-navy)" }}>{pushPct}%</span>
                      <span className="donut-center-label">Push Alerts</span>
                      <span className="donut-center-sub">{Math.round(parseInt(String(data.conversions || '434').replace(/[^0-9]/g, '')) * (pushPct / 100))} Conv.</span>
                    </>
                  )}
                  {(hoveredChannel === 'sms' || (channel === 'sms' && !hoveredChannel)) && (
                    <>
                      <span className="donut-center-pct" style={{ color: "var(--loyum-gold)" }}>{smsPct}%</span>
                      <span className="donut-center-label">SMS Direct</span>
                      <span className="donut-center-sub">{Math.round(parseInt(String(data.conversions || '434').replace(/[^0-9]/g, '')) * (smsPct / 100))} Conv.</span>
                    </>
                  )}
                  {(hoveredChannel === 'ad' || (channel === 'ad' && !hoveredChannel)) && (
                    <>
                      <span className="donut-center-pct" style={{ color: "var(--loyum-brown)" }}>{adPct}%</span>
                      <span className="donut-center-label">Ads & POS</span>
                      <span className="donut-center-sub">{Math.round(parseInt(String(data.conversions || '434').replace(/[^0-9]/g, '')) * (adPct / 100))} Conv.</span>
                    </>
                  )}
                </div>
              </div>

              {/* Enhanced Interactive Channel Mix List */}
              <div className="channel-mix-list">
                {/* Push Row */}
                <div 
                  className={`channel-mix-item ${channel === 'push' ? 'active' : ''}`}
                  onClick={() => setChannel(channel === 'push' ? 'all' : 'push')}
                  onMouseEnter={() => setHoveredChannel('push')}
                  onMouseLeave={() => setHoveredChannel(null)}
                >
                  <div className="channel-mix-item-header">
                    <span className="channel-mix-item-title">
                      <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--loyum-navy)", display: "inline-block" }}></span>
                      Push Notifications
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "0.78rem", color: "var(--loyum-text-muted)" }}>
                        {Math.round(parseInt(String(data.conversions || '434').replace(/[^0-9]/g, '')) * (pushPct / 100))} conv.
                      </span>
                      <span style={{ fontWeight: 800, fontSize: "0.85rem", color: "var(--loyum-navy)" }}>{pushPct}%</span>
                    </div>
                  </div>
                  <div className="channel-mix-bar-bg">
                    <div className="channel-mix-bar-fill" style={{ width: `${pushPct}%`, background: "linear-gradient(90deg, #00122B, #0A2E63)" }}></div>
                  </div>
                </div>

                {/* SMS Row */}
                <div 
                  className={`channel-mix-item ${channel === 'sms' ? 'active' : ''}`}
                  onClick={() => setChannel(channel === 'sms' ? 'all' : 'sms')}
                  onMouseEnter={() => setHoveredChannel('sms')}
                  onMouseLeave={() => setHoveredChannel(null)}
                >
                  <div className="channel-mix-item-header">
                    <span className="channel-mix-item-title">
                      <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--loyum-gold)", display: "inline-block" }}></span>
                      SMS Gateway
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "0.78rem", color: "var(--loyum-text-muted)" }}>
                        {Math.round(parseInt(String(data.conversions || '434').replace(/[^0-9]/g, '')) * (smsPct / 100))} conv.
                      </span>
                      <span style={{ fontWeight: 800, fontSize: "0.85rem", color: "var(--loyum-gold)" }}>{smsPct}%</span>
                    </div>
                  </div>
                  <div className="channel-mix-bar-bg">
                    <div className="channel-mix-bar-fill" style={{ width: `${smsPct}%`, background: "linear-gradient(90deg, #E5A31E, #F2B12F)" }}></div>
                  </div>
                </div>

                {/* Ad Row */}
                <div 
                  className={`channel-mix-item ${channel === 'ad' ? 'active' : ''}`}
                  onClick={() => setChannel(channel === 'ad' ? 'all' : 'ad')}
                  onMouseEnter={() => setHoveredChannel('ad')}
                  onMouseLeave={() => setHoveredChannel(null)}
                >
                  <div className="channel-mix-item-header">
                    <span className="channel-mix-item-title">
                      <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--loyum-brown)", display: "inline-block" }}></span>
                      In-Store & Digital Ads
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "0.78rem", color: "var(--loyum-text-muted)" }}>
                        {Math.round(parseInt(String(data.conversions || '434').replace(/[^0-9]/g, '')) * (adPct / 100))} conv.
                      </span>
                      <span style={{ fontWeight: 800, fontSize: "0.85rem", color: "var(--loyum-brown)" }}>{adPct}%</span>
                    </div>
                  </div>
                  <div className="channel-mix-bar-bg">
                    <div className="channel-mix-bar-fill" style={{ width: `${adPct}%`, background: "linear-gradient(90deg, #3D1C1C, #7A3E3E)" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="card">
          <h3>Execution log</h3>
          <p className="section-desc">Recent activity recorded for this campaign</p>
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
              {(!data.logs || data.logs.length === 0) ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: '#64748B', padding: '1.5rem' }}>
                    No recent executions logged yet.
                  </td>
                </tr>
              ) : (
                data.logs.map((log, i) => (
                  <tr key={i}>
                    <td>{log.timestamp}</td>
                    <td>{log.trigger}</td>
                    <td>{log.channel}</td>
                    <td><span className={`status-badge ${log.class || 'active'}`}>{log.status}</span></td>
                    <td style={{ textAlign: "right" }}>{log.value && log.value.includes('€') ? <strong>{log.value}</strong> : log.value}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}