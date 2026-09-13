import React, { useState } from 'react';

const CATEGORIES = [
  { id: 'Roads', label: 'Roads', icon: '🛣️' },
  { id: 'Water', label: 'Water', icon: '💧' },
  { id: 'Electricity', label: 'Electricity', icon: '⚡' },
  { id: 'Waste', label: 'Waste', icon: '🗑️' },
  { id: 'Construction', label: 'Construction', icon: '🏗️' },
  { id: 'Public Transport', label: 'Public Transport', icon: '🚌' },
  { id: 'Environment', label: 'Environment', icon: '🍃' },
  { id: 'Other', label: 'Other', icon: '💬' },
];

export default function ReportModal({ onClose, onSubmit }) {
  const [category, setCategory] = useState('Roads');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('End Point Road, Manipal');
  const [coords, setCoords] = useState({ lat: 13.3521, lng: 74.7947 });
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: Number(position.coords.latitude.toFixed(4)),
            lng: Number(position.coords.longitude.toFixed(4)),
          });
          setLocationName(`Current Location, Manipal`);
        },
        () => {
          alert('Could not retrieve GPS location. Defaulting to Manipal.');
        }
      );
    }
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please provide a title for the incident report.');
      return;
    }
    setIsSubmitting(true);
    await onSubmit({
      title: title.trim(),
      description: description.trim(),
      category,
      location: locationName,
      latitude: coords.lat,
      longitude: coords.lng,
      distance: 0.4,
      image: imageUrl || 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1200&q=85',
    });
    setIsSubmitting(false);
  };

  return (
    <div className="modal-overlay">
      <div className="report-modal-sheet">
        {/* Header bar */}
        <div className="report-header">
          <button className="back-btn" onClick={onClose} aria-label="Go back">
            ‹
          </button>
          <div className="header-titles">
            <h1>Report an Incident</h1>
            <p>Spot something? Let the community know.</p>
          </div>
          <div className="motto-badge">
            <span className="bulb">💡</span>
            <span>Small reports.<br />Big impact.</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="report-form">
          {/* Location Section */}
          <section className="form-section">
            <div className="section-title-row">
              <div className="section-heading">
                <span className="section-icon">📍</span>
                <h3>Location</h3>
              </div>
              <button
                type="button"
                className="btn-text-action"
                onClick={handleUseCurrentLocation}
              >
                🎯 Use current location
              </button>
            </div>

            <div className="map-preview-box">
              <div className="map-placeholder-graphic">
                <span className="map-label">Manipal Lake</span>
                <span className="map-label center-tag">MIT</span>
                <div className="map-pin">📍</div>
                <span className="map-label pin-name">Manipal</span>
              </div>
              <div className="location-bar">
                <div className="loc-info">
                  <span className="pin-icon">📍</span>
                  <div>
                    <strong>{locationName}</strong>
                    <small>Lat {coords.lat}, Long {coords.lng}</small>
                  </div>
                </div>
                <button
                  type="button"
                  className="change-btn"
                  onClick={() => {
                    const custom = prompt('Enter location name:', locationName);
                    if (custom) setLocationName(custom);
                  }}
                >
                  Change
                </button>
              </div>
            </div>
          </section>

          {/* Incident Category */}
          <section className="form-section">
            <div className="section-title-row">
              <div className="section-heading">
                <span className="section-icon">◫</span>
                <h3>Incident Category</h3>
              </div>
            </div>

            <div className="category-grid">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`category-card ${category === cat.id ? 'selected' : ''}`}
                  onClick={() => setCategory(cat.id)}
                >
                  <span className="cat-icon">{cat.icon}</span>
                  <span className="cat-label">{cat.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Incident Details */}
          <section className="form-section">
            <div className="section-title-row">
              <div className="section-heading">
                <span className="section-icon">📝</span>
                <h3>Incident Details</h3>
              </div>
            </div>

            <div className="input-group">
              <input
                type="text"
                className="text-input"
                placeholder="Brief title (e.g. Water logging near gate)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                required
              />
            </div>

            <div className="input-group">
              <textarea
                className="textarea-input"
                placeholder="Describe the incident in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={1000}
                rows={4}
              />
              <div className="char-count">{description.length}/1000</div>
            </div>

            <div className="hint-banner">
              <span className="hint-icon">💡</span>
              <div>
                <strong>Include helpful details</strong>
                <p>e.g. size, exact location, when it started, any risks, and how it affects people.</p>
              </div>
            </div>
          </section>

          {/* Add Photos / Videos */}
          <section className="form-section">
            <div className="section-title-row">
              <div className="section-heading">
                <span className="section-icon">📷</span>
                <h3>Add Photos / Videos</h3>
              </div>
              <span className="sub-hint">Add up to 5 files</span>
            </div>

            <div className="photo-upload-row">
              <label className="upload-card primary">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  hidden
                />
                <span className="plus">+</span>
                <span>{imageUrl ? 'Change Photo' : 'Add Photo/Video'}</span>
              </label>

              {imageUrl ? (
                <div className="upload-card preview">
                  <img src={imageUrl} alt="Incident preview" />
                  <button
                    type="button"
                    className="remove-img"
                    onClick={() => setImageUrl('')}
                  >
                    ×
                  </button>
                </div>
              ) : (
                [1, 2, 3, 4].map((i) => (
                  <div key={i} className="upload-card placeholder">
                    <span className="ph-icon">🖼️</span>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Submit Button */}
          <button
            type="submit"
            className="submit-report-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting Report...' : 'Submit Report'}
          </button>
        </form>
      </div>
    </div>
  );
}
