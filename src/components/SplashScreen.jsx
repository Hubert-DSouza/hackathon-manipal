import React from 'react';

export default function SplashScreen({ onGetStarted, onContinueAsGuest }) {
  return (
    <div className="splash-screen">
      <div className="splash-content">
        {/* Brand Hero Header */}
        <div className="splash-brand">
          <div className="splash-logo">
            Ripple<span className="splash-wave">⌁</span>
          </div>
          <div className="splash-tagline">Small issues. Big impact.</div>
        </div>

        {/* Hero Visual Banner */}
        <div className="splash-hero-card">
          <div className="splash-badge">📍 Manipal Community</div>
          <h2>Report local issues.<br />Fix your neighborhood.</h2>
          <p>
            Join your neighbors to verify road hazards, water logging, fallen trees, and utility outages in real time.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="splash-features">
          <div className="feature-item">
            <span className="feat-icon">⚡</span>
            <div>
              <strong>Instant Incident Reports</strong>
              <small>Spot hazards near you and alert the community in seconds.</small>
            </div>
          </div>

          <div className="feature-item">
            <span className="feat-icon">👥</span>
            <div>
              <strong>Community Verified</strong>
              <small>Confirm issues you witness so authorities act faster.</small>
            </div>
          </div>

          <div className="feature-item">
            <span className="feat-icon">🗺️</span>
            <div>
              <strong>Live Location Map</strong>
              <small>Track active problems near MIT, KMC, and Tiger Circle.</small>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="splash-actions">
          <button className="splash-primary-btn" onClick={onGetStarted}>
            Sign In / Sign Up
          </button>
          {onContinueAsGuest && (
            <button className="splash-secondary-btn" onClick={onContinueAsGuest}>
              Preview as Guest
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
