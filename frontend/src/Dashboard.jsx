import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './index.css';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import Overview from './pages/Overview';
import Campaigns from './pages/Campaigns';
import Analytics from './pages/Analytics';
import Gamification from './pages/Gamification';
import EventStream from './pages/EventStream';
import Automations from './pages/Automations';
import Settings from './pages/Settings';
import Banners from './pages/Banners';

export default function Dashboard({ token, onLogout }) {
  const [storeName, setStoreName] = useState('Maison Lune - Paris');
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [newCampaignName, setNewCampaignName] = useState('Weekend comeback');
  const navigate = useNavigate();

  const fetchCampaigns = () => {
    fetch('/api/v1/campaigns/', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (res.status === 401 && onLogout) {
          onLogout();
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          const mapped = data.map(c => ({
            id: c.id,
            name: c.name,
            status: c.status || 'Draft',
            channel: 'Push + SMS',
            audience: 'All customers',
            performance: c.status === 'Active' ? '82% reached' : 'Not started',
            budget: `€0 / €${c.budget_cap ?? 0}`,
            budget_cap: c.budget_cap ?? 0,
            reward_cap: c.reward_cap ?? 0,
            lastUpdated: 'Today'
          }));
          setCampaigns(mapped);
          if (mapped.length > 0 && !selectedCampaign) {
            setSelectedCampaign(mapped[0]);
          }
        }
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchCampaigns();
    // Load store name from settings
    fetch('/api/v1/settings/', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (res.status === 401 && onLogout) {
          onLogout();
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data && data.store_name) {
          setStoreName(data.store_name);
        }
      })
      .catch(err => console.error(err));
  }, [token]);

  const handleCreateCampaign = (customData = {}) => {
    const payload = {
      name: customData.name || newCampaignName,
      targeting_criteria: customData.targeting_criteria || { audience: "All customers" },
      schedule: customData.schedule || { type: "Run continuously" },
      budget_cap: customData.budget_cap ? parseFloat(customData.budget_cap) : 1000,
      reward_cap: customData.reward_cap ? parseInt(customData.reward_cap) : 500
    };

    fetch('/api/v1/campaigns/', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(newCamp => {
        fetchCampaigns();
        if (newCamp && newCamp.id) {
          setSelectedCampaign({
            id: newCamp.id,
            name: newCamp.name,
            status: newCamp.status || 'Draft',
            budget_cap: newCamp.budget_cap ?? 1000,
            reward_cap: newCamp.reward_cap ?? 500
          });
        }
        navigate('/campaigns');
      })
      .catch(err => console.error(err));
  };

  const handleSelectCampaign = (c) => {
    setSelectedCampaign(c);
    navigate(`/campaigns/${c.id}/analytics`);
  };

  return (
    <div className="app-layout">
      <Sidebar storeName={storeName} />
      <div className="main-content">
        <Topbar 
          onLogout={onLogout} 
          selectedCampaign={selectedCampaign}
        />

        <Routes>
          <Route path="/" element={<Navigate to="/overview" replace />} />
          <Route 
            path="/overview" 
            element={<Overview token={token} />} 
          />
          <Route 
            path="/campaigns" 
            element={
              <Campaigns 
                activeSubPage="list" 
                campaigns={campaigns} 
                newCampaignName={newCampaignName} 
                setNewCampaignName={setNewCampaignName} 
                handleCreateCampaign={handleCreateCampaign} 
                onSelectCampaign={handleSelectCampaign}
                token={token}
                onRefreshCampaigns={fetchCampaigns}
              />
            } 
          />
          <Route 
            path="/campaigns/create" 
            element={
              <Campaigns 
                activeSubPage="create" 
                campaigns={campaigns} 
                newCampaignName={newCampaignName} 
                setNewCampaignName={setNewCampaignName} 
                handleCreateCampaign={handleCreateCampaign} 
                onSelectCampaign={handleSelectCampaign}
                token={token}
                onRefreshCampaigns={fetchCampaigns}
              />
            } 
          />
          <Route 
            path="/campaigns/:id/analytics" 
            element={
              <Analytics 
                activeSubPage="details" 
                token={token}
                selectedCampaign={selectedCampaign}
                onCampaignUpdated={fetchCampaigns}
                campaigns={campaigns}
              />
            } 
          />
          <Route 
            path="/analytics" 
            element={
              <Analytics 
                activeSubPage="details" 
                token={token}
                selectedCampaign={selectedCampaign}
                onCampaignUpdated={fetchCampaigns}
                campaigns={campaigns}
              />
            } 
          />
          <Route 
            path="/automations" 
            element={
              <Automations 
                token={token} 
                campaigns={campaigns}
              />
            } 
          />
          <Route 
            path="/gamification" 
            element={
              <Gamification 
                activeSubPage="list" 
                token={token} 
                campaigns={campaigns}
              />
            } 
          />
          <Route 
            path="/event-stream" 
            element={
              <EventStream token={token} />
            } 
          />
          <Route 
            path="/banners" 
            element={
              <Banners token={token} campaigns={campaigns} />
            } 
          />
          <Route 
            path="/settings" 
            element={
              <Settings 
                token={token} 
                onUpdateStoreName={setStoreName} 
              />
            } 
          />
          <Route path="*" element={<Navigate to="/overview" replace />} />
        </Routes>
      </div>
    </div>
  );
}
