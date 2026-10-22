import React, { useState, useEffect } from 'react';

export default function EventStream({ token }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchEvents = () => {
    fetch('/api/v1/events/', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setEvents(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(() => {
      if (!isPaused) {
        fetchEvents();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [token, isPaused]);

  const filteredEvents = events.filter(ev => {
    const term = searchQuery.toLowerCase();
    const matchesSearch = (ev.event || '').toLowerCase().includes(term) ||
                          (ev.rule || '').toLowerCase().includes(term) ||
                          (ev.dispatch || '').toLowerCase().includes(term);
    const matchesStatus = statusFilter === 'All' ? true : (ev.status || '').toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const [showSimulateModal, setShowSimulateModal] = useState(false);
  const [simEvent, setSimEvent] = useState('user.signup');
  const [simEmail, setSimEmail] = useState('satyareddy0608@gmail.com');
  const [simulating, setSimulating] = useState(false);

  const handleSimulateEvent = (e) => {
    e.preventDefault();
    setSimulating(true);
    fetch('/api/v1/events/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        event: simEvent,
        email: simEmail,
        customer_id: 'cust_sim_' + Math.floor(Math.random() * 10000),
        amount: 55.0
      })
    })
      .then(res => res.json())
      .then(() => {
        setSimulating(false);
        setShowSimulateModal(false);
        fetchEvents();
      })
      .catch(err => {
        console.error(err);
        setSimulating(false);
      });
  };

  return (
    <main className="page-content fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Event stream</h1>
          <p className="page-subtitle">Watch customer events move through rules, dispatch, and delivery in real-time.</p>
        </div>
        <div className="header-actions" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button 
            className="btn-primary" 
            onClick={() => setShowSimulateModal(true)}
            style={{ width: 'auto', padding: '0.6rem 1rem', background: '#6366F1' }}
          >
            ⚡ Simulate Event
          </button>
          <div className="sync-status">
            <span className={`dot ${isPaused ? 'orange' : 'green'}`}></span> 
            {isPaused ? 'Stream paused' : 'Processing normally'}
          </div>
          <button 
            className="btn-secondary" 
            onClick={() => setIsPaused(!isPaused)}
            style={{ width: 'auto' }}
          >
            {isPaused ? 'Resume stream' : 'Pause stream'}
          </button>
          <button 
            className="btn-secondary" 
            onClick={fetchEvents}
            style={{ width: 'auto', padding: '0.6rem 1rem' }}
          >
            Refresh
          </button>
        </div>
      </div>

      {showSimulateModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '24px',
            width: '420px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: '#0F172A' }}>
              Simulate Customer Event
            </h2>
            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px' }}>
              Emit an event into the Rules Engine pipeline to test email and notification dispatches.
            </p>
            <form onSubmit={handleSimulateEvent}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
                  Trigger Event Type
                </label>
                <select 
                  value={simEvent} 
                  onChange={e => setSimEvent(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                >
                  <option value="user.signup">user.signup</option>
                  <option value="customer.purchase_above_50">customer.purchase_above_50</option>
                  <option value="cart.abandoned">cart.abandoned</option>
                  <option value="loyalty.tier_unlocked">loyalty.tier_unlocked</option>
                </select>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
                  Recipient Email
                </label>
                <input 
                  type="email"
                  value={simEmail}
                  onChange={e => setSimEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setShowSimulateModal(false)}
                  style={{ width: 'auto' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={simulating}
                  style={{ width: 'auto' }}
                >
                  {simulating ? 'Emitting...' : 'Emit Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="stream-layout">
        <div className="stream-main">
          <div className="filter-bar">
            <div className="dropdowns">
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="All">All statuses</option>
                <option value="Delivered">Delivered</option>
                <option value="Ignored">Ignored</option>
                <option value="Recorded">Recorded</option>
                <option value="Converted">Converted</option>
              </select>
            </div>
            <div className="search-box">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="#94A3B8" strokeWidth="2" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input 
                type="text" 
                placeholder="Search event, rule, or dispatch" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
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
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>
                      {loading ? 'Connecting to event pipeline...' : 'No events matching current filter.'}
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((ev, idx) => (
                    <tr key={ev.id || idx}>
                      <td>{ev.time || 'Just now'}</td>
                      <td>
                        <span className={`event-badge ${ev.css_class || 'purple'}`}>
                          {ev.event}
                        </span>
                      </td>
                      <td>{ev.rule || '—'}</td>
                      <td>{ev.dispatch || '—'}</td>
                      <td>
                        <span className={`text-status ${(ev.status || '').toLowerCase()}`}>
                          {ev.status || 'Delivered'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <p className="table-footer-note">Partitioned by merchant_id · Aiven Kafka cluster stream</p>
        </div>
        <div className="stream-sidebar">
          <div className="card">
            <h3>Pipeline health</h3>
            <div className="health-stats">
              <div className="hs-row"><span>Kafka lag</span> <strong>0.4s</strong></div>
              <div className="hs-row"><span>Rules engine</span> <strong className="green-text">99.98%</strong></div>
              <div className="hs-row"><span>Delivery success</span> <strong className="green-text">98.6%</strong></div>
              <div className="hs-row"><span>Events ingested</span> <strong>{events.length}</strong></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
