import React, { useState, useEffect } from 'react';

export default function Gamification({ activeSubPage, token, campaigns = [] }) {
  const [templates, setTemplates] = useState([]);
  const [activeTemplate, setActiveTemplate] = useState('spin-the-wheel');
  const [gameTitle, setGameTitle] = useState('Spin & save');
  const [rewardCap, setRewardCap] = useState('500');
  const [selectedCampaignId, setSelectedCampaignId] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Wheel interaction state
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [spinResult, setSpinResult] = useState(null);

  // Odds table
  const [prizes, setPrizes] = useState([
    { name: '10% off', chance: 20 },
    { name: 'Free coffee', chance: 10 },
    { name: 'No prize', chance: 70 }
  ]);

  useEffect(() => {
    fetch('/api/v1/gametemplates/', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTemplates(data);
          if (data.length > 0) setActiveTemplate(data[0].id);
        }
      })
      .catch(err => console.error(err));
  }, [token]);

  useEffect(() => {
    if (campaigns.length > 0 && !selectedCampaignId) {
      setSelectedCampaignId(campaigns[0].id);
    }
  }, [campaigns]);

  const handlePrizeChange = (index, field, value) => {
    setPrizes(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: field === 'chance' ? Number(value) : value };
      return updated;
    });
  };

  const handleSaveGame = () => {
    if (!selectedCampaignId) {
      alert("Please select a campaign to link this game to.");
      return;
    }
    setSaving(true);
    setSaveSuccess(false);

    const prizeNames = prizes.filter(p => p.chance > 0).map(p => p.name);
    const winOdds = (prizes.find(p => p.name !== 'No prize')?.chance || 30) / 100;

    fetch(`/api/v1/campaigns/${selectedCampaignId}/game`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        template: activeTemplate,
        odds: winOdds,
        prizes: prizeNames
      })
    })
      .then(res => res.json())
      .then(() => {
        setSaving(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      })
      .catch(err => {
        console.error(err);
        setSaving(false);
      });
  };

  const handleSpinWheel = () => {
    if (spinning) return;
    setSpinning(true);
    setSpinResult(null);

    // Pick random outcome according to prizes
    const rand = Math.random() * 100;
    let accumulated = 0;
    let wonPrize = prizes[prizes.length - 1].name;
    for (const p of prizes) {
      accumulated += p.chance;
      if (rand <= accumulated) {
        wonPrize = p.name;
        break;
      }
    }

    const extraSpins = 5 * 360;
    const randomAngle = Math.floor(Math.random() * 360);
    const nextRotation = rotation + extraSpins + randomAngle;
    setRotation(nextRotation);

    setTimeout(() => {
      setSpinning(false);
      setSpinResult(wonPrize);
    }, 2500);
  };

  return (
    <main className="page-content fade-in">
      {activeSubPage === "list" && <div className="create-wizard">
        <div className="page-header">
          <div>
            <h1 className="page-title">Configure game</h1>
            <p className="page-subtitle">Make the reward moment feel memorable without losing control of your cap.</p>
          </div>
          <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {saveSuccess && (
              <span style={{ color: '#10B981', fontSize: '0.875rem', fontWeight: '600' }}>
                ✓ Game configuration saved!
              </span>
            )}
            <div className="sync-status" style={{ background: "white", border: "1px solid #E2E8F0", padding: "0.5rem 1rem", borderRadius: "8px" }}>
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="#10B981" strokeWidth="2" fill="none" style={{ marginRight: "5px", verticalAlign: "middle" }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> 
              Rewards are issued server-side and caps are decremented atomically.
            </div>
          </div>
        </div>

        <div className="wizard-content gamification-wizard">
          <div className="g-templates">
            <h4>Choose a template</h4>
            <p className="section-desc">Select the game customers will play.</p>
            {templates.map(t => (
              <div 
                key={t.id} 
                className={`template-selector ${activeTemplate === t.id ? 'active' : ''}`} 
                onClick={() => setActiveTemplate(t.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className={`icon-circle ${activeTemplate === t.id ? 'green' : 'empty'}`}>
                  {activeTemplate === t.id && <div className="inner-dot"></div>}
                </div>
                <div>
                  <h5>{t.name}</h5>
                  <p>{t.description}</p>
                </div>
                {activeTemplate === t.id && <div className="active-dot"></div>}
              </div>
            ))}

            <div className="card" style={{ marginTop: '1.5rem', padding: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Link to Campaign
              </label>
              <select 
                className="input"
                value={selectedCampaignId}
                onChange={e => setSelectedCampaignId(e.target.value)}
              >
                {campaigns.length === 0 ? (
                  <option value="">No campaigns available</option>
                ) : (
                  campaigns.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.status})</option>
                  ))
                )}
              </select>
            </div>
          </div>

          <div className="g-main">
            <div className="card">
              <h3>Game details</h3>
              <p className="section-desc">Set the basic rules for this experience.</p>
              <div className="grid-2">
                <div className="form-group">
                  <label>Game title</label>
                  <input 
                    type="text" 
                    value={gameTitle} 
                    onChange={e => setGameTitle(e.target.value)}
                    className="input" 
                  />
                </div>
                <div className="form-group">
                  <label>Play frequency</label>
                  <select className="input"><option>Once per customer</option><option>Daily</option></select>
                </div>
                <div className="form-group">
                  <label>Reward cap</label>
                  <input 
                    type="text" 
                    value={rewardCap} 
                    onChange={e => setRewardCap(e.target.value)}
                    className="input" 
                  />
                </div>
                <div className="form-group">
                  <label>Redemption expiry</label>
                  <select className="input"><option>30 days</option><option>14 days</option><option>7 days</option></select>
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
                  {prizes.map((p, idx) => (
                    <tr key={idx}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="drag-handle">⠿</span> 
                          <input 
                            type="text" 
                            value={p.name} 
                            onChange={e => handlePrizeChange(idx, 'name', e.target.value)}
                            className="input slim" 
                          />
                        </div>
                      </td>
                      <td className="chance-td">
                        <input 
                          type="number" 
                          value={p.chance} 
                          onChange={e => handlePrizeChange(idx, 'chance', e.target.value)}
                          className="input slim right" 
                        /> 
                        <span>%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="g-preview">
            <div className="card preview-card">
              <h3>Live preview</h3>
              <p className="section-desc">Experience how customers interact with the game.</p>
              <div className="preview-box">
                {activeTemplate === 'spin-the-wheel' && (
                  <>
                    <div 
                      className="wheel-mockup"
                      style={{
                        transform: `rotate(${rotation}deg)`,
                        transition: spinning ? 'transform 2.5s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none'
                      }}
                    >
                      <div className="wheel-slice s1"></div>
                      <div className="wheel-slice s2"></div>
                      <div className="wheel-slice s3"></div>
                      <div className="wheel-slice s4"></div>
                      <div className="wheel-slice s5"></div>
                      <div className="wheel-slice s6"></div>
                      <div className="wheel-center"><svg viewBox="0 0 24 24" width="16" height="16" stroke="white" strokeWidth="2" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg></div>
                    </div>
                    <div className="wheel-pointer">▼</div>
                  </>
                )}

                {activeTemplate === 'scratch-card' && (
                  <div
                    onClick={() => {
                      if (!spinning) {
                        setSpinning(true);
                        setTimeout(() => {
                          setSpinning(false);
                          setSpinResult(prizes[0]?.name || '10% off');
                        }, 800);
                      }
                    }}
                    style={{
                      width: "220px",
                      height: "140px",
                      borderRadius: "12px",
                      background: spinResult ? "linear-gradient(135deg, #10B981, #059669)" : "linear-gradient(135deg, #CBD5E1, #94A3B8)",
                      border: "3px dashed #6366F1",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                      color: "#fff",
                      userSelect: "none",
                      transition: "all 0.3s ease"
                    }}
                  >
                    {spinResult ? (
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px" }}>YOU REVEALED</div>
                        <div style={{ fontSize: "1.4rem", fontWeight: "800", marginTop: "4px" }}>{spinResult}</div>
                        <div style={{ fontSize: "0.7rem", opacity: 0.9, marginTop: "2px" }}>Code: SCRATCHVIP</div>
                      </div>
                    ) : (
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "1.5rem" }}>✨</div>
                        <div style={{ fontWeight: "700", fontSize: "0.95rem" }}>Tap or Scratch Here</div>
                        <div style={{ fontSize: "0.75rem", opacity: 0.8 }}>Reveal Mystery Prize</div>
                      </div>
                    )}
                  </div>
                )}

                {activeTemplate === 'quiz' && (
                  <div
                    style={{
                      background: "#1E1B4B",
                      border: "2px solid #818CF8",
                      borderRadius: "12px",
                      padding: "1.2rem",
                      width: "240px",
                      textAlign: "center",
                      color: "#fff",
                      boxShadow: "0 10px 25px rgba(99,102,241,0.2)"
                    }}
                  >
                    <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "#A5B4FC", textTransform: "uppercase", marginBottom: "8px" }}>
                      🎰 LUCKY REEL SLOTS
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "8px",
                        background: "#0F172A",
                        padding: "0.75rem",
                        borderRadius: "8px",
                        fontSize: "2rem"
                      }}
                    >
                      <span>{spinning ? "💎" : (spinResult ? "7️⃣" : "🍒")}</span>
                      <span>{spinning ? "⭐" : (spinResult ? "7️⃣" : "🍋")}</span>
                      <span>{spinning ? "🔔" : (spinResult ? "7️⃣" : "🍇")}</span>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#C7D2FE", marginTop: "8px" }}>
                      Match 3 symbols to win jackpot!
                    </div>
                  </div>
                )}
              </div>

              {spinResult && (
                <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#EEF2FF', borderRadius: '8px', textAlign: 'center', border: '1px solid #C7D2FE' }}>
                  <div style={{ fontSize: '0.8rem', color: '#6366F1', fontWeight: '600' }}>REWARD RESULT</div>
                  <div style={{ fontSize: '1.1rem', color: '#1E1B4B', fontWeight: '700' }}>
                    {spinResult === 'No prize' ? 'Better luck next time!' : `🎉 Winner: ${spinResult}!`}
                  </div>
                </div>
              )}

              <h3 className="text-center mt-4" style={{ marginTop: "1.5rem" }}>
                {activeTemplate === 'spin-the-wheel' ? 'Your next spin could win' : activeTemplate === 'scratch-card' ? 'Scratch to reveal promo' : 'Spin the lucky reels'}
              </h3>
              <p className="section-desc text-center">Simulate customer moment in-store or online.</p>
              <button 
                className="btn-primary full-width mt-4" 
                onClick={handleSpinWheel}
                disabled={spinning}
              >
                {spinning ? 'Playing...' : (activeTemplate === 'spin-the-wheel' ? 'Spin now' : activeTemplate === 'scratch-card' ? 'Scratch card' : 'Pull slot lever')}
              </button>
            </div>
          </div>
        </div>

        <div className="footer-actions flex-between mt-4">
          <button className="btn-text" onClick={() => window.location.reload()}>Cancel</button>
          <div>
            <button 
              className="btn-primary" 
              onClick={handleSaveGame} 
              disabled={saving}
              style={{ width: 'auto', padding: '0.75rem 1.75rem' }}
            >
              {saving ? 'Saving...' : 'Save & activate game'}
            </button>
          </div>
        </div>
      </div>}
    </main>
  );
}
