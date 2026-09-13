import React from 'react';
import { supabase } from '../lib/supabase';

export default function ProfileModal({ user, profile, onClose, onSignOut, userEvents = [] }) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    onSignOut();
    onClose();
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email || 'Anonymous Citizen';
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';

  return (
    <div className="modal-overlay">
      <div className="profile-sheet">
        <button className="back-btn" onClick={onClose}>×</button>
        
        <div className="profile-card-header">
          <div className="profile-avatar-large">
            <img src={avatarUrl} alt={displayName} />
          </div>
          <h3>{displayName}</h3>
          <p className="profile-email">{user?.email}</p>
          <div className="reputation-badge">
            <span>⭐ Ripple Citizen</span>
          </div>
        </div>

        <div className="profile-stats-row">
          <div className="stat-box">
            <strong>{userEvents.length}</strong>
            <small>Reports Filed</small>
          </div>
          <div className="stat-box">
            <strong>Manipal</strong>
            <small>Home Base</small>
          </div>
        </div>

        <div className="profile-section">
          <h4>Your Recent Submissions</h4>
          {userEvents.length === 0 ? (
            <p className="empty-sub-text">You haven't filed any incident reports yet.</p>
          ) : (
            <div className="user-events-list">
              {userEvents.map((evt) => (
                <div key={evt.id} className="user-event-item">
                  <div>
                    <strong>{evt.title}</strong>
                    <small>{evt.location}</small>
                  </div>
                  <span className="status-tag">Active</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="signout-btn" onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
