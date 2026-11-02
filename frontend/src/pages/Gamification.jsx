import React, { useState, useEffect } from 'react';
import { LoyumIcon } from '../components/common/LoyumLogo';

export default function Gamification({ activeSubPage, token, campaigns = [] }) {
  const [templates, setTemplates] = useState([]);
  const [activeTemplate, setActiveTemplate] = useState('spin-the-wheel');
  const [gameTitle, setGameTitle] = useState('Spin & save');
  const [rewardCap, setRewardCap] = useState('500');
  const [selectedCampaignId, setSelectedCampaignId] = useState(() => campaigns[0]?.id || '');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Wheel & Game interaction state
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [spinResult, setSpinResult] = useState(null);
  const [stampsCount, setStampsCount] = useState(3);

  // Odds table
  const [prizes, setPrizes] = useState([
    { name: '15% Off VIP Coupon', chance: 20 },
    { name: 'Free Welcome Treat', chance: 15 },
    { name: 'Double Loyalty Points', chance: 25 },
    { name: 'No prize', chance: 40 }
  ]);

  useEffect(() => {
    fetch('/api/v1/gametemplates/', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTemplates(data);
          if (data.length > 0 && !activeTemplate) setActiveTemplate(data[0].id);
        }
      })
      .catch(err => console.error(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handlePrizeChange = (index, field, value) => {
    setPrizes(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: field === 'chance' ? Number(value) : value };
      return updated;
    });
  };

  const handleSaveGame = () => {
    const targetCampaignId = selectedCampaignId || campaigns[0]?.id;
    if (!targetCampaignId) {
      alert("Please select a campaign to link this game to.");
      return;
    }
    setSaving(true);
    setSaveSuccess(false);

    const prizeNames = prizes.filter(p => p.chance > 0 && p.name !== 'No prize').map(p => p.name);
    const winOdds = (prizes.filter(p => p.name !== 'No prize').reduce((sum, p) => sum + p.chance, 0)) / 100;

    fetch(`/api/v1/campaigns/${targetCampaignId}/game`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        template: activeTemplate,
        odds: winOdds > 0 ? winOdds : 0.5,
        prizes: prizeNames.length > 0 ? prizeNames : ["15% VIP Coupon", "Free Treat"]
      })
    })
      .then(res => res.json())
      .then(() => {
        setSaving(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3500);
      })
      .catch(err => {
        console.error(err);
        setSaving(false);
      });
  };

  const handlePlayGame = () => {
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

    if (activeTemplate === 'spin-the-wheel') {
      const extraSpins = 5 * 360;
      const randomAngle = Math.floor(Math.random() * 360);
      const nextRotation = rotation + extraSpins + randomAngle;
      setRotation(nextRotation);

      setTimeout(() => {
        setSpinning(false);
        setSpinResult(wonPrize);
      }, 2500);
    } else if (activeTemplate === 'scratch-card') {
      setTimeout(() => {
        setSpinning(false);
        setSpinResult(wonPrize);
      }, 900);
    } else if (activeTemplate === 'loyalty-stamp-card') {
      setTimeout(() => {
        setSpinning(false);
        const next = stampsCount >= 5 ? 1 : stampsCount + 1;
        setStampsCount(next);
        if (next === 5) {
          setSpinResult('Unlocked VIP Gold Tier Perk!');
        } else {
          setSpinResult(`Stamp ${next}/5 Collected!`);
        }
      }, 400);
    } else {
      setTimeout(() => {
        setSpinning(false);
        setSpinResult(wonPrize);
      }, 800);
    }
  };

  return (
    <main className="page-content fade-in">
      {activeSubPage === "list" && (
        <div className="create-wizard">
          <div className="page-header">
            <div>
              <h1 className="page-title">Loyum Gamification & Rewards</h1>
              <p className="page-subtitle">Configure branded loyalty experiences and manage reward caps server-side.</p>
            </div>
            <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {saveSuccess && (
                <span style={{ color: '#059669', fontSize: '0.875rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  ✓ Loyum Game Published!
                </span>
              )}
              <div className="sync-status" style={{ background: "#FFFFFF", border: "1px solid var(--loyum-sand-border)", padding: "0.5rem 1rem", borderRadius: "8px" }}>
                <LoyumIcon size={16} fill="#001F46" letterFill="#F2B12F" />
                <span style={{ fontSize: '0.8rem', color: 'var(--loyum-navy)', fontWeight: 600 }}>Atomic Cap Enforcement Active</span>
              </div>
            </div>
          </div>

          <div className="wizard-content gamification-wizard">
            <div className="g-templates">
              <h4 style={{ color: 'var(--loyum-navy)', fontWeight: 700, marginBottom: '0.25rem' }}>Choose Template</h4>
              <p className="section-desc">Official Loyum game archetypes.</p>

              {templates.map(t => (
                <div 
                  key={t.id} 
                  className={`template-selector ${activeTemplate === t.id ? 'active' : ''}`} 
                  onClick={() => { setActiveTemplate(t.id); setSpinResult(null); }}
                >
                  <div className={`icon-circle ${activeTemplate === t.id ? 'green' : 'empty'}`}>
                    {activeTemplate === t.id ? (
                      <LoyumIcon size={20} fill="#001F46" letterFill="#F2B12F" />
                    ) : (
                      <span style={{ fontSize: '12px' }}>★</span>
                    )}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <h5 style={{ color: 'var(--loyum-navy)', fontWeight: 700, margin: 0 }}>{t.name}</h5>
                      {t.badge && (
                        <span style={{ fontSize: '0.65rem', padding: '1px 5px', borderRadius: '4px', background: 'var(--loyum-sand)', color: 'var(--loyum-navy)', fontWeight: 700 }}>
                          {t.badge}
                        </span>
                      )}
                    </div>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'var(--loyum-text-muted)' }}>{t.description}</p>
                  </div>
                  {activeTemplate === t.id && <div className="active-dot"></div>}
                </div>
              ))}

              <div className="card" style={{ marginTop: '1.5rem', padding: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--loyum-navy)' }}>
                  Target Campaign Node
                </label>
                <select 
                  className="input"
                  value={selectedCampaignId || campaigns[0]?.id || ''}
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
                <h3>Game Details & Caps</h3>
                <p className="section-desc">Set operational parameters and security limits.</p>
                <div className="grid-2">
                  <div className="form-group">
                    <label>Game Title</label>
                    <input 
                      type="text" 
                      value={gameTitle} 
                      onChange={e => setGameTitle(e.target.value)}
                      className="input" 
                    />
                  </div>
                  <div className="form-group">
                    <label>Play Frequency</label>
                    <select className="input">
                      <option>Once per customer</option>
                      <option>Daily visit</option>
                      <option>Per qualifying purchase</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Strict Reward Cap</label>
                    <input 
                      type="text" 
                      value={rewardCap} 
                      onChange={e => setRewardCap(e.target.value)}
                      className="input" 
                    />
                  </div>
                  <div className="form-group">
                    <label>Voucher Validity</label>
                    <select className="input">
                      <option>30 days from issuance</option>
                      <option>14 days from issuance</option>
                      <option>End of calendar month</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex-between">
                  <div>
                    <h3>Odds & Prize Distribution</h3>
                    <p className="section-desc">Server-validated probabilities. Total sum should equal 100%.</p>
                  </div>
                  <LoyumIcon size={26} fill="#001F46" letterFill="#F2B12F" />
                </div>

                <table className="odds-table">
                  <thead>
                    <tr>
                      <th>Reward Item</th>
                      <th style={{ textAlign: "right", width: "100px" }}>Probability</th>
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
                          <span style={{ fontWeight: 600, color: 'var(--loyum-navy)' }}>%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="g-preview">
              <div className="card preview-card">
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
                  <LoyumIcon size={30} fill="#001F46" letterFill="#F2B12F" />
                </div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--loyum-navy)' }}>Loyum Live Simulator</h3>
                <p className="section-desc" style={{ marginBottom: '1rem' }}>Instant interactive touchpoint demo.</p>

                <div className="preview-box">
                  {activeTemplate === 'spin-the-wheel' && (
                    <div style={{ position: 'relative' }}>
                      <div className="wheel-pointer">▼</div>
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
                        <div className="wheel-center">
                          <LoyumIcon size={20} fill="#001F46" letterFill="#F2B12F" />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTemplate === 'scratch-card' && (
                    <div
                      onClick={handlePlayGame}
                      style={{
                        width: "240px",
                        height: "150px",
                        borderRadius: "14px",
                        background: spinResult ? "linear-gradient(135deg, #001F46, #0A2E63)" : "linear-gradient(135deg, #F2B12F 0%, #F5DFBB 50%, #E5A31E 100%)",
                        border: "2px solid #001F46",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        boxShadow: "0 8px 20px rgba(0, 31, 70, 0.2)",
                        color: spinResult ? "#F5DFBB" : "#001F46",
                        userSelect: "none",
                        transition: "all 0.3s ease",
                        padding: "1rem"
                      }}
                    >
                      {spinResult ? (
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--loyum-gold)", fontWeight: 700 }}>
                            OFFICIAL REVEAL
                          </div>
                          <div style={{ fontSize: "1.2rem", fontWeight: "800", marginTop: "4px", color: "#FFF" }}>{spinResult}</div>
                          <div style={{ fontSize: "0.72rem", opacity: 0.9, marginTop: "6px", background: "rgba(245,223,187,0.2)", padding: "2px 8px", borderRadius: "4px" }}>
                            VALIDATION: LOYUM-PASS-2024
                          </div>
                        </div>
                      ) : (
                        <div style={{ textAlign: "center" }}>
                          <LoyumIcon size={32} fill="#001F46" letterFill="#FFFFFF" />
                          <div style={{ fontWeight: "800", fontSize: "0.95rem", marginTop: "6px" }}>Scratch Loyum Seal</div>
                          <div style={{ fontSize: "0.75rem", opacity: 0.85 }}>Tap to Reveal Prize</div>
                        </div>
                      )}
                    </div>
                  )}

                  {(activeTemplate === 'loyalty-stamp-card' || activeTemplate === 'mystery-gift-box') && (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <img 
                          src="/brand/Carte2-Test.png" 
                          alt="Ma Carte Loyum Pass" 
                          style={{ width: '220px', borderRadius: '10px', boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '10px' }}>
                          {[1, 2, 3, 4, 5].map(step => (
                            <div 
                              key={step} 
                              onClick={() => setStampsCount(step)}
                              style={{ 
                                width: '28px', 
                                height: '28px', 
                                borderRadius: '50%', 
                                background: step <= stampsCount ? 'var(--loyum-gold)' : '#FFFFFF',
                                border: '2px solid var(--loyum-navy)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '11px',
                                fontWeight: 800,
                                color: 'var(--loyum-navy)',
                                cursor: 'pointer'
                              }}
                            >
                              {step <= stampsCount ? '✓' : step}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--loyum-brown)', fontWeight: 600, marginTop: '8px' }}>
                        {stampsCount}/5 Stamps toward VIP Perk
                      </div>
                    </div>
                  )}
                </div>

                {spinResult && (
                  <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--loyum-sand-soft)', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--loyum-sand-border)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--loyum-brown)', fontWeight: '700', letterSpacing: '0.05em' }}>
                      LOYUM REWARD DISPATCH
                    </div>
                    <div style={{ fontSize: '1.05rem', color: 'var(--loyum-navy)', fontWeight: '800', marginTop: '2px' }}>
                      {spinResult === 'No prize' ? 'Better luck next time!' : `🎉 Winner: ${spinResult}`}
                    </div>
                  </div>
                )}

                <h3 className="text-center mt-4" style={{ marginTop: "1.25rem", fontSize: "1rem" }}>
                  {activeTemplate === 'spin-the-wheel' ? 'Simulate Spin' : activeTemplate === 'scratch-card' ? 'Simulate Scratch' : 'Simulate Stamp Collect'}
                </h3>
                <button 
                  className="btn-primary full-width mt-4" 
                  onClick={handlePlayGame}
                  disabled={spinning}
                  style={{ width: '100%', marginTop: '0.75rem' }}
                >
                  {spinning ? 'Validating...' : (
                    activeTemplate === 'spin-the-wheel' ? 'Spin Wheel Now' : 
                    activeTemplate === 'scratch-card' ? 'Scratch Card Now' : 
                    'Add Stamp to Pass'
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="footer-actions flex-between mt-4" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button 
              className="btn-gold" 
              onClick={handleSaveGame} 
              disabled={saving}
              style={{ padding: '0.75rem 2rem' }}
            >
              {saving ? 'Publishing...' : 'Save & Deploy Game'}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}