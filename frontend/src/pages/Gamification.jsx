import React, { useState, useEffect } from 'react';

export default function Gamification({ activeSubPage, token }) {
  const [templates, setTemplates] = useState([]);
  const [activeTemplate, setActiveTemplate] = useState(null);

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

  return (
    <main className="page-content fade-in">
      {activeSubPage === "list" && <div className="create-wizard">
        <div className="page-header">
          <div>
            <h1 className="page-title">Configure game</h1>
            <p className="page-subtitle">Make the reward moment feel memorable without losing control of your cap.</p>
          </div>
          <div className="header-actions">
            <div className="sync-status" style={{ background: "white", border: "1px solid #E2E8F0", padding: "0.5rem 1rem", borderRadius: "8px" }}><svg viewBox="0 0 24 24" width="14" height="14" stroke="#10B981" strokeWidth="2" fill="none" style={{ marginRight: "5px", verticalAlign: "middle" }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> Rewards are issued server-side and caps are decremented atomically.</div>
          </div>
        </div>

        <div className="wizard-content gamification-wizard">
          <div className="g-templates">
            <h4>Choose a template</h4>
            <p className="section-desc">Select the game customers will play.</p>
            {templates.map(t => (
              <div key={t.id} className={`template-selector ${activeTemplate === t.id ? 'active' : ''}`} onClick={() => setActiveTemplate(t.id)}>
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
          </div>

          <div className="g-main">
            <div className="card">
              <h3>Game details</h3>
              <p className="section-desc">Set the basic rules for this experience.</p>
              <div className="grid-2">
                <div className="form-group">
                  <label>Game title</label>
                  <input type="text" defaultValue="Spin & save" className="input" />
                </div>
                <div className="form-group">
                  <label>Play frequency</label>
                  <select className="input"><option>Once per customer</option></select>
                </div>
                <div className="form-group">
                  <label>Reward cap</label>
                  <input type="text" defaultValue="500 rewards" className="input" />
                </div>
                <div className="form-group">
                  <label>Redemption expiry</label>
                  <select className="input"><option>30 days</option></select>
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
                  <tr>
                    <td><div className="drag-handle">⠿</div> <input type="text" defaultValue="10% off" className="input slim" /></td>
                    <td className="chance-td"><input type="text" defaultValue="20" className="input slim right" /> <span>%</span></td>
                  </tr>
                  <tr>
                    <td><div className="drag-handle">⠿</div> <input type="text" defaultValue="Free coffee" className="input slim" /></td>
                    <td className="chance-td"><input type="text" defaultValue="10" className="input slim right" /> <span>%</span></td>
                  </tr>
                  <tr>
                    <td><div className="drag-handle">⠿</div> <input type="text" defaultValue="No prize" className="input slim" /></td>
                    <td className="chance-td"><input type="text" defaultValue="70" className="input slim right" /> <span>%</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="g-preview">
            <div className="card preview-card">
              <h3>Live preview</h3>
              <p className="section-desc">See how the reward moment feels.</p>
              <div className="preview-box">
                <div className="wheel-mockup">
                  <div className="wheel-slice s1"></div>
                  <div className="wheel-slice s2"></div>
                  <div className="wheel-slice s3"></div>
                  <div className="wheel-slice s4"></div>
                  <div className="wheel-slice s5"></div>
                  <div className="wheel-slice s6"></div>
                  <div className="wheel-center"><svg viewBox="0 0 24 24" width="16" height="16" stroke="white" strokeWidth="2" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg></div>
                  <div className="wheel-pointer">▼</div>
                </div>
              </div>
              <h3 className="text-center mt-4" style={{ marginTop: "1.5rem" }}>Your next spin could win</h3>
              <p className="section-desc text-center">Try your luck and reveal a reward.</p>
              <button className="btn-primary full-width mt-4">Spin now</button>
            </div>
          </div>
        </div>

        <div className="footer-actions flex-between mt-4">
          <button className="btn-text">Cancel</button>
          <div>
            <button className="btn-secondary mr-2">Save game</button>
            <button className="btn-primary">Activate game</button>
          </div>
        </div>
      </div>}
    </main>
  );
}