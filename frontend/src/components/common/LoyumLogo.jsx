import React from 'react';

export function LoyumIcon({ size = 32, fill = "#001F46", letterFill = "#FFFFFF", className = "" }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 119.36 119.36" 
      width={size} 
      height={size} 
      className={`loyum-seal-icon ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    >
      <defs>
        <filter id="sealGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#F2B12F" floodOpacity="0.25"/>
        </filter>
      </defs>
      <g>
        <path 
          fill={fill} 
          d="M108.22,36.69,96.31,31.13a17.5,17.5,0,0,1-7.5-7.61l-5.37-12a4.66,4.66,0,0,0-4.22-2.67,4.29,4.29,0,0,0-1.47.26L65.39,13.59a15.69,15.69,0,0,1-5.19.79h0a16,16,0,0,1-5.49-.87L42.43,8.82a4.26,4.26,0,0,0-1.55-.28,4.67,4.67,0,0,0-4.19,2.6L31.13,23.05a17.5,17.5,0,0,1-7.61,7.5l-12,5.37A4.67,4.67,0,0,0,9.1,41.61L13.59,54a17.47,17.47,0,0,1-.08,10.68L8.82,76.93a4.67,4.67,0,0,0,2.32,5.74l11.91,5.56a17.47,17.47,0,0,1,7.5,7.62l5.36,12a4.69,4.69,0,0,0,4.23,2.67,4.29,4.29,0,0,0,1.47-.26L54,105.77a15.69,15.69,0,0,1,5.19-.79,16,16,0,0,1,5.49.87l12.28,4.69a4.26,4.26,0,0,0,1.55.28,4.67,4.67,0,0,0,4.19-2.6l5.56-11.91a17.45,17.45,0,0,1,7.61-7.5l12-5.36a4.68,4.68,0,0,0,2.41-5.7l-4.49-12.36a17.39,17.39,0,0,1,.08-10.68l4.69-12.28A4.67,4.67,0,0,0,108.22,36.69Z"
        />
        <path 
          fill={fill} 
          d="M119,39.83a5.77,5.77,0,0,0-2.91-7.16l-14.87-6.94a16.51,16.51,0,0,1-6.94-7l-6.7-15a5.77,5.77,0,0,0-7.11-3L65.05,6.29a16.44,16.44,0,0,1-9.89-.08L39.83.36a5.77,5.77,0,0,0-7.16,2.9L25.73,18.13a16.51,16.51,0,0,1-7,6.94l-15,6.7a5.77,5.77,0,0,0-3,7.11L6.29,54.3a16.47,16.47,0,0,1-.08,9.9L.36,79.53a5.77,5.77,0,0,0,2.9,7.16l14.87,6.94a16.48,16.48,0,0,1,6.94,7.06l6.7,15a5.77,5.77,0,0,0,7.11,3l15.42-5.61a16.48,16.48,0,0,1,9.9.08L79.53,119a5.76,5.76,0,0,0,7.16-2.9l6.94-14.87a16.51,16.51,0,0,1,7.05-6.94l15-6.69a5.79,5.79,0,0,0,3-7.12l-5.61-15.43a16.44,16.44,0,0,1,.08-9.89Zm-6.35,3.4L108,55.52a15.35,15.35,0,0,0-.08,9.1L112.39,77a6.91,6.91,0,0,1-3.62,8.54l-12,5.37a15.34,15.34,0,0,0-6.48,6.38l-5.56,11.92a6.89,6.89,0,0,1-6.24,3.91,6.41,6.41,0,0,1-2.35-.44L63.84,108a15.36,15.36,0,0,0-9.1-.08l-12.35,4.5a6.62,6.62,0,0,1-2.25.39,7,7,0,0,1-6.29-4l-5.37-12a15.36,15.36,0,0,0-6.38-6.49L10.18,84.72A6.92,6.92,0,0,1,6.7,76.13l4.69-12.29a15.35,15.35,0,0,0,.08-9.1L7,42.39a6.91,6.91,0,0,1,3.62-8.54l12-5.37a15.31,15.31,0,0,0,6.49-6.38l5.56-11.92a6.89,6.89,0,0,1,6.24-3.91,6.66,6.66,0,0,1,2.35.43l12.28,4.69a13.67,13.67,0,0,0,4.69.73h0a13.52,13.52,0,0,0,4.42-.65L77,7a6.62,6.62,0,0,1,2.25-.39,7,7,0,0,1,6.29,4l5.37,12a15.36,15.36,0,0,0,6.38,6.49l11.92,5.56A6.92,6.92,0,0,1,112.66,43.23Z"
        />
        <text 
          transform="translate(32 83.01)" 
          fill={letterFill} 
          style={{ 
            fontSize: '70px', 
            fontFamily: "'Playfair Display', 'Cinzel', Georgia, serif", 
            fontWeight: 700,
            fontStyle: 'italic'
          }}
        >
          L
        </text>
      </g>
    </svg>
  );
}

export default function LoyumLogo({ 
  variant = "horizontal", 
  theme = "dark", 
  size = "md",
  showSubtitle = true,
  className = "" 
}) {
  const isDark = theme === "dark";
  const textColor = isDark ? "#FFFFFF" : "#001F46";
  const subColor = isDark ? "#F5DFBB" : "#562C2C";
  const sealFill = isDark ? "#F2B12F" : "#001F46";
  const sealLetter = isDark ? "#001F46" : "#FFFFFF";

  if (variant === "icon") {
    return (
      <LoyumIcon 
        size={size === "sm" ? 24 : size === "lg" ? 48 : 34} 
        fill={sealFill} 
        letterFill={sealLetter} 
        className={className} 
      />
    );
  }

  if (variant === "vertical") {
    return (
      <div className={`loyum-brand-vertical ${className}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px' }}>
        <LoyumIcon size={size === "lg" ? 64 : 52} fill={sealFill} letterFill={sealLetter} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span 
            style={{ 
              fontFamily: "'Segoe UI', 'Sego', -apple-system, sans-serif", 
              fontWeight: 800, 
              fontSize: size === "lg" ? '1.8rem' : '1.45rem', 
              letterSpacing: '0.12em', 
              color: textColor,
              lineHeight: 1.1
            }}
          >
            LOYUM
          </span>
          {showSubtitle && (
            <span 
              style={{ 
                fontFamily: "'Segoe UI', 'Sego', sans-serif",
                fontSize: '0.68rem', 
                fontWeight: 600, 
                letterSpacing: '0.2em', 
                textTransform: 'uppercase', 
                color: subColor,
                marginTop: '4px',
                opacity: 0.95
              }}
            >
              MINDSIT • OFFICIAL
            </span>
          )}
        </div>
      </div>
    );
  }

  // Default: Horizontal
  return (
    <div 
      className={`loyum-brand-horizontal ${className}`} 
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '12px',
        userSelect: 'none'
      }}
    >
      <LoyumIcon 
        size={size === "sm" ? 28 : size === "lg" ? 42 : 36} 
        fill={sealFill} 
        letterFill={sealLetter} 
      />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span 
            style={{ 
              fontFamily: "'Segoe UI', 'Sego', -apple-system, sans-serif", 
              fontWeight: 800, 
              fontSize: size === "sm" ? '1.15rem' : size === "lg" ? '1.5rem' : '1.3rem', 
              letterSpacing: '0.1em', 
              color: textColor,
              lineHeight: 1
            }}
          >
            LOYUM
          </span>
          <span 
            style={{ 
              background: 'linear-gradient(135deg, #F2B12F, #F2EA2F)',
              color: '#001F46',
              fontSize: '0.58rem',
              fontWeight: 800,
              padding: '1px 5px',
              borderRadius: '4px',
              letterSpacing: '0.05em'
            }}
          >
            OS
          </span>
        </div>
        {showSubtitle && (
          <span 
            style={{ 
              fontSize: '0.62rem', 
              fontWeight: 600, 
              letterSpacing: '0.14em', 
              textTransform: 'uppercase', 
              color: subColor,
              marginTop: '3px',
              opacity: 0.9
            }}
          >
            MINDSIT 2024
          </span>
        )}
      </div>
    </div>
  );
}
