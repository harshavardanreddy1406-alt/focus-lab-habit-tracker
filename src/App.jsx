import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  DEFAULT_HABITS, 
  generateDemoRecordsForMonth, 
  generateEmptyRecordsForMonth,
  calculateDailyStats, 
  calculateMonthSummary,
  getDaysInMonth,
  MONTH_NAMES
} from './utils/habitUtils';

import { 
  Header,
  HabitGrid,
  ProgressChart,
  MonthTabs,
  HabitModal,
  StatsView,
  AIChatBot,
  PomodoroTimer,
  HabitStacks
} from './components';

export function App() {
  // Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('focuslab_theme') || 'dark';
  });

  // User Name State (Default "Harsh")
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('focuslab_username') || 'Harsh';
  });

  // Active View ('grid' | 'stats' | 'stacks')
  const [activeView, setActiveView] = useState('grid');

  // Month & Year State (Default November 2026 to match reference photo)
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(10); // November
  const [selectedYear, setSelectedYear] = useState(2026);
  const [activeTabSpecial, setActiveTabSpecial] = useState(null);

  // Habits List State
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('focuslab_habits');
    return saved ? JSON.parse(saved) : DEFAULT_HABITS;
  });

  // Records State per Month
  const [monthRecords, setMonthRecords] = useState(() => {
    const saved = localStorage.getItem('focuslab_records');
    if (saved) {
      return JSON.parse(saved);
    }
    const cleanRecords = generateEmptyRecordsForMonth(DEFAULT_HABITS, 2026, 10);
    return {
      '2026-10': cleanRecords
    };
  });

  // Modals & Timers State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [pomodoroHabit, setPomodoroHabit] = useState(null);
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);

  // Apply Theme Attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('focuslab_theme', theme);
  }, [theme]);

  // Persist User Name
  useEffect(() => {
    localStorage.setItem('focuslab_username', userName);
  }, [userName]);

  // Persist Habits
  useEffect(() => {
    localStorage.setItem('focuslab_habits', JSON.stringify(habits));
  }, [habits]);

  // Persist Records
  useEffect(() => {
    localStorage.setItem('focuslab_records', JSON.stringify(monthRecords));
  }, [monthRecords]);

  // Current Active Month Key
  const currentMonthKey = `${selectedYear}-${selectedMonthIndex}`;
  const totalDays = getDaysInMonth(selectedYear, selectedMonthIndex);

  // Ensure record structure exists for active month
  const activeRecords = monthRecords[currentMonthKey] || (() => {
    const fresh = generateEmptyRecordsForMonth(habits, selectedYear, selectedMonthIndex);
    return fresh;
  })();

  // Calculate Real-time Daily Stats
  const dailyStats = calculateDailyStats(habits, activeRecords, totalDays);
  const summaryStats = calculateMonthSummary(habits, activeRecords, totalDays);

  // Cell Toggle Handler
  const handleToggleCell = (habitId, dayNum) => {
    const currentVal = Boolean(activeRecords[habitId] && activeRecords[habitId][dayNum]);
    const newVal = !currentVal;

    const updatedActiveRecords = {
      ...activeRecords,
      [habitId]: {
        ...(activeRecords[habitId] || {}),
        [dayNum]: newVal
      }
    };

    setMonthRecords(prev => ({
      ...prev,
      [currentMonthKey]: updatedActiveRecords
    }));

    if (newVal) {
      let completedCount = 0;
      habits.forEach(h => {
        if (h.id === habitId) completedCount++;
        else if (updatedActiveRecords[h.id] && updatedActiveRecords[h.id][dayNum]) completedCount++;
      });

      if (completedCount === habits.length && habits.length > 0) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  // Voice Batch Toggle Handler
  const handleBatchToggleHabits = (habitIds) => {
    const todayNum = new Date().getDate();
    const dayToToggle = (todayNum >= 1 && todayNum <= totalDays) ? todayNum : 1;

    setMonthRecords(prev => {
      const activeRecs = prev[currentMonthKey] || {};
      const updatedRecs = { ...activeRecs };

      habitIds.forEach(hId => {
        updatedRecs[hId] = {
          ...(updatedRecs[hId] || {}),
          [dayToToggle]: true
        };
      });

      return {
        ...prev,
        [currentMonthKey]: updatedRecs
      };
    });

    confetti({ particleCount: 60, spread: 50 });
  };

  // Clear All Ticks
  const handleClearAllTicks = () => {
    if (window.confirm(`Clear all tick marks for ${MONTH_NAMES[selectedMonthIndex]} ${selectedYear}?`)) {
      const cleared = generateEmptyRecordsForMonth(habits, selectedYear, selectedMonthIndex);
      setMonthRecords(prev => ({
        ...prev,
        [currentMonthKey]: cleared
      }));
    }
  };

  // Reset Demo Data
  const handleResetMonth = () => {
    if (window.confirm(`Load demo tick marks pattern for ${MONTH_NAMES[selectedMonthIndex]} ${selectedYear}?`)) {
      const resetRecs = generateDemoRecordsForMonth(habits, selectedYear, selectedMonthIndex);
      setMonthRecords(prev => ({
        ...prev,
        [currentMonthKey]: resetRecs
      }));
    }
  };

  // Import Habit Stack Preset
  const handleImportStack = (stackHabits) => {
    const newHabits = [...habits];
    stackHabits.forEach(sHabit => {
      const exists = newHabits.some(h => h.title.toLowerCase() === sHabit.title.toLowerCase());
      if (!exists) {
        newHabits.push({
          id: `h_stack_${Date.now()}_${Math.random()}`,
          title: sHabit.title,
          icon: sHabit.icon,
          category: sHabit.category,
          targetDays: 7
        });
      }
    });
    setHabits(newHabits);
    alert(`Successfully imported preset stack habits into your tracker!`);
  };

  // Add / Edit Habit Handlers
  const handleSaveHabit = (savedHabit) => {
    if (editingHabit) {
      setHabits(prev => prev.map(h => h.id === savedHabit.id ? savedHabit : h));
    } else {
      setHabits(prev => [...prev, savedHabit]);
      setMonthRecords(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(mKey => {
          updated[mKey][savedHabit.id] = {};
        });
        return updated;
      });
    }
  };

  const handleDeleteHabit = (habitId) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      setHabits(prev => prev.filter(h => h.id !== habitId));
    }
  };

  const handleOpenAddModal = () => {
    setEditingHabit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (habit) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  };

  const handleOpenPomodoro = (habitObj) => {
    setPomodoroHabit(habitObj);
    setIsPomodoroOpen(true);
  };

  // Export Data JSON
  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      userName,
      habits,
      monthRecords
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `focuslab_habits_export_${selectedYear}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="app-container">
      {/* Top Executive Header */}
      <Header
        userName={userName}
        onUpdateUserName={(name) => setUserName(name)}
        selectedMonthIndex={selectedMonthIndex}
        selectedYear={selectedYear}
        summaryStats={summaryStats}
        habits={habits}
        records={activeRecords}
        totalDays={totalDays}
        theme={theme}
        onToggleTheme={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
        onOpenAddModal={handleOpenAddModal}
        onResetMonth={handleResetMonth}
        onClearAllTicks={handleClearAllTicks}
        onExportData={handleExportData}
        onOpenPomodoro={handleOpenPomodoro}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Main Content Area */}
      {activeView === 'grid' && (
        <>
          <HabitGrid
            habits={habits}
            records={activeRecords}
            selectedYear={selectedYear}
            selectedMonthIndex={selectedMonthIndex}
            dailyStats={dailyStats}
            onToggleCell={handleToggleCell}
            onDeleteHabit={handleDeleteHabit}
            onOpenEditModal={handleOpenEditModal}
          />

          <ProgressChart
            selectedYear={selectedYear}
            selectedMonthIndex={selectedMonthIndex}
            dailyStats={dailyStats}
            theme={theme}
          />
        </>
      )}

      {activeView === 'stacks' && (
        <HabitStacks
          habits={habits}
          onImportStack={handleImportStack}
          onOpenPomodoro={handleOpenPomodoro}
        />
      )}

      {activeView === 'stats' && (
        <StatsView
          habits={habits}
          records={activeRecords}
          selectedYear={selectedYear}
          selectedMonthIndex={selectedMonthIndex}
        />
      )}

      {/* Bottom Month Tabs Navigator */}
      <MonthTabs
        selectedMonthIndex={selectedMonthIndex}
        onSelectMonth={(mIdx) => setSelectedMonthIndex(mIdx)}
        activeTabSpecial={activeTabSpecial}
        onSelectSpecialTab={(tab) => {
          setActiveTabSpecial(tab);
          if (tab === 'Dashboard') setActiveView('stats');
          else if (tab === 'Example') setActiveView('grid');
        }}
      />

      {/* Floating AI Chat Bot Drawer */}
      <AIChatBot
        userName={userName}
        summaryStats={summaryStats}
        habits={habits}
        activeMonthName={MONTH_NAMES[selectedMonthIndex]}
      />

      {/* Pomodoro Focus Timer Modal */}
      <PomodoroTimer
        habit={pomodoroHabit}
        isOpen={isPomodoroOpen}
        onClose={() => setIsPomodoroOpen(false)}
        onCompleteHabit={(hId) => {
          const todayNum = new Date().getDate();
          if (todayNum >= 1 && todayNum <= totalDays) {
            handleToggleCell(hId, todayNum);
          }
        }}
      />

      {/* Add/Edit Modal */}
      <HabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveHabit}
        editingHabit={editingHabit}
      />
    </div>
  );
}

export default App;
