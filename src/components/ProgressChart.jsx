import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Activity } from 'lucide-react';
import { getMonthDaysInfo, MONTH_NAMES } from '../utils/habitUtils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export const ProgressChart = ({
  selectedYear,
  selectedMonthIndex,
  dailyStats,
  theme
}) => {
  const { days } = getMonthDaysInfo(selectedYear, selectedMonthIndex);

  const labels = days.map(d => `${d.dayNum}`);
  const dataValues = days.map(d => (dailyStats[d.dayNum] ? dailyStats[d.dayNum].progressPct : 0));

  const isDark = theme === 'dark';

  const chartData = {
    labels,
    datasets: [
      {
        fill: true,
        label: 'Daily Progress %',
        data: dataValues,
        borderColor: '#22c55e',
        borderWidth: 2.5,
        tension: 0.4, // Smooth Bézier curve (like in reference photo!)
        pointBackgroundColor: '#22c55e',
        pointBorderColor: isDark ? '#0f172a' : '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 6,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, 'rgba(34, 197, 94, 0.45)');
          gradient.addColorStop(0.8, 'rgba(34, 197, 94, 0.02)');
          gradient.addColorStop(1, 'rgba(34, 197, 94, 0.0)');
          return gradient;
        },
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        titleColor: isDark ? '#f8fafc' : '#0f172a',
        bodyColor: '#22c55e',
        borderColor: 'rgba(34, 197, 94, 0.3)',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          title: (items) => `Day ${items[0].label} ${MONTH_NAMES[selectedMonthIndex]}`,
          label: (item) => {
            const dayNum = parseInt(item.label, 10);
            const stat = dailyStats[dayNum] || { done: 0, notDone: 0 };
            return `Progress: ${item.formattedValue}% (${stat.done} done, ${stat.notDone} remaining)`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: isDark ? '#64748b' : '#475569',
          font: { family: 'Fira Code', size: 11 }
        }
      },
      y: {
        min: 0,
        max: 100,
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
        },
        ticks: {
          color: isDark ? '#64748b' : '#475569',
          font: { family: 'Fira Code', size: 11 },
          stepSize: 25,
          callback: (value) => `${value}%`
        }
      }
    }
  };

  return (
    <div className="glass-panel chart-panel">
      <div className="chart-header">
        <div className="chart-title">
          <Activity size={20} color="var(--accent-green)" />
          <span>Monthly Habit Completion Curve ({MONTH_NAMES[selectedMonthIndex]})</span>
        </div>
      </div>

      <div className="chart-container">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};
