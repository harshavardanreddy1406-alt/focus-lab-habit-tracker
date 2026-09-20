import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, X, Clock, CheckCircle2, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const PomodoroTimer = ({ habit, isOpen, onClose, onCompleteHabit }) => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' | 'break'

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (seconds === 0) {
          if (minutes === 0) {
            // Timer Finished!
            clearInterval(interval);
            setIsActive(false);
            confetti({ particleCount: 70, spread: 60 });
            if (mode === 'focus' && habit && onCompleteHabit) {
              onCompleteHabit(habit.id);
            }
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, mode, habit, onCompleteHabit]);

  if (!isOpen) return null;

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = (newMinutes = mode === 'focus' ? 25 : 5) => {
    setIsActive(false);
    setMinutes(newMinutes);
    setSeconds(0);
  };

  const setFocusMode = (m) => {
    setMode(m);
    resetTimer(m === 'focus' ? 25 : 5);
  };

  const totalSeconds = (mode === 'focus' ? 25 : 5) * 60;
  const currentSeconds = minutes * 60 + seconds;
  const progressPct = Math.round(((totalSeconds - currentSeconds) / totalSeconds) * 100);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '400px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
            <Clock size={20} color="var(--accent-green)" />
            <span>Focus Timer {habit ? `• ${habit.icon} ${habit.title}` : ''}</span>
          </div>
          <button className="action-icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Mode Switcher */}
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', background: 'var(--bg-dark)', padding: '4px', borderRadius: '8px' }}>
          <button 
            className={`btn btn-secondary ${mode === 'focus' ? 'active' : ''}`}
            style={{ flex: 1, padding: '0.4rem', fontSize: '0.8rem' }}
            onClick={() => setFocusMode('focus')}
          >
            🔥 Focus (25m)
          </button>
          <button 
            className={`btn btn-secondary ${mode === 'break' ? 'active' : ''}`}
            style={{ flex: 1, padding: '0.4rem', fontSize: '0.8rem' }}
            onClick={() => setFocusMode('break')}
          >
            ☕ Break (5m)
          </button>
        </div>

        {/* Countdown Display */}
        <div style={{ margin: '1.5rem 0', position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '3.5rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em'
          }}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button 
            className="btn btn-primary" 
            style={{ padding: '0.75rem 1.75rem', fontSize: '1rem' }}
            onClick={toggleTimer}
          >
            {isActive ? <><Pause size={18} /> Pause</> : <><Play size={18} /> Start Focus</>}
          </button>

          <button className="btn btn-secondary btn-icon-only" title="Reset Timer" onClick={() => resetTimer()}>
            <RotateCcw size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
