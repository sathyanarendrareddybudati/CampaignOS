import React, { useState, useEffect } from 'react';

export default function Settings({ token, onUpdateStoreName }) {
  const [activeSection, setActiveSection] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [userInfo, setUserInfo] = useState({ email: '', id: '' });

  const [form, setForm] = useState({
    store_name: 'Maison Lune - Paris',
    currency: 'EUR (€)',
    timezone: 'Europe/Paris',
    default_budget_cap: 1000,
    default_reward_cap: 500,
    auto_pause_on_budget: 'true',
    push_enabled: 'true',
    sms_enabled: 'true',
    email_notifications: 'true',
    webhook_url: 'http://localhost:8000/api/v1/events/',
    api_key: 'ml_live_sk_8f93b29c118e74a0'
  });

  const [testResult, setTestResult] = useState(null);
  const [testLoading, setTestLoading] = useState(false);

  useEffect(() => {
    // Fetch current user
    fetch('/api/v1/users/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(u => {
        if (u && !u.detail) {
          setUserInfo(u);
        }
      })
      .catch(err => console.error('Failed to load user info:', err));

    // Fetch settings
    fetch('/api/v1/settings/', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data && !data.detail) {
          const cleanWebhook = (data.webhook_url && !data.webhook_url.includes('maisonlune.com')) 
            ? data.webhook_url 
            : 'http://localhost:8000/api/v1/events/';

          setForm({
            store_name: data.store_name || 'Maison Lune - Paris',
            currency: data.currency || 'EUR (€)',
            timezone: data.timezone || 'Europe/Paris',
            default_budget_cap: data.default_budget_cap ?? 1000,
            default_reward_cap: data.default_reward_cap ?? 500,
            auto_pause_on_budget: data.auto_pause_on_budget || 'true',
            push_enabled: data.push_enabled || 'true',
            sms_enabled: data.sms_enabled || 'true',
            email_notifications: data.email_notifications || 'true',
            webhook_url: cleanWebhook,
            api_key: data.api_key || 'ml_live_sk_8f93b29c118e74a0'
          });
          if (onUpdateStoreName && data.store_name) {
            onUpdateStoreName(data.store_name);
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load settings:', err);
        setLoading(false);
      });
  }, [token]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setSaveSuccess(false);
  };

  const handleSave = (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    fetch('/api/v1/settings/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        store_name: form.store_name,
        currency: form.currency,
        timezone: form.timezone,
        default_budget_cap: parseFloat(form.default_budget_cap) || 1000,
        default_reward_cap: parseInt(form.default_reward_cap) || 500,
        auto_pause_on_budget: form.auto_pause_on_budget,
        push_enabled: form.push_enabled,
        sms_enabled: form.sms_enabled,
        email_notifications: form.email_notifications,
        webhook_url: form.webhook_url,
        api_key: form.api_key
      })
    })
      .then(res => res.json())
      .then(updated => {
        setSaving(false);
        if (updated && !updated.detail) {
          setSaveSuccess(true);
          if (onUpdateStoreName && updated.store_name) {
            onUpdateStoreName(updated.store_name);
          }
          setTimeout(() => setSaveSuccess(false), 3000);
        }
      })
      .catch(err => {
        console.error('Failed to save settings:', err);
        setSaving(false);
      });
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(form.api_key);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const regenerateApiKey = () => {
    const chars = 'abcdef0123456789';
    let rand = '';
    for (let i = 0; i < 16; i++) {
      rand += chars[Math.floor(Math.random() * chars.length)];
    }
    const newKey = `ml_live_sk_${rand}`;
    handleChange('api_key', newKey);
  };

  const handleTestWebhook = () => {
    if (!form.webhook_url) {
      setTestResult({ success: false, message: 'Please enter a webhook URL first.' });
      return;
    }
    setTestLoading(true);
    setTestResult(null);

    // If testing the local events endpoint
    const url = form.webhook_url.startsWith('http://localhost') || form.webhook_url.startsWith('/')
      ? form.webhook_url
      : form.webhook_url;

    fetch(url, {
      method: url.includes('/api/v1/events') ? 'GET' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        setTestLoading(false);
        if (res.ok) {
          setTestResult({ success: true, message: '✓ Webhook endpoint reachable (HTTP ' + res.status + ' OK)' });
        } else {
          setTestResult({ success: false, message: `HTTP ${res.status}: ${res.statusText || 'Endpoint returned error'}` });
        }
      })
      .catch(err => {
        setTestLoading(false);
        setTestResult({ success: false, message: 'Connection failed: ' + err.message });
      });
  };

  return (
    <main className="page-content fade-in">
      <div className="page-header" style={{ marginBottom: "1.5rem" }}>
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Configure your merchant store preferences, campaign guardrails, and pipeline integrations.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {saveSuccess && (
            <span style={{ color: '#10B981', fontSize: '0.875rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Changes saved to database
            </span>
          )}
          <button 
            className="btn-primary" 
            onClick={handleSave} 
            disabled={saving || loading}
            style={{ width: 'auto', padding: '0.65rem 1.4rem' }}
          >
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem' }}>
        {/* Settings Navigation Menu */}
        <div className="card" style={{ padding: '0.75rem', height: 'fit-content' }}>
          <button
            onClick={() => setActiveSection('general')}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: 'none',
              background: activeSection === 'general' ? '#F1F5F9' : 'transparent',
              color: activeSection === 'general' ? '#0F172A' : '#64748B',
              fontWeight: activeSection === 'general' ? '600' : '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.9rem',
              marginBottom: '4px'
            }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            Store profile
          </button>

          <button
            onClick={() => setActiveSection('guardrails')}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: 'none',
              background: activeSection === 'guardrails' ? '#F1F5F9' : 'transparent',
              color: activeSection === 'guardrails' ? '#0F172A' : '#64748B',
              fontWeight: activeSection === 'guardrails' ? '600' : '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.9rem',
              marginBottom: '4px'
            }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            Budget & Guardrails
          </button>

          <button
            onClick={() => setActiveSection('channels')}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: 'none',
              background: activeSection === 'channels' ? '#F1F5F9' : 'transparent',
              color: activeSection === 'channels' ? '#0F172A' : '#64748B',
              fontWeight: activeSection === 'channels' ? '600' : '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.9rem',
              marginBottom: '4px'
            }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"></path></svg>
            Notification channels
          </button>

          <button
            onClick={() => setActiveSection('integrations')}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: 'none',
              background: activeSection === 'integrations' ? '#F1F5F9' : 'transparent',
              color: activeSection === 'integrations' ? '#0F172A' : '#64748B',
              fontWeight: activeSection === 'integrations' ? '600' : '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.9rem'
            }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
            Pipeline & API keys
          </button>
        </div>

        {/* Section Contents */}
        <div>
          {activeSection === 'general' && (
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>Store Profile</h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
                Manage your merchant identity, account details, and regional preferences.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Store Name</label>
                  <input
                    type="text"
                    className="input"
                    value={form.store_name}
                    onChange={e => handleChange('store_name', e.target.value)}
                    placeholder="e.g. Maison Lune - Paris"
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label>Merchant Contact Email</label>
                  <input
                    type="email"
                    className="input"
                    value={userInfo.email || 'merchant@example.com'}
                    disabled
                    style={{ background: '#F8FAFC', color: '#64748B', cursor: 'not-allowed' }}
                  />
                  <small style={{ color: '#94A3B8', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>Managed by your account authentication.</small>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Primary Currency</label>
                  <select
                    className="input"
                    value={form.currency}
                    onChange={e => handleChange('currency', e.target.value)}
                  >
                    <option value="EUR (€)">EUR (€) - Euro</option>
                    <option value="USD ($)">USD ($) - US Dollar</option>
                    <option value="GBP (£)">GBP (£) - British Pound</option>
                    <option value="CHF (CHF)">CHF (CHF) - Swiss Franc</option>
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label>Business Timezone</label>
                  <select
                    className="input"
                    value={form.timezone}
                    onChange={e => handleChange('timezone', e.target.value)}
                  >
                    <option value="Europe/Paris">Europe/Paris (CET, UTC+1)</option>
                    <option value="Europe/London">Europe/London (GMT, UTC+0)</option>
                    <option value="America/New_York">America/New_York (EST, UTC-5)</option>
                    <option value="Asia/Tokyo">Asia/Tokyo (JST, UTC+9)</option>
                    <option value="UTC">UTC (Universal Coordinated Time)</option>
                  </select>
                </div>
              </div>

              <div style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: '#0F172A' }}>Merchant Account ID</strong>
                    <div style={{ fontSize: '0.8rem', color: '#64748B', fontFamily: 'monospace', marginTop: '2px' }}>
                      {userInfo.id || 'usr_prod_849204128'}
                    </div>
                  </div>
                  <span className="status-badge active" style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}>Verified Merchant</span>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'guardrails' && (
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>Budget & Reward Guardrails</h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
                Enforce transactional limits across campaigns so marketing spend is always protected.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Default Campaign Budget Cap (€)</label>
                  <input
                    type="number"
                    className="input"
                    value={form.default_budget_cap}
                    onChange={e => handleChange('default_budget_cap', e.target.value)}
                  />
                  <small style={{ color: '#64748B', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>Initial budget populated when creating a new campaign.</small>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label>Default Reward Redemption Cap</label>
                  <input
                    type="number"
                    className="input"
                    value={form.default_reward_cap}
                    onChange={e => handleChange('default_reward_cap', e.target.value)}
                  />
                  <small style={{ color: '#64748B', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>Maximum prizes or discounts that can be redeemed.</small>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem' }}>Automatic Budget Guardrail</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B' }}>
                      Automatically pause campaign dispatch when budget limit is reached.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.auto_pause_on_budget === 'true'}
                    onChange={e => handleChange('auto_pause_on_budget', e.target.checked ? 'true' : 'false')}
                    style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#6366F1' }}
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'channels' && (
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>Notification & Dispatch Channels</h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
                Control which communication channels the engine can dispatch messages to.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.25rem', borderBottom: '1px solid #E2E8F0' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem' }}>Push Notifications (Mobile App)</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B' }}>
                      Dispatch personalized push notifications to opted-in mobile app users.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.push_enabled === 'true'}
                    onChange={e => handleChange('push_enabled', e.target.checked ? 'true' : 'false')}
                    style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#6366F1' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.25rem', borderBottom: '1px solid #E2E8F0' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem' }}>SMS Gateway Delivery</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B' }}>
                      Send direct SMS text messages for high-urgency win-back automations.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.sms_enabled === 'true'}
                    onChange={e => handleChange('sms_enabled', e.target.checked ? 'true' : 'false')}
                    style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#6366F1' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem' }}>Merchant Alerts & Email Digest</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B' }}>
                      Receive email alerts whenever campaigns pause or budget thresholds are triggered.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.email_notifications === 'true'}
                    onChange={e => handleChange('email_notifications', e.target.checked ? 'true' : 'false')}
                    style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#6366F1' }}
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'integrations' && (
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>Pipeline & Developer API Keys</h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
                Connect your POS or e-commerce store directly to the Kafka real-time event pipeline.
              </p>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem' }}>Live API Key</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="input"
                    value={form.api_key}
                    readOnly
                    style={{ fontFamily: 'monospace', fontSize: '0.9rem', background: '#F8FAFC' }}
                  />
                  <button 
                    type="button" 
                    className="btn-secondary" 
                    onClick={copyApiKey}
                    style={{ width: 'auto', whiteSpace: 'nowrap', padding: '0 1rem' }}
                  >
                    {copiedKey ? '✓ Copied' : 'Copy'}
                  </button>
                  <button 
                    type="button" 
                    className="btn-secondary" 
                    onClick={regenerateApiKey}
                    style={{ width: 'auto', whiteSpace: 'nowrap', padding: '0 1rem' }}
                  >
                    Regenerate
                  </button>
                </div>
                <small style={{ color: '#64748B', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                  Use this key in the <code>Authorization: Bearer &lt;key&gt;</code> header when publishing events.
                </small>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label>Webhook URL for Campaign Dispatches</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="url"
                    className="input"
                    value={form.webhook_url}
                    onChange={e => { handleChange('webhook_url', e.target.value); setTestResult(null); }}
                    placeholder="http://localhost:8000/api/v1/events/ or your webhook URL"
                  />
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleTestWebhook}
                    disabled={testLoading}
                    style={{ width: 'auto', whiteSpace: 'nowrap', padding: '0 1rem' }}
                  >
                    {testLoading ? 'Testing...' : 'Test Webhook'}
                  </button>
                </div>
                {testResult && (
                  <div style={{ marginTop: '6px', fontSize: '0.8rem', fontWeight: '500', color: testResult.success ? '#10B981' : '#EF4444' }}>
                    {testResult.message}
                  </div>
                )}
                <small style={{ color: '#64748B', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                  External HTTP endpoint where events and notifications are dispatched. Default is your local engine events pipeline.
                </small>
              </div>

              <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '1.25rem', border: '1px solid #E2E8F0' }}>
                <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="dot green"></span> Kafka Stream Status: Connected
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem', color: '#475569' }}>
                  <div>
                    <strong>Bootstrap Broker:</strong>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', marginTop: '2px', wordBreak: 'break-all' }}>
                      kafka-c01345f-sathyanarendrareddybudati-d3c5.l.aivencloud.com:18828
                    </div>
                  </div>
                  <div>
                    <strong>Topic:</strong>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', marginTop: '2px' }}>
                      marketing_events
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
