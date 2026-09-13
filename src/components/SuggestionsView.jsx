import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { IconLightbulb, IconLock, IconPin, IconHeart, IconChat, IconAlert, IconTrash } from './Icons';

const INITIAL_SUGGESTIONS = [
  {
    id: 1,
    content: 'Would be nice if there was a proper pedestrian crossing near Bandra Kurla Complex.',
    location: 'BKC, Mumbai',
    agree_count: 48,
    comments_count: 9,
    time: '2h ago',
  },
  {
    id: 2,
    content: 'The lighting around Marine Drive promenade is dim after 10pm.',
    location: 'Marine Drive, Mumbai',
    agree_count: 62,
    comments_count: 14,
    time: '4h ago',
  },
  {
    id: 3,
    content: 'Can we get more recycling & waste bins placed around Dadar Station?',
    location: 'Dadar, Mumbai',
    agree_count: 35,
    comments_count: 6,
    time: '6h ago',
  },
  {
    id: 4,
    content: 'This curve near Worli Naka urgently needs a speed breaker.',
    location: 'Worli Naka, Mumbai',
    agree_count: 54,
    comments_count: 11,
    time: '8h ago',
  },
  {
    id: 5,
    content: 'Why doesn\'t the local bus stop near Andheri East have shaded shelter for monsoons?',
    location: 'Andheri East, Mumbai',
    agree_count: 29,
    comments_count: 4,
    time: '12h ago',
  },
];

export default function SuggestionsView({ onAddToast, user }) {
  const [suggestions, setSuggestions] = useState(INITIAL_SUGGESTIONS);
  const [newContent, setNewContent] = useState('');
  const [newLoc, setNewLoc] = useState('Mumbai');
  const [agreedMap, setAgreedMap] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch suggestions from Supabase
  const fetchSuggestions = async () => {
    try {
      const { data, error } = await supabase
        .from('suggestions')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const formatted = data.map((item) => ({
          id: item.id,
          content: item.content,
          location: item.location || 'Manipal',
          agree_count: item.agree_count || 1,
          comments_count: item.comments_count || 0,
          time: item.created_at ? formatTimeAgo(item.created_at) : 'Just now',
          user_id: item.user_id || null,
        }));
        setSuggestions(formatted);
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  function formatTimeAgo(dateString) {
    const diff = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  const handlePostSuggestion = async (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    setIsSubmitting(true);
    const payload = {
      content: newContent.trim(),
      location: newLoc.trim() || 'Manipal',
      agree_count: 1,
      user_id: user?.id || null,
      created_at: new Date().toISOString(),
    };

    const optimisticItem = {
      id: Date.now(),
      ...payload,
      time: 'Just now',
      comments_count: 0,
    };

    setSuggestions((prev) => [optimisticItem, ...prev]);
    setNewContent('');
    setIsSubmitting(false);

    if (onAddToast) onAddToast('Anonymous suggestion posted!', 5);

    try {
      await supabase.from('suggestions').insert([payload]);
    } catch (err) {
      console.warn('Supabase suggestion insert fallback:', err);
    }
  };

  const handleToggleAgree = (id) => {
    setAgreedMap((prev) => {
      const isAgreed = !prev[id];
      setSuggestions((current) =>
        current.map((s) =>
          s.id === id ? { ...s, agree_count: s.agree_count + (isAgreed ? 1 : -1) } : s
        )
      );

      if (isAgreed && onAddToast) {
        onAddToast('Agreed! +5 Points for supporting community ideas', 5);
      }

      const target = suggestions.find((s) => s.id === id);
      if (target) {
        const nextCount = target.agree_count + (isAgreed ? 1 : -1);
        supabase.from('suggestions').update({ agree_count: nextCount }).eq('id', id).then();
      }

      return { ...prev, [id]: isAgreed };
    });
  };

  const handleDeleteSuggestion = async (id) => {
    setSuggestions((prev) => prev.filter((item) => item.id !== id));
    if (onAddToast) onAddToast('Note deleted', 0);

    try {
      await supabase.from('suggestions').delete().eq('id', id);
    } catch (err) {
      console.warn('Delete failed:', err);
    }
  };

  return (
    <div className="suggestions-screen">
      {/* Header Banner */}
      <div className="suggestions-header">
        <div className="hdr-tag">
          <IconLightbulb size={12} color="#79e0d4" /> &nbsp; Community Notes
        </div>
        <h2>What does your community need?</h2>
        <p>Post anonymous ideas, road improvements, or safety requests for Mumbai.</p>
      </div>

      {/* Anonymous Post Box */}
      <form onSubmit={handlePostSuggestion} className="post-suggestion-box">
        <div className="anon-badge">
          <span><IconLock size={12} color="#0b7067" /> &nbsp; Posting Anonymously</span>
          <input
            type="text"
            className="loc-input"
            placeholder="Location tag (e.g. Marine Drive)"
            value={newLoc}
            onChange={(e) => setNewLoc(e.target.value)}
          />
        </div>

        <textarea
          className="suggestion-textarea"
          placeholder="e.g. Would be nice if there was a proper crosswalk here..."
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          rows={3}
          maxLength={300}
        />

        <div className="box-bottom">
          <small className="anon-hint">No names attached. Lowering barrier to participation.</small>
          <button type="submit" className="post-anon-btn" disabled={isSubmitting || !newContent.trim()}>
            {isSubmitting ? 'Posting...' : 'Share Note'}
          </button>
        </div>
      </form>

      {/* Feed List */}
      <div className="suggestions-list">
        {suggestions.map((item) => (
          <div key={item.id} className="suggestion-card">
            <div className="sugg-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="anon-author"><IconLock size={11} color="#596b68" /> &nbsp; Anonymous Resident</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="sugg-time">{item.time}</span>
                {/* Only allow deleting if note belongs to logged-in user or posted during current session */}
                {((user?.id && item.user_id === user.id) || (typeof item.id === 'number' && item.id > 1000000)) && (
                  <button
                    aria-label="Delete note"
                    onClick={() => handleDeleteSuggestion(item.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      color: '#8b9795',
                      display: 'inline-flex',
                      alignItems: 'center',
                      borderRadius: '4px',
                      transition: 'color 0.15s ease'
                    }}
                    title="Delete your note"
                    onMouseEnter={(e) => e.currentTarget.style.color = '#e53935'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#8b9795'}
                  >
                    <IconTrash size={14} color="currentColor" />
                  </button>
                )}
              </div>
            </div>

            <p className="sugg-text">{item.content}</p>

            <div className="sugg-location">
              <IconPin size={12} color="#0b7067" /> {item.location}
            </div>

            <div className="sugg-actions">
              <button
                className={`agree-btn ${agreedMap[item.id] ? 'agreed' : ''}`}
                onClick={() => handleToggleAgree(item.id)}
              >
                <IconHeart size={14} color={agreedMap[item.id] ? '#ffffff' : '#0b7067'} filled={agreedMap[item.id]} />
                <span>{agreedMap[item.id] ? 'Agreed' : 'Agree'}</span>
                <span className="agree-count">{item.agree_count}</span>
              </button>

              <div className="sugg-meta">
                <span><IconChat size={12} color="#6a7775" /> {item.comments_count} notes</span>
                {item.agree_count >= 40 && (
                  <span className="hot-tag"><IconAlert size={10} color="#e65100" /> High Support</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
