import React from 'react';
import { Check, Trash2, Edit2, Plus, Sparkles } from 'lucide-react';
import { getMonthDaysInfo } from '../utils/habitUtils';

export const HabitGrid = ({
  habits,
  records,
  selectedYear,
  selectedMonthIndex,
  dailyStats,
  onToggleCell,
  onDeleteHabit,
  onOpenEditModal
}) => {
  const { days, weeks } = getMonthDaysInfo(selectedYear, selectedMonthIndex);
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === selectedYear && today.getMonth() === selectedMonthIndex;
  const todayDateNum = isCurrentMonth ? today.getDate() : -1;

  return (
    <div className="glass-panel grid-wrapper">
      <table className="spreadsheet-table">
        <thead>
          {/* Row 1: Week Header Spans */}
          <tr>
            <th className="col-sticky-habit" style={{ background: 'var(--bg-table-header)' }}>
              My Habits ({habits.length})
            </th>
            {Object.keys(weeks).map(weekNum => (
              <th 
                key={`week-${weekNum}`} 
                colSpan={weeks[weekNum].length}
                className="th-week"
              >
                Week {weekNum}
              </th>
            ))}
          </tr>

          {/* Row 2: Day Abbreviation & Date Number */}
          <tr>
            <th className="col-sticky-habit">Habit Name</th>
            {days.map(d => {
              const isToday = d.dayNum === todayDateNum;
              return (
                <th key={`day-hdr-${d.dayNum}`} style={{ padding: '0.3rem 0' }}>
                  <div className="th-day-abbrev">{d.dayAbbrev}</div>
                  <div className={`th-date-num ${isToday ? 'is-today' : ''}`}>
                    {d.dayNum}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {/* Habit Matrix Rows */}
          {habits.map((habit, idx) => {
            const isEven = idx % 2 === 0;
            const rowStyle = {
              background: isEven ? 'var(--bg-table-row-even)' : 'var(--bg-table-row-odd)'
            };

            return (
              <tr key={habit.id} style={rowStyle}>
                {/* Sticky Habit Title Cell */}
                <td className="col-sticky-habit" style={rowStyle}>
                  <div className="habit-title-cell">
                    <div className="habit-name-group" title={habit.title}>
                      <span className="habit-emoji">{habit.icon || '📌'}</span>
                      <span className="habit-text">{habit.title}</span>
                    </div>

                    <div className="habit-row-actions">
                      <button 
                        className="action-icon-btn" 
                        title="Edit Habit"
                        onClick={() => onOpenEditModal(habit)}
                      >
                        <Edit2 size={13} />
                      </button>
                      <button 
                        className="action-icon-btn" 
                        title="Delete Habit"
                        onClick={() => onDeleteHabit(habit.id)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </td>

                {/* Checkbox Cell per Day */}
                {days.map(d => {
                  const isChecked = Boolean(records[habit.id] && records[habit.id][d.dayNum]);
                  const isToday = d.dayNum === todayDateNum;

                  return (
                    <td 
                      key={`cell-${habit.id}-${d.dayNum}`}
                      className={isToday ? 'cell-today' : ''}
                      onClick={() => onToggleCell(habit.id, d.dayNum)}
                    >
                      <div className="cell-checkbox-wrapper">
                        <div className={`custom-checkbox ${isChecked ? 'checked' : ''}`}>
                          {isChecked && <Check size={14} strokeWidth={3.5} />}
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>

        {/* Footer Summary Section (Matching FocusLab Habits Bottom Rows) */}
        <tfoot>
          {/* Progress % Row */}
          <tr className="tr-summary-header">
            <td className="col-sticky-habit summary-label-col">
              Progress %
            </td>
            {days.map(d => {
              const stat = dailyStats[d.dayNum] || { progressPct: 0 };
              const pct = stat.progressPct;
              let badgeClass = 'badge-pct-zero';
              if (pct >= 80) badgeClass = 'badge-pct-high';
              else if (pct >= 50) badgeClass = 'badge-pct-mid';
              else if (pct > 0) badgeClass = 'badge-pct-low';

              return (
                <td key={`stat-pct-${d.dayNum}`}>
                  <span className={`badge-pct ${badgeClass}`}>
                    {pct}%
                  </span>
                </td>
              );
            })}
          </tr>

          {/* Done Count Row */}
          <tr className="tr-summary-header">
            <td className="col-sticky-habit summary-label-col" style={{ color: 'var(--accent-green)' }}>
              Done
            </td>
            {days.map(d => {
              const stat = dailyStats[d.dayNum] || { done: 0 };
              return (
                <td key={`stat-done-${d.dayNum}`} className="val-done">
                  {stat.done}
                </td>
              );
            })}
          </tr>

          {/* Not Done Count Row */}
          <tr className="tr-summary-header">
            <td className="col-sticky-habit summary-label-col" style={{ color: 'var(--text-muted)' }}>
              Not Done
            </td>
            {days.map(d => {
              const stat = dailyStats[d.dayNum] || { notDone: 0 };
              return (
                <td key={`stat-not-done-${d.dayNum}`} className="val-not-done">
                  {stat.notDone}
                </td>
              );
            })}
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
