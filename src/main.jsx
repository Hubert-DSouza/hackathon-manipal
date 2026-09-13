import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { supabase } from './lib/supabase';
import ReportModal from './components/ReportModal';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';
import SplashScreen from './components/SplashScreen';

const INITIAL_MOCK_EVENTS = [
  {
    id: 1,
    title: 'Water logging near MIT Road',
    location: 'Near MIT Main Gate, Manipal',
    distance: 0.4,
    time: '2h ago',
    seen: 42,
    confirmed: 56,
    image: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 2,
    title: 'Water logging near MIT Main Gate',
    location: 'MIT Main Gate, Manipal',
    distance: 1.2,
    time: '4h ago',
    seen: 34,
    confirmed: 34,
    image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 3,
    title: 'Streetlight not working near Tiger Circle',
    location: 'Tiger Circle, Manipal',
    distance: 2.1,
    time: '6h ago',
    seen: 18,
    confirmed: 18,
    image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 4,
    title: 'Tree fallen near KMC',
    location: 'Near KMC, Manipal',
    distance: 3.4,
    time: '8h ago',
    seen: 27,
    confirmed: 22,
    image: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1200&q=85',
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

  // Modals & User state
  const [showReportModal, setShowReportModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isGuestPreview, setIsGuestPreview] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  // Check auth session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch events from Supabase
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
          distance: Number(item.distance || 0.4),
          time: item.created_at ? formatTimeAgo(item.created_at) : 'Just now',
          seen: item.seen || 1,
          confirmed: item.confirmed || 0,
          image: item.image || 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1200&q=85',
          user_id: item.user_id,
        }));
        setEvents(formatted);
      }
    } catch {
      // Keep fallback mock data if tables don't exist yet
    }
  };

  useEffect(() => {
    fetchEvents();

    // Subscribe to realtime updates
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
    const payload = {
      ...newEventData,
      user_id: user?.id || null,
      created_at: new Date().toISOString(),
    };

    // Optimistically update UI
    const tempId = Date.now();
    const optimisticEvent = {
      id: tempId,
      ...payload,
      time: 'Just now',
      seen: 1,
      confirmed: 0,
    };
    setEvents((prev) => [optimisticEvent, ...prev]);
    setShowReportModal(false);

    try {
      const { error } = await supabase.from('events').insert([payload]);
      if (error) {
        console.warn('Supabase insert notice:', error.message);
      } else {
        fetchEvents();
      }
    } catch (err) {
      console.warn('Supabase offline or table not ready yet:', err);
    }
  };

  function toggleConfirm(id) {
    setConfirmed((prev) => {
      const isSelected = !prev[id];
      if (isSelected) {
        const target = events.find((e) => e.id === id);
        if (target && typeof id === 'number') {
          supabase.from('events').update({ confirmed: (target.confirmed || 0) + 1 }).eq('id', id).then();
        }
      }
      return { ...prev, [id]: isSelected };
    });
    setNotHere((prev) => ({ ...prev, [id]: false }));
  }

  function toggleNotHere(id) {
    setNotHere((prev) => ({ ...prev, [id]: !prev[id] }));
    setConfirmed((prev) => ({ ...prev, [id]: false }));
  }

  const handleProfileClick = () => {
    if (user) {
      setShowProfileModal(true);
    } else {
      setShowAuthModal(true);
    }
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
            }}
          />
        )}
      </>
    );
  }

  return (
    <div className="app-shell">
      <header className="header">
        <div className="brand">
          <div className="logo">Ripple<span className="logo-wave">⌁</span></div>
          <div className="tagline">Small issues.<br />Big impact.</div>
        </div>
        <div className="header-actions">
          <button
            aria-label="Profile / Login"
            className="icon-button"
            onClick={handleProfileClick}
            title={user ? 'Profile' : 'Sign In'}
          >
            {user ? '👤' : '🔑'}
          </button>
        </div>
      </header>

      <section className="location-row">
        <div className="location">
          <span className="pin">●</span>
          <div><strong>Manipal</strong><small>Nearest first</small></div>
          <span className="chevron">⌄</span>
        </div>
      </section>

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
            <div className="event-card" style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,.20), rgba(0,0,0,.74)), url(${event.image})` }}>
              <div className="card-top">
                <span className="distance">➤ {event.distance.toFixed(1)} km away</span>
                <span className="time">{event.time}</span>
              </div>
              <div className="card-content">
                <h2>{event.title}</h2>
                <p className="location-text">♥ {event.location}</p>
                <div className="card-bottom">
                  <div className="seen"><div className="avatars"><i /><i /><i /></div><span>+{event.seen} people have<br />seen this</span></div>
                </div>
                <button className="map-button">▧ &nbsp; View live on map&nbsp; →</button>
              </div>
            </div>
            <div className="verify-row">
              <div className="verify-copy"><strong>Have you seen this?</strong><span>Help verify this report</span></div>
              <button className={`confirm ${confirmed[event.id] ? 'selected' : ''}`} onClick={() => toggleConfirm(event.id)}>✓ &nbsp; Confirm</button>
              <button className={`not-here ${notHere[event.id] ? 'selected' : ''}`} onClick={() => toggleNotHere(event.id)}>× &nbsp; Not here</button>
            </div>
          </article>
        ))}
      </main>

      <nav className="bottom-nav">
        <button className="nav-item active"><span>⌂</span>Home</button>
        <button className="nav-item"><span>⌑</span>Map</button>
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
        <button className="nav-item"><span>♧</span>Community</button>
        <button className="nav-item" onClick={handleProfileClick}>
          <span>♙</span>{user ? 'Profile' : 'Sign In'}
        </button>
      </nav>

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
            setShowProfileModal(true);
          }}
        />
      )}

      {showProfileModal && (
        <ProfileModal
          user={user}
          profile={profile}
          userEvents={events.filter((e) => e.user_id === user?.id)}
          onClose={() => setShowProfileModal(false)}
          onSignOut={() => {
            setUser(null);
            setProfile(null);
            setIsGuestPreview(false);
          }}
        />
      )}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
