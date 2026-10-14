import React, { useState, useEffect } from 'react';
import './index.css';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import Overview from './pages/Overview';
import Campaigns from './pages/Campaigns';
import Analytics from './pages/Analytics';
import Gamification from './pages/Gamification';
import EventStream from './pages/EventStream';
import Automations from './pages/Automations';

export default function Dashboard({ token, onLogout }) {
  const [activeTab, setactiveTab] = useState('overview');
  // activeSubPage = 'list' | 'create' | 'details'
  const [activeSubPage, setactiveSubPage] = useState('list');

  const [campaigns, setCampaigns] = useState([]);
  const [newCampaignName, setNewCampaignName] = useState('Weekend comeback');

  useEffect(() => {
    if (activeTab === 'campaigns') {
      fetch('/api/v1/campaigns/', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setCampaigns(data.map(c => ({
              id: c.id,
              name: c.name,
              status: c.status || 'Draft',
              channel: 'Push + SMS',
              audience: 'All customers',
              performance: 'Not started',
              budget: `€0 / €${c.budget_cap}`,
              lastUpdated: 'Today'
            })));
          }
        })
        .catch(err => console.error(err));
    }
  }, [activeTab, activeSubPage, token]);

  const handleCreateCampaign = () => {
    fetch('/api/v1/campaigns/', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: newCampaignName,
        targeting_criteria: { audience: "All customers" },
        schedule: { type: "Run continuously" },
        budget_cap: 1000,
        reward_cap: 500
      })
    })
      .then(res => res.json())
      .then(() => {
        setactiveSubPage("list");
      })
      .catch(err => console.error(err));
  };

  const [automations] = useState([
    { id: 1, name: 'Welcome series', trigger: 'New customer signup', audience: 'First-time customers', performance: '1,248 sent · 24.8% CTR', status: 'Active', lastUpdated: 'Today' },
    { id: 2, name: 'Win-back after 30 days', trigger: 'Customer inactivity', audience: 'Lapsed customers', performance: '864 sent · 16.2% CTR', status: 'Active', lastUpdated: 'Yesterday' },
    { id: 3, name: 'VIP birthday reward', trigger: 'Customer birthday', audience: 'VIP members', performance: '96 sent · 41.7% CTR', status: 'Active', lastUpdated: '3 days ago' },
    { id: 4, name: 'Post-purchase thank you', trigger: 'Order completed', audience: 'All customers', performance: '2,104 sent · 19.4% CTR', status: 'Active', lastUpdated: '5 days ago' },
    { id: 5, name: 'Weekend comeback', trigger: 'Friday at 18:00', audience: 'Engaged customers', performance: 'Draft', status: 'Draft', lastUpdated: 'Edited 12 min ago' }
  ]);

  const [events] = useState([
    { time: '14:32:06', event: 'customer.purchase.recorded', rule: 'Purchase threshold matched', dispatch: 'Push sent', status: 'Delivered', class: 'purple' },
    { time: '14:32:05', event: 'campaign.dispatch.command', rule: 'Weekend comeback', dispatch: 'Push adapter', status: 'Delivered', class: 'blue' },
    { time: '14:31:58', event: 'customer.inactivity.detected', rule: 'No matching rule', dispatch: '—', status: 'Ignored', class: 'yellow' },
    { time: '14:30:44', event: 'customer.purchase.recorded', rule: 'Spin & save matched', dispatch: 'Game adapter', status: 'Delivered', class: 'purple' },
    { time: '14:29:18', event: 'campaign.execution.recorded', rule: 'Weekend comeback', dispatch: 'Analytics consumer', status: 'Recorded', class: 'blue' },
  ]);

  return (
    <div className="app-layout">
      <Sidebar activeTab={activeTab} setactiveTab={setactiveTab} setactiveSubPage={setactiveSubPage} />
      <div className="main-content">
        <Topbar activeTab={activeTab} activeSubPage={activeSubPage} onLogout={onLogout} />

        {activeTab === "overview" && (
          <Overview 
            setactiveTab={setactiveTab} 
            setactiveSubPage={setactiveSubPage} 
            token={token}
          />
        )}

        {activeTab === "campaigns" && (
          <Campaigns 
            activeSubPage={activeSubPage} 
            setactiveSubPage={setactiveSubPage} 
            setactiveTab={setactiveTab} 
            campaigns={campaigns} 
            newCampaignName={newCampaignName} 
            setNewCampaignName={setNewCampaignName} 
            handleCreateCampaign={handleCreateCampaign} 
          />
        )}

        {activeTab === "analytics" && (
          <Analytics 
            activeSubPage={activeSubPage} 
            setactiveSubPage={setactiveSubPage} 
            setactiveTab={setactiveTab} 
            token={token}
          />
        )}

        {activeTab === "event-stream" && (
          <EventStream events={events} token={token} />
        )}

        {activeTab === "gamification" && (
          <Gamification activeSubPage={activeSubPage} token={token} />
        )}

        {activeTab === "automations" && (
          <Automations automations={automations} token={token} />
        )}
      </div>
    </div>
  );
}
