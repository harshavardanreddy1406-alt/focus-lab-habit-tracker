import React from 'react';
import { SHORT_MONTHS } from '../utils/habitUtils';

export const MonthTabs = ({ 
  selectedMonthIndex, 
  onSelectMonth,
  activeTabSpecial,
  onSelectSpecialTab 
}) => {
  return (
    <nav className="month-tabs-bar">
      <button 
        className={`month-tab-btn ${activeTabSpecial === 'Dashboard' ? 'active' : ''}`}
        onClick={() => onSelectSpecialTab('Dashboard')}
      >
        📊 Dashboard
      </button>

      <button 
        className={`month-tab-btn ${activeTabSpecial === 'Example' ? 'active' : ''}`}
        onClick={() => onSelectSpecialTab('Example')}
      >
        💡 Example Guide
      </button>

      <div style={{ width: '1px', height: '20px', background: 'var(--border-color)', margin: '0 4px' }} />

      {SHORT_MONTHS.map((monthName, idx) => {
        const isActive = activeTabSpecial === null && selectedMonthIndex === idx;

        return (
          <button
            key={monthName}
            className={`month-tab-btn ${isActive ? 'active' : ''}`}
            onClick={() => {
              onSelectSpecialTab(null);
              onSelectMonth(idx);
            }}
          >
            {monthName}
          </button>
        );
      })}
    </nav>
  );
};
