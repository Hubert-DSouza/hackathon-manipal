import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { supabase } from './lib/supabase';
import ReportModal from './components/ReportModal';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';
import SplashScreen from './components/SplashScreen';
import CommentsModal from './components/CommentsModal';
import MapView from './components/MapView';
import SuggestionsView from './components/SuggestionsView';
import {
  IconPin, IconHeart, IconChat, IconShare, IconBookmark,
  IconShield, IconUser, IconKey, IconLightbulb, IconAlert, IconStar, IconHome
} from './components/Icons';

const INITIAL_MOCK_EVENTS = [
  {
    id: 1,
    title: 'Severe Pothole Damage & Mud Water Logging',
    location: 'Western Express Highway, Mumbai',
    latitude: 19.0760,
    longitude: 72.8777,
    distance: 0.4,
    time: '15m ago',
    seen: 48,
    confirmed: 56,
    likes: 34,
    commentsCount: 9,
    category: 'Roads',
    author: 'Hubert D\'Souza',
    credibility: 96,
    impactNote: 'High vehicle damage risk',
    image: '/pothole.jpg',
  },
  {
    id: 2,
    title: 'Drainage Overflow & Road Inundation',
    location: 'Bandra Kurla Complex, Mumbai',
    latitude: 19.0657,
    longitude: 72.8686,
    distance: 0.8,
    time: '45m ago',
    seen: 62,
    confirmed: 42,
    likes: 28,
    commentsCount: 11,
    category: 'Water',
    author: 'Ananya Rao',
    credibility: 94,
    impactNote: 'Pedestrian hazard & flooding',
    image: '/flooding.jpg',
  },
  {
    id: 3,
    title: 'Illegal Waste Dump & Uncollected Garbage Pile',
    location: 'Dadar Market Area, Mumbai',
    latitude: 19.0178,
    longitude: 72.8478,
    distance: 1.5,
    time: '2h ago',
    seen: 39,
    confirmed: 31,
    likes: 22,
    commentsCount: 6,
    category: 'Sanitation',
    author: 'Vikram Sen',
    credibility: 91,
    impactNote: 'Foul odor & sanitation risk',
    image: '/garbage.jpg',
  },
  {
    id: 4,
    title: 'Dilapidated Structural Danger & Unsafe Building',
    location: 'Colaba Causeway, Mumbai',
    latitude: 18.9067,
    longitude: 72.8147,
    distance: 2.1,
    time: '3h ago',
    seen: 54,
    confirmed: 45,
    likes: 38,
    commentsCount: 14,
    category: 'Public Safety',
    author: 'Priya Sharma',
    credibility: 95,
    impactNote: 'Debris collapse hazard',
    image: '/unsafe_building.jpg',
  },
];

const filters = [
  { key: 'nearby', label: 'Nearby', range: '0 – 5 km', max: 5 },
  { key: 'taluka', label: 'Taluka', range: '5 – 25 km', max: 25 },
  { key: 'district', label: 'District', range: '25 – 100 km', max: 100 },
  { key: 'state', label: 'State', range: '100+ km', max: Infinity },
];

function App() {
  const [events, setEvents] = useState(INITIAL_MOCK_EVENTS);
  const [filter, setFilter] = useState('nearby');
  const [confirmed, setConfirmed] = useState({});
  const [notHere, setNotHere] = useState({});
  const [likedEvents, setLikedEvents] = useState({});
  const [savedEvents, setSavedEvents] = useState({});

  // Points & Toast state
  const [ripplePoints, setRipplePoints] = useState(75);
  const [toastMsg, setToastMsg] = useState(null);

  // Tab & Modals state
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'suggestions'
  const [showReportModal, setShowReportModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showMapView, setShowMapView] = useState(false);
  const [selectedMapEventId, setSelectedMapEventId] = useState(null);
  const [commentingEvent, setCommentingEvent] = useState(null);
  const [viewingPeopleEvent, setViewingPeopleEvent] = useState(null);
  const [isGuestPreview, setIsGuestPreview] = useState(false);

  // User & Profile state (tied directly to Supabase auth)
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  // Trigger Toast Notification & Sync Points to Supabase Profile
  const triggerToast = (msg, ptsAwarded = 0) => {
    if (ptsAwarded > 0) {
      setRipplePoints((prev) => {
        const nextPts = prev + ptsAwarded;
        if (user) {
          supabase.from('profiles').update({ ripple_points: nextPts }).eq('id', user.id).then();
        }
        return nextPts;
      });
    }
    setToastMsg({ text: msg, pts: ptsAwarded });
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Fetch User Profile from Supabase
  const loadUserProfile = async (authUser) => {
    if (!authUser) {
      setProfile(null);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (!error && data) {
        setProfile(data);
        if (data.ripple_points) setRipplePoints(data.ripple_points);
      } else {
        // Create initial profile if missing
        const newProf = {
          id: authUser.id,
          full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'SociTea Member',
          avatar_url: authUser.user_metadata?.avatar_url || '',
          ripple_points: 50,
          credibility_score: 94.0,
        };
        await supabase.from('profiles').insert([newProf]);
        setProfile(newProf);
        setRipplePoints(50);
      }
    } catch {
      // Fallback
    }
  };

  // Check auth session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const authUser = session?.user ?? null;
      setUser(authUser);
      if (authUser) loadUserProfile(authUser);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const authUser = session?.user ?? null;
      setUser(authUser);
      if (authUser) loadUserProfile(authUser);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch events directly from Supabase
  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const formatted = data.map((item) => ({
          id: item.id,
          title: item.title,
          location: item.location,
          latitude: Number(item.latitude || 13.3521),
          longitude: Number(item.longitude || 74.7947),
          distance: Number(item.distance || 0.4),
          time: item.created_at ? formatTimeAgo(item.created_at) : 'Just now',
          seen: item.seen || 1,
          confirmed: item.confirmed || 0,
          likes: item.likes_count || 12,
          commentsCount: item.comments_count || 3,
          category: item.category || 'Roads',
          author: item.author_name || 'Community Member',
          credibility: item.author_credibility || 94,
          impactNote: item.impact_note || 'Local issue',
          image: item.image || 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1200&q=85',
          user_id: item.user_id,
        }));
        setEvents(formatted);
      }
    } catch {
      // Fallback mock events if database table not yet populated
    }
  };

  useEffect(() => {
    fetchEvents();

    const channel = supabase
      .channel('public:events')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => {
        fetchEvents();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  function formatTimeAgo(dateString) {
    const diff = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  const visibleEvents = useMemo(() => {
    const selected = filters.find((f) => f.key === filter);
    if (!selected) return events;
    if (filter === 'nearby') return events.filter((e) => e.distance <= 5);
    return events.filter((e) => e.distance > 5 && e.distance <= selected.max);
  }, [filter, events]);

  const handleCreateEvent = async (newEventData) => {
    const authorName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'SociTea Member';
    const payload = {
      ...newEventData,
      user_id: user?.id || null,
      author_name: authorName,
      author_credibility: profile?.credibility_score || 94.0,
      created_at: new Date().toISOString(),
    };

    const tempId = Date.now();
    const optimisticEvent = {
      id: tempId,
      ...payload,
      time: 'Just now',
      seen: 1,
      confirmed: 0,
      likes: 1,
      commentsCount: 0,
      author: authorName,
      credibility: profile?.credibility_score || 94.0,
      impactNote: 'Fresh report',
    };

    setEvents((prev) => [optimisticEvent, ...prev]);
    setShowReportModal(false);
    triggerToast('Report published to neighborhood feed!', 10);

    try {
      const { error } = await supabase.from('events').insert([payload]);
      if (!error) fetchEvents();
    } catch (err) {
      console.warn('Supabase insert fallback:', err);
    }
  };

  function toggleConfirm(id) {
    const isConfirming = !confirmed[id];
    setConfirmed((prev) => ({ ...prev, [id]: isConfirming }));
    setNotHere((prev) => ({ ...prev, [id]: false }));

    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          const delta = isConfirming ? 1 : -1;
          const updatedSeen = Math.max(1, e.seen + delta);
          const updatedConfirmed = Math.max(0, e.confirmed + delta);
          if (typeof id === 'number') {
            supabase.from('events').update({ seen: updatedSeen, confirmed: updatedConfirmed }).eq('id', id).then();
          }
          return { ...e, seen: updatedSeen, confirmed: updatedConfirmed };
        }
        return e;
      })
    );

    if (isConfirming) {
      triggerToast('Confirmed! +10 Points for verifying community report', 10);
    }
  }

  function toggleNotHere(id) {
    const isNotHere = !notHere[id];
    setNotHere((prev) => ({ ...prev, [id]: isNotHere }));
    
    if (confirmed[id]) {
      setConfirmed((prev) => ({ ...prev, [id]: false }));
      setEvents((prev) =>
        prev.map((e) => {
          if (e.id === id) {
            const updatedSeen = Math.max(1, e.seen - 1);
            const updatedConfirmed = Math.max(0, e.confirmed - 1);
            if (typeof id === 'number') {
              supabase.from('events').update({ seen: updatedSeen, confirmed: updatedConfirmed }).eq('id', id).then();
            }
            return { ...e, seen: updatedSeen, confirmed: updatedConfirmed };
          }
          return e;
        })
      );
    }
    if (isNotHere) {
      triggerToast('Flagged as not here. Thanks for your verification feedback!', 0);
    }
  }

  function toggleLike(id) {
    setLikedEvents((prev) => {
      const isLiked = !prev[id];
      setEvents((currentEvents) =>
        currentEvents.map((evt) =>
          evt.id === id ? { ...evt, likes: evt.likes + (isLiked ? 1 : -1) } : evt
        )
      );
      if (typeof id === 'number') {
        const target = events.find((e) => e.id === id);
        if (target) {
          const nextLikes = target.likes + (isLiked ? 1 : -1);
          supabase.from('events').update({ likes_count: nextLikes }).eq('id', id).then();
        }
      }
      return { ...prev, [id]: isLiked };
    });
  }

  function toggleSave(id) {
    setSavedEvents((prev) => {
      const isSaved = !prev[id];
      triggerToast(isSaved ? 'Report saved to your profile!' : 'Removed from saved items', 0);
      return { ...prev, [id]: isSaved };
    });
  }

  function handleShare(event) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      triggerToast(`Link copied to clipboard!`, 0);
    } else {
      triggerToast(`Sharing report: ${event.title}`, 0);
    }
  }

  const handleProfileClick = () => {
    setShowProfileModal(true);
  };

  const handleOpenMap = (eventId = null) => {
    setSelectedMapEventId(eventId);
    setShowMapView(true);
  };

  // Render splash screen if user is logged out and not explicitly previewing as guest
  if (!user && !isGuestPreview) {
    return (
      <>
        <SplashScreen
          onGetStarted={() => setShowAuthModal(true)}
          onContinueAsGuest={() => setIsGuestPreview(true)}
        />
        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            onAuthSuccess={(authUser) => {
              setUser(authUser);
              setShowAuthModal(false);
              loadUserProfile(authUser);
            }}
          />
        )}
      </>
    );
  }

  return (
    <div className="app-shell">
      <header className="header">
        <div className="brand" style={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src="/socitea-header-logo.png" 
            alt="SociTea - What's happening around you" 
            style={{ height: '42px', width: 'auto', objectFit: 'contain' }} 
          />
        </div>
        <div className="header-actions">
          <button
            className="location-pill-btn"
            onClick={() => handleOpenMap()}
            title="Open Map View"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#e0f2f1',
              border: '1px solid #b2dfdb',
              borderRadius: '20px',
              padding: '6px 12px',
              cursor: 'pointer',
              color: '#004d40',
              fontSize: '13px',
              fontWeight: '600'
            }}
          >
            <IconPin size={14} color="#087267" />
            <span>Mumbai</span>
          </button>
        </div>
      </header>

      {activeTab === 'home' && (
        <>
          <nav className="filter-scroll" aria-label="Distance filter">
            {filters.map((item, index) => (
              <button
                key={item.key}
                className={`filter-pill ${filter === item.key ? 'active' : ''}`}
                onClick={() => setFilter(item.key)}
              >
                <span className="filter-icon">{index === 0 ? '◎' : index === 1 ? '⌖' : index === 2 ? '⌖' : '◫'}</span>
                <span><b>{item.label}</b><small>{item.range}</small></span>
              </button>
            ))}
          </nav>

          <main className="feed">
            {visibleEvents.length === 0 && (
              <div className="empty">No reports in this distance yet.</div>
            )}
            {visibleEvents.map((event) => (
              <article className="event-block" key={event.id}>
                {/* Author Bar */}
                <div className="post-author-bar">
                  <div className="author-info">
                    <div className="author-avatar">{event.author?.charAt(0) || 'R'}</div>
                    <div>
                      <span className="author-name">{event.author}</span>
                      <span className="credibility-tag">
                        <IconShield size={10} color="#0b7067" /> &nbsp;{event.credibility}%
                      </span>
                    </div>
                  </div>
                  {event.impactNote && (
                    <span className="post-impact-badge">
                      <IconAlert size={10} color="#e65100" /> &nbsp;{event.impactNote}
                    </span>
                  )}
                </div>

                {/* Event Card Banner */}
                <div className="event-card" style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,.20), rgba(0,0,0,.74)), url(${event.image})` }}>
                  <div className="card-top">
                    <span className="distance">➤ {event.distance.toFixed(1)} km away</span>
                    <span className="time">{event.time}</span>
                  </div>
                  <div className="card-content">
                    <h2>{event.title}</h2>
                    <p className="location-text"><IconPin size={12} color="#ffffff" /> {event.location}</p>
                    <div className="card-bottom">
                      <div 
                        className="seen" 
                        onClick={() => setViewingPeopleEvent(event)} 
                        style={{ cursor: 'pointer' }}
                        title="Click to view list of people who verified this"
                      >
                        <div className="avatars"><i /><i /><i /></div>
                        <span>+{event.seen} people have<br />seen this</span>
                      </div>
                    </div>
                    <button className="map-button" onClick={() => handleOpenMap(event.id)}>
                      ▧ &nbsp; View live on map&nbsp; →
                    </button>
                  </div>
                </div>

                {/* Verification Bar */}
                <div className="verify-row">
                  <div className="verify-copy"><strong>Have you seen this?</strong><span>Help verify this report</span></div>
                  <button className={`confirm ${confirmed[event.id] ? 'selected' : ''}`} onClick={() => toggleConfirm(event.id)}>✓ &nbsp; Confirm</button>
                  <button className={`not-here ${notHere[event.id] ? 'selected' : ''}`} onClick={() => toggleNotHere(event.id)}>× &nbsp; Not here</button>
                </div>

                {/* Social Interaction Bar */}
                <div className="social-bar">
                  <button
                    className={`social-action-btn ${likedEvents[event.id] ? 'liked' : ''}`}
                    onClick={() => toggleLike(event.id)}
                  >
                    <IconHeart size={14} color={likedEvents[event.id] ? '#e03e49' : '#5a6866'} filled={likedEvents[event.id]} />
                    <span>{event.likes}</span>
                  </button>

                  <button
                    className="social-action-btn"
                    onClick={() => setCommentingEvent(event)}
                  >
                    <IconChat size={14} color="#5a6866" />
                    <span>{event.commentsCount}</span>
                  </button>

                  <button
                    className="social-action-btn"
                    onClick={() => handleShare(event)}
                  >
                    <IconShare size={14} color="#5a6866" />
                    <span>Share</span>
                  </button>

                  <button
                    className={`social-action-btn ${savedEvents[event.id] ? 'saved' : ''}`}
                    onClick={() => toggleSave(event.id)}
                  >
                    <IconBookmark size={14} color={savedEvents[event.id] ? '#087267' : '#5a6866'} filled={savedEvents[event.id]} />
                  </button>
                </div>
              </article>
            ))}
          </main>
        </>
      )}

      {activeTab === 'suggestions' && (
        <SuggestionsView user={user} onAddToast={triggerToast} />
      )}

      <nav className="bottom-nav">
        <button
          className={`nav-item ${activeTab === 'home' && !showMapView ? 'active' : ''}`}
          onClick={() => {
            setShowMapView(false);
            setActiveTab('home');
          }}
        >
          <IconHome size={20} color={activeTab === 'home' && !showMapView ? '#087267' : '#75807e'} />
          Home
        </button>
        <button
          className={`nav-item ${activeTab === 'suggestions' && !showMapView ? 'active' : ''}`}
          onClick={() => {
            setShowMapView(false);
            setActiveTab('suggestions');
          }}
        >
          <IconLightbulb size={20} color={activeTab === 'suggestions' && !showMapView ? '#087267' : '#75807e'} />
          Suggestions
        </button>
        <button
          className="report-button"
          aria-label="Report"
          onClick={() => {
            if (!user) {
              setShowAuthModal(true);
            } else {
              setShowReportModal(true);
            }
          }}
        >
          +
        </button>
        <button
          className={`nav-item ${showMapView ? 'active' : ''}`}
          onClick={() => handleOpenMap()}
        >
          <IconPin size={20} color={showMapView ? '#087267' : '#75807e'} />
          Map
        </button>
        <button className={`nav-item ${showProfileModal ? 'active' : ''}`} onClick={handleProfileClick}>
          <IconUser size={20} color={showProfileModal ? '#087267' : '#75807e'} />
          Profile
        </button>
      </nav>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="points-toast">
          {toastMsg.pts > 0 && <span className="toast-badge">+{toastMsg.pts} Points</span>}
          <span className="toast-msg">{toastMsg.text}</span>
        </div>
      )}

      {/* Map View */}
      {showMapView && (
        <MapView
          events={events}
          selectedEventId={selectedMapEventId}
          onClose={() => setShowMapView(false)}
        />
      )}

      {/* Modals */}
      {showReportModal && (
        <ReportModal
          onClose={() => setShowReportModal(false)}
          onSubmit={handleCreateEvent}
        />
      )}

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={(authUser) => {
            setUser(authUser);
            setShowAuthModal(false);
            loadUserProfile(authUser);
            setShowProfileModal(true);
          }}
        />
      )}

      {showProfileModal && (
        <ProfileModal
          user={user}
          profile={profile}
          points={ripplePoints}
          credibility={profile?.credibility_score || 94.0}
          confirmCount={Object.values(confirmed || {}).filter(Boolean).length}
          userEvents={(events || []).filter((e) => user?.id && e.user_id === user.id)}
          savedEventsList={(events || []).filter((e) => savedEvents && savedEvents[e.id])}
          onClose={() => setShowProfileModal(false)}
          onSignOut={() => {
            setUser(null);
            setProfile(null);
            setIsGuestPreview(false);
          }}
        />
      )}

      {/* Verified People List Drawer */}
      {viewingPeopleEvent && (
        <div className="modal-overlay" onClick={() => setViewingPeopleEvent(null)}>
          <div className="auth-sheet" onClick={(e) => e.stopPropagation()} style={{ paddingBottom: '24px' }}>
            <button className="back-btn" onClick={() => setViewingPeopleEvent(null)}>×</button>
            <div className="auth-header" style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', margin: '0 0 4px', color: '#112826' }}>People Who Verified This</h3>
              <p style={{ fontSize: '12px', color: '#596b68' }}>{viewingPeopleEvent.title}</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: '#f4f8f7', borderRadius: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#087267', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '13px' }}>H</div>
                <div>
                  <strong style={{ fontSize: '12px', color: '#112826', display: 'block' }}>Hubert Dsouza (You)</strong>
                  <small style={{ fontSize: '10px', color: '#0b7067' }}>✓ Verified resident · 94% Credibility</small>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: '#f4f8f7', borderRadius: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#26a69a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '13px' }}>A</div>
                <div>
                  <strong style={{ fontSize: '12px', color: '#112826', display: 'block' }}>Ananya R.</strong>
                  <small style={{ fontSize: '10px', color: '#0b7067' }}>✓ Verified resident · 96% Credibility</small>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: '#f4f8f7', borderRadius: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#78909c', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '13px' }}>R</div>
                <div>
                  <strong style={{ fontSize: '12px', color: '#112826', display: 'block' }}>Rahul K.</strong>
                  <small style={{ fontSize: '10px', color: '#0b7067' }}>✓ Verified resident · 91% Credibility</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {commentingEvent && (
        <CommentsModal
          event={commentingEvent}
          onClose={() => setCommentingEvent(null)}
          onAddComment={(evtId) => {
            setEvents((currentEvents) =>
              currentEvents.map((e) =>
                e.id === evtId ? { ...e, commentsCount: e.commentsCount + 1 } : e
              )
            );
            triggerToast('Comment added to discussion!', 2);
          }}
        />
      )}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
