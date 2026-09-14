import React from 'react';
import { supabase } from '../lib/supabase';
import { IconShield, IconStar, IconPin, IconFile, IconCheckCircle, IconZap } from './Icons';

export default function ProfileModal({ user, profile, points = 50, credibility = 94, onClose, onSignOut, userEvents = [], savedEventsList = [], confirmCount = 0 }) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    onSignOut();
    onClose();
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'SociTea Member';
  const googleAvatar = profile?.avatar_url || user?.user_metadata?.avatar_url;
  const initialLetter = (displayName ? displayName.charAt(0) : 'S').toUpperCase();

  return (
    <div className="modal-overlay">
      <div className="profile-sheet">
        <button className="back-btn" onClick={onClose}>×</button>
        
        <div className="profile-card-header">
          <div className="profile-avatar-large" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {googleAvatar ? (
              <img src={googleAvatar} alt={displayName} />
            ) : (
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: '#087267',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                fontWeight: '800',
                boxShadow: '0 4px 14px rgba(8, 114, 103, 0.3)'
              }}>
                {initialLetter}
              </div>
            )}
          </div>
          <h3>{displayName}</h3>
          <p className="profile-email">{user?.email || 'Logged in user'}</p>
          <div className="credibility-pill">
            <IconShield size={12} color="#0b7067" /> &nbsp;
            <span>{credibility}% Credibility</span>
          </div>
        </div>

        {/* Gamified Stats Dashboard */}
        <div className="profile-stats-grid">
          <div className="stat-card points">
            <span className="stat-icon"><IconStar size={18} color="#087267" /></span>
            <strong>{points}</strong>
            <small>SociTea Points</small>
          </div>
          <div className="stat-card">
            <span className="stat-icon"><IconFile size={18} color="#455a64" /></span>
            <strong>{userEvents.length}</strong>
            <small>My Reports</small>
          </div>
          <div className="stat-card">
            <span className="stat-icon"><IconCheckCircle size={18} color="#087267" /></span>
            <strong>{confirmCount}</strong>
            <small>Verifications</small>
          </div>
          <div className="stat-card">
            <span className="stat-icon"><IconZap size={18} color="#e65100" /></span>
            <strong>5 Days</strong>
            <small>Streak</small>
          </div>
        </div>

        {/* My Reports Section */}
        <div className="profile-section">
          <h4>My Submitted Reports</h4>
          {userEvents.length === 0 ? (
            <div className="empty-sub-box">
              <p>You haven't posted any local reports yet.</p>
              <small>Spot a pothole, road block, or water logging? Tap '+' to report!</small>
            </div>
          ) : (
            <div className="user-events-list">
              {userEvents.map((evt) => (
                <div key={evt.id} className="user-event-item">
                  <div className="item-details">
                    <strong>{evt.title}</strong>
                    <small><IconPin size={10} color="#0b7067" /> {evt.location} · {evt.time || 'Recently'}</small>
                  </div>
                  <span className="status-tag">Active</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Saved Reports Section */}
        {savedEventsList && savedEventsList.length > 0 && (
          <div className="profile-section" style={{ marginTop: '16px' }}>
            <h4>Saved Reports ({savedEventsList.length})</h4>
            <div className="user-events-list">
              {savedEventsList.map((evt) => (
                <div key={evt.id} className="user-event-item" style={{ background: '#eaf5f2', border: '1px solid #b2dfdb' }}>
                  <div className="item-details">
                    <strong>{evt.title}</strong>
                    <small><IconPin size={10} color="#0b7067" /> {evt.location} · {evt.time || 'Recently'}</small>
                  </div>
                  <span className="status-tag" style={{ background: '#087267', color: '#ffffff' }}>Saved</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button className="signout-btn" onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
