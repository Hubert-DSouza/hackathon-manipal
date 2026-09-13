import React from 'react';

export default function SplashScreen({ onGetStarted, onContinueAsGuest }) {
  return (
    <div className="splash-screen-redesign" onClick={onGetStarted}>
      {/* Background Cloud & Atmosphere overlay */}
      <div className="splash-bg-clouds">
        <div className="cloud cloud-1" />
        <div className="cloud cloud-2" />
      </div>

      <div className="splash-center-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Main Logo Image Badge */}
        <div className="splash-main-brand" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img 
            src="/socitea-logo.jpg" 
            alt="SociTea Branding" 
            style={{ 
              width: '160px', 
              height: '160px', 
              borderRadius: '32px', 
              objectFit: 'cover',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.35)',
              border: '3px solid rgba(255, 255, 255, 0.9)'
            }} 
          />
        </div>

        {/* Stylized Center Tagline */}
        <div className="splash-tagline-block" style={{ marginTop: '24px', textAlign: 'center' }}>
          <p className="splash-main-tagline" style={{ 
            fontFamily: "'Outfit', 'Georgia', serif",
            fontStyle: 'italic',
            fontSize: '24px',
            fontWeight: '600',
            color: '#ffffff',
            letterSpacing: '0.2px',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            lineHeight: '1.3',
            margin: '0'
          }}>
            What’s happening around you.
          </p>
        </div>
      </div>

      {/* Bottom City / Bridge Graphic & Footer */}
      <div className="splash-bottom-art">
        {/* Bridge & Skyline SVG silhouette */}
        <svg className="skyline-svg" viewBox="0 0 400 120" preserveAspectRatio="none">
          <path
            d="M0 120 L0 90 L30 90 L30 70 L40 70 L40 90 L80 90 L100 40 L110 40 L130 90 L180 90 L200 20 L210 20 L230 90 L280 90 L290 65 L310 65 L320 90 L400 90 L400 120 Z"
            fill="rgba(255, 255, 255, 0.08)"
          />
          {/* Bridge Cables */}
          <path
            d="M60 90 Q 105 35 150 90 Q 205 15 260 90"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="2"
            fill="none"
          />
        </svg>

        <div className="splash-footer-text">
          <p>For a safer, stronger tomorrow.</p>
          <p>By the people, for the people.</p>
        </div>

        <div className="splash-tap-action">
          <button className="splash-btn-primary" onClick={(e) => { e.stopPropagation(); onGetStarted(); }}>
            Get Started →
          </button>
          {onContinueAsGuest && (
            <button className="splash-btn-ghost" onClick={(e) => { e.stopPropagation(); onContinueAsGuest(); }}>
              Explore Feed
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
