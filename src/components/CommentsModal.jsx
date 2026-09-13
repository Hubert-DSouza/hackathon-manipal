import React, { useState } from 'react';

export default function CommentsModal({ event, onClose, onAddComment }) {
  const [comments, setComments] = useState([
    { id: 1, author: 'Ananya R.', text: 'Municipal workers were spotted nearby an hour ago.', time: '45m ago' },
    { id: 2, author: 'Vikram S.', text: 'Avoid taking autos through this lane during peak hours.', time: '20m ago' },
  ]);
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const commentObj = {
      id: Date.now(),
      author: 'You (SociTea Member)',
      text: newComment.trim(),
      time: 'Just now',
    };
    setComments((prev) => [...prev, commentObj]);
    onAddComment(event.id);
    setNewComment('');
  };

  return (
    <div className="modal-overlay">
      <div className="comments-sheet">
        <button className="back-btn" onClick={onClose}>×</button>
        <div className="comments-header">
          <h3>Community Comments</h3>
          <p className="sub">{event?.title}</p>
        </div>

        <div className="comments-list">
          {comments.map((c) => (
            <div key={c.id} className="comment-item">
              <div className="comment-meta">
                <strong>{c.author}</strong>
                <small>{c.time}</small>
              </div>
              <p className="comment-text">{c.text}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="comment-form">
          <input
            type="text"
            className="text-input"
            placeholder="Add a community update or comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button type="submit" className="btn-text-action">Post</button>
        </form>
      </div>
    </div>
  );
}
