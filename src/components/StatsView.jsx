import React from 'react';
import { Flame, Trophy, Award, Target, Calendar, CheckCircle2 } from 'lucide-react';
import { calculateHabitStreak, getDaysInMonth, MONTH_NAMES } from '../utils/habitUtils';
import { CircularProgress } from './CircularProgress';

export const StatsView = ({ habits, records, selectedYear, selectedMonthIndex }) => {
  const totalDays = getDaysInMonth(selectedYear, selectedMonthIndex);

  // Compute streak details for each habit
  const habitStatsList = habits.map(h => {
    const { currentStreak, bestStreak } = calculateHabitStreak(h.id, records, totalDays);
    
    let totalChecked = 0;
    if (records[h.id]) {
      Object.values(records[h.id]).forEach(val => {
        if (val) totalChecked++;
      });
    }

    const completionRate = totalDays > 0 ? Math.round((totalChecked / totalDays) * 100) : 0;

    return {
      ...h,
      currentStreak,
      bestStreak,
      totalChecked,
      completionRate
    };
  });

  // Sort by highest streak / completion rate
  const sortedHabits = [...habitStatsList].sort((a, b) => b.completionRate - a.completionRate);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Streak Leaderboard Cards with Circular Pie Progress */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        {sortedHabits.map((habit, index) => {
          return (
            <div key={habit.id} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span style={{ fontSize: '1.6rem' }}>{habit.icon || '📌'}</span>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{habit.title}</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{habit.category}</span>
                  </div>
                </div>

                <CircularProgress
                  percentage={habit.completionRate}
                  size={48}
                  strokeWidth={5}
                  color={habit.completionRate >= 80 ? '#22c55e' : habit.completionRate >= 50 ? '#eab308' : '#ef4444'}
                />
              </div>

              {/* Progress Summary */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                <span>Monthly Checks:</span>
                <span style={{ color: 'var(--accent-green)' }}>{habit.totalChecked} / {totalDays} days</span>
              </div>

              {/* Streak Counters */}
              <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.25rem' }}>
                <div style={{ flex: 1, background: 'var(--bg-dark)', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Flame size={16} color="var(--accent-gold)" />
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Active Streak</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{habit.currentStreak} Days</div>
                  </div>
                </div>

                <div style={{ flex: 1, background: 'var(--bg-dark)', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Award size={16} color="var(--accent-green)" />
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Best Streak</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{habit.bestStreak} Days</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Activity Heatmap */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={18} color="var(--accent-green)" />
          <span>Daily Consistency Heatmap ({MONTH_NAMES[selectedMonthIndex]} {selectedYear})</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
          {Array.from({ length: totalDays }).map((_, i) => {
            const dayNum = i + 1;
            let checkedCount = 0;
            habits.forEach(h => {
              if (records[h.id] && records[h.id][dayNum]) checkedCount++;
            });

            const ratio = habits.length > 0 ? checkedCount / habits.length : 0;
            let bg = 'rgba(255, 255, 255, 0.05)';
            if (ratio >= 0.8) bg = 'var(--accent-green)';
            else if (ratio >= 0.5) bg = 'rgba(34, 197, 94, 0.6)';
            else if (ratio > 0) bg = 'rgba(34, 197, 94, 0.25)';

            return (
              <div 
                key={`heatmap-${dayNum}`}
                style={{
                  aspectRatio: '1',
                  background: bg,
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  color: ratio >= 0.5 ? '#000000' : 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  transition: 'transform 0.15s ease'
                }}
                title={`Day ${dayNum}: ${checkedCount}/${habits.length} habits completed (${Math.round(ratio * 100)}%)`}
              >
                {dayNum}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
