import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { IconTarget, IconPin } from './Icons';

const DEFAULT_MUMBAI = { lat: 19.0760, lng: 72.8777 };

// Custom clean SVG icon creator
const createCustomIcon = (category, isSelected) => {
  const color = isSelected ? '#ffffff' : '#087267';
  const bg = isSelected ? '#087267' : '#ffffff';
  const border = isSelected ? '#ffffff' : '#087267';
  const scale = isSelected ? 'scale(1.2)' : 'scale(1)';

  // Clean SVG path symbols
  const svgPaths = {
    Roads: '<path d="M4 19L8 5m8 0l4 14M12 5v2m0 6v2m0 6v2" stroke="' + color + '" stroke-width="2" stroke-linecap="round"/>',
    Water: '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" stroke="' + color + '" stroke-width="2" fill="none"/>',
    Electricity: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="' + color + '"/>',
    Waste: '<polyline points="3 6 5 6 21 6" stroke="' + color + '" stroke-width="2"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" stroke="' + color + '" stroke-width="2"/>',
    Construction: '<path d="M2 22h20M13 6l2-2 4 4-2 2m-6 0l4 4M2 18l6-6" stroke="' + color + '" stroke-width="2"/>',
    Environment: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.1 2 9a9 9 0 0 1-10 9z" stroke="' + color + '" stroke-width="2" fill="none"/>',
  };

  const svgInner = svgPaths[category] || '<circle cx="12" cy="10" r="3" fill="' + color + '"/>';

  const html = `
    <div style="
      background: ${bg};
      border: 2px solid ${border};
      border-radius: 50%;
      width: 38px;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transform: ${scale};
      transition: transform 0.2s ease;
    ">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        ${svgInner}
      </svg>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-map-marker',
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  });
};

export default function MapView({ events = [], selectedEventId, onClose, onSelectEvent }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const [activeCategory, setActiveCategory] = useState('All');
  const [highlightedEvent, setHighlightedEvent] = useState(
    events.find((e) => e.id === selectedEventId) || events[0] || null
  );

  const categories = ['All', 'Roads', 'Water', 'Electricity', 'Waste', 'Environment'];

  const filteredEvents = activeCategory === 'All'
    ? events
    : events.filter((e) => (e.category || 'Roads') === activeCategory);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialCenter = highlightedEvent
        ? [highlightedEvent.latitude || DEFAULT_MUMBAI.lat, highlightedEvent.longitude || DEFAULT_MUMBAI.lng]
        : [DEFAULT_MUMBAI.lat, DEFAULT_MUMBAI.lng];

      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
      }).setView(initialCenter, 13);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;

      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 100);
    }

    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    const MUMBAI_OFFSETS = [
      { lat: 19.0760, lng: 72.8777 },
      { lat: 19.0657, lng: 72.8686 },
      { lat: 19.0178, lng: 72.8478 },
      { lat: 18.9067, lng: 72.8147 },
      { lat: 19.0820, lng: 72.8890 },
      { lat: 19.0550, lng: 72.8300 },
      { lat: 19.0200, lng: 72.8550 },
      { lat: 18.9200, lng: 72.8300 },
    ];

    filteredEvents.forEach((evt, idx) => {
      const isDefaultCoords = !evt.latitude || Math.abs(evt.latitude - DEFAULT_MUMBAI.lat) < 0.0001;
      const offsetPos = MUMBAI_OFFSETS[idx % MUMBAI_OFFSETS.length];

      const baseLat = isDefaultCoords ? offsetPos.lat : evt.latitude;
      const baseLng = isDefaultCoords ? offsetPos.lng : evt.longitude;

      const isSelected = highlightedEvent?.id === evt.id;
      const markerIcon = createCustomIcon(evt.category || 'Roads', isSelected);

      const marker = L.marker([baseLat, baseLng], { icon: markerIcon }).addTo(map);

      marker.on('click', () => {
        setHighlightedEvent(evt);
        if (onSelectEvent) onSelectEvent(evt);
        map.flyTo([baseLat, baseLng], 14, { duration: 0.8 });
      });

      markersRef.current[evt.id] = marker;
    });
  }, [filteredEvents, highlightedEvent]);

  // Center on Highlighted Event
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (map && highlightedEvent) {
      const lat = highlightedEvent.latitude || DEFAULT_MUMBAI.lat;
      const lng = highlightedEvent.longitude || DEFAULT_MUMBAI.lng;
      map.flyTo([lat, lng], 14, { duration: 0.8 });
    }
  }, [selectedEventId]);

  return (
    <div className="map-view-screen">
      <div ref={mapContainerRef} className="map-leaflet-container" />

      <div className="map-top-bar">
        <div className="map-header">
          <button className="map-back-btn" onClick={onClose}>
            ‹
          </button>
          <div className="map-title-box">
            <h2>Live Mumbai Map</h2>
            <small>{filteredEvents.length} active incidents nearby</small>
          </div>
        </div>

        <div className="map-category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`map-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <button
        className="map-center-btn"
        onClick={() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([DEFAULT_MUMBAI.lat, DEFAULT_MUMBAI.lng], 13);
          }
        }}
        title="Center on Mumbai"
      >
        <IconTarget size={20} color="#087267" />
      </button>

      {highlightedEvent && (
        <div className="map-preview-card">
          <div className="preview-img-box">
            <img src={highlightedEvent.image} alt={highlightedEvent.title} />
            <span className="preview-distance">➤ {highlightedEvent.distance?.toFixed(1) || '0.4'} km away</span>
          </div>

          <div className="preview-details">
            <div className="preview-tags">
              <span className="cat-badge">{highlightedEvent.category || 'Roads'}</span>
              <span className="time-badge">{highlightedEvent.time || 'Recently'}</span>
            </div>
            <h3>{highlightedEvent.title}</h3>
            <p><IconPin size={12} color="#087267" /> {highlightedEvent.location}</p>
            <div className="preview-actions">
              <span className="seen-tag">+{highlightedEvent.seen || 42} seen</span>
              <button
                className="btn-text-action"
                onClick={() => {
                  if (onSelectEvent) onSelectEvent(highlightedEvent);
                  onClose();
                }}
              >
                View in Feed →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
