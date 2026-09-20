// Utility helpers for date generation, metrics, streaks, and state management

export const CATEGORIES = [
  { id: 'all', name: 'All Habits', color: '#6366f1' },
  { id: 'Health', name: 'Health & Fitness', color: '#10b981' },
  { id: 'Productivity', name: 'Productivity', color: '#3b82f6' },
  { id: 'Mindset', name: 'Mindset & Growth', color: '#8b5cf6' },
  { id: 'Finance', name: 'Finance', color: '#f59e0b' }
];

export const EMOJI_LIST = ['⏰', '💪', '📚', '📝', '💰', '🚀', '🍺', '🌿', '🚿', '🧘', '💧', '🥗', '🚶', '😴', '🎯', '🔥', '🎨', '🧠', '💻', '⚡'];

export const DEFAULT_HABITS = [
  { id: 'h1', title: 'Wake up at 05:00', icon: '⏰', category: 'Mindset', targetDays: 7 },
  { id: 'h2', title: 'Gym', icon: '💪', category: 'Health', targetDays: 5 },
  { id: 'h3', title: 'Reading / Learning', icon: '📚', category: 'Mindset', targetDays: 7 },
  { id: 'h4', title: 'Day Planning', icon: '📝', category: 'Productivity', targetDays: 7 },
  { id: 'h5', title: 'Budget Tracking', icon: '💰', category: 'Finance', targetDays: 7 },
  { id: 'h6', title: 'Project Work', icon: '🚀', category: 'Productivity', targetDays: 6 },
  { id: 'h7', title: 'No Alcohol', icon: '🍺', category: 'Health', targetDays: 7 },
  { id: 'h8', title: 'Social Media Detox', icon: '🌿', category: 'Mindset', targetDays: 7 },
  { id: 'h9', title: 'Goal Journaling', icon: '📝', category: 'Mindset', targetDays: 7 },
  { id: 'h10', title: 'Cold Shower', icon: '🚿', category: 'Health', targetDays: 7 }
];

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const SHORT_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export const DAY_ABBREVS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

/**
 * Get total days in a month (1-indexed month 0-11)
 */
export const getDaysInMonth = (year, monthIndex) => {
  return new Date(year, monthIndex + 1, 0).getDate();
};

/**
 * Get days array for a month with week grouping
 */
export const getMonthDaysInfo = (year, monthIndex) => {
  const totalDays = getDaysInMonth(year, monthIndex);
  const days = [];

  let currentWeekNum = 1;
  
  for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
    const dateObj = new Date(year, monthIndex, dayNum);
    const dayOfWeekIndex = dateObj.getDay(); // 0 = Sunday
    const dayAbbrev = DAY_ABBREVS[dayOfWeekIndex];

    // Increment week number every Saturday or when dayOfWeek is Saturday (index 6) after day 1
    if (dayNum > 1 && dayOfWeekIndex === 6) {
      currentWeekNum++;
    }

    days.push({
      dayNum,
      dayAbbrev,
      dayOfWeekIndex,
      weekNum: currentWeekNum,
      dateString: `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
    });
  }

  // Group days by week number
  const weeks = {};
  days.forEach(day => {
    if (!weeks[day.weekNum]) {
      weeks[day.weekNum] = [];
    }
    weeks[day.weekNum].push(day);
  });

  return { days, weeks, totalDays };
};

/**
 * Generate empty records for a month (all false, cleared slate)
 */
export const generateEmptyRecordsForMonth = (habits, year, monthIndex) => {
  const totalDays = getDaysInMonth(year, monthIndex);
  const records = {};

  habits.forEach(h => {
    records[h.id] = {};
    for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
      records[h.id][dayNum] = false;
    }
  });

  return records;
};

/**
 * Generate sample grid record matching the screenshot for Nov
 */
export const generateDemoRecordsForMonth = (habits, year, monthIndex) => {
  const totalDays = getDaysInMonth(year, monthIndex);
  const records = {};

  habits.forEach(h => {
    records[h.id] = {};
  });

  // Pre-seed patterns matching reference photo (Nov screenshot: Days 1-11 checked partially)
  const novPattern = {
    1: [true, true, true, true, true, true, true, true, true, true], // 100%
    2: [true, true, true, true, true, true, true, false, false, false], // 70%
    3: [true, true, true, true, true, true, true, false, false, false], // 70%
    4: [true, true, true, true, true, false, false, false, false, false], // 50%
    5: [true, true, true, true, true, true, true, true, true, false], // 90%
    6: [true, true, true, true, true, false, false, false, false, false], // 50%
    7: [true, true, true, true, true, true, true, false, false, false], // 70%
    8: [true, true, true, true, true, true, true, true, false, false], // 80%
    9: [true, true, true, true, false, false, false, false, false, false], // 40%
    10: [true, true, true, true, true, true, true, false, false, false], // 70%
    11: [true, true, true, true, true, true, true, true, true, false], // 90%
  };

  for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
    habits.forEach((habit, hIdx) => {
      if (monthIndex === 10 && novPattern[dayNum]) { // November (monthIndex 10)
        records[habit.id][dayNum] = novPattern[dayNum][hIdx] || false;
      } else {
        records[habit.id][dayNum] = false;
      }
    });
  }

  return records;
};

/**
 * Compute growth percentage per Category (Health, Mindset, Productivity, Finance)
 */
export const calculateCategoryStats = (habits, records, totalDays) => {
  const categoryStats = {};

  CATEGORIES.filter(c => c.id !== 'all').forEach(cat => {
    const catHabits = habits.filter(h => h.category === cat.id);
    let totalDone = 0;
    let totalPossible = catHabits.length * totalDays;

    catHabits.forEach(h => {
      if (records[h.id]) {
        Object.values(records[h.id]).forEach(val => {
          if (val) totalDone++;
        });
      }
    });

    const progressPct = totalPossible > 0 ? Math.round((totalDone / totalPossible) * 100) : 0;
    categoryStats[cat.id] = {
      ...cat,
      totalHabits: catHabits.length,
      progressPct
    };
  });

  return categoryStats;
};

/**
 * Compute daily statistics (Done, Not Done, Progress %)
 */
export const calculateDailyStats = (habits, records, totalDays) => {
  const stats = {};
  const habitCount = habits.length;

  for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
    let done = 0;
    habits.forEach(h => {
      if (records[h.id] && records[h.id][dayNum]) {
        done++;
      }
    });

    const notDone = habitCount - done;
    const progressPct = habitCount > 0 ? Math.round((done / habitCount) * 100) : 0;

    stats[dayNum] = {
      done,
      notDone,
      progressPct
    };
  }

  return stats;
};

/**
 * Compute overall month stats
 */
export const calculateMonthSummary = (habits, records, totalDays) => {
  const habitCount = habits.length;
  let totalChecked = 0;
  let possibleChecks = habitCount * totalDays;

  habits.forEach(h => {
    if (records[h.id]) {
      Object.values(records[h.id]).forEach(val => {
        if (val) totalChecked++;
      });
    }
  });

  const overallProgressPct = possibleChecks > 0 ? Math.round((totalChecked / possibleChecks) * 100) : 0;

  return {
    totalHabits: habitCount,
    completedHabits: totalChecked,
    overallProgressPct
  };
};

/**
 * Compute streaks for a habit
 */
export const calculateHabitStreak = (habitId, records, totalDays) => {
  if (!records[habitId]) return { currentStreak: 0, bestStreak: 0 };

  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;

  for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
    if (records[habitId][dayNum]) {
      tempStreak++;
      if (tempStreak > bestStreak) bestStreak = tempStreak;
    } else {
      tempStreak = 0;
    }
  }

  // Current streak counting backwards from today or latest filled day
  for (let dayNum = totalDays; dayNum >= 1; dayNum--) {
    if (records[habitId][dayNum]) {
      currentStreak++;
    } else if (currentStreak > 0) {
      break;
    }
  }

  return { currentStreak, bestStreak };
};
