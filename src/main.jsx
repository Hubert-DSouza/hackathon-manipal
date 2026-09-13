import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const events = [
  {
    id: 1,
    title: 'Water logging near MIT Road',
    location: 'Near MIT Main Gate, Manipal',
    distance: 0.4,
    time: '2h ago',
    seen: 42,
    confirmed: 56,
    impact: 'High Impact',
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
    impact: 'High Impact',
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
    impact: 'Medium Impact',
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
    impact: 'High Impact',
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
  const [filter, setFilter] = useState('nearby');
  const [confirmed, setConfirmed] = useState({});
  const [notHere, setNotHere] = useState({});

  const visibleEvents = useMemo(() => {
    const selected = filters.find((f) => f.key === filter);
    if (!selected) return events;
    if (filter === 'nearby') return events.filter((e) => e.distance <= 5);
    return events.filter((e) => e.distance > 5 && e.distance <= selected.max);
  }, [filter]);

  function toggleConfirm(id) {
    setConfirmed((prev) => ({ ...prev, [id]: !prev[id] }));
    setNotHere((prev) => ({ ...prev, [id]: false }));
  }

  function toggleNotHere(id) {
    setNotHere((prev) => ({ ...prev, [id]: !prev[id] }));
    setConfirmed((prev) => ({ ...prev, [id]: false }));
  }

  return (
    <div className="app-shell">
      <header className="header">
        <div className="brand">
          <div className="logo">Ripple<span className="logo-wave">⌁</span></div>
          <div className="tagline">Small issues.<br />Big impact.</div>
        </div>
        <div className="header-actions">
          <button aria-label="Notifications" className="icon-button notification">♧<span /></button>
          <button aria-label="Search" className="icon-button">⌕</button>
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
        <button className="report-button" aria-label="Report">+</button>
        <button className="nav-item"><span>♧</span>Community</button>
        <button className="nav-item"><span>♙</span>Profile</button>
      </nav>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
