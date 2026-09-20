import React, { useState } from 'react';
import { 
  Plus, 
  Flame, 
  CheckCircle2, 
  BarChart3, 
  Moon, 
  Sun, 
  Download, 
  RotateCcw,
  Sparkles,
  Layers,
  Eraser,
  UserCheck,
  Edit3,
  Clock
} from 'lucide-react';
import { MONTH_NAMES, calculateCategoryStats } from '../utils/habitUtils';
import { CircularProgress } from './CircularProgress';

export const Header = ({ 
  userName,
  onUpdateUserName,
  selectedMonthIndex, 
  selectedYear,
  summaryStats,
  habits,
  records,
  totalDays,
  theme,
  onToggleTheme,
  onOpenAddModal,
  onResetMonth,
  onClearAllTicks,
  onExportData,
  onOpenPomodoro,
  activeView,
  setActiveView
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(userName);

  const categoryStats = calculateCategoryStats(habits, records, totalDays);

  const handleNameSave = (e) => {
    e.preventDefault();
    if (nameInput.trim()) {
      onUpdateUserName(nameInput.trim());
    }
    setIsEditingName(false);
  };

  return (
    <header className="glass-panel app-header">
      {/* Top Header Controls */}
      <div className="header-top">
        <div className="brand-title-group">
          <div className="brand-logo-icon">
            <Flame size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 className="brand-title">FocusLab Habits</h1>
              <span className="metric-badge" style={{ background: 'rgba(34, 197, 94, 0.2)', color: 'var(--accent-green)' }}>
                PRO
              </span>
            </div>

            {/* Personalized User Name Tag */}
            <div className="brand-subtitle" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '2px' }}>
              <span>Welcome back,</span>
              {isEditingName ? (
                <form onSubmit={handleNameSave} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <input
                    type="text"
                    className="form-input"
                    style={{ padding: '0.1rem 0.4rem', fontSize: '0.8rem', width: '110px' }}
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    autoFocus
                  />
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.15rem 0.4rem', fontSize: '0.7rem' }}>OK</button>
                </form>
              ) : (
                <span 
                  onClick={() => setIsEditingName(true)}
                  style={{ 
                    fontWeight: 700, 
                    color: 'var(--accent-green)', 
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    borderBottom: '1px dashed var(--accent-green)'
                  }}
                  title="Click to change name"
                >
                  {userName} 👋 <Edit3 size={11} />
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="header-actions">
          {/* Pomodoro Timer Launcher */}
          <button 
            className="btn btn-secondary"
            onClick={() => onOpenPomodoro(null)}
            title="Launch 25m Focus Timer"
          >
            <Clock size={16} color="var(--accent-green)" /> Focus Timer
          </button>

          {/* View Toggle */}
          <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-dark)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <button 
              className={`btn btn-secondary ${activeView === 'grid' ? 'active' : ''}`}
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
              onClick={() => setActiveView('grid')}
            >
              <Layers size={14} /> Matrix
            </button>
            <button 
              className={`btn btn-secondary ${activeView === 'stacks' ? 'active' : ''}`}
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
              onClick={() => setActiveView('stacks')}
            >
              <Sparkles size={14} /> Stacks
            </button>
            <button 
              className={`btn btn-secondary ${activeView === 'stats' ? 'active' : ''}`}
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
              onClick={() => setActiveView('stats')}
            >
              <BarChart3 size={14} /> Analytics
            </button>
          </div>

          <button className="btn btn-primary" onClick={onOpenAddModal}>
            <Plus size={16} /> Add Habit
          </button>

          <button 
            className="btn btn-secondary" 
            style={{ color: 'var(--accent-gold)' }} 
            title="Clear all tick marks to 0%" 
            onClick={onClearAllTicks}
          >
            <Eraser size={15} /> Clear Ticks
          </button>

          <button className="btn btn-secondary btn-icon-only" title="Export JSON Data" onClick={onExportData}>
            <Download size={16} />
          </button>

          <button className="btn btn-secondary btn-icon-only" title="Reset Demo Data" onClick={onResetMonth}>
            <RotateCcw size={16} />
          </button>

          <button className="btn btn-secondary btn-icon-only" title="Toggle Theme" onClick={onToggleTheme}>
            {theme === 'dark' ? <Sun size={16} color="#eab308" /> : <Moon size={16} />}
          </button>
        </div>
      </div>

      {/* Metric Stat Cards & Pie Circles */}
      <div className="metrics-row" style={{ alignItems: 'center' }}>
        <div className="metric-card">
          <span className="metric-label">Active Period</span>
          <div className="metric-value-row">
            <span className="metric-value" style={{ fontSize: '1.4rem' }}>{MONTH_NAMES[selectedMonthIndex]}</span>
            <span className="metric-badge">{selectedYear}</span>
          </div>
        </div>

        <div className="metric-card">
          <span className="metric-label">Active Habits</span>
          <div className="metric-value-row">
            <span className="metric-value">{summaryStats.totalHabits}</span>
            <span className="metric-badge">Tracked</span>
          </div>
        </div>

        <div className="metric-card">
          <span className="metric-label">Completed Checks</span>
          <div className="metric-value-row">
            <span className="metric-value">{summaryStats.completedHabits}</span>
            <CheckCircle2 size={20} color="var(--accent-green)" />
          </div>
        </div>

        <div className="metric-card" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span className="metric-label">Monthly Growth</span>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>Overall Completion</div>
          </div>
          <CircularProgress 
            percentage={summaryStats.overallProgressPct} 
            size={58} 
            strokeWidth={6} 
            color="#22c55e" 
          />
        </div>

        <div className="metric-card" style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', gap: '0.75rem' }}>
          {Object.values(categoryStats).map(cat => (
            <CircularProgress
              key={cat.id}
              percentage={cat.progressPct}
              size={52}
              strokeWidth={5}
              color={cat.color}
              label={cat.name.split(' ')[0]}
            />
          ))}
        </div>
      </div>
    </header>
  );
};
