import React, { useState } from 'react';
import { Layers, Play, CheckCircle2, Sparkles, ChevronRight, Clock, Plus } from 'lucide-react';
import confetti from 'canvas-confetti';

export const PRESET_STACKS = [
  {
    id: 'morning_stack',
    name: '5 AM Executive Morning Stack',
    icon: '🌅',
    description: 'High performance morning routine for maximum energy and mental clarity.',
    habits: [
      { title: 'Wake up at 05:00', icon: '⏰', category: 'Mindset' },
      { title: 'Hydrate 500ml Water', icon: '💧', category: 'Health' },
      { title: '10 Min Cold Shower', icon: '🚿', category: 'Health' },
      { title: 'Day Planning & Priorities', icon: '📝', category: 'Productivity' }
    ]
  },
  {
    id: 'evening_stack',
    name: 'Evening Wind-Down & Reset',
    icon: '🌙',
    description: 'Decompress and prepare for restorative deep sleep.',
    habits: [
      { title: 'Social Media Detox', icon: '🌿', category: 'Mindset' },
      { title: 'Goal Journaling & Gratitude', icon: '📝', category: 'Mindset' },
      { title: 'Budget Tracking', icon: '💰', category: 'Finance' },
      { title: 'Sleep by 22:30', icon: '😴', category: 'Health' }
    ]
  },
  {
    id: 'deep_work_stack',
    name: 'Deep Work Sprint Stack',
    icon: '🚀',
    description: 'Uninterrupted 90-minute focus workflow.',
    habits: [
      { title: 'Project Work Sprint', icon: '🚀', category: 'Productivity' },
      { title: 'Reading / Learning', icon: '📚', category: 'Mindset' }
    ]
  }
];

export const HabitStacks = ({ habits, onImportStack, onOpenPomodoro }) => {
  const [activeStackModal, setActiveStackModal] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const startStackFlow = (stack) => {
    setActiveStackModal(stack);
    setCurrentStepIndex(0);
  };

  const handleNextStep = () => {
    if (activeStackModal && currentStepIndex < activeStackModal.habits.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      // Completed entire stack!
      confetti({ particleCount: 100, spread: 80 });
      setActiveStackModal(null);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers size={20} color="var(--accent-green)" />
          <span>Habit Stacking & Sequential Trigger Chains</span>
        </h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Automated Routine Workflows</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        {PRESET_STACKS.map(stack => (
          <div 
            key={stack.id}
            style={{
              background: 'var(--bg-dark)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1rem'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '1.4rem' }}>{stack.icon}</span>
                <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{stack.name}</h4>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                {stack.description}
              </p>

              {/* Habit Chain Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {stack.habits.map((h, i) => (
                  <span key={i} style={{
                    fontSize: '0.75rem',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '6px',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {h.icon} {h.title}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                className="btn btn-primary" 
                style={{ flex: 1, padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}
                onClick={() => startStackFlow(stack)}
              >
                <Play size={14} /> Start Routine Flow
              </button>

              <button 
                className="btn btn-secondary" 
                style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}
                onClick={() => onImportStack(stack.habits)}
                title="Inject this stack into active tracker"
              >
                <Plus size={14} /> Import
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Guided Stack Flow Modal */}
      {activeStackModal && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '440px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="metric-badge">{activeStackModal.icon} Step {currentStepIndex + 1} of {activeStackModal.habits.length}</span>
              <button className="action-icon-btn" onClick={() => setActiveStackModal(null)}>✕</button>
            </div>

            <div style={{ margin: '1.5rem 0' }}>
              <span style={{ fontSize: '3rem' }}>{activeStackModal.habits[currentStepIndex].icon}</span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '0.5rem' }}>
                {activeStackModal.habits[currentStepIndex].title}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Focus entirely on completing this single step now.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button 
                className="btn btn-secondary"
                onClick={() => onOpenPomodoro({ title: activeStackModal.habits[currentStepIndex].title, icon: activeStackModal.habits[currentStepIndex].icon })}
              >
                <Clock size={16} /> 25m Focus Timer
              </button>

              <button className="btn btn-primary" onClick={handleNextStep}>
                Complete Step <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
