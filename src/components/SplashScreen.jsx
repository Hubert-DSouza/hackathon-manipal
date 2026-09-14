import React from 'react';

export default function SplashScreen({ onGetStarted, onContinueAsGuest }) {
  return (
    <div 
      className="splash-screen-redesign" 
      onClick={onGetStarted} 
      style={{ 
        padding: '40px 24px 32px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        position: 'relative'
      }}
    >
      <div className="splash-center-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '30px', zIndex: 2 }}>
        {/* Main Branding Graphic Card Badge */}
        <div className="splash-main-brand" style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            padding: '16px 20px',
            boxShadow: '0 14px 36px rgba(0, 0, 0, 0.4)',
            border: '2px solid rgba(255, 255, 255, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img 
              src="/socitea-splash-transparent.png" 
              alt="SociTea Logo" 
              style={{ 
                height: '130px', 
                width: 'auto', 
                objectFit: 'contain'
              }} 
            />
          </div>
        </div>

        {/* Montserrat Light Center Tagline */}
        <div className="splash-tagline-block" style={{ textAlign: 'center', maxWidth: '300px' }}>
          <h1 className="splash-main-tagline" style={{ 
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: '300',
            fontSize: '30px',
            color: '#ffffff',
            lineHeight: '1.25',
            letterSpacing: '-0.3px',
            margin: '0 0 20px',
            textShadow: '0 2px 10px rgba(0,0,0,0.5)'
          }}>
            What’s happening<br />around you.
          </h1>

          {/* Subtitle / Microcopy */}
          <div style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: '400',
            fontSize: '10px',
            color: 'rgba(255, 255, 255, 0.85)',
            letterSpacing: '1.8px',
            textTransform: 'uppercase',
            lineHeight: '1.8',
            textShadow: '0 1px 6px rgba(0,0,0,0.5)'
          }}>
            <p style={{ margin: '0' }}>PEOPLE. PLACES. ACTIONS.</p>
            <p style={{ margin: '0' }}>A STRONGER TOMORROW, TOGETHER.</p>
          </div>
        </div>
      </div>

      {/* Bottom Action Area */}
      <div className="splash-bottom-art" style={{ position: 'relative', width: '100%', marginTop: 'auto', zIndex: 2 }}>
        <div className="splash-tap-action" style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', alignItems: 'center' }}>
          <button 
            className="splash-btn-primary" 
            onClick={(e) => { e.stopPropagation(); onGetStarted(); }}
            style={{
              width: '100%',
              maxWidth: '320px',
              padding: '14px 24px',
              borderRadius: '30px',
              background: '#fffdf5',
              color: '#073b35',
              fontWeight: '600',
              fontSize: '15px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(0,0,0,0.25)'
            }}
          >
            Get Started →
          </button>

          {onContinueAsGuest && (
            <button 
              className="splash-btn-ghost" 
              onClick={(e) => { e.stopPropagation(); onContinueAsGuest(); }}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.75)',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Explore Feed
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
