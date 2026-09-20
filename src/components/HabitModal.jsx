import React, { useState, useEffect } from 'react';
import { X, Check, Sparkles } from 'lucide-react';
import { EMOJI_LIST, CATEGORIES } from '../utils/habitUtils';

export const HabitModal = ({ isOpen, onClose, onSave, editingHabit }) => {
  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState('⏰');
  const [category, setCategory] = useState('Mindset');
  const [targetDays, setTargetDays] = useState(7);

  useEffect(() => {
    if (editingHabit) {
      setTitle(editingHabit.title);
      setIcon(editingHabit.icon || '⏰');
      setCategory(editingHabit.category || 'Mindset');
      setTargetDays(editingHabit.targetDays || 7);
    } else {
      setTitle('');
      setIcon('⏰');
      setCategory('Mindset');
      setTargetDays(7);
    }
  }, [editingHabit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: editingHabit ? editingHabit.id : `h_${Date.now()}`,
      title: title.trim(),
      icon,
      category,
      targetDays: Number(targetDays)
    });

    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            {editingHabit ? 'Edit Habit' : 'Create New Habit'}
          </div>
          <button className="action-icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Title */}
          <div className="form-group">
            <label className="form-label">Habit Title</label>
            <input 
              type="text"
              className="form-input"
              placeholder="e.g., Read 20 pages, Hydrate 3L, Meditate"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              required
            />
          </div>

          {/* Emoji Selector */}
          <div className="form-group">
            <label className="form-label">Select Icon / Emoji</label>
            <div className="emoji-grid">
              {EMOJI_LIST.map((eIcon) => (
                <button
                  type="button"
                  key={eIcon}
                  className={`emoji-btn ${icon === eIcon ? 'selected' : ''}`}
                  onClick={() => setIcon(eIcon)}
                >
                  {eIcon}
                </button>
              ))}
            </div>
          </div>

          {/* Category & Frequency */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select 
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Goal (Days / Week)</label>
              <select 
                className="form-select"
                value={targetDays}
                onChange={(e) => setTargetDays(e.target.value)}
              >
                {[1, 2, 3, 4, 5, 6, 7].map(num => (
                  <option key={num} value={num}>{num} days / week</option>
                ))}
              </select>
            </div>
          </div>

          {/* Modal Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingHabit ? 'Save Changes' : 'Add Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
