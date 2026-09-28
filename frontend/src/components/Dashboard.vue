<script setup>
import { ref } from 'vue'

const activeTab = ref('overview')
// activeSubPage = 'list' | 'create' | 'analytics'
const activeSubPage = ref('list')

const campaigns = ref([
  { id: 1, name: 'Weekend comeback', status: 'Active', channel: 'Push + SMS', audience: 'Lapsed customers', performance: '8.2% conversion', budget: '€820 / €1,000', lastUpdated: 'Today' },
  { id: 2, name: 'Spin & save', status: 'Active', channel: 'Game', audience: 'Loyalty members', performance: '31% play rate', budget: '€1,220 / €2,000', lastUpdated: 'Yesterday' },
  { id: 3, name: 'Summer launch', status: 'Scheduled', channel: 'Ad + Push', audience: 'All customers', performance: 'Not started', budget: '€0 / €4,000', lastUpdated: 'Jun 24' },
  { id: 4, name: 'VIP birthday reward', status: 'Draft', channel: 'SMS', audience: 'VIP customers', performance: 'Not started', budget: '€0 / €500', lastUpdated: 'Jun 18' },
  { id: 5, name: 'Win-back: 30 day lapse', status: 'Paused', channel: 'SMS', audience: 'Inactive 30d+', performance: '4.8% conversion', budget: '€340 / €1,000', lastUpdated: 'Jun 12' },
])
const automations = ref([
  { id: 1, name: 'Welcome series', trigger: 'New customer signup', audience: 'First-time customers', performance: '1,248 sent · 24.8% CTR', status: 'Active', lastUpdated: 'Today' },
  { id: 2, name: 'Win-back after 30 days', trigger: 'Customer inactivity', audience: 'Lapsed customers', performance: '864 sent · 16.2% CTR', status: 'Active', lastUpdated: 'Yesterday' },
  { id: 3, name: 'VIP birthday reward', trigger: 'Customer birthday', audience: 'VIP members', performance: '96 sent · 41.7% CTR', status: 'Active', lastUpdated: '3 days ago' },
  { id: 4, name: 'Post-purchase thank you', trigger: 'Order completed', audience: 'All customers', performance: '2,104 sent · 19.4% CTR', status: 'Active', lastUpdated: '5 days ago' },
  { id: 5, name: 'Weekend comeback', trigger: 'Friday at 18:00', audience: 'Engaged customers', performance: 'Draft', status: 'Draft', lastUpdated: 'Edited 12 min ago' }
])

const events = ref([
  { time: '14:32:06', event: 'customer.purchase.recorded', rule: 'Purchase threshold matched', dispatch: 'Push sent', status: 'Delivered', class: 'purple' },
  { time: '14:32:05', event: 'campaign.dispatch.command', rule: 'Weekend comeback', dispatch: 'Push adapter', status: 'Delivered', class: 'blue' },
  { time: '14:31:58', event: 'customer.inactivity.detected', rule: 'No matching rule', dispatch: '—', status: 'Ignored', class: 'yellow' },
  { time: '14:30:44', event: 'customer.purchase.recorded', rule: 'Spin & save matched', dispatch: 'Game adapter', status: 'Delivered', class: 'purple' },
  { time: '14:29:18', event: 'campaign.execution.recorded', rule: 'Weekend comeback', dispatch: 'Analytics consumer', status: 'Recorded', class: 'blue' },
])
</script>

<template>
  <div class="app-layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2 class="logo">Loyum</h2>
        <div class="account-selector">
          <div class="account-info">
            <span class="account-name">Maison Lune - Paris</span>
            <span class="account-role">Merchant account</span>
          </div>
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="chevron-icon"><polyline points="8 17 12 21 16 17"></polyline><polyline points="8 7 12 3 16 7"></polyline></svg>
        </div>
      </div>
      
      <nav class="nav-menu">
        <button :class="{ active: activeTab === 'overview' }" @click="activeTab = 'overview'">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          Overview
        </button>
        <button :class="{ active: activeTab === 'campaigns' }" @click="activeTab = 'campaigns'; activeSubPage = 'list'">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          Campaigns
        </button>
        <button :class="{ active: activeTab === 'automations' }" @click="activeTab = 'automations'">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          Automations
        </button>
        <button :class="{ active: activeTab === 'gamification' }" @click="activeTab = 'gamification'; activeSubPage = 'list'">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          Gamification
        </button>
        <button :class="{ active: activeTab === 'analytics' }" @click="activeTab = 'analytics'; activeSubPage = 'details'">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
          Analytics
        </button>
        <button :class="{ active: activeTab === 'event-stream' }" @click="activeTab = 'event-stream'">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
          Event stream
        </button>
        <button :class="{ active: activeTab === 'settings' }" @click="activeTab = 'settings'">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          Settings
        </button>
      </nav>

      <div class="sidebar-footer">
        <button class="help-btn">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          Help
        </button>
      </div>
    </aside>

    <div class="main-content">
      <header class="topbar">
        <div class="breadcrumbs">
          Merchant marketing <span class="separator">></span> 
          <span v-if="activeTab === 'campaigns' && activeSubPage === 'create'">Campaigns <span class="separator">></span> New campaign</span>
          <span v-else-if="activeTab === 'gamification' && activeSubPage === 'create'">Gamification <span class="separator">></span> Spin & save</span>
          <span v-else-if="activeTab === 'analytics' && activeSubPage === 'details'">Analytics <span class="separator">></span> Weekend comeback</span>
          <span v-else>{{ activeTab.charAt(0).toUpperCase() + activeTab.slice(1) }}</span>
        </div>
        <div class="topbar-actions">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="#64748B" stroke-width="2" fill="none" class="action-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="#64748B" stroke-width="2" fill="none" class="action-icon"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          <div class="avatar">ML</div>
        </div>
      </header>

      <!-- OVERVIEW TAB -->
      <main v-if="activeTab === 'overview'" class="page-content fade-in">
        <div class="page-header" style="margin-bottom: 1.5rem">
          <div>
            <h1 class="page-title">Good morning, Marie</h1>
            <p class="page-subtitle">Here's what's happening across your campaigns today.</p>
          </div>
          <button class="btn-primary" @click="activeTab = 'campaigns'; activeSubPage = 'create'">+ Create campaign</button>
        </div>

        <div class="stats-cards" style="grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: 1.5rem;">
          <div class="stat-card" style="padding: 1.5rem;">
            <div class="stat-label">Active campaigns</div>
            <div class="stat-value" style="font-size: 2rem;">6</div>
            <div class="stat-trend positive">+2 this month</div>
          </div>
          <div class="stat-card" style="padding: 1.5rem;">
            <div class="stat-label">Audience reached</div>
            <div class="stat-value" style="font-size: 2rem;">24,860</div>
            <div class="stat-trend positive">+18.4%</div>
          </div>
          <div class="stat-card" style="padding: 1.5rem;">
            <div class="stat-label">Conversions</div>
            <div class="stat-value" style="font-size: 2rem;">1,284</div>
            <div class="stat-trend positive">+12.8%</div>
          </div>
          <div class="stat-card" style="padding: 1.5rem;">
            <div class="stat-label">Rewards issued</div>
            <div class="stat-value" style="font-size: 2rem;">€3,940</div>
            <div class="stat-desc">68% of cap</div>
          </div>
        </div>

        <div class="charts-grid" style="grid-template-columns: 2fr 1fr; margin-bottom: 1.5rem;">
          <div class="card chart-card large" style="padding: 1.5rem; display: flex; flex-direction: column;">
            <h3 style="margin:0 0 0.75rem 0; font-size: 1.1rem;">Performance overview</h3>
            <div style="display: flex; gap: 8px; margin-bottom: 1rem;">
              <button class="btn-secondary active" style="padding: 0.3rem 0.8rem; border-radius: 6px; font-size: 0.8rem; background: #F1F5F9; border:none; box-shadow:none; color: #0F172A; font-weight: 600;">Reach</button>
              <button class="btn-secondary" style="padding: 0.3rem 0.8rem; border-radius: 6px; font-size: 0.8rem; border:none; box-shadow:none; color: #64748B; background: #F8FAFC; font-weight: 500;">Conversions</button>
              <button class="btn-secondary" style="padding: 0.3rem 0.8rem; border-radius: 6px; font-size: 0.8rem; border:none; box-shadow:none; color: #64748B; background: #F8FAFC; font-weight: 500;">Revenue</button>
            </div>
            
            <div class="chart-placeholder line-chart" style="flex: 1; position: relative; min-height: 180px; margin-top: 1rem;">
              <svg width="100%" height="100%" viewBox="0 0 500 200" preserveAspectRatio="none" style="position: absolute; bottom: 0; left: 0; width: 100%; height: 100%; z-index: 2;">
                <!-- A single purple line trending up -->
                <path d="M0,170 L40,165 L80,170 L120,150 L160,155 L200,135 L240,145 L280,130 L320,138 L360,118 L400,125 L440,105 L480,110 L500,80" stroke="#6366F1" stroke-width="3" fill="none"/>
                <circle cx="500" cy="80" r="4" fill="#6366F1" />
              </svg>
              <!-- Horizontal grid lines mock -->
              <div style="position: absolute; top: 0; width: 100%; height: 1px; background: #F1F5F9; z-index: 1;"></div>
              <div style="position: absolute; top: 25%; width: 100%; height: 1px; background: #F1F5F9; z-index: 1;"></div>
              <div style="position: absolute; top: 50%; width: 100%; height: 1px; background: #F1F5F9; z-index: 1;"></div>
              <div style="position: absolute; top: 75%; width: 100%; height: 1px; background: #F1F5F9; z-index: 1;"></div>
              <div style="position: absolute; top: 100%; width: 100%; height: 1px; background: #F1F5F9; z-index: 1;"></div>
            </div>
            <div class="legend" style="margin-top: 1.5rem; align-items: center; color: #475569;"><span class="dot purple"></span> €18,420 attributed revenue <span style="margin-left: 1.5rem; display: flex; align-items: center; gap: 4px;"><svg viewBox="0 0 24 24" width="14" height="14" stroke="#64748B" stroke-width="2" fill="none"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg> 7.4% conversion rate</span></div>
          </div>
          
          <div class="card chart-card" style="padding: 1.5rem;">
            <h3 style="margin:0; font-size: 1.1rem;">Campaign health</h3>
            <div class="health-list" style="margin-top: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 1rem; border-bottom: 1px solid #F1F5F9;">
                <div>
                  <div style="font-weight: 600; font-size: 0.9rem; color: #0F172A;">Weekend comeback</div>
                  <div style="color: #64748B; font-size: 0.8rem; margin-top: 4px;">82% budget used</div>
                </div>
                <span class="status-badge active" style="font-size: 0.7rem; padding: 0.15rem 0.5rem;">Active</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 1rem; border-bottom: 1px solid #F1F5F9;">
                <div>
                  <div style="font-weight: 600; font-size: 0.9rem; color: #0F172A;">Spin & save</div>
                  <div style="color: #64748B; font-size: 0.8rem; margin-top: 4px;">61% rewards used</div>
                </div>
                <span class="status-badge active" style="font-size: 0.7rem; padding: 0.15rem 0.5rem;">Active</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-weight: 600; font-size: 0.9rem; color: #0F172A;">Summer launch</div>
                  <div style="color: #64748B; font-size: 0.8rem; margin-top: 4px;">Starts Jun 24</div>
                </div>
                <span class="status-badge gray" style="font-size: 0.7rem; padding: 0.15rem 0.5rem; background: #F8FAFC;">Scheduled</span>
              </div>
            </div>
          </div>
        </div>

        <div class="card" style="padding: 1.5rem;">
          <h3 style="margin:0; font-size: 1.1rem;">Recent activity</h3>
          <table class="data-table clean" style="margin-top: 1rem; width: 100%;">
            <thead>
              <tr>
                <th style="padding: 0.75rem 0; font-size: 0.7rem; color: #64748B; border-bottom: 1px solid #E2E8F0;">EVENT</th>
                <th style="padding: 0.75rem 0; font-size: 0.7rem; color: #64748B; border-bottom: 1px solid #E2E8F0;">CHANNEL</th>
                <th style="padding: 0.75rem 0; font-size: 0.7rem; color: #64748B; border-bottom: 1px solid #E2E8F0;">STATUS</th>
                <th style="padding: 0.75rem 0; font-size: 0.7rem; color: #64748B; border-bottom: 1px solid #E2E8F0; text-align: right;">TIMESTAMP</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 1rem 0; font-weight: 500; color: #0F172A; font-size: 0.85rem; border-bottom: 1px solid #F8FAFC;">Purchase threshold matched</td>
                <td style="padding: 1rem 0; font-size: 0.85rem; color: #475569; border-bottom: 1px solid #F8FAFC;">Push</td>
                <td style="padding: 1rem 0; border-bottom: 1px solid #F8FAFC;"><span class="status-badge active" style="font-size: 0.7rem; padding: 0.15rem 0.5rem;">Delivered</span></td>
                <td style="padding: 1rem 0; font-size: 0.8rem; color: #64748B; text-align: right; border-bottom: 1px solid #F8FAFC;">2 min ago</td>
              </tr>
              <tr>
                <td style="padding: 1rem 0; font-weight: 500; color: #0F172A; font-size: 0.85rem; border-bottom: 1px solid #F8FAFC;">Spin & save reward issued</td>
                <td style="padding: 1rem 0; font-size: 0.85rem; color: #475569; border-bottom: 1px solid #F8FAFC;">Game</td>
                <td style="padding: 1rem 0; border-bottom: 1px solid #F8FAFC;"><span class="status-badge active" style="font-size: 0.7rem; padding: 0.15rem 0.5rem;">Converted</span></td>
                <td style="padding: 1rem 0; font-size: 0.8rem; color: #64748B; text-align: right; border-bottom: 1px solid #F8FAFC;">8 min ago</td>
              </tr>
              <tr>
                <td style="padding: 1rem 0; font-weight: 500; color: #0F172A; font-size: 0.85rem; border-bottom: none;">Inactive customer re-engaged</td>
                <td style="padding: 1rem 0; font-size: 0.85rem; color: #475569; border-bottom: none;">SMS</td>
                <td style="padding: 1rem 0; border-bottom: none;"><span class="status-badge active" style="font-size: 0.7rem; padding: 0.15rem 0.5rem;">Delivered</span></td>
                <td style="padding: 1rem 0; font-size: 0.8rem; color: #64748B; text-align: right; border-bottom: none;">14 min ago</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>

      <!-- CAMPAIGNS TAB -->
      <main v-if="activeTab === 'campaigns'" class="page-content fade-in">
        <div v-if="activeSubPage === 'list'">
          <div class="page-header">
            <div>
              <h1 class="page-title">Campaigns</h1>
              <p class="page-subtitle">Create, automate, and measure every customer moment.</p>
            </div>
            <button class="btn-primary" @click="activeSubPage = 'create'">+ Create campaign</button>
          </div>

          <div class="filter-bar">
            <span class="status-summary">All 12 Active 6 Scheduled 3 Draft 2 Paused 1</span>
            <div class="search-box">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="#94A3B8" stroke-width="2" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" placeholder="Search campaigns" />
            </div>
          </div>

          <div class="data-table-container">
            <table class="data-table">
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
                <tr v-for="c in campaigns" :key="c.id" @click="activeTab='analytics'; activeSubPage='details'" class="clickable-row">
                  <td class="primary-col">{{ c.name }}</td>
                  <td><span :class="['status-badge', c.status.toLowerCase()]">{{ c.status }}</span></td>
                  <td>{{ c.channel }}</td>
                  <td>{{ c.audience }}</td>
                  <td>{{ c.performance }}</td>
                  <td>{{ c.budget }}</td>
                  <td>{{ c.lastUpdated }}</td>
                  <td><button class="more-btn">•••</button></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="table-footer-note">Budgets and reward caps are enforced transactionally.</p>
        </div>

        <div v-else-if="activeSubPage === 'create'" class="create-wizard fade-in">
           <h1 class="page-title">Create campaign</h1>
           <p class="page-subtitle">Build a campaign that brings your customers back.</p>

           <div class="stepper">
              <div class="step active"><div class="step-num">1</div> Details</div>
              <div class="step-line"></div>
              <div class="step"><div class="step-num">2</div> Audience</div>
              <div class="step-line"></div>
              <div class="step"><div class="step-num">3</div> Trigger & action</div>
              <div class="step-line"></div>
              <div class="step"><div class="step-num">4</div> Budget</div>
              <div class="step-line"></div>
              <div class="step"><div class="step-num">5</div> Review</div>
           </div>

           <div class="wizard-content">
             <div class="wizard-form card">
               <h2>Bring customers back</h2>
               <p class="section-desc">Set the goal and basic details for this campaign.</p>

               <div class="form-group">
                 <label>Campaign name</label>
                 <input type="text" value="Weekend comeback" class="input" />
               </div>

               <div class="form-group">
                 <label>Objective</label>
                 <select class="input"><option>Increase repeat visits</option></select>
               </div>

               <div class="form-group">
                 <label>Description</label>
                 <textarea class="input" rows="3">A gentle reminder for customers who have not visited in 30 days.</textarea>
               </div>

               <div class="form-group">
                 <label>Channels</label>
                 <div class="channels-grid">
                   <div class="channel-card selected">
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                      <h4>Push</h4>
                      <p>Mobile notifications</p>
                   </div>
                   <div class="channel-card">
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                      <h4>SMS</h4>
                      <p>Direct messages</p>
                   </div>
                   <div class="channel-card">
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                      <h4>Ad</h4>
                      <p>Digital banners</p>
                   </div>
                   <div class="channel-card">
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><rect x="2" y="6" width="20" height="12" rx="2" ry="2"></rect><path d="M12 12h.01"></path><path d="M17 12h.01"></path><path d="M7 12h.01"></path></svg>
                      <h4>Game</h4>
                      <p>Interactive play</p>
                   </div>
                 </div>
               </div>

               <div class="form-group">
                 <label>Schedule</label>
                 <div class="radio-group">
                   <label class="radio-label selected"><input type="radio" checked /> Run continuously</label>
                   <label class="radio-label"><input type="radio" /> Set an end date</label>
                 </div>
               </div>

               <div class="form-actions">
                 <button class="btn-secondary" @click="activeSubPage = 'list'">Save draft</button>
                 <button class="btn-primary" @click="activeSubPage = 'list'">Continue to audience &rarr;</button>
               </div>
             </div>

             <div class="wizard-summary">
               <div class="card summary-card">
                 <h3>Campaign summary</h3>
                 <p class="section-desc">Review your campaign setup.</p>
                 <div class="summary-list">
                   <div class="summary-item"><span>Status</span> <strong>Draft</strong></div>
                   <div class="summary-item"><span>Objective</span> <strong>Increase repeat visits</strong></div>
                   <div class="summary-item"><span>Channels</span> <strong>2 channels</strong></div>
                 </div>
                 <p class="next-step-hint">Next: define who should receive this campaign.</p>
               </div>
             </div>
           </div>
        </div>
      </main>

      <!-- ANALYTICS TAB -->
      <main v-if="activeTab === 'analytics'" class="page-content fade-in">
        <div v-if="activeSubPage === 'details'">
          <div class="page-header">
            <div>
              <div class="back-link" @click="activeSubPage = 'list'; activeTab = 'campaigns'">&larr; All campaigns</div>
              <h1 class="page-title">Weekend comeback</h1>
            </div>
            <div class="header-actions">
              <button class="btn-secondary">Pause campaign</button>
              <button class="btn-primary btn-icon"><svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> Export report</button>
            </div>
          </div>

          <div class="filter-bar">
            <div class="dropdowns">
              <select><option>Last 30 days</option></select>
              <select><option>All channels</option></select>
              <select><option>All audiences</option></select>
            </div>
            <div class="sync-status"><span class="dot green"></span> Last event processed 12 seconds ago</div>
          </div>

          <div class="stats-cards">
            <div class="stat-card">
              <div class="stat-label">Impressions</div>
              <div class="stat-value">18,420</div>
              <div class="stat-trend positive">+22%</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Engagements</div>
              <div class="stat-value">4,268</div>
              <div class="stat-desc">23.2%</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Conversions</div>
              <div class="stat-value">1,284</div>
              <div class="stat-desc">7.4%</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Attributed revenue</div>
              <div class="stat-value">€18,420</div>
              <div class="stat-trend positive">+18.4%</div>
            </div>
          </div>

          <div class="charts-grid">
            <div class="card chart-card large">
              <h3>Reach to conversion</h3>
              <p class="section-desc">Jun 1 - Jun 30</p>
              <div class="legend"><span class="dot purple"></span> Impressions <span class="dot green"></span> Conversions</div>
              <div class="chart-placeholder line-chart">
                <!-- SVG MOCK FOR LINE CHART -->
                <svg width="100%" height="200" viewBox="0 0 500 200" preserveAspectRatio="none">
                  <path d="M0,150 C50,140 100,160 150,120 C200,80 250,110 300,70 C350,30 400,60 450,20 L500,10" stroke="#6366F1" stroke-width="4" fill="none"/>
                  <path d="M0,190 C50,185 100,195 150,170 C200,140 250,160 300,130 C350,100 400,120 450,90 L500,85" stroke="#10B981" stroke-width="3" fill="none"/>
                </svg>
                <div class="x-axis"><span>Jun 1</span><span>Jun 10</span><span>Jun 20</span><span>Jun 30</span></div>
              </div>
            </div>
            <div class="card chart-card">
              <h3>Channel mix</h3>
              <p class="section-desc">Attributed conversions by channel</p>
              <div class="donut-placeholder">
                <svg viewBox="0 0 36 36" class="circular-chart">
                  <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                  <path class="circle purple" stroke-dasharray="48, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                  <path class="circle green" stroke-dasharray="32, 100" stroke-dashoffset="-48" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                  <path class="circle orange" stroke-dasharray="20, 100" stroke-dashoffset="-80" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                  <text x="18" y="18.5" class="percentage">100%</text>
                  <text x="18" y="14" class="percentage-label">Total</text>
                </svg>
                <div class="donut-legend">
                  <div class="dl-item"><span class="dot purple"></span> Push <strong>48%</strong></div>
                  <div class="dl-item"><span class="dot green"></span> SMS <strong>32%</strong></div>
                  <div class="dl-item"><span class="dot orange"></span> Ad <strong>20%</strong></div>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <h3>Execution log</h3>
            <p class="section-desc">Recent campaign activity</p>
            <table class="data-table clean">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Trigger</th>
                  <th>Channel</th>
                  <th>Status</th>
                  <th style="text-align: right">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Jun 18 14:32</td><td>Purchase above €50</td><td>Push</td><td><span class="status-badge active">Converted</span></td><td style="text-align: right"><strong>€24</strong></td></tr>
                <tr><td>Jun 18 13:08</td><td>30 days inactive</td><td>SMS</td><td><span class="status-badge gray">Delivered</span></td><td style="text-align: right">—</td></tr>
                <tr><td>Jun 17 19:44</td><td>Purchase above €50</td><td>Push</td><td><span class="status-badge gray">Opened</span></td><td style="text-align: right">—</td></tr>
                <tr><td>Jun 17 18:01</td><td>Purchase above €50</td><td>Ad</td><td><span class="status-badge active">Converted</span></td><td style="text-align: right"><strong>€42</strong></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <!-- EVENT STREAM TAB -->
      <main v-if="activeTab === 'event-stream'" class="page-content fade-in">
        <div class="page-header">
          <div>
            <h1 class="page-title">Event stream</h1>
            <p class="page-subtitle">Watch customer events move through rules, dispatch, and delivery.</p>
          </div>
          <div class="header-actions">
            <div class="sync-status"><span class="dot green"></span> Processing normally</div>
            <button class="btn-secondary">Pause stream</button>
          </div>
        </div>
        
        <div class="stream-layout">
          <div class="stream-main">
            <div class="filter-bar">
              <div class="dropdowns">
                <select><option>All events</option></select>
                <select><option>All campaigns</option></select>
                <select><option>All statuses</option></select>
              </div>
              <div class="search-box">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="#94A3B8" stroke-width="2" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" placeholder="Search event ID or customer" />
              </div>
            </div>
            
            <div class="card no-pad">
              <table class="data-table clean padded">
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
                  <tr v-for="(ev, idx) in events" :key="idx">
                    <td>{{ ev.time }}</td>
                    <td><span :class="['event-badge', ev.class]">{{ ev.event }}</span></td>
                    <td>{{ ev.rule }}</td>
                    <td>{{ ev.dispatch }}</td>
                    <td><span :class="['text-status', ev.status.toLowerCase()]">{{ ev.status }}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p class="table-footer-note">Partitioned by merchant_id - Last sync 12 seconds ago</p>
          </div>
          <div class="stream-sidebar">
            <div class="card">
              <h3>Pipeline health</h3>
              <div class="health-stats">
                <div class="hs-row"><span>Kafka lag</span> <strong>0.8s</strong></div>
                <div class="hs-row"><span>Rules engine</span> <strong class="green-text">99.98%</strong></div>
                <div class="hs-row"><span>Delivery success</span> <strong class="green-text">98.6%</strong></div>
                <div class="hs-row"><span>Events today</span> <strong>28,642</strong></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- GAMIFICATION TAB -->
      <main v-if="activeTab === 'gamification'" class="page-content fade-in">
        <div v-if="activeSubPage === 'list'" class="create-wizard">
          <div class="page-header">
            <div>
              <h1 class="page-title">Configure game</h1>
              <p class="page-subtitle">Make the reward moment feel memorable without losing control of your cap.</p>
            </div>
            <div class="header-actions">
              <div class="sync-status" style="background: white; border: 1px solid #E2E8F0; padding: 0.5rem 1rem; border-radius: 8px;"><svg viewBox="0 0 24 24" width="14" height="14" stroke="#10B981" stroke-width="2" fill="none" style="margin-right: 5px; vertical-align: middle;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> Rewards are issued server-side and caps are decremented atomically.</div>
            </div>
          </div>

          <div class="wizard-content gamification-wizard">
            <div class="g-templates">
              <h4>Choose a template</h4>
              <p class="section-desc">Select the game customers will play.</p>
              <div class="template-selector active">
                 <div class="icon-circle green"><div class="inner-dot"></div></div>
                 <div>
                   <h5>Spin the wheel</h5>
                   <p>A bright, rewarding spin.</p>
                 </div>
                 <div class="active-dot"></div>
              </div>
              <div class="template-selector">
                 <div class="icon-circle empty"></div>
                 <div>
                   <h5>Scratch card</h5>
                   <p>Reveal a surprise reward.</p>
                 </div>
              </div>
              <div class="template-selector">
                 <div class="icon-circle text">?</div>
                 <div>
                   <h5>Quiz</h5>
                   <p>Turn knowledge into rewards.</p>
                 </div>
              </div>
            </div>

            <div class="g-main">
              <div class="card">
                <h3>Game details</h3>
                <p class="section-desc">Set the basic rules for this experience.</p>
                <div class="grid-2">
                  <div class="form-group">
                    <label>Game title</label>
                    <input type="text" value="Spin & save" class="input" />
                  </div>
                  <div class="form-group">
                    <label>Play frequency</label>
                    <select class="input"><option>Once per customer</option></select>
                  </div>
                  <div class="form-group">
                    <label>Reward cap</label>
                    <input type="text" value="500 rewards" class="input" />
                  </div>
                  <div class="form-group">
                    <label>Redemption expiry</label>
                    <select class="input"><option>30 days</option></select>
                  </div>
                </div>
              </div>

              <div class="card">
                <div class="flex-between">
                  <div>
                    <h3>Odds and prizes</h3>
                    <p class="section-desc">Adjust the chance of each outcome. Total odds must equal 100%.</p>
                  </div>
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="#6366F1" stroke-width="2" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                </div>
                
                <table class="odds-table">
                  <thead>
                    <tr>
                      <th>Prize</th>
                      <th style="text-align: right; width: 100px;">Chance</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><div class="drag-handle">⠿</div> <input type="text" value="10% off" class="input slim" /></td>
                      <td class="chance-td"><input type="text" value="20" class="input slim right" /> <span>%</span></td>
                    </tr>
                    <tr>
                      <td><div class="drag-handle">⠿</div> <input type="text" value="Free coffee" class="input slim" /></td>
                      <td class="chance-td"><input type="text" value="10" class="input slim right" /> <span>%</span></td>
                    </tr>
                    <tr>
                      <td><div class="drag-handle">⠿</div> <input type="text" value="No prize" class="input slim" /></td>
                      <td class="chance-td"><input type="text" value="70" class="input slim right" /> <span>%</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="g-preview">
              <div class="card preview-card">
                <h3>Live preview</h3>
                <p class="section-desc">See how the reward moment feels.</p>
                <div class="preview-box">
                  <div class="wheel-mockup">
                    <div class="wheel-slice s1"></div>
                    <div class="wheel-slice s2"></div>
                    <div class="wheel-slice s3"></div>
                    <div class="wheel-slice s4"></div>
                    <div class="wheel-slice s5"></div>
                    <div class="wheel-slice s6"></div>
                    <div class="wheel-center"><svg viewBox="0 0 24 24" width="16" height="16" stroke="white" stroke-width="2" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg></div>
                    <div class="wheel-pointer">▼</div>
                  </div>
                </div>
                <h3 class="text-center mt-4" style="margin-top: 1.5rem">Your next spin could win</h3>
                <p class="section-desc text-center">Try your luck and reveal a reward.</p>
                <button class="btn-primary full-width mt-4">Spin now</button>
              </div>
            </div>
          </div>
          
          <div class="footer-actions flex-between mt-4">
            <button class="btn-text">Cancel</button>
            <div>
              <button class="btn-secondary mr-2">Save game</button>
              <button class="btn-primary">Activate game</button>
            </div>
          </div>
        </div>
      </main>

      <!-- AUTOMATIONS TAB -->
      <main v-if="activeTab === 'automations'" class="page-content fade-in">
        <div class="page-header">
          <div>
            <h1 class="page-title">Automations</h1>
            <p class="page-subtitle">Turn customer moments into timely, personalized actions.</p>
          </div>
          <button class="btn-primary">+ Create automation</button>
        </div>

        <div class="stats-cards" style="grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: 2rem;">
          <div class="stat-card" style="padding: 1.25rem;">
            <div class="stat-label">Active automations</div>
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 0.5rem;">
              <div class="stat-value" style="font-size: 1.75rem; margin:0;">8</div>
              <div class="stat-trend positive" style="font-size: 0.75rem;">+2 this month</div>
            </div>
          </div>
          <div class="stat-card" style="padding: 1.25rem;">
            <div class="stat-label">Messages sent</div>
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 0.5rem;">
              <div class="stat-value" style="font-size: 1.75rem; margin:0;">12,480</div>
              <div class="stat-desc" style="font-size: 0.75rem;">Last 30 days</div>
            </div>
          </div>
          <div class="stat-card" style="padding: 1.25rem;">
            <div class="stat-label">Conversion rate</div>
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 0.5rem;">
              <div class="stat-value" style="font-size: 1.75rem; margin:0;">18.6%</div>
              <div class="stat-trend positive" style="font-size: 0.75rem;">+3.2%</div>
            </div>
          </div>
          <div class="stat-card" style="padding: 1.25rem;">
            <div class="stat-label">Revenue influenced</div>
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 0.5rem;">
              <div class="stat-value" style="font-size: 1.75rem; margin:0;">€24,860</div>
              <div class="stat-trend positive" style="font-size: 0.75rem;">+11.4%</div>
            </div>
          </div>
        </div>

        <div class="data-table-container">
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 1.5rem; border-bottom: 1px solid #E2E8F0; background: white;">
            <h3 style="margin: 0; font-size: 1.1rem;">Your automations</h3>
            <div style="display: flex; gap: 12px; align-items: center;">
              <div style="background: #F1F5F9; border-radius: 6px; padding: 0.3rem 0.6rem; font-size: 0.8rem; color: #475569;">
                <span style="font-weight: 600; color: #0F172A; margin-right: 8px;">All 8</span>
                <span style="margin-right: 8px;">Active 6</span>
                <span>Drafts 2</span>
              </div>
              <div class="search-box" style="margin: 0;">
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="#94A3B8" stroke-width="2" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" placeholder="Search automations" style="width: 140px; font-size: 0.8rem;" />
              </div>
              <button class="btn-secondary" style="display: flex; align-items: center; gap: 6px; padding: 0.4rem 0.8rem;">
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                Filter
              </button>
            </div>
          </div>
          <table class="data-table">
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
              <tr v-for="a in automations" :key="a.id">
                <td class="primary-col">{{ a.name }}</td>
                <td>{{ a.trigger }}</td>
                <td>{{ a.audience }}</td>
                <td>{{ a.performance }}</td>
                <td><span :class="['status-badge', a.status.toLowerCase()]">{{ a.status }}</span></td>
                <td>{{ a.lastUpdated }}</td>
                <td><button class="more-btn">•••</button></td>
              </tr>
            </tbody>
          </table>
          <div style="padding: 1rem 1.5rem; display: flex; justify-content: flex-end; align-items: center; border-top: 1px solid #F1F5F9; font-size: 0.85rem; color: #64748B;">
            Showing 5 of 8 automations
            <div style="display: flex; gap: 4px; margin-left: 1rem;">
              <button style="background: white; border: 1px solid #E2E8F0; border-radius: 4px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #94A3B8;">&lt;</button>
              <button style="background: white; border: 1px solid #E2E8F0; border-radius: 4px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #64748B;">&gt;</button>
            </div>
          </div>
        </div>

        <div style="margin-top: 2rem; background: linear-gradient(135deg, #F5F3FF, #EDE9FE); border: 1px solid #E9D5FF; border-radius: 12px; padding: 1.5rem 2rem; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h3 style="margin: 0 0 0.25rem 0; font-size: 1.1rem; color: #0F172A;">Automations that work while you sleep</h3>
            <p style="margin: 0; font-size: 0.9rem; color: #475569;">Start with a proven recipe or build a journey from scratch.</p>
          </div>
          <div style="display: flex; gap: 12px;">
            <button class="btn-secondary" style="background: white;">Browse recipes</button>
            <button class="btn-secondary" style="background: white;">View documentation</button>
          </div>
        </div>
      </main>

      <!-- SETTINGS TAB -->
      <main v-if="activeTab === 'settings'" class="page-content fade-in" style="padding-bottom: 4rem;">
        <div class="page-header">
          <div>
            <h1 class="page-title">Settings</h1>
            <p class="page-subtitle">Manage your workspace, integrations, and messaging preferences.</p>
          </div>
        </div>
        
        <div style="display: flex; gap: 2rem; align-items: flex-start; margin-top: 1rem;">
          <div style="width: 220px; background: white; border-radius: 12px; border: 1px solid #E2E8F0; padding: 1rem 0;">
            <div style="padding: 0.5rem 1.25rem; font-weight: 700; font-size: 0.9rem; color: #0F172A; margin-bottom: 0.5rem;">Settings</div>
            <div style="display: flex; flex-direction: column; gap: 4px; padding: 0 0.75rem;">
              <button style="text-align: left; background: #F3E8FF; color: #6366F1; border: none; padding: 0.6rem 0.75rem; border-radius: 6px; font-size: 0.85rem; font-weight: 600; cursor: pointer;">General</button>
              <button style="text-align: left; background: transparent; color: #64748B; border: none; padding: 0.6rem 0.75rem; border-radius: 6px; font-size: 0.85rem; font-weight: 500; cursor: pointer;">Team members</button>
              <button style="text-align: left; background: transparent; color: #64748B; border: none; padding: 0.6rem 0.75rem; border-radius: 6px; font-size: 0.85rem; font-weight: 500; cursor: pointer;">Integrations</button>
              <button style="text-align: left; background: transparent; color: #64748B; border: none; padding: 0.6rem 0.75rem; border-radius: 6px; font-size: 0.85rem; font-weight: 500; cursor: pointer;">Messaging</button>
              <button style="text-align: left; background: transparent; color: #64748B; border: none; padding: 0.6rem 0.75rem; border-radius: 6px; font-size: 0.85rem; font-weight: 500; cursor: pointer;">Notifications</button>
              <button style="text-align: left; background: transparent; color: #64748B; border: none; padding: 0.6rem 0.75rem; border-radius: 6px; font-size: 0.85rem; font-weight: 500; cursor: pointer;">Billing & plan</button>
            </div>
          </div>
          
          <div style="flex: 1; display: flex; flex-direction: column; gap: 1.5rem;">
            <div class="card" style="padding: 2rem;">
              <h3 style="margin: 0 0 0.5rem 0; font-size: 1.15rem;">General settings</h3>
              <p class="section-desc" style="margin-bottom: 2rem;">Keep your merchant workspace details up to date.</p>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2.5rem;">
                <div class="form-group" style="margin: 0;">
                  <label>Workspace name</label>
                  <input type="text" class="input" value="Maison Lune - Paris" />
                </div>
                <div class="form-group" style="margin: 0;">
                  <label>Timezone</label>
                  <input type="text" class="input" value="Europe/Paris" />
                </div>
                <div class="form-group" style="margin: 0;">
                  <label>Default currency</label>
                  <input type="text" class="input" value="EUR — Euro" />
                </div>
                <div class="form-group" style="margin: 0;">
                  <label>Locale</label>
                  <input type="text" class="input" value="French (France)" />
                </div>
              </div>
              
              <h3 style="margin: 0 0 1.5rem 0; font-size: 1.05rem;">Workspace preferences</h3>
              
              <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <div style="font-weight: 600; font-size: 0.9rem; color: #0F172A; margin-bottom: 4px;">Enable campaign approval workflow</div>
                    <div style="color: #64748B; font-size: 0.85rem;">Require a second review before campaigns go live</div>
                  </div>
                  <div style="width: 36px; height: 20px; background: #6366F1; border-radius: 10px; position: relative; cursor: pointer;">
                    <div style="width: 16px; height: 16px; background: white; border-radius: 50%; position: absolute; top: 2px; right: 2px; box-shadow: 0 1px 2px rgba(0,0,0,0.1);"></div>
                  </div>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <div style="font-weight: 600; font-size: 0.9rem; color: #0F172A; margin-bottom: 4px;">Show revenue in local currency</div>
                    <div style="color: #64748B; font-size: 0.85rem;">Use EUR throughout reports and dashboards</div>
                  </div>
                  <div style="width: 36px; height: 20px; background: #6366F1; border-radius: 10px; position: relative; cursor: pointer;">
                    <div style="width: 16px; height: 16px; background: white; border-radius: 50%; position: absolute; top: 2px; right: 2px; box-shadow: 0 1px 2px rgba(0,0,0,0.1);"></div>
                  </div>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <div style="font-weight: 600; font-size: 0.9rem; color: #0F172A; margin-bottom: 4px;">Allow team members to export customer data</div>
                    <div style="color: #64748B; font-size: 0.85rem;">Exports are logged for audit purposes</div>
                  </div>
                  <div style="width: 36px; height: 20px; background: #E2E8F0; border-radius: 10px; position: relative; cursor: pointer;">
                    <div style="width: 16px; height: 16px; background: white; border-radius: 50%; position: absolute; top: 2px; left: 2px; box-shadow: 0 1px 2px rgba(0,0,0,0.1);"></div>
                  </div>
                </div>
              </div>
              
              <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 2.5rem; padding-top: 2rem; border-top: 1px solid #F1F5F9;">
                <button class="btn-secondary" style="background: #F1F5F9; border: none; box-shadow: none;">Cancel</button>
                <button class="btn-primary">Save changes</button>
              </div>
            </div>
            
            <div class="card" style="padding: 2rem; border-color: #FECACA;">
              <h3 style="margin: 0 0 1.5rem 0; font-size: 1.15rem; color: #DC2626;">Danger zone</h3>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="color: #475569; font-size: 0.9rem;">
                  This permanently deletes your campaigns, events, and customer data.
                </div>
                <button class="btn-secondary" style="color: #DC2626; border-color: #FECACA; background: white;">Delete workspace</button>
              </div>
            </div>
            
          </div>
        </div>
      </main>

    </div>
  </div>
</template>

<style scoped>
/* Base Layout */
.app-layout {
  display: flex;
  height: 100vh;
  background-color: #F8FAFC;
  color: #0F172A;
  font-family: 'Inter', -apple-system, sans-serif;
  overflow: hidden;
}

/* Sidebar */
.sidebar {
  width: 250px;
  background-color: #151821;
  color: #94A3B8;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}
.sidebar-header {
  padding: 1.5rem 1.2rem;
}
.logo {
  color: #fff;
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  letter-spacing: -0.5px;
}
.account-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: rgba(255,255,255,0.05);
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.1);
  cursor: pointer;
}
.account-name { display: block; color: #fff; font-weight: 600; font-size: 0.85rem; }
.account-role { display: block; font-size: 0.75rem; margin-top: 2px; }

.nav-menu {
  flex: 1;
  padding: 0 0.75rem;
  overflow-y: auto;
}
.nav-menu button {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  background: none;
  border: none;
  color: #94A3B8;
  padding: 0.6rem 0.75rem;
  margin-bottom: 0.25rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.nav-menu button:hover { color: #fff; background: rgba(255,255,255,0.05); }
.nav-menu button.active {
  background: #6366F1;
  color: #fff;
}
.sidebar-footer { padding: 1rem; }
.help-btn {
  display: flex; align-items: center; gap: 8px; background: none; border: none; color: #94A3B8; cursor: pointer; font-size: 0.9rem;
}

/* Main Content & Topbar */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.topbar {
  height: 60px;
  background: #FDFDFC;
  border-bottom: 1px solid #E2E8F0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  flex-shrink: 0;
}
.breadcrumbs {
  font-size: 0.85rem;
  color: #64748B;
  font-weight: 500;
  cursor: pointer;
}
.breadcrumbs .separator { margin: 0 8px; color: #CBD5E1; }
.topbar-actions { display: flex; align-items: center; gap: 16px; }
.avatar { width: 30px; height: 30px; background: #E2E8F0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; color: #475569; }

.page-content {
  padding: 2rem;
  overflow-y: auto;
  flex: 1;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}
.page-title { font-size: 1.75rem; font-weight: 700; color: #0F172A; margin: 0 0 0.25rem 0; letter-spacing: -0.5px; }
.page-subtitle { color: #64748B; margin: 0; font-size: 0.95rem; }

/* Buttons & Inputs */
.btn-primary { background: #6366F1; color: white; border: none; padding: 0.6rem 1.25rem; border-radius: 6px; font-weight: 500; cursor: pointer; transition: 0.2s; font-size: 0.9rem; }
.btn-primary:hover { background: #4F46E5; }
.btn-secondary { background: white; border: 1px solid #CBD5E1; color: #334155; padding: 0.6rem 1.25rem; border-radius: 6px; font-weight: 500; cursor: pointer; transition: 0.2s; font-size: 0.9rem; box-shadow: 0 1px 2px rgba(0,0,0,0.05);}
.btn-secondary:hover { background: #F8FAFC; }
.btn-text { background: none; border: none; color: #64748B; cursor: pointer; font-weight: 500;}
.btn-icon { display: inline-flex; align-items: center; gap: 8px; }

.filter-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.status-summary { font-size: 0.85rem; color: #64748B; font-weight: 500; word-spacing: 2px;}
.search-box { display: flex; align-items: center; background: white; border: 1px solid #E2E8F0; border-radius: 6px; padding: 0.4rem 0.8rem; gap: 8px; box-shadow: 0 1px 2px rgba(0,0,0,0.02);}
.search-box input { border: none; outline: none; font-size: 0.85rem; width: 200px; }

/* Data Table */
.data-table-container { background: white; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
.data-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.85rem; }
.data-table th { padding: 1rem 1.5rem; border-bottom: 1px solid #E2E8F0; color: #64748B; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; font-size: 0.75rem; }
.data-table td { padding: 1rem 1.5rem; border-bottom: 1px solid #F1F5F9; color: #334155; }
.data-table tbody tr:hover { background: #F8FAFC; cursor: pointer; }
.primary-col { font-weight: 600; color: #0F172A; }
.more-btn { background: none; border: none; color: #94A3B8; cursor: pointer; font-size: 1rem; }

.status-badge { padding: 0.25rem 0.6rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600; }
.status-badge.active { background: #D1FAE5; color: #065F46; }
.status-badge.scheduled { background: #F3E8FF; color: #6B21A8; }
.status-badge.draft { background: #F1F5F9; color: #475569; }
.status-badge.paused { background: #FEE2E2; color: #991B1B; }
.status-badge.gray { background: #F1F5F9; color: #64748B; }

.table-footer-note { font-size: 0.8rem; color: #64748B; margin-top: 1rem; }

/* Create Wizard */
.create-wizard { max-width: 1100px; }
.stepper { display: flex; align-items: center; justify-content: center; background: white; border: 1px solid #E2E8F0; border-radius: 12px; padding: 1.5rem; margin: 2rem 0; gap: 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.02);}
.step { display: flex; align-items: center; gap: 8px; color: #94A3B8; font-weight: 500; font-size: 0.9rem;}
.step.active { color: #6366F1; font-weight: 600; }
.step-num { width: 24px; height: 24px; border-radius: 50%; background: #F1F5F9; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; }
.step.active .step-num { background: #6366F1; color: white; }
.step-line { height: 1px; flex: 1; background: #E2E8F0; }

.wizard-content { display: flex; gap: 2rem; align-items: flex-start; }
.wizard-form { flex: 2; padding: 2.5rem; }
.wizard-summary { flex: 1; }

.card { background: white; border: 1px solid #E2E8F0; border-radius: 12px; padding: 2rem; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
.card h2 { margin: 0 0 0.5rem 0; font-size: 1.25rem; }
.section-desc { color: #64748B; font-size: 0.9rem; margin: 0 0 2rem 0; }
.card h3 { margin: 0 0 0.5rem 0; font-size: 1.1rem; }

.form-group { margin-bottom: 1.5rem; }
.form-group label { display: block; font-weight: 500; margin-bottom: 0.5rem; font-size: 0.9rem; color: #334155;}
.input { width: 100%; padding: 0.75rem; border: 1px solid #CBD5E1; border-radius: 6px; font-family: inherit; font-size: 0.9rem; outline: none; transition: 0.2s;}
.input:focus { border-color: #6366F1; box-shadow: 0 0 0 2px rgba(99,102,241,0.1); }
textarea.input { resize: vertical; }

.channels-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
.channel-card { border: 1px solid #E2E8F0; border-radius: 8px; padding: 1.5rem 1rem; text-align: center; cursor: pointer; transition: 0.2s; }
.channel-card:hover { border-color: #CBD5E1; }
.channel-card.selected { border-color: #6366F1; background: rgba(99,102,241,0.03); color: #6366F1; }
.channel-card h4 { margin: 0.75rem 0 0.25rem 0; font-size: 0.95rem; color: #0F172A; }
.channel-card p { margin: 0; font-size: 0.75rem; color: #64748B; }

.radio-group { border: 1px solid #E2E8F0; border-radius: 6px; overflow: hidden; }
.radio-label { display: block; padding: 1rem; border-bottom: 1px solid #E2E8F0; font-size: 0.9rem; cursor: pointer; }
.radio-label:last-child { border-bottom: none; }
.radio-label.selected { background: #F8FAFC; }
.radio-label input { margin-right: 10px; }

.form-actions { display: flex; justify-content: space-between; margin-top: 2rem; border-top: 1px solid #E2E8F0; padding-top: 2rem;}

.summary-card { background: #FDFDFC; }
.summary-list { margin-bottom: 2rem; }
.summary-item { display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px dashed #E2E8F0; font-size: 0.9rem; }
.summary-item span { color: #64748B; }
.next-step-hint { font-size: 0.85rem; color: #64748B; }

/* Analytics */
.back-link { color: #64748B; font-size: 0.85rem; cursor: pointer; margin-bottom: 0.5rem; display: inline-block;}
.back-link:hover { color: #0F172A; }
.header-actions { display: flex; gap: 12px; }
.dropdowns select { border: 1px solid #E2E8F0; background: white; padding: 0.4rem 2rem 0.4rem 1rem; border-radius: 6px; font-size: 0.85rem; margin-right: 12px; outline: none; appearance: none; background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748B%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E"); background-repeat: no-repeat; background-position: right 0.7rem top 50%; background-size: 0.65rem auto;}
.sync-status { font-size: 0.85rem; color: #64748B; display: flex; align-items: center; gap: 6px;}
.dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
.dot.green { background: #10B981; }
.dot.purple { background: #6366F1; }
.dot.orange { background: #F59E0B; }

.stats-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: 1.5rem;}
.stat-card { background: white; border: 1px solid #E2E8F0; border-radius: 12px; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.02);}
.stat-label { color: #64748B; font-size: 0.85rem; font-weight: 500; margin-bottom: 0.5rem;}
.stat-value { font-size: 1.75rem; font-weight: 700; color: #0F172A; margin-bottom: 0.5rem;}
.stat-trend { font-size: 0.85rem; font-weight: 600; }
.stat-trend.positive { color: #10B981; }
.stat-desc { font-size: 0.85rem; color: #64748B; }

.charts-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;}
.chart-card { padding: 1.5rem; position: relative;}
.legend { font-size: 0.8rem; color: #64748B; display: flex; gap: 12px; margin-bottom: 1rem;}
.chart-placeholder { height: 220px; width: 100%; position: relative;}
.line-chart svg { position: absolute; bottom: 30px; left: 0; width: 100%; height: 170px;}
.x-axis { position: absolute; bottom: 0; left: 0; width: 100%; display: flex; justify-content: space-between; font-size: 0.75rem; color: #94A3B8; border-top: 1px dashed #E2E8F0; padding-top: 8px;}

.donut-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 220px; }
.circular-chart { display: block; margin: 0 auto; max-width: 140px; max-height: 140px; }
.circle-bg { fill: none; stroke: #F1F5F9; stroke-width: 3.8; }
.circle { fill: none; stroke-width: 3.8; stroke-linecap: round; }
.circle.purple { stroke: #6366F1; }
.circle.green { stroke: #10B981; }
.circle.orange { stroke: #F59E0B; }
.percentage { fill: #0F172A; font-size: 0.4em; text-anchor: middle; font-weight: bold; }
.percentage-label { fill: #64748B; font-size: 0.15em; text-anchor: middle; font-weight: 500;}
.donut-legend { margin-top: 1rem; width: 100%; display: flex; flex-direction: column; gap: 8px; font-size: 0.85rem;}
.dl-item { display: flex; justify-content: space-between; align-items: center;}
.dl-item strong { color: #0F172A; }

table.clean { border: none; }
table.clean th { border: none; border-bottom: 1px solid #E2E8F0; }
table.clean td { border: none; border-bottom: 1px solid #F1F5F9; }
table.padded th, table.padded td { padding: 1rem 1.5rem; }
.card.no-pad { padding: 0; }

/* Event Stream */
.stream-layout { display: flex; gap: 1.5rem; align-items: flex-start;}
.stream-main { flex: 3; }
.stream-sidebar { flex: 1; }
.event-badge { padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.75rem; font-family: monospace; font-weight: 600; background: #F1F5F9; color: #475569; border: 1px solid #E2E8F0;}
.event-badge.purple { color: #6366F1; border-color: #E9D5FF; background: #FAF5FF; }
.event-badge.blue { color: #2563EB; border-color: #DBEAFE; background: #EFF6FF; }
.event-badge.yellow { color: #D97706; border-color: #FEF3C7; background: #FFFBEB; }
.text-status { font-weight: 600; font-size: 0.8rem; }
.text-status.delivered, .text-status.recorded { color: #10B981; }
.text-status.ignored { color: #64748B; }
.health-stats { display: flex; flex-direction: column; gap: 1.25rem; margin-top: 1.5rem;}
.hs-row { display: flex; justify-content: space-between; font-size: 0.9rem; color: #475569;}
.hs-row strong { color: #0F172A; font-weight: 600; }
.green-text { color: #10B981 !important; }

/* Gamification */
.gamification-wizard { gap: 2rem; }
.g-templates { flex: 1; min-width: 200px;}
.template-selector { display: flex; gap: 12px; padding: 1rem; border-radius: 8px; cursor: pointer; border: 1px solid transparent; position: relative;}
.template-selector:hover { background: #F8FAFC; }
.template-selector.active { background: white; border-color: #E2E8F0; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
.icon-circle { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;}
.icon-circle.green { background: #D1FAE5; }
.icon-circle .inner-dot { width: 12px; height: 12px; border-radius: 50%; background: #10B981; }
.icon-circle.empty { border: 2px dashed #CBD5E1; }
.icon-circle.text { background: #F1F5F9; color: #64748B; font-weight: bold;}
.template-selector h5 { margin: 0 0 0.25rem 0; font-size: 0.95rem; }
.template-selector p { margin: 0; font-size: 0.75rem; color: #64748B; }
.active-dot { width: 8px; height: 8px; background: #6366F1; border-radius: 50%; position: absolute; right: 1rem; top: 1.5rem; }

.g-main { flex: 2; display: flex; flex-direction: column; gap: 1.5rem;}
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.flex-between { display: flex; justify-content: space-between; align-items: center; }

.odds-table { width: 100%; border-collapse: collapse; margin-top: 1rem;}
.odds-table th { text-align: left; font-size: 0.8rem; color: #64748B; border-bottom: 1px solid #E2E8F0; padding-bottom: 0.5rem;}
.odds-table td { padding: 0.75rem 0; border-bottom: 1px dashed #E2E8F0; }
.odds-table td:last-child { border-bottom: none; }
.drag-handle { display: inline-block; color: #CBD5E1; margin-right: 8px; cursor: grab;}
.input.slim { padding: 0.4rem 0.5rem; width: auto; font-size: 0.85rem;}
.input.right { text-align: right; width: 60px;}
.chance-td { display: flex; align-items: center; justify-content: flex-end; gap: 8px; color: #64748B; font-size: 0.85rem;}

.g-preview { flex: 1.5; }
.preview-card { background: #FAFAFA; border: 1px solid #E2E8F0; text-align: center;}
.preview-box { background: #D1FAE5; border-radius: 12px; padding: 2rem; margin-top: 1rem; display: flex; justify-content: center;}
.wheel-mockup { width: 180px; height: 180px; border-radius: 50%; background: #fff; position: relative; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); display: flex; justify-content: center; align-items: center;}
.wheel-slice { position: absolute; width: 50%; height: 50%; transform-origin: 100% 100%; }
.s1 { background: #6366F1; transform: rotate(0deg) skew(30deg); }
.s2 { background: #10B981; transform: rotate(60deg) skew(30deg); }
.s3 { background: #F59E0B; transform: rotate(120deg) skew(30deg); }
.s4 { background: #EF4444; transform: rotate(180deg) skew(30deg); }
.s5 { background: #3B82F6; transform: rotate(240deg) skew(30deg); }
.s6 { background: #8B5CF6; transform: rotate(300deg) skew(30deg); }
.wheel-center { width: 40px; height: 40px; background: white; border-radius: 50%; position: absolute; z-index: 10; box-shadow: 0 2px 4px rgba(0,0,0,0.1); display: flex; justify-content: center; align-items: center; }
.wheel-center svg { stroke: #6366F1; }
.wheel-pointer { position: absolute; top: -10px; left: 50%; transform: translateX(-50%); color: #6366F1; font-size: 1.5rem; z-index: 20; text-shadow: 0 2px 4px rgba(0,0,0,0.2);}

.full-width { width: 100%; }
.mt-4 { margin-top: 1.5rem; }
.mr-2 { margin-right: 0.5rem; }

.fade-in { animation: fadeIn 0.4s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
</style>
