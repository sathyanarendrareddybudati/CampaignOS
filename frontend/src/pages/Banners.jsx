import React, { useState, useEffect } from 'react';

const PRESET_TEMPLATES = [
  {
    id: "pos_screen",
    name: "POS Countertop Display",
    resolution: "1920 × 1080 (16:9)",
    category: "In-Store POS Touchpoint",
    desc: "Display on iPad or dual-screen checkout to prompt immediate loyalty signups and coupon redemptions.",
    aspectClass: "ratio-16-9",
    width: "100%",
    minHeight: "300px"
  },
  {
    id: "story_9_16",
    name: "Instagram / TikTok Story",
    resolution: "1080 × 1920 (9:16)",
    category: "Digital Advertising",
    desc: "Vertical format ready for Meta Ads Manager, TikTok promotional campaigns, and WhatsApp status.",
    aspectClass: "ratio-9-16",
    width: "280px",
    minHeight: "480px"
  },
  {
    id: "mobile_push",
    name: "Rich Push Banner",
    resolution: "800 × 400 (2:1)",
    category: "Mobile Messaging",
    desc: "Embedded in mobile app notification trays and lock-screen push alerts.",
    aspectClass: "ratio-2-1",
    width: "100%",
    minHeight: "180px"
  },
  {
    id: "coupon_receipt",
    name: "Digital Receipt Voucher",
    resolution: "600 × 800 (3:4)",
    category: "Print & Email POS",
    desc: "Formatted for email purchase receipts, SMS links, and thermal receipt printouts.",
    aspectClass: "ratio-3-4",
    width: "300px",
    minHeight: "400px"
  }
];

const COLOR_THEMES = [
  {
    id: "luxury_gold",
    name: "Maison Luxury Gold",
    bg: "linear-gradient(135deg, #1C1917 0%, #292524 50%, #44403C 100%)",
    accent: "#F59E0B",
    accentBg: "rgba(245, 158, 11, 0.15)",
    textColor: "#FAFAF9",
    border: "1px solid rgba(245, 158, 11, 0.3)"
  },
  {
    id: "vibrant_neon",
    name: "Midnight Indigo",
    bg: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #312E81 100%)",
    accent: "#6366F1",
    accentBg: "rgba(99, 102, 241, 0.2)",
    textColor: "#FFFFFF",
    border: "1px solid rgba(99, 102, 241, 0.4)"
  },
  {
    id: "deep_emerald",
    name: "Emerald VIP",
    bg: "linear-gradient(135deg, #064E3B 0%, #065F46 50%, #047857 100%)",
    accent: "#34D399",
    accentBg: "rgba(52, 211, 153, 0.2)",
    textColor: "#ECFDF5",
    border: "1px solid rgba(52, 211, 153, 0.3)"
  },
  {
    id: "minimal_slate",
    name: "Pure Minimalist",
    bg: "linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)",
    accent: "#0F172A",
    accentBg: "#F1F5F9",
    textColor: "#0F172A",
    border: "1px solid #E2E8F0"
  }
];

export default function Banners({ token, campaigns = [] }) {
  const [selectedTouchpoint, setSelectedTouchpoint] = useState("pos_screen");
  const [selectedTheme, setSelectedTheme] = useState("luxury_gold");
  const [headline, setHeadline] = useState("Summer Sparkle: 20% Off Your Purchase");
  const [subtitle, setSubtitle] = useState("Scan the QR code at checkout to unlock your exclusive store reward.");
  const [discountCode, setDiscountCode] = useState("SUMMER20");
  const [ctaText, setCtaText] = useState("Scan to Claim");
  const [selectedCampaignId, setSelectedCampaignId] = useState(campaigns[0]?.id || "");
  const [savedBanners, setSavedBanners] = useState([]);
  const [saving, setSaving] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  useEffect(() => {
    fetch('/api/v1/banners/', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setSavedBanners(data);
      })
      .catch(err => console.error(err));
  }, [token]);

  const currentTheme = COLOR_THEMES.find(t => t.id === selectedTheme) || COLOR_THEMES[0];
  const currentTouchpoint = PRESET_TEMPLATES.find(t => t.id === selectedTouchpoint) || PRESET_TEMPLATES[0];

  const handleSaveBanner = () => {
    setSaving(true);
    fetch('/api/v1/banners/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        campaign_id: selectedCampaignId || null,
        title: headline,
        subtitle: subtitle,
        touchpoint: selectedTouchpoint,
        theme: selectedTheme,
        discount_code: discountCode,
        cta_text: ctaText,
        bg_gradient: currentTheme.bg,
        qr_url: `https://loyum.io/claim/${discountCode}`
      })
    })
      .then(res => res.json())
      .then(newBanner => {
        setSaving(false);
        setSavedBanners(prev => [newBanner, ...prev]);
        alert("Promo banner saved to merchant touchpoints!");
      })
      .catch(err => {
        console.error(err);
        setSaving(false);
      });
  };

  const handleCopyEmbedCode = () => {
    const embedSnippet = `<div class="loyum-touchpoint-banner" style="background:${currentTheme.bg}; color:${currentTheme.textColor}; border-radius:12px; padding:2rem; font-family:sans-serif;">\n  <h2 style="color:${currentTheme.accent}">${headline}</h2>\n  <p>${subtitle}</p>\n  <div style="display:inline-block; padding:0.5rem 1.25rem; background:${currentTheme.accent}; color:#fff; border-radius:6px; font-weight:bold;">${discountCode}</div>\n</div>`;
    navigator.clipboard.writeText(embedSnippet);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2500);
  };

  return (
    <main className="page-content fade-in">
      <div className="page-header" style={{ marginBottom: "1.5rem" }}>
        <div>
          <h1 className="page-title">Promo Studio & Touchpoints</h1>
          <p className="page-subtitle">
            Generate ready-to-display marketing banners for in-store checkout screens, social stories, and mobile touchpoints.
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn-secondary" onClick={handleCopyEmbedCode}>
            {copiedEmbed ? "✓ Embed Code Copied!" : "</> Copy Embed Code"}
          </button>
          <button className="btn-primary" onClick={handleSaveBanner} disabled={saving}>
            {saving ? "Saving..." : "+ Save to Touchpoints"}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: "2rem", alignItems: "start" }}>
        {/* Editor Controls */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Touchpoint Format</h3>
          <p className="section-desc" style={{ marginBottom: "1rem" }}>Select where this creative will be delivered</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "1.5rem" }}>
            {PRESET_TEMPLATES.map(tpl => (
              <div
                key={tpl.id}
                onClick={() => setSelectedTouchpoint(tpl.id)}
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "8px",
                  border: selectedTouchpoint === tpl.id ? "2px solid #6366F1" : "1px solid #E2E8F0",
                  background: selectedTouchpoint === tpl.id ? "#EEF2FF" : "#FFFFFF",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ fontSize: "0.9rem", color: selectedTouchpoint === tpl.id ? "#4338CA" : "#0F172A" }}>
                    {tpl.name}
                  </strong>
                  <span style={{ fontSize: "0.7rem", padding: "0.15rem 0.5rem", borderRadius: "4px", background: "#E2E8F0", color: "#475569" }}>
                    {tpl.resolution}
                  </span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "#64748B", marginTop: "4px" }}>
                  {tpl.desc}
                </div>
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Design Theme</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "1.5rem" }}>
            {COLOR_THEMES.map(th => (
              <div
                key={th.id}
                onClick={() => setSelectedTheme(th.id)}
                style={{
                  padding: "0.6rem 0.75rem",
                  borderRadius: "8px",
                  border: selectedTheme === th.id ? "2px solid #6366F1" : "1px solid #E2E8F0",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: th.accent }}></div>
                <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "#1E293B" }}>{th.name.split(" ")[0]}</span>
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Content Customization</h3>
          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "#475569", marginBottom: "4px", display: "block" }}>
              Headline
            </label>
            <input 
              className="input" 
              value={headline} 
              onChange={e => setHeadline(e.target.value)} 
              placeholder="e.g. 20% Off Your Purchase"
            />
          </div>

          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "#475569", marginBottom: "4px", display: "block" }}>
              Subtitle / Hook
            </label>
            <input 
              className="input" 
              value={subtitle} 
              onChange={e => setSubtitle(e.target.value)} 
              placeholder="Scan or present at checkout"
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "1rem" }}>
            <div className="form-group">
              <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "#475569", marginBottom: "4px", display: "block" }}>
                Promo / Voucher Code
              </label>
              <input 
                className="input" 
                value={discountCode} 
                onChange={e => setDiscountCode(e.target.value.toUpperCase())} 
                placeholder="SUMMER20"
              />
            </div>
            <div className="form-group">
              <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "#475569", marginBottom: "4px", display: "block" }}>
                CTA Button Text
              </label>
              <input 
                className="input" 
                value={ctaText} 
                onChange={e => setCtaText(e.target.value)} 
                placeholder="Scan to Claim"
              />
            </div>
          </div>

          <div className="form-group">
            <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "#475569", marginBottom: "4px", display: "block" }}>
              Link to Campaign
            </label>
            <select
              className="input"
              value={selectedCampaignId}
              onChange={e => setSelectedCampaignId(e.target.value)}
            >
              <option value="">Standalone Merchant Banner</option>
              {campaigns.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.status})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Touchpoint Preview */}
        <div>
          <div className="card" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div>
                <h3 style={{ margin: "0", fontSize: "1.1rem" }}>Live Touchpoint Preview</h3>
                <span style={{ fontSize: "0.8rem", color: "#64748B" }}>
                  Rendering in {currentTouchpoint.name} mode ({currentTouchpoint.resolution})
                </span>
              </div>
              <span className="status-badge active">Pixel Perfect</span>
            </div>

            {/* Dynamic Interactive Banner Display */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#0F172A",
                padding: "2rem",
                borderRadius: "12px",
                overflow: "hidden"
              }}
            >
              <div
                style={{
                  width: currentTouchpoint.width,
                  minHeight: currentTouchpoint.minHeight,
                  background: currentTheme.bg,
                  color: currentTheme.textColor,
                  border: currentTheme.border,
                  borderRadius: "16px",
                  padding: selectedTouchpoint === "story_9_16" ? "3rem 1.5rem" : "2rem 2.5rem",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                  overflow: "hidden",
                  transition: "all 0.3s ease"
                }}
              >
                {/* Background glow circle */}
                <div
                  style={{
                    position: "absolute",
                    top: "-20%",
                    right: "-10%",
                    width: "250px",
                    height: "250px",
                    borderRadius: "50%",
                    background: currentTheme.accent,
                    opacity: 0.15,
                    filter: "blur(50px)",
                    pointerEvents: "none"
                  }}
                />

                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "24px", height: "24px", borderRadius: "6px", background: currentTheme.accent, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "bold", fontSize: "0.75rem" }}>
                      M
                    </div>
                    <span style={{ fontSize: "0.85rem", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase" }}>
                      Maison Lune · Paris
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: "700",
                      padding: "0.25rem 0.6rem",
                      borderRadius: "12px",
                      background: currentTheme.accentBg,
                      color: currentTheme.accent,
                      border: `1px solid ${currentTheme.accent}`
                    }}
                  >
                    EXCLUSIVITÉ
                  </span>
                </div>

                {/* Main Offer Content */}
                <div style={{ margin: selectedTouchpoint === "story_9_16" ? "4rem 0" : "2rem 0" }}>
                  <h1
                    style={{
                      fontSize: selectedTouchpoint === "story_9_16" ? "2.2rem" : selectedTouchpoint === "pos_screen" ? "2.5rem" : "1.5rem",
                      fontWeight: "800",
                      lineHeight: "1.15",
                      marginBottom: "0.75rem",
                      letterSpacing: "-0.5px"
                    }}
                  >
                    {headline}
                  </h1>
                  <p style={{ fontSize: "1rem", opacity: 0.85, maxWidth: "520px", lineHeight: "1.5" }}>
                    {subtitle}
                  </p>
                </div>

                {/* Footer with Voucher & QR code */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "1rem",
                    borderTop: `1px solid rgba(255,255,255,0.1)`,
                    paddingTop: "1.25rem"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        padding: "0.5rem 1rem",
                        borderRadius: "8px",
                        background: currentTheme.accentBg,
                        border: `1px dashed ${currentTheme.accent}`,
                        color: currentTheme.accent,
                        fontWeight: "800",
                        fontSize: "1.1rem",
                        letterSpacing: "1px"
                      }}
                    >
                      {discountCode}
                    </div>
                    <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>
                      Present at till or enter online
                    </div>
                  </div>

                  {/* QR code mock */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        background: "#fff",
                        borderRadius: "6px",
                        padding: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <svg viewBox="0 0 24 24" width="40" height="40" fill="#0F172A">
                        <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 13h6v6H3v-6zm2 2v2h2v-2H5zm13-2h3v3h-3v-3zm-5 0h2v2h-2v-2zm2 2h2v2h-2v-2zm3 3h3v3h-3v-3zm-3 0h2v2h-2v-2zm-5 0h2v2h-2v-2z"/>
                      </svg>
                    </div>
                    <button
                      style={{
                        background: currentTheme.accent,
                        color: currentTheme.id === "minimal_slate" ? "#fff" : "#0F172A",
                        border: "none",
                        padding: "0.6rem 1.25rem",
                        borderRadius: "8px",
                        fontWeight: "700",
                        fontSize: "0.85rem",
                        cursor: "pointer",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
                      }}
                    >
                      {ctaText} &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Saved Banners Table */}
          <div className="card" style={{ padding: "1.5rem" }}>
            <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem" }}>Deployed Touchpoint Creatives</h3>
            <p className="section-desc" style={{ marginBottom: "1rem" }}>Banners active across your store POS and social channels</p>
            {savedBanners.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "#64748B" }}>
                No banners deployed yet. Click "+ Save to Touchpoints" to deploy your first creative.
              </div>
            ) : (
              <table className="data-table clean" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Touchpoint</th>
                    <th>Headline</th>
                    <th>Code</th>
                    <th>Theme</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {savedBanners.map((b, i) => (
                    <tr key={i}>
                      <td><span className="status-badge active">{b.touchpoint}</span></td>
                      <td><strong>{b.title}</strong></td>
                      <td><code>{b.discount_code}</code></td>
                      <td>{b.theme}</td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          className="btn-secondary"
                          style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem", width: "auto" }}
                          onClick={() => {
                            setHeadline(b.title);
                            setSubtitle(b.subtitle || "");
                            setDiscountCode(b.discount_code || "PROMO");
                            setSelectedTouchpoint(b.touchpoint || "pos_screen");
                            setSelectedTheme(b.theme || "luxury_gold");
                          }}
                        >
                          Load in Editor
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
